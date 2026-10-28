import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test, { after } from 'node:test';
import { gitColors, necromancerDark, palette } from '../src/palettes/necromancer-dark.ts';
import { loadVSCodeTools } from './vscode-tools.ts';
import { registerMarkdownDiffTests } from './markdown-diff.ts';
import { registerMarkdownEmbeddedTests } from './markdown-embedded.ts';

const tools = loadVSCodeTools();
const { tm, onig, ts } = tools;

test('Color utilities: TypeScript enforces validated RGB/RGBA brands', () => {
  const typesPath = fileURLToPath(new URL('../src/color/types.ts', import.meta.url));
  const alphaPath = fileURLToPath(new URL('../src/color/alpha.ts', import.meta.url));
  const themePath = fileURLToPath(new URL('../src/palettes/necromancer-dark.ts', import.meta.url));
  const paladinDarkPath = fileURLToPath(new URL('../src/palettes/paladin-dark.ts', import.meta.url));
  const paladinLightPath = fileURLToPath(new URL('../src/palettes/paladin-light.ts', import.meta.url));
  const contractPath = join(tools.extracted, 'color-contract.ts');
  const contract = `
    import { rgb, rgba, parseColor } from ${JSON.stringify(typesPath)};
    import type { RGB, RGBA, Color } from ${JSON.stringify(typesPath)};
    import { withAlpha } from ${JSON.stringify(alphaPath)};
    import { necromancerDark, gitPalette } from ${JSON.stringify(themePath)};
    import { paladinDark } from ${JSON.stringify(paladinDarkPath)};
    import { paladinLight } from ${JSON.stringify(paladinLightPath)};
    const paladinBackground: RGB = paladinDark.colors['editor.background'];
    const paladinOverlay: RGBA = paladinLight.colors['diffEditor.insertedTextBackground'];
    const gitOverlay: RGBA = gitPalette.insertedText;
    const shadow: RGBA = necromancerDark.colors['scrollbar.shadow'];
    const opaque: RGB = rgb('#242424');
    const transparent: RGBA = withAlpha(opaque, 0.5);
    const parsed: Color = parseColor('#242424CC');
    // @ts-expect-error Raw strings do not carry a validated RGB brand.
    const unchecked: RGB = '#242424';
    // @ts-expect-error Raw strings do not carry a validated RGBA brand.
    const uncheckedAlpha: RGBA = '#242424CC';
    // @ts-expect-error RGB and RGBA are distinct brands.
    const incompatible: RGB = transparent;
    // @ts-expect-error withAlpha accepts only validated RGB, not a raw string.
    withAlpha('#242424', 0.5);
    // @ts-expect-error An existing RGBA cannot receive alpha again.
    withAlpha(rgba('#242424CC'), 0.5);
    // @ts-expect-error A union must be narrowed before attaching alpha.
    withAlpha(parsed, 0.5);
    // @ts-expect-error Opacity must be numeric.
    withAlpha(opaque, '0.5');
  `;
  const options = { noEmit: true, strict: true, target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.NodeNext, moduleResolution: ts.ModuleResolutionKind.NodeNext,
    allowImportingTsExtensions: true };
  const host = ts.createCompilerHost(options);
  const getSourceFile = host.getSourceFile.bind(host);
  host.getSourceFile = (file: string, languageVersion: any, ...rest: any[]) => file === contractPath
    ? ts.createSourceFile(file, contract, languageVersion, true)
    : getSourceFile(file, languageVersion, ...rest);
  const program = ts.createProgram([contractPath], options, host);
  const diagnostics = ts.getPreEmitDiagnostics(program);
  assert.equal(diagnostics.length, 0, ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCanonicalFileName: (file: string) => file, getCurrentDirectory: () => '', getNewLine: () => '\n',
  }));
});

await onig.loadWASM(tools.wasm);
after(() => rmSync(tools.extracted, { recursive: true, force: true }));
console.log(`Testing actual TextMate, Oniguruma and TypeScript from VS Code ${tools.version}; this is not a visual UI test.`);
registerMarkdownDiffTests(tools);
registerMarkdownEmbeddedTests(tools);

