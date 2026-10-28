import assert from 'node:assert/strict';
import { readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import test, { after } from 'node:test';
import { necromancerDark } from '../src/palettes/necromancer-dark.ts';
import { necromancerLight } from '../src/palettes/necromancer-light.ts';
import { paladinDark } from '../src/palettes/paladin-dark.ts';
import { paladinLight } from '../src/palettes/paladin-light.ts';
import { loadVSCodeTools } from './vscode-tools.ts';

const tools = loadVSCodeTools();
const { tm, onig, ts } = tools;
await onig.loadWASM(tools.wasm);
after(() => rmSync(tools.extracted, { recursive: true, force: true }));

const example = [
  'const palette = { someValue: 1, nested: { someValue: 2 } };',
  'const value = palette.someValue;',
  'const optional = palette?.someValue;',
  'const nested = palette.nested.someValue;',
  'function read(palette) { return palette.someValue; }',
  'const callback = (entry) => entry.someValue;',
  'const service = { getValue() { return palette.someValue; } };',
  'read(palette); callback(palette); service.getValue();',
].join('\n');
const definitions = [
  ['ts', 'source.ts', 'typescript', 'typescript-basics', 'TypeScript'],
  ['tsx', 'source.tsx', 'typescriptreact', 'typescript-basics', 'TypeScriptReact'],
  ['js', 'source.js', 'javascript', 'javascript', 'JavaScript'],
  ['jsx', 'source.js.jsx', 'javascriptreact', 'javascript', 'JavaScriptReact'],
] as const;
const tokenTypes = ['class', 'enum', 'interface', 'namespace', 'typeParameter', 'type',
  'parameter', 'variable', 'enumMember', 'property', 'function', 'method'];

for (const theme of [necromancerDark, necromancerLight, paladinDark, paladinLight]) {
  for (const [extension, root, language, folder, grammarName] of definitions) {
    const source = extension.startsWith('ts') ? example.replace(' };', ' } as const;') : example;
    const variable = theme.semanticTokenColors[`variable:${language}`];
    const property = theme.semanticTokenColors[`property:${language}`];
    const callable = theme.semanticTokenColors[`function:${language}`];

    test(`${theme.name} ${extension}: actual TextMate variables, properties and functions differ`, async () => {
      assert.notEqual(variable, property);
      assert.notEqual(variable, callable);
      assert.notEqual(property, callable);
      assert.equal(theme.semanticTokenColors[`method:${language}`], callable);
      const grammarFile = join(tools.appRoot, 'extensions', folder, 'syntaxes', `${grammarName}.tmLanguage.json`);
      const raw = tm.parseRawGrammar(readFileSync(grammarFile, 'utf8'), grammarFile);
      const registry = new tm.Registry({
        theme: { settings: [
          { settings: { foreground: theme.colors['editor.foreground'], background: theme.colors['editor.background'] } },
          ...theme.tokenColors,
        ] },
        onigLib: Promise.resolve({
          createOnigScanner: (patterns: string[]) => new onig.OnigScanner(patterns),
          createOnigString: (text: string) => new onig.OnigString(text),
        }),
        loadGrammar: async (scope: string) => scope === root ? raw : null,
      });
      try {
        const grammar = await registry.loadGrammar(root);
        const colorMap = registry.getColorMap();
        let state = null;
        let checked = 0;
        for (const line of source.split('\n')) {
          const result = grammar.tokenizeLine2(line, state);
          state = result.ruleStack;
          for (const match of line.matchAll(/\b(palette|someValue|nested|read|callback|getValue)\b/g)) {
            const isCallable = ['read', 'callback', 'getValue'].includes(match[0]);
            const isProperty = match[0] !== 'palette';
            // The declaration `const nested` is a variable, unlike `.nested`.
            if (match[0] === 'nested' && line.startsWith('const nested') && match.index === 6) continue;
            let color = '';
            for (let i = 0; i < result.tokens.length; i += 2) {
              const end = result.tokens[i + 2] ?? line.length;
              if (result.tokens[i] <= match.index && match.index < end) {
                color = colorMap[(result.tokens[i + 1] >> 15) & 0x1FF];
                break;
              }
            }
            const expected = isCallable ? callable : isProperty ? property : variable;
            assert.equal(color.toUpperCase(), expected.toUpperCase(),
              `${line}: ${match[0]} at ${match.index}`);
            checked++;
          }
        }
        assert(checked >= 12);
      } finally {
        registry.dispose();
      }
    });

    test(`${theme.name} ${extension}: semantic variables, properties and functions match TextMate roles`, () => {
      const file = join(tools.extracted, `identifiers.${extension}`);
      const host = {
        getScriptFileNames: () => [file], getScriptVersion: () => '1',
        getScriptSnapshot: (path: string) => path === file ? ts.ScriptSnapshot.fromString(source)
          : ts.sys.fileExists(path) ? ts.ScriptSnapshot.fromString(ts.sys.readFile(path)) : undefined,
        getCurrentDirectory: () => tools.extracted,
        getCompilationSettings: () => ({ target: ts.ScriptTarget.ESNext, allowJs: true, checkJs: true,
          jsx: ts.JsxEmit.Preserve, noEmit: true }),
        getDefaultLibFileName: (options: any) => ts.getDefaultLibFilePath(options),
        fileExists: (path: string) => path === file || ts.sys.fileExists(path),
        readFile: (path: string) => path === file ? source : ts.sys.readFile(path),
        readDirectory: ts.sys.readDirectory,
      };
      const service = ts.createLanguageService(host);
      try {
        const result = service.getEncodedSemanticClassifications(file, { start: 0, length: source.length },
          ts.SemanticClassificationFormat.TwentyTwenty);
        const seen = new Set<string>();
        for (let i = 0; i < result.spans.length; i += 3) {
          const [start, length, bits] = result.spans.slice(i, i + 3);
          const text = source.slice(start, start + length);
          if (!['palette', 'someValue', 'read', 'callback', 'getValue'].includes(text)) continue;
          const type = tokenTypes[(bits >> 8) - 1];
          const expected = text === 'palette' ? variable : text === 'someValue' ? property : callable;
          assert.equal(theme.semanticTokenColors[`${type}:${language}`], expected,
            `${text}: ${type}`);
          seen.add(text);
        }
        assert.deepEqual([...seen].sort(), ['callback', 'getValue', 'palette', 'read', 'someValue']);
      } finally {
        service.dispose();
      }
    });
  }
}
