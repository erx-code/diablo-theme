import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { necromancerDark } from '../src/palettes/necromancer-dark.ts';
import { semantic } from '../src/palettes/necromancer-dark/semantic.ts';
import type { loadVSCodeTools } from './vscode-tools.ts';

type Tools = ReturnType<typeof loadVSCodeTools>;
type Theme = typeof necromancerDark;
const fixtures = [
  { file: 'syntax-audit.md', scope: 'text.html.markdown' },
  { file: 'syntax-audit.diff', scope: 'source.diff' },
] as const;

// Read built-in contributions only. No extensions are installed or activated.
function builtinGrammars(tools: Tools) {
  const paths = new Map<string, string>();
  const injections = new Map<string, string[]>();
  const extensions = join(tools.appRoot, 'extensions');
  for (const entry of readdirSync(extensions, { withFileTypes: true })) {
    const manifestPath = join(extensions, entry.name, 'package.json');
    if (!entry.isDirectory() || !existsSync(manifestPath)) continue;
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    for (const grammar of manifest.contributes?.grammars ?? []) {
      paths.set(grammar.scopeName, join(extensions, entry.name, grammar.path));
      for (const target of grammar.injectTo ?? []) {
        injections.set(target, [...(injections.get(target) ?? []), grammar.scopeName]);
      }
    }
  }
  return { paths, injections };
}

function settings(theme: Theme) {
  return [{ settings: { foreground: theme.colors['editor.foreground'], background: theme.colors['editor.background'] } },
    ...theme.tokenColors];
}

// Ask the SAME theme engine for foreground provenance. Each foreground rule receives
// a unique marker in a second registry; scopes, rule order and fontStyle stay intact.
// Style-only rules deliberately receive no foreground. This avoids reimplementing
// TextMate selector matching or guessing a winner from the semantic role name.
function probeSettings(theme: Theme) {
  return settings(theme).map((rule, index) => ({
    ...rule,
    settings: { ...rule.settings, ...('foreground' in rule.settings
      ? { foreground: `#${(index + 1).toString(16).padStart(6, '0').toUpperCase()}` } : {}) },
  }));
}

function foregroundAt(encoded: any, column: number, registry: any): string {
  let metadata: number | undefined;
  for (let i = 0; i < encoded.tokens.length; i += 2) {
    if (encoded.tokens[i] > column) break;
    metadata = encoded.tokens[i + 1];
  }
  assert.notEqual(metadata, undefined, `No encoded metadata at column ${column}`);
  return registry.getColorMap()[(metadata! >>> 15) & 511];
}

export async function collectMarkdownDiffReport(
  tools: Tools, theme: Theme,
  inputs: readonly { file: string; scope: string; content?: string }[] = fixtures,
) {
  const { paths, injections } = builtinGrammars(tools);
  const cache = new Map<string, any>();
  const registry = (themeSettings: any[]) => new tools.tm.Registry({
    theme: { settings: themeSettings },
    onigLib: Promise.resolve({
      createOnigScanner: (patterns: string[]) => new tools.onig.OnigScanner(patterns),
      createOnigString: (text: string) => new tools.onig.OnigString(text),
    }),
    loadGrammar: async (scope: string) => {
      const file = paths.get(scope);
      if (!file) return null;
      if (!cache.has(scope)) cache.set(scope, tools.tm.parseRawGrammar(readFileSync(file, 'utf8'), file));
      return cache.get(scope);
    },
    getInjections: (scope: string) => [...injections]
      .filter(([target]) => scope === target || scope.startsWith(`${target}.`))
      .flatMap(([, scopes]) => scopes),
  });
  const actual = registry(settings(theme));
  const probe = registry(probeSettings(theme));
  const results = [];
  try {
    for (const fixture of inputs) {
      const file = paths.get(fixture.scope);
      assert(file, `Missing installed grammar ${fixture.scope}`);
      const grammar = await actual.loadGrammar(fixture.scope);
      const probeGrammar = await probe.loadGrammar(fixture.scope);
      assert(grammar && probeGrammar, fixture.scope);
      const lines = (fixture.content ?? readFileSync(new URL(`../fixtures/${fixture.file}`, import.meta.url), 'utf8')).split('\n');
      const tokens = [];
      let state = null;
      let probeState = null;
      for (const [lineIndex, line] of lines.entries()) {
        const raw = grammar.tokenizeLine(line, state);
        const encoded = grammar.tokenizeLine2(line, state);
        const provenance = probeGrammar.tokenizeLine2(line, probeState);
        assert(!raw.stoppedEarly && !encoded.stoppedEarly && !provenance.stoppedEarly, 'Tokenization stopped early');
        state = raw.ruleStack;
        probeState = provenance.ruleStack;
        for (const token of raw.tokens) {
          const end = Math.min(token.endIndex, line.length);
          if (token.startIndex >= end) continue;
          const foreground = foregroundAt(encoded, token.startIndex, actual);
          const marker = foregroundAt(provenance, token.startIndex, probe);
          const settingIndex = parseInt(marker.slice(1), 16) - 1;
          assert(settingIndex >= 0 && settingIndex <= theme.tokenColors.length, `Unknown provenance marker ${marker}`);
          const ruleIndex = settingIndex - 1; // Setting 0 is editor.foreground.
          const winner = ruleIndex < 0 ? null : theme.tokenColors[ruleIndex];
          assert(!winner || 'foreground' in winner.settings, 'Style-only rule cannot supply foreground');
          const expected = winner?.settings.foreground ?? theme.colors['editor.foreground'];
          // Confirm the probe's attributed winner against the original engine result,
          // including alpha. Never substitute a guessed foreground for metadata.
          assert.equal(foreground, expected.toUpperCase(), `${fixture.file}:${lineIndex + 1}`);
          tokens.push({
            line: lineIndex + 1, start: token.startIndex, end,
            text: line.slice(token.startIndex, end), scopes: token.scopes,
            foreground,
            foregroundRule: winner ? { index: ruleIndex, name: winner.name } : null,
            editorForegroundFallback: winner === null,
          });
        }
      }
      results.push({ file: fixture.file, rootScope: fixture.scope,
        grammarSha256: createHash('sha256').update(readFileSync(file)).digest('hex'), tokens });
    }
    return { vscodeVersion: tools.version, fixtures: results };
  } finally {
    actual.dispose();
    probe.dispose();
  }
}