const definitions = [
  ['ts', 'source.ts', 'typescript', 'typescript-basics', 'TypeScript'],
  ['tsx', 'source.tsx', 'typescriptreact', 'typescript-basics', 'TypeScriptReact'],
  ['js', 'source.js', 'javascript', 'javascript', 'JavaScript'],
  ['jsx', 'source.js.jsx', 'javascriptreact', 'javascript', 'JavaScriptReact'],
  ['json', 'source.json', 'json', 'json', 'JSON'],
  ['jsonc', 'source.json.comments', 'jsonc', 'json', 'JSONC'],
  ['css', 'source.css', 'css', 'css', 'css'],
  ['scss', 'source.css.scss', 'scss', 'scss', 'scss'],
  ['html', 'text.html.derivative', 'html', 'html', 'html-derivative'],
] as const;
const grammars = new Map<string, any>();
for (const [, , , folder, name] of definitions) {
  const file = join(tools.appRoot, 'extensions', folder, 'syntaxes', `${name}.tmLanguage.json`);
  const grammar = tm.parseRawGrammar(readFileSync(file, 'utf8'), file);
  grammars.set(grammar.scopeName, grammar);
}
for (const name of ['jsdoc.ts.injection', 'jsdoc.js.injection']) {
  const file = join(tools.appRoot, 'extensions/typescript-basics/syntaxes', `${name}.tmLanguage.json`);
  const grammar = tm.parseRawGrammar(readFileSync(file, 'utf8'), file);
  grammars.set(grammar.scopeName, grammar);
}
const regexFile = join(tools.appRoot, 'extensions/javascript/syntaxes/Regular Expressions (JavaScript).tmLanguage');
const regexGrammar = tm.parseRawGrammar(readFileSync(regexFile, 'utf8'), regexFile);
grammars.set(regexGrammar.scopeName, regexGrammar);

for (const [folder, name] of [['html', 'html'], ['scss', 'sassdoc']]) {
  const file = join(tools.appRoot, 'extensions', folder, 'syntaxes', `${name}.tmLanguage.json`);
  const grammar = tm.parseRawGrammar(readFileSync(file, 'utf8'), file);
  grammars.set(grammar.scopeName, grammar);
}
// Optional integration with an already-installed extension; never install or activate it.
const extensionsPath = join(homedir(), '.vscode/extensions');
const tailwindRoot = process.env.VSCODE_TAILWIND_ROOT ?? (existsSync(extensionsPath)
  ? readdirSync(extensionsPath).filter(name => name.startsWith('bradlc.vscode-tailwindcss-')).sort().reverse()
    .map(name => join(extensionsPath, name))[0] : undefined);
const injections = new Map<string, string[]>();
if (tailwindRoot) {
  const manifest = JSON.parse(readFileSync(join(tailwindRoot, 'package.json'), 'utf8'));
  console.log(`Testing installed Tailwind CSS IntelliSense ${manifest.version} grammars.`);
  for (const contribution of manifest.contributes.grammars) {
    const file = join(tailwindRoot, contribution.path);
    const grammar = tm.parseRawGrammar(readFileSync(file, 'utf8'), file);
    grammars.set(grammar.scopeName, grammar);
    for (const root of contribution.injectTo ?? []) injections.set(root, [...(injections.get(root) ?? []), grammar.scopeName]);
  }
}
const cases: [string, string, string, boolean][] = definitions.map(([ext, root]) => [ext, root, ext, false]);
if (tailwindRoot) cases.push(['css-tailwind', 'source.css', 'css', true],
  ['tailwind', 'source.css.tailwind', 'css', true], ['scss-tailwind', 'source.css.scss', 'scss', true]);

const approved = new Set([palette.bone, palette.ancientBone, palette.paleBone, palette.silver,
  palette.ashRose, palette.blood, palette.sageAsh, palette.dustyCopper, palette.inactiveForeground].map(color => color.toUpperCase()));
