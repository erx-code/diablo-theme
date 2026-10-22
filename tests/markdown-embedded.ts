import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { necromancerDark } from '../src/palettes/necromancer-dark.ts';
import { collectMarkdownDiffReport } from './markdown-diff.ts';
import type { loadVSCodeTools } from './vscode-tools.ts';

export function registerMarkdownEmbeddedTests(tools: ReturnType<typeof loadVSCodeTools>) {
  const preEmbeddedBaseline = JSON.parse(readFileSync(new URL('./baselines/necromancer-dark-pre-embedded-tsjs.json', import.meta.url), 'utf8'));
  const source = readFileSync(new URL('../fixtures/markdown-embedded.md', import.meta.url), 'utf8');
  const blocks = [...source.matchAll(/^```(\w+)\n([\s\S]*?)^```/gm)].map(match => ({
    alias: match[1], body: match[2],
    firstLine: source.slice(0, match.index).split('\n').length + 1,
  }));
  const input = [{ file: 'markdown-embedded.md', scope: 'text.html.markdown' }];
  const collect = (theme: typeof necromancerDark) => collectMarkdownDiffReport(tools, theme, input);
  let pending: ReturnType<typeof collect> | undefined;
  const report = () => pending ??= collect(necromancerDark);
  const blockTokens = async (alias: string) => {
    const block = blocks.find(b => b.alias === alias)!;
    return (await report()).fixtures[0].tokens.filter(t => t.line >= block.firstLine && t.line < block.firstLine + block.body.split('\n').length - 1);
  };

  test('Markdown embedded: only appended TS/JS rules differ from the historical pre-embedded baseline', () => {
    const { tokenColors, ...rest } = necromancerDark;
    assert.deepEqual(rest, Object.fromEntries(Object.entries(preEmbeddedBaseline).filter(([key]) => key !== 'tokenColors')));
    assert.deepEqual(tokenColors.slice(0, preEmbeddedBaseline.tokenColors.length), preEmbeddedBaseline.tokenColors);
    const additions = tokenColors.slice(preEmbeddedBaseline.tokenColors.length);
    assert.equal(additions.length, 19);
    for (const rule of additions) {
      assert(rule.name.startsWith('Markdown embedded — '));
      assert(!rule.name.includes('JSX —'));
      const original = preEmbeddedBaseline.tokenColors.find((r: any) => rule.name === `Markdown embedded — ${r.name}`);
      assert(original);
      assert.deepEqual(rule.settings, original.settings);
      for (const scope of rule.scope) {
        assert(/^text\.html\.markdown markup\.fenced_code\.block\.markdown meta\.embedded\.block\.(typescript|javascript)( |$)/.test(scope), scope);
        assert(!scope.includes('typescriptreact'));
      }
    }
  });

  for (const [alias, suffix, embedded] of [
    ['typescript', 'ts', 'typescript'], ['ts', 'ts', 'typescript'],
    ['javascript', 'js', 'javascript'], ['js', 'js', 'javascript'],
  ]) {
    test(`Markdown embedded ${alias}: actual scopes, winning rules and category colors`, async () => {
      const tokens = await blockTokens(alias);
      const checks: [string, string, string][] = [
        ['const', `storage.type.${suffix}`, '#AEB5BA'],
        ['essence', `variable.other.constant.${suffix}`, '#D8CBB8'],
        ['cast', `entity.name.function.${suffix}`, '#C58F96'],
        ['name', `variable.parameter.${suffix}`, '#D8CBB8'],
        ['toUpperCase', `entity.name.function.${suffix}`, '#C58F96'],
        ['bone', `string.quoted.double.${suffix}`, '#A8B59A'],
        ['ash', `string.quoted.single.${suffix}`, '#A8B59A'],
        ['100', `constant.numeric.decimal.${suffix}`, '#C9A18B'],
        ['true', `constant.language.boolean.true.${suffix}`, '#C58F96'],
        ['false', `constant.language.boolean.false.${suffix}`, '#C58F96'],
        ['return', `keyword.control.flow.${suffix}`, '#AEB5BA'],
        ['>=', `keyword.operator.relational.${suffix}`, '#AEB5BA'],
        [';', `punctuation.terminator.statement.${suffix}`, '#AEB5BA'],
        ['ritual comment', `comment.line.double-slash.${suffix}`, '#777F86'],
        ['//', `punctuation.definition.comment.${suffix}`, '#777F86'],
        ['Essence: ', `string.template.${suffix}`, '#A8B59A'],
        ['\\d', 'constant.other.character-class.regexp', '#A8B59A'],
        ['word', 'variable.other.regexp', '#A8B59A'],
        ['+', 'keyword.operator.quantifier.regexp', '#A8B59A'],
        ['/', `punctuation.definition.string.begin.${suffix}`, '#AEB5BA'],
        ['gi', `keyword.other.${suffix}`, '#AEB5BA'],
      ];
      if (suffix === 'ts') checks.push(['Necromancer', 'entity.name.type.interface.ts', '#E0D4C2'], ['number', 'support.type.primitive.ts', '#E0D4C2']);
      for (const [text, scope, foreground] of checks) {
        const token = tokens.find(t => t.text.includes(text) && t.scopes.includes(scope));
        assert(token, `${alias}: missing actual ${text} / ${scope}`);
        assert(token.scopes.includes(`meta.embedded.block.${embedded}`));
        assert(!token.scopes.includes(`source.${suffix}`));
        assert.equal(token.foreground, foreground, `${alias}: ${text}`);
        assert(token.foregroundRule?.name.startsWith('Markdown embedded — '), `${alias}: ${text} winner`);
      }
      for (const token of tokens.filter(t => t.scopes.some(s => s.startsWith('meta.embedded.line.')) && t.text === 'essence')) {
        assert.equal(token.foreground, '#D8CBB8', 'Template expression must not inherit string color');
      }
      assert(tokens.some(t => t.text === 'essence' && t.scopes.includes(`meta.embedded.line.${suffix}`)));
      assert(tokens.some(t => t.scopes.includes('storage.type.class.jsdoc')));
      for (const token of tokens.filter(t => t.scopes.some(s => s.startsWith('comment.')))) {
        assert.equal(token.foreground, '#777F86', `${alias}: comment internals ${token.text}`);
      }
    });

    test(`Markdown embedded ${alias}: foreground matches the same body in an ordinary source file`, async () => {
      const block = blocks.find(b => b.alias === alias)!;
      const standalone = await collectMarkdownDiffReport(tools, necromancerDark, [{ file: `${alias}-in-memory`, scope: `source.${suffix}`, content: block.body }]);
      const normalize = (t: any, offset: number) => ({ line: t.line - offset, start: t.start, end: t.end, text: t.text, foreground: t.foreground });
      assert.deepEqual((await blockTokens(alias)).map(t => normalize(t, block.firstLine - 1)), standalone.fixtures[0].tokens.map(t => normalize(t, 0)));
    });
  }

  test('Markdown embedded: ordinary TS/JS files keep every effective foreground and winning rule', async () => {
    const inputs = [{ file: 'syntax-audit.ts', scope: 'source.ts' }, { file: 'syntax-audit.js', scope: 'source.js' }];
    assert.deepEqual(await collectMarkdownDiffReport(tools, necromancerDark, inputs), await collectMarkdownDiffReport(tools, preEmbeddedBaseline, inputs));
  });

  test('Markdown embedded: complete existing TS/JS audit fixtures retain source-file foregrounds inside fences', async () => {
    for (const [suffix, alias] of [['ts', 'typescript'], ['js', 'javascript']]) {
      const body = readFileSync(new URL(`../fixtures/syntax-audit.${suffix}`, import.meta.url), 'utf8');
      const direct = await collectMarkdownDiffReport(tools, necromancerDark, [{ file: 'direct', scope: `source.${suffix}`, content: body }]);
      const fenced = await collectMarkdownDiffReport(tools, necromancerDark, [{ file: 'fenced', scope: 'text.html.markdown', content: `\`\`\`${alias}\n${body}\`\`\`\n` }]);
      const normalize = (t: any, offset: number) => ({ line: t.line - offset, start: t.start, end: t.end, text: t.text, foreground: t.foreground });
      const embedded = fenced.fixtures[0].tokens.filter(t => t.scopes.includes(`meta.embedded.block.${alias}`));
      assert.deepEqual(embedded.map(t => normalize(t, 1)), direct.fixtures[0].tokens.map(t => normalize(t, 0)), alias);
    }
  });

  test('Markdown embedded: other languages, Markdown text, headers and fence delimiters remain unchanged', async () => {
    const previous = await collect(preEmbeddedBaseline);
    const current = await report();
    let unchanged = 0;
    for (const [index, token] of current.fixtures[0].tokens.entries()) {
      const jsOrTs = token.scopes.includes('meta.embedded.block.typescript') || token.scopes.includes('meta.embedded.block.javascript');
      if (!jsOrTs) {
        assert.deepEqual(token, previous.fixtures[0].tokens[index]);
        unchanged++;
      }
    }
    assert(unchanged > 100);
    for (const alias of ['tsx', 'json', 'css', 'scss', 'html', 'go', 'unknown']) assert((await blockTokens(alias)).length > 0);
    const oldMarkdown = await collectMarkdownDiffReport(tools, preEmbeddedBaseline);
    const newMarkdown = await collectMarkdownDiffReport(tools, necromancerDark);
    for (const [fixtureIndex, fixture] of newMarkdown.fixtures.entries()) {
      for (const [index, token] of fixture.tokens.entries()) {
        if (!token.scopes.includes('meta.embedded.block.typescript') && !token.scopes.includes('meta.embedded.block.javascript')) {
          assert.deepEqual(token, oldMarkdown.fixtures[fixtureIndex].tokens[index]);
        }
      }
    }
  });

  test('Markdown embedded: JSX alias shares JS scopes; JSX markup rules are not added', async () => {
    const tokens = await blockTokens('jsx');
    const keyword = tokens.find(t => t.text === 'const')!;
    assert(keyword.scopes.includes('meta.embedded.block.javascript'));
    assert(keyword.scopes.includes('storage.type.js'));
    assert.equal(keyword.foreground, '#AEB5BA');
    const tag = tokens.find(t => t.text === 'button')!;
    assert(tag.scopes.includes('entity.name.tag.js'));
    assert.equal(tag.foreground, '#D8CBB8');
    assert(!necromancerDark.tokenColors.some(r => r.name.startsWith('Markdown embedded — JSX')));
  });

  test('Markdown embedded: generated Light remains byte-identical to its baseline', () => {
    assert.deepEqual(readFileSync(new URL('../themes/Necromancer Light-color-theme.json', import.meta.url)), readFileSync(new URL('./baselines/necromancer-light.json', import.meta.url)));
  });
}