export function registerMarkdownDiffTests(tools: Tools) {
  const baseline = JSON.parse(readFileSync(new URL('./baselines/necromancer-dark.json', import.meta.url), 'utf8'));
  const markdownFixedBaseline = JSON.parse(readFileSync(new URL('./baselines/necromancer-dark-pre-embedded-tsjs.json', import.meta.url), 'utf8'));
  const historicalBaseline = JSON.parse(readFileSync(new URL('./baselines/necromancer-dark-pre-markdown-fix.json', import.meta.url), 'utf8'));
  const frozen = JSON.parse(readFileSync(new URL('./fixtures/markdown-diff-report.json', import.meta.url), 'utf8'));
  // Shared async work starts once; the test runner still reports each assertion group.
  let pending: ReturnType<typeof collectMarkdownDiffReport> | undefined;
  const report = () => pending ??= collectMarkdownDiffReport(tools, necromancerDark);
  const fixture = async (file: string) => (await report()).fixtures.find(result => result.file === file)!;
  const tokenAt = async (lineIncludes: string, text: string) => {
    const lines = readFileSync(new URL('../fixtures/syntax-audit.md', import.meta.url), 'utf8').split('\n');
    const line = lines.findIndex(line => line.includes(lineIncludes));
    assert(line >= 0, lineIncludes);
    const column = lines[line].indexOf(text);
    assert(column >= 0, text);
    const token = (await fixture('syntax-audit.md')).tokens.find(t => t.line === line + 1 && t.start <= column && t.end > column);
    assert(token, `${lineIncludes}: ${text}`);
    return token;
  };

  for (const file of fixtures.map(f => f.file)) {
    test(`Markdown/diff: ${file} actual scopes, winning rules and foreground match frozen diagnostics`, async () => {
      const actual = await report();
      assert.equal(actual.vscodeVersion, frozen.vscodeVersion, 'Review diagnostics after a VS Code upgrade; do not update automatically');
      assert.deepEqual(actual.fixtures.find(f => f.file === file), frozen.fixtures.find((f: any) => f.file === file));
    });
  }

  test('Markdown/diff: current tokenization is identical to the independent theme baseline', async () => {
    const actual = await report();
    const expected = await collectMarkdownDiffReport(tools, baseline);
    if (process.env.DIABLO_TOKEN_REPORT === '1') console.log(JSON.stringify(actual, null, 2));
    assert.deepEqual(actual, expected);
  });

  test('Step 20: only the seven explicitly approved Markdown selector arrays differ from the historical baseline', () => {
    const changes = JSON.parse(readFileSync(new URL('./fixtures/markdown-selectors-step20.json', import.meta.url), 'utf8'));
    assert.equal(changes.length, 7);
    const expected = structuredClone(historicalBaseline);
    for (const change of changes) {
      const rule = expected.tokenColors.find((rule: any) => rule.name === change.name);
      assert(rule, change.name);
      assert.deepEqual(rule.scope, change.before, `${change.name}: historical selectors changed`);
      rule.scope = change.after;
    }
    // Preserve the Step 20 delta using its frozen approved snapshot. The current
    // baseline is checked separately by the strict baseline tests.
    assert.equal(JSON.stringify(markdownFixedBaseline, null, 2), JSON.stringify(expected, null, 2));
  });

  test('Step 20: intended Markdown tokens change; every neighboring token and diff token stays unchanged', async () => {
    const current = await collectMarkdownDiffReport(tools, markdownFixedBaseline);
    const historical = await collectMarkdownDiffReport(tools, historicalBaseline);
    let changed = 0;
    for (const [index, actual] of current.fixtures.entries()) {
      const previous = historical.fixtures[index];
      assert.equal(actual.file, previous.file);
      assert.equal(actual.tokens.length, previous.tokens.length);
      for (const [tokenIndex, token] of actual.tokens.entries()) {
        const old = previous.tokens[tokenIndex];
        const { foreground, foregroundRule, ...structure } = token;
        const { foreground: oldColor, foregroundRule: oldRule, ...oldStructure } = old;
        assert.deepEqual(structure, oldStructure, `${actual.file}:${token.line}: scopes/text/fallback changed`);
        let expected: [string, string] | undefined;
        if (actual.file === 'syntax-audit.md') {
          const scopes = token.scopes;
          if (scopes.includes('markup.heading.markdown') && scopes.includes('entity.name.section.markdown')) {
            expected = ['Markdown - Heading', '#E0D4C2'];
          } else if (scopes.includes('markup.inline.raw.string.markdown')) {
            expected = scopes.includes('punctuation.definition.raw.markdown')
              ? ['Markdown - Markup Raw Inline Punctuation', '#777F86']
              : ['Markdown - Markup Raw Inline', '#A8B59A'];
          } else if (scopes.includes('markup.fenced_code.block.markdown')) {
            expected = scopes.includes('fenced_code.block.language.markdown')
              ? ['Markdown - Fenced Language', '#777F86']
              : ['Markdown - Fenced Bode Block Variable', '#D8CBB8'];
          } else if (scopes.includes('markup.quote.markdown') && scopes.includes('punctuation.definition.quote.begin.markdown')) {
            expected = ['Markdown - Blockquote', '#777F86'];
          }
        }
        if (expected) {
          const [name, color] = expected;
          assert.deepEqual(foregroundRule, { index: necromancerDark.tokenColors.findIndex(rule => rule.name === name), name });
          assert.equal(foreground, color);
          if (foreground !== oldColor || foregroundRule?.name !== oldRule?.name) changed++;
        } else {
          assert.deepEqual(token, old, `${actual.file}:${token.line}: unapproved neighboring token change`);
        }
      }
    }
    assert(changed > 0, 'Expected the approved selector correction to affect real tokens');
  });

  test('Step 20: legacy fenced overlays stay unchanged; applying them to current delimiters would darken them', async () => {
    const names = ['Markdown - Raw Block Fenced', 'Markdown - Fenced Bode Block'];
    for (const name of names) {
      const actual = necromancerDark.tokenColors.find(rule => rule.name === name)!;
      assert.deepEqual(actual, historicalBaseline.tokenColors.find((rule: any) => rule.name === name));
      assert.equal(actual.settings.foreground, '#00000050');
      assert(!('background' in actual.settings));
    }
    assert(!(await fixture('syntax-audit.md')).tokens.some(token => names.includes(token.foregroundRule?.name ?? '')));
    // Research only, in memory: never write these selectors into the theme.
    const trial = structuredClone(necromancerDark);
    trial.tokenColors.find(rule => rule.name === names[0])!.scope = ['text.html.markdown markup.fenced_code.block.markdown'];
    trial.tokenColors.find(rule => rule.name === names[1])!.scope = ['text.html.markdown markup.fenced_code.block.markdown punctuation.definition.markdown'];
    const simulation = await collectMarkdownDiffReport(tools, trial);
    const darkened = simulation.fixtures[0].tokens.filter(token => token.foregroundRule?.name === names[1]);
    assert.equal(darkened.length, 4);
    assert(darkened.every(token => token.foreground === '#00000050'));
    // The broad overlay would lose to the later Bone content rule; the specific
    // delimiter overlay wins and supplies translucent black foreground instead.
    assert(!simulation.fixtures[0].tokens.some(token => token.foregroundRule?.name === names[0]));
  });

  test('Markdown: H1–H6 markers and text use the existing heading role', async () => {
    for (const [index, name] of ['One', 'Two', 'Three', 'Four', 'Five', 'Six'].entries()) {
      const marker = await tokenAt(`${'#'.repeat(index + 1)} Heading ${name}`, '#');
      const text = await tokenAt(`Heading ${name}`, 'Heading');
      assert(marker.scopes.includes(`heading.${index + 1}.markdown`));
      assert.equal(marker.foregroundRule?.name, 'Markdown - Heading');
      assert.equal(marker.foreground, '#E0D4C2');
      assert(text.scopes.includes('entity.name.section.markdown'));
      assert.equal(text.foregroundRule?.name, 'Markdown - Heading');
      assert.equal(text.foreground, '#E0D4C2');
      assert.equal(text.editorForegroundFallback, false);
    }
  });

  test('Markdown: inline code, delimiters, fences and language labels use their existing roles', async () => {
    const inline = await tokenAt('Plain paragraph', 'inline ritual');
    assert(inline.scopes.includes('markup.inline.raw.string.markdown'));
    assert.equal(inline.foregroundRule?.name, 'Markdown - Markup Raw Inline');
    assert.equal(inline.foreground, '#A8B59A');
    const delimiter = await tokenAt('Plain paragraph', '`');
    assert(delimiter.scopes.includes('punctuation.definition.raw.markdown'));
    assert.equal(delimiter.foregroundRule?.name, 'Markdown - Markup Raw Inline Punctuation');
    assert.equal(delimiter.foreground, '#777F86');
    const fenced = await tokenAt('Unlabelled ritual', 'Unlabelled');
    assert(fenced.scopes.includes('markup.fenced_code.block.markdown'));
    assert.equal(fenced.foregroundRule?.name, 'Markdown - Fenced Bode Block Variable');
    assert.equal(fenced.foreground, '#D8CBB8');
    const names = (await fixture('syntax-audit.md')).tokens.map(t => t.foregroundRule?.name);
    for (const legacy of ['Markdown - Raw Block Fenced', 'Markdown - Fenced Bode Block']) assert(!names.includes(legacy), legacy);
    const language = await tokenAt('```typescript', 'typescript');
    assert(language.scopes.includes('fenced_code.block.language.markdown'));
    assert.equal(language.foregroundRule?.name, 'Markdown - Fenced Language');
    assert.equal(language.foreground, '#777F86');
  });

  test('Markdown: embedded TypeScript uses syntax colors without a source.ts parent', async () => {
    const keyword = await tokenAt('const essence = 100', 'const');
    const number = await tokenAt('const essence = 100', '100');
    assert(keyword.scopes.includes('meta.embedded.block.typescript'));
    assert(keyword.scopes.includes('storage.type.ts'));
    assert(number.scopes.includes('constant.numeric.decimal.ts'));
    assert(!keyword.scopes.includes('source.ts'));
    assert.equal(keyword.foregroundRule?.name, 'Markdown embedded — Code — Keywords and modifiers');
    assert.equal(keyword.foreground, '#AEB5BA');
    assert.equal(number.foregroundRule?.name, 'Markdown embedded — Code — Numeric literals and BigInt suffixes');
    assert.equal(number.foreground, '#C9A18B');
  });

  test('Markdown: emphasis, inline/reference links and URL variants use observed rules', async () => {
    for (const [text, scope, rule] of [
      ['Strong ritual', 'markup.bold.markdown', 'Markup - Bold'],
      ['Emphasis ritual', 'markup.italic.markdown', 'Markup - Italic'],
      ['Combined ritual', 'markup.italic.markdown', 'Markup - Bold-Italic'],
    ]) {
      const token = await tokenAt('**Strong ritual**', text);
      assert(token.scopes.includes(scope));
      assert.equal(token.foregroundRule?.name, rule);
      assert.equal(token.foreground, '#C58F96');
    }
    const combined = await tokenAt('**Strong ritual**', 'Combined ritual');
    assert(combined.scopes.includes('markup.bold.markdown'));
    for (const line of ['[Inline ritual]', '[Reference ritual]']) {
      const token = await tokenAt(line, line.slice(1, line.indexOf(']')));
      assert(token.scopes.includes('string.other.link.title.markdown'));
      assert.equal(token.foregroundRule?.name, 'Markdown - Link');
      assert.equal(token.foreground, '#C58F96');
    }
    const reference = await tokenAt('[Reference ritual]', 'rathma');
    assert(reference.scopes.includes('constant.other.reference.link.markdown'));
    assert.equal(reference.foregroundRule?.name, 'Markdown - Link Anchor');
    for (const line of ['[Inline ritual]', '[rathma]:', 'Autolink:']) {
      const url = await tokenAt(line, 'https://');
      assert(url.scopes.includes('markup.underline.link.markdown'));
      assert.equal(url.foregroundRule?.name, 'Markup - Underline');
      assert.equal(url.foreground, '#AEB5BA');
    }
    const bare = await tokenAt('Bare URL:', 'https://');
    assert.equal(bare.foregroundRule?.name, 'Markdown - Plain');
    assert.equal(bare.foreground, '#D8CBB8');
  });

  test('Markdown: quote markers are muted; list markers, tables and horizontal rules retain their colors', async () => {
    for (const [line, text, scope, rule, color] of [
      ['> Quoted ritual', '>', 'punctuation.definition.quote.begin.markdown', 'Markdown - Blockquote', '#777F86'],
      ['- Unordered ritual', '-', 'punctuation.definition.list.begin.markdown', 'Markdown - Plain', '#D8CBB8'],
      ['1. Ordered ritual', '1.', 'punctuation.definition.list.begin.markdown', 'Markdown - Plain', '#D8CBB8'],
    ]) {
      const token = await tokenAt(line, text);
      assert(token.scopes.includes(scope));
      assert.equal(token.foregroundRule?.name, rule);
      assert.equal(token.foreground, color);
    }
    const table = await tokenAt('| Name | Essence |', 'Name');
    assert(table.scopes.includes('markup.table.markdown'));
    assert.equal(table.foregroundRule?.name, 'Markup - Table');
    assert.equal(table.foreground, '#D8CBB8');
    const horizontal = (await fixture('syntax-audit.md')).tokens.find(t =>
      t.scopes.includes('meta.separator.markdown') && t.text === '---');
    assert(horizontal);
    assert.equal(horizontal.foregroundRule?.name, 'Markdown - Separator');
    assert.equal(horizontal.foreground, '#777F86');
  });

  test('Diff bindings: three legacy scopes reference the independent semantic diffMarkup roles', () => {
    const file = readFileSync(new URL('../src/palettes/necromancer-dark.ts', import.meta.url), 'utf8');
    const ast = tools.ts.createSourceFile('theme.ts', file, tools.ts.ScriptTarget.Latest, true);
    const wanted = new Map([['Inserted', 'inserted'], ['Deleted', 'deleted'], ['Changed', 'changed']]);
    const found = new Set<string>();
    const visit = (node: any) => {
      if (tools.ts.isVariableDeclaration(node) && node.name.getText(ast) === 'preservedMarkup') {
        for (const entry of node.initializer.elements) {
          const name = entry.properties.find((p: any) => p.name.text === 'name').initializer.text;
          const role = wanted.get(name);
          if (!role) continue;
          const settings = entry.properties.find((p: any) => p.name.text === 'settings').initializer;
          assert.equal(settings.properties.find((p: any) => p.name.text === 'foreground').initializer.getText(ast),
            `semantic.syntax.diffMarkup.${role}`);
          found.add(name);
          const rule = necromancerDark.tokenColors.find(rule => rule.name === name)!;
          assert.deepEqual(rule.scope, [`markup.${role}`]);
          assert.equal(rule.settings.foreground, semantic.syntax.diffMarkup[role]);
        }
      }
      tools.ts.forEachChild(node, visit);
    };
    visit(ast);
    assert.equal(found.size, 3);
  });

  test('Diff grammar: real inserted/deleted/changed tokens retain legacy colors; headers fall back', async () => {
    const tokens = (await fixture('syntax-audit.diff')).tokens;
    for (const [scope, name, color] of [['inserted', 'Inserted', '#C3E88D'],
      ['deleted', 'Deleted', '#FF5370'], ['changed', 'Changed', '#C792EA']]) {
      const actual = tokens.filter(t => t.scopes.includes(`markup.${scope}.diff`));
      assert(actual.length > 0, `Installed diff grammar did not emit markup.${scope}.diff; binding checks alone are not integration coverage`);
      for (const token of actual) {
        assert.equal(token.foregroundRule?.name, name);
        assert.equal(token.foreground, color);
        assert.equal(token.editorForegroundFallback, false);
      }
    }
    const header = tokens.find(t => t.scopes.includes('meta.diff.header.git'))!;
    assert(header);
    assert.equal(header.editorForegroundFallback, true);
    assert.equal(header.foregroundRule, null);
    assert.equal(header.foreground, '#EEFFFF');
  });
}