type Token = { start: number; end: number; text: string; scopes: string[]; color: string };
type Parsed = { text: string; lines: string[]; tokens: Token[][] };
const parsed = new Map<string, Parsed>();

for (const [extension, root, fixtureExtension, useTailwind] of cases) {
  test(`TextMate ${extension}: all effective fixture colors belong to the approved palette`, async () => {
    const registry = new tm.Registry({
      theme: { settings: [
        { settings: { foreground: necromancerDark.colors['editor.foreground'], background: necromancerDark.colors['editor.background'] } },
        ...necromancerDark.tokenColors,
      ] },
      onigLib: Promise.resolve({ createOnigScanner: (patterns: string[]) => new onig.OnigScanner(patterns), createOnigString: (text: string) => new onig.OnigString(text) }),
      loadGrammar: async (scope: string) => grammars.get(scope) ?? null,
      getInjections: (scope: string) => scope === 'source.ts' || scope === 'source.tsx'
        ? ['documentation.injection.ts'] : scope === 'source.js' || scope === 'source.js.jsx' ? ['documentation.injection.js']
          : useTailwind ? [...injections].filter(([root]) => scope === root || scope.startsWith(`${root}.`)).flatMap(([, names]) => names) : [],
    });
    const grammar = await registry.loadGrammar(root);
    assert(grammar, root);
    const text = readFileSync(new URL(`../fixtures/syntax-audit.${fixtureExtension}`, import.meta.url), 'utf8');
    const lines = text.split('\n');
    const tokens: Token[][] = [];
    let state = null;
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      const raw = grammar.tokenizeLine(line, state);
      const encoded = grammar.tokenizeLine2(line, state);
      state = raw.ruleStack;
      tokens.push(raw.tokens.map((token: any) => {
        let metadata = 0;
        for (let i = 0; i < encoded.tokens.length; i += 2) {
          if (encoded.tokens[i] > token.startIndex) break;
          metadata = encoded.tokens[i + 1];
        }
        const color = registry.getColorMap()[(metadata >>> 15) & 511];
        const result = { start: token.startIndex, end: Math.min(token.endIndex, line.length), text: line.slice(token.startIndex, token.endIndex), scopes: token.scopes, color };
        if (result.text.trim()) assert(approved.has(color), `${extension}:${lineIndex + 1} ${JSON.stringify(result.text)} ${color}: ${token.scopes.join(' > ')}`);
        return result;
      }));
    }
    parsed.set(extension, { text, lines, tokens });
    registry.dispose();
  });
}

function expectColor(extension: string, lineIncludes: string, target: string, expected: string, occurrence = 0) {
  const fixture = parsed.get(extension);
  assert(fixture, `Fixture ${extension} did not tokenize`);
  const lineIndex = fixture.lines.findIndex(line => line.includes(lineIncludes));
  assert(lineIndex >= 0, `${extension}: missing line ${lineIncludes}`);
  const line = fixture.lines[lineIndex];
  let position = -1;
  for (let i = 0; i <= occurrence; i++) position = line.indexOf(target, position + 1);
  assert(position >= 0, `${extension}: missing token ${target}`);
  for (let i = position; i < position + target.length; i++) {
    const token = fixture.tokens[lineIndex].find(token => token.start <= i && token.end > i);
    assert(token, `${extension}:${lineIndex + 1}:${i}`);
    assert.equal(token.color, expected, `${extension}:${lineIndex + 1} ${JSON.stringify(target)}: ${token.scopes.join(' > ')}`);
  }
}

test('TextMate: production examples, regex constructs and JSON role assertions', () => {
  expectColor('ts', 'enum Contracts', 'Contracts', palette.ancientBone);
  expectColor('ts', 'enum Contracts', 'eUSDte', palette.bone);
  expectColor('ts', 'rate: bigint', 'rate', palette.bone);
  expectColor('ts', 'rate: bigint', 'bigint', palette.ancientBone);
  expectColor('ts', 'decimals: number', 'number', palette.ancientBone);
  expectColor('ts', 'listed: boolean', 'listed', palette.bone);
  expectColor('ts', 'React.FC<Necromancer>', 'React', palette.ancientBone);
  expectColor('ts', 'React.FC<Necromancer>', 'FC', palette.ancientBone);
  expectColor('ts', 'React.FC<Necromancer>', 'Necromancer', palette.ancientBone);
  expectColor('ts', 'Record<ChainId, Address>', 'Record', palette.ancientBone);
  expectColor('ts', 'case ShareClass.COMMON', 'COMMON', palette.bone);
  expectColor('ts', '[ChainId.ETHEREUM]', 'ETHEREUM', palette.bone);
  expectColor('ts', 'local: "0x456"', 'local', palette.bone);
  expectColor('ts', '"quoted": "casting"', 'quoted', palette.bone);
  expectColor('ts', '"quoted": "casting"', 'casting', palette.sageAsh);
  expectColor('ts', 'escaped\\u004Bey', '\\u004B', palette.bone);
  expectColor('ts', 'invoke(amount: number)', 'Promise', palette.ancientBone);
  expectColor('ts', 'A muted comment', '@param', palette.inactiveForeground);
  expectColor('ts', 'name: string;', ':', palette.bone);
  expectColor('ts', 'shareClass: ShareClass | undefined', 'undefined', palette.ancientBone);
  for (const extension of ['ts', 'js']) {
    expectColor(extension, 'const wide = params?.wide', 'wide', palette.bone, 1);
    expectColor(extension, 'const medium = params?.medium', 'medium', palette.bone, 1);
    expectColor(extension, 'const overlay = variant.overlay', 'overlay', palette.bone, 1);
    expectColor(extension, 'variant.invoke()', 'invoke', palette.ashRose);
    expectColor(extension, 'const arrow =', '=>', palette.silver);
    expectColor(extension, 'return ', 'return', palette.silver);
    expectColor(extension, 'continue;', 'continue', palette.silver);
    expectColor(extension, 'catch (error)', 'throw', palette.silver);
    expectColor(extension, '[true, false, null, undefined]', 'true', palette.ashRose);
    expectColor(extension, '[true, false, null, undefined]', 'false', palette.ashRose);
    expectColor(extension, '[true, false, null, undefined]', 'null', palette.silver);
    expectColor(extension, '[true, false, null, undefined]', 'undefined', palette.silver);
    expectColor(extension, '100n;', '100n', palette.dustyCopper);
    expectColor(extension, 'const template =', 'Essence', palette.sageAsh);
    expectColor(extension, 'const template =', '${', palette.silver);
    expectColor(extension, 'line\\ntext', '\\n', palette.sageAsh);
    expectColor(extension, 'const formatted =', '\\d', palette.sageAsh);
    expectColor(extension, 'const formatted =', '{4}', palette.sageAsh);
    expectColor(extension, 'const formatted =', '(?=', palette.sageAsh);
    expectColor(extension, 'const formatted =', '/g', palette.silver);
    expectColor(extension, 'const formatted =', '$1 ', palette.sageAsh);
    expectColor(extension, 'const regex =', '(?<=', palette.sageAsh);
    expectColor(extension, 'const regex =', '[A-Z]+', palette.sageAsh);
    expectColor(extension, 'const regex =', '/gi', palette.silver);
    expectColor(extension, 'const backreference =', '\\1', palette.sageAsh);
    expectColor(extension, 'const backreference =', '\\k<ash>', palette.sageAsh);
  }
  for (const extension of ['tsx', 'jsx']) {
    expectColor(extension, '<button className=', 'button', palette.ancientBone);
    expectColor(extension, '<button className=', 'className', palette.silver);
    expectColor(extension, '<button className=', 'ritual', palette.sageAsh);
    expectColor(extension, '<button className=', 'castRitual', palette.bone);
    expectColor(extension, 'Cast Ritual', 'Cast Ritual', palette.paleBone);
    expectColor(extension, '<p>Essence:', 'Essence:', palette.paleBone);
    expectColor(extension, '<p>Essence:', '&amp;', palette.paleBone);
    expectColor(extension, '<p>Essence:', 'essence', palette.bone);
    expectColor(extension, '<Linarian essence=', 'Linarian', palette.ancientBone);
    expectColor(extension, '<UI.Button', 'UI.Button', palette.ancientBone);
    expectColor(extension, '<UI.Button', 'castRitual', palette.ashRose);
    expectColor(extension, 'JSX comment:', '<button>', palette.inactiveForeground);
    expectColor(extension, '</button>', '</', palette.silver);
    expectColor(extension, '<svg:path', '/>', palette.silver);
  }
  for (const extension of ['json', 'jsonc']) {
    expectColor(extension, '"name": "Linarian"', 'name', palette.bone);
    expectColor(extension, '"name": "Linarian"', 'Linarian', palette.sageAsh);
    expectColor(extension, '"essence": 100', '100', palette.dustyCopper);
    expectColor(extension, '"alive": true', 'true', palette.silver);
    expectColor(extension, '"paused": false', 'false', palette.silver);
    expectColor(extension, '"target": null', 'null', palette.silver);
    expectColor(extension, '"nested":', 'name', palette.bone);
    expectColor(extension, '"escaped":', '\\n', palette.sageAsh);
    expectColor(extension, 'escaped\\u004Bey', '\\u004B', palette.bone);
  }
  expectColor('json', '"deep":', 'g', palette.bone);
  expectColor('jsonc', '// A muted JSONC', 'true', palette.inactiveForeground);
  expectColor('jsonc', '// A muted JSONC', '//', palette.inactiveForeground);
});

test('TextMate: every regex construct has the pattern color except its delimiters and flags', () => {
  for (const [extension, fixture] of parsed) {
    if (extension === 'json' || extension === 'jsonc') continue;
    for (const tokens of fixture.tokens) {
      for (const token of tokens) {
        if (!token.scopes.some(scope => scope.startsWith('string.regexp.'))) continue;
        const leaf = token.scopes.at(-1)!;
        const isDelimiter = leaf.startsWith('punctuation.definition.string.');
        const isFlag = leaf === `keyword.other.${extension === 'jsx' ? 'js.jsx' : extension}`;
        assert.equal(token.color, isDelimiter || isFlag ? palette.silver : palette.sageAsh,
          `${extension}: regex ${JSON.stringify(token.text)}: ${token.scopes.join(' > ')}`);
      }
    }
  }
});

test('TypeScript semantic provider: real symbol categories and modifiers in TS, TSX, JS and JSX', () => {
  const tokenTypes = ['class', 'enum', 'interface', 'namespace', 'typeParameter', 'type',
    'parameter', 'variable', 'enumMember', 'property', 'function', 'method'];
  const categories = {
    class: palette.ancientBone, enum: palette.ancientBone, interface: palette.ancientBone,
    namespace: palette.ancientBone, typeParameter: palette.ancientBone, type: palette.ancientBone,
    parameter: palette.dustyCopper, variable: palette.dustyCopper, enumMember: palette.bone, property: palette.bone,
    function: palette.ashRose, method: palette.ashRose,
  };
  const seenTypes = new Set<string>();
  const seenModifiers = new Set<number>();
  let checked = 0;
  for (const [extension, , language] of definitions.slice(0, 4)) {
    const file = fileURLToPath(new URL(`../fixtures/syntax-audit.${extension}`, import.meta.url));
    const content = readFileSync(file, 'utf8');
    const reactFile = join(tools.extracted, 'react.d.ts');
    // A local contract supplies React symbols without installing React or @types/react.
    const reactSource = 'declare namespace React { type FC<P = {}> = (props: P) => any; function useState<T>(value: T): [T, (value: T) => void]; } export = React;';
    const host = {
      getScriptFileNames: () => [file, reactFile], getScriptVersion: () => '1',
      getScriptSnapshot: (path: string) => path === reactFile ? ts.ScriptSnapshot.fromString(reactSource)
        : ts.sys.fileExists(path) ? ts.ScriptSnapshot.fromString(ts.sys.readFile(path)) : undefined,
      getCurrentDirectory: () => fileURLToPath(new URL('..', import.meta.url)),
      getCompilationSettings: () => ({ target: ts.ScriptTarget.ESNext, module: ts.ModuleKind.ESNext,
        jsx: ts.JsxEmit.Preserve, allowJs: true, checkJs: true, strictNullChecks: true, noEmit: true }),
      getDefaultLibFileName: (options: any) => ts.getDefaultLibFilePath(options),
      fileExists: (path: string) => path === reactFile || ts.sys.fileExists(path),
      readFile: (path: string) => path === reactFile ? reactSource : ts.sys.readFile(path),
      readDirectory: ts.sys.readDirectory,
      resolveModuleNames: (names: string[]) => names.map(name => name === 'react'
        ? { resolvedFileName: reactFile, extension: ts.Extension.Dts } : undefined),
    };
    const service = ts.createLanguageService(host);
    assert.deepEqual(service.getSyntacticDiagnostics(file), [], `${extension}: fixture has syntax errors`);
    const result = service.getEncodedSemanticClassifications(file, { start: 0, length: content.length }, ts.SemanticClassificationFormat.TwentyTwenty);
    const classified: { start: number; length: number; type: string; modifiers: number; color: string }[] = [];
    for (let i = 0; i < result.spans.length; i += 3) {
      const [start, length, bits] = result.spans.slice(i, i + 3);
      const type = tokenTypes[(bits >> 8) - 1];
      assert(type && type in categories, `Unhandled provider category ${bits}`);
      const color = necromancerDark.semanticTokenColors[`${type}:${language}`];
      assert.equal(color, categories[type], `${language}: ${content.slice(start, start + length)} (${type}, modifiers=${bits & 255})`);
      classified.push({ start, length, type, color, modifiers: bits & 255 });
      seenTypes.add(type); seenModifiers.add(bits & 255); checked++;
    }
    const expectSymbol = (lineIncludes: string, word: string, type: string, color: string, occurrence = 0) => {
      const lines = content.split('\n');
      const lineIndex = lines.findIndex(line => line.includes(lineIncludes));
      assert(lineIndex >= 0, lineIncludes);
      let offset = -1;
      for (let i = 0; i <= occurrence; i++) offset = lines[lineIndex].indexOf(word, offset + 1);
      assert(offset >= 0, word);
      const position = lines.slice(0, lineIndex).reduce((sum, line) => sum + line.length + 1, 0) + offset;
      const token = classified.find(token => token.start <= position && token.start + token.length > position);
      assert(token, `${extension}: no semantic classification for ${lineIncludes} / ${word}`);
      assert.equal(token.type, type, `${extension}: ${word}`);
      assert.equal(token.color, color, `${extension}: ${word}`);
    };
    if (extension === 'ts') {
      expectSymbol('Contracts.eUSDte', 'Contracts', 'enum', palette.ancientBone);
      expectSymbol('Contracts.eUSDte', 'eUSDte', 'enumMember', palette.bone);
      expectSymbol('ShareClass.COMMON', 'ShareClass', 'enum', palette.ancientBone);
      expectSymbol('ShareClass.COMMON', 'COMMON', 'enumMember', palette.bone);
      expectSymbol('[ChainId.ETHEREUM]', 'ChainId', 'enum', palette.ancientBone);
      expectSymbol('[ChainId.ETHEREUM]', 'ETHEREUM', 'enumMember', palette.bone);
      expectSymbol('React.FC<Necromancer>', 'React', 'namespace', palette.ancientBone);
      expectSymbol('React.FC<Necromancer>', 'FC', 'type', palette.ancientBone);
      expectSymbol('React.FC<Necromancer>', 'Necromancer', 'interface', palette.ancientBone);
      expectSymbol('Record<ChainId, Address>', 'Record', 'type', palette.ancientBone);
      expectSymbol('shadowed(undefined: number)', 'undefined', 'parameter', palette.bone);
      expectSymbol('shadowed(undefined: number)', 'undefined', 'parameter', palette.bone, 1);
    }
    if (extension === 'ts' || extension === 'js') {
      expectSymbol('params?.wide', 'wide', 'property', palette.bone, 1);
      expectSymbol('params?.medium', 'medium', 'property', palette.bone, 1);
      expectSymbol('variant.overlay', 'overlay', 'property', palette.bone, 1);
      expectSymbol('variant.invoke()', 'invoke', 'method', palette.ashRose);
    }
    if (extension === 'tsx' || extension === 'jsx') {
      expectSymbol('useState(100)', 'useState', 'function', palette.ashRose);
      expectSymbol('const castRitual', 'castRitual', 'function', palette.ashRose);
      // The installed TS provider excludes JSX markup, while expressions remain semantic.
      const markup = content.indexOf('<button className=');
      assert(markup >= 0);
      assert(!classified.some(token => token.start >= markup && token.start < markup + '<button className="ritual"'.length));
    }
    service.dispose();
  }
  assert.equal(seenTypes.size, tokenTypes.length, `Fixture coverage missed: ${tokenTypes.filter(type => !seenTypes.has(type))}`);
  for (const bit of [1, 2, 4, 8, 16]) assert([...seenModifiers].some(modifiers => modifiers & bit), `No actual declaration/static/async/readonly/defaultLibrary fixture for bit ${bit}`);
  console.log(`Checked ${checked} actual semantic tokens, all ${seenTypes.size} TS provider categories, including declaration/static/async/readonly/defaultLibrary modifiers.`);
});


test('TextMate: CSS, SCSS and HTML syntax roles', () => {
  for (const [line, word, color] of [
    [':root {', 'root', palette.ancientBone], ['.btn, #ritual:hover', 'btn', palette.ancientBone],
    ['.btn, #ritual:hover', 'ritual', palette.ancientBone], ['.btn, #ritual:hover', 'hover', palette.ancientBone],
    ['.btn, #ritual:hover', 'disabled', palette.ancientBone], ['--custom-property:', '--custom-property', palette.bone],
    ['color: var', 'color', palette.silver], ['color: var', 'var', palette.ashRose],
    ['color: var', '--color-bone', palette.bone], ['--custom-property:', '10px', palette.dustyCopper],
    ['border: 1px', '#ffffff', palette.bone], ['background: hsl', 'hsl', palette.ashRose],
    ['--color-ash:', 'rgb', palette.ashRose], ['content:', 'Cast Ritual', palette.sageAsh],
    ['@theme', '@theme', palette.silver], ['@layer', '@layer', palette.silver],
    ['@apply', '@apply', palette.silver], ['@apply', 'flex', palette.bone],
    ['@apply', 'gap-2.5', palette.bone], ['CSS comment', 'var()', palette.inactiveForeground],
  ]) expectColor('css', line, word, color);
  for (const [line, word, color] of [
    ['$name:', '$name', palette.bone], ['$size:', '2.5rem', palette.dustyCopper],
    ['@mixin ritual-button', 'ritual-button', palette.ashRose], ['@function', 'double-size', palette.ashRose],
    ['@include', 'ritual-button', palette.ashRose], ['width: double-size', 'double-size', palette.ashRose],
    ['content:', 'Cast ', palette.sageAsh], ['content:', '#{', palette.silver], ['content:', '}', palette.silver], ['content:', '$name', palette.bone],
    ['&:hover', 'hover', palette.ancientBone], ['.#{$name}-child', '$name', palette.bone],
    ['SassDoc comment', '$size', palette.inactiveForeground], ['color: var', 'color', palette.silver], ['background: hsl', 'hsl', palette.ashRose], ['--custom-property:', '--custom-property', palette.bone], ['--custom-property:', '10px', palette.dustyCopper], ['$palette:', 'bone', palette.bone], ['$palette:', '#ffffff', palette.bone],
  ]) expectColor('scss', line, word, color);
  for (const [line, word, color] of [
    ['<button class="btn', 'button', palette.ancientBone], ['<button class="btn', 'class', palette.silver],
    ['<button class="btn', 'ritual', palette.sageAsh], ['Cast Ritual', 'Cast Ritual', palette.paleBone],
    ['Cast Ritual', '&amp;', palette.paleBone], ['<p>Essence:', '&#x26;', palette.paleBone], ['<button class="btn', '<', palette.silver], ['<button class="btn', '=', palette.silver], ['const essence =', '100', palette.dustyCopper], ['const castRitual =', 'castRitual', palette.ashRose], ['const castRitual =', 'casting', palette.sageAsh], ['HTML comment', 'HTML comment', palette.inactiveForeground],
    ['.embedded:hover', 'embedded', palette.ancientBone], ['.embedded:hover', 'color', palette.silver],
  ]) expectColor('html', line, word, color);
});

test('TextMate: actual Tailwind @apply injection preserves utility roles', { skip: !tailwindRoot && 'Set VSCODE_TAILWIND_ROOT to an installed Tailwind CSS IntelliSense extension' }, () => {
  for (const extension of ['css-tailwind', 'tailwind', 'scss-tailwind']) {
    for (const word of ['flex', 'h-10', 'w-max', 'cursor-pointer', 'items-center', 'justify-center', 'gap-2.5']) {
      expectColor(extension, '@apply', word, palette.bone);
    }
    expectColor(extension, '@apply', '@apply', palette.silver);
    const fixture = parsed.get(extension)!;
    const tokens = fixture.tokens[fixture.lines.findIndex(line => line.includes('@apply'))];
    assert(tokens.some(token => token.scopes.includes('meta.at-rule.apply.tailwind')));
  }
});


test('Git/Diff color IDs and transparency match the installed VS Code color registry schema', () => {
  const bundle = readFileSync(join(tools.appRoot, 'out/vs/workbench/workbench.desktop.main.js'), 'utf8');
  // Find the actual registerColor binding, rather than assuming a minified symbol name.
  const binding = bundle.match(/function ([\w$]+)\([^)]*\)\{return [\w$]+\.registerColor\(/)?.[1];
  assert(binding, 'Installed VS Code registerColor binding was not found; review registry extraction');
  const gitManifest = JSON.parse(readFileSync(join(tools.appRoot, 'extensions/git/package.json'), 'utf8'));
  const extensionIDs = new Set(gitManifest.contributes.colors.map((color: any) => color.id));
  for (const [id, color] of Object.entries(gitColors)) {
    if (extensionIDs.has(id)) continue;
    const start = bundle.indexOf(`${binding}("${id}",`);
    assert(start >= 0, `Unsupported color ID in installed VS Code ${tools.version}: ${id}`);
    // TS scanner safely finds the registration call's closing parenthesis across nested defaults.
    const scanner = ts.createScanner(ts.ScriptTarget.Latest, false, ts.LanguageVariant.Standard, bundle);
    scanner.setTextPos(start + binding.length);
    let depth = 0;
    let end = start;
    for (let token = scanner.scan(); token !== ts.SyntaxKind.EndOfFileToken; token = scanner.scan()) {
      if (token === ts.SyntaxKind.OpenParenToken) depth++;
      if (token === ts.SyntaxKind.CloseParenToken && --depth === 0) { end = scanner.getTextPos(); break; }
    }
    assert(end > start, id);
    const file = ts.createSourceFile('registration.js', bundle.slice(start, end), ts.ScriptTarget.Latest, true);
    const call = file.statements[0].expression;
    const transparency = call.arguments[3]?.getText(file);
    assert(!transparency || ['!0', '!1', 'true', 'false'].includes(transparency), `Review transparency requirement for ${id}: ${transparency}`);
    if (transparency === '!0' || transparency === 'true') {
      assert(/^#[0-9a-f]{8}$/i.test(color) && parseInt(color.slice(7), 16) < 255, `${id} requires transparency`);
    }
  }
  console.log(`Validated ${Object.keys(gitColors).length} Git/Diff/Merge color IDs against installed registry registrations and Git manifest.`);
});
