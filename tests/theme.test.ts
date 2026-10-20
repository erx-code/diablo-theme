import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { gitColors, gitPalette, necromancerDark, palette } from '../src/palettes/necromancer-dark.ts';
import { necromancerLight } from '../src/palettes/necromancer-light.ts';

const syntaxColors = new Set([
  palette.bone, palette.ancientBone, palette.paleBone, palette.silver,
  palette.ashRose, palette.blood, palette.sageAsh, palette.dustyCopper, palette.inactiveForeground,
]);
const auditedRules = necromancerDark.tokenColors.filter(rule =>
  /^(Code|JSX|Regex|TypeScript|JSON|CSS|HTML|Tailwind) —/.test(rule.name));
const languages = ['typescript', 'typescriptreact', 'javascript', 'javascriptreact'];

test('generated JSON matches both palette sources', async () => {
  for (const theme of [necromancerDark, necromancerLight]) {
    const file = new URL(`../themes/${theme.name}-color-theme.json`, import.meta.url);
    assert.deepEqual(JSON.parse(await readFile(file, 'utf8')), theme);
  }
});

test('audited syntax uses only the approved palette and scoped, unique selectors', () => {
  assert(auditedRules.length >= 20);
  const seen = new Set<string>();
  for (const rule of auditedRules) {
    assert(syntaxColors.has(rule.settings.foreground), rule.name);
    assert(rule.scope.length > 0);
    for (const scope of rule.scope) {
      assert(/^((?:source\.(?:ts|tsx|js|js\.jsx|json|css)|text\.html\.(?:basic|derivative)))(?:\s|$)/.test(scope), scope);
      assert(!seen.has(scope), `Conflicting duplicate selector: ${scope}`);
      seen.add(scope);
    }
  }
  // The former global rules caused unrelated token categories to bleed together.
  for (const rule of necromancerDark.tokenColors) {
    for (const scope of rule.scope) {
      assert(!['entity.name', 'keyword', 'punctuation', 'variable', 'meta.block variable.other', 'meta.function-call'].includes(scope), scope);
    }
  }
});

test('semantic categories preserve the hierarchy for every code language and modifier', () => {
  assert.equal(necromancerDark.semanticHighlighting, true);
  const expected = {
    variable: palette.bone, parameter: palette.bone, property: palette.bone, enumMember: palette.bone,
    function: palette.ashRose, method: palette.ashRose, decorator: palette.ashRose,
    type: palette.ancientBone, class: palette.ancientBone, interface: palette.ancientBone,
    enum: palette.ancientBone, namespace: palette.ancientBone, typeParameter: palette.ancientBone,
    keyword: palette.silver, operator: palette.silver, label: palette.bone,
    string: palette.sageAsh, regexp: palette.sageAsh, number: palette.dustyCopper,
    comment: palette.inactiveForeground,
  };
  for (const language of languages) {
    for (const [type, color] of Object.entries(expected)) {
      assert.equal(necromancerDark.semanticTokenColors[`${type}:${language}`], color);
    }
  }
  assert.equal(Object.keys(necromancerDark.semanticTokenColors).length, languages.length * Object.keys(expected).length);
  for (const [selector, color] of Object.entries(necromancerDark.semanticTokenColors)) {
    assert(/^[a-zA-Z]+:(typescript|typescriptreact|javascript|javascriptreact)$/.test(selector), selector);
    assert(syntaxColors.has(color), selector);
  }
  // No global modifier override may repaint a readonly property, static method or library type.
  assert(!Object.keys(necromancerDark.semanticTokenColors).some(selector => selector.startsWith('*')));
});

test('intentional overlaps and grammar limitations are explicit', () => {
  const find = (name: string) => {
    const rule = auditedRules.find(rule => rule.name === name);
    assert(rule, name);
    return rule;
  };
  assert.equal(find('TypeScript — Interface field colons').settings.foreground, palette.bone);
  assert(find('TypeScript — Interface field colons').scope.every(scope => scope.includes(' > ')));
  assert.equal(find('Regex — Pattern constructs').settings.foreground, palette.sageAsh);
  assert.equal(find('Regex — Delimiters and flags').settings.foreground, palette.silver);
  assert.equal(find('JSON — Shared boolean/null scope').settings.foreground, palette.silver);
  assert.equal(find('JSX — Text content').settings.foreground, palette.paleBone);
  assert.equal(find('Code — Embedded expression fallback').settings.foreground, palette.bone);
  assert.equal(find('Code — Comment internals').settings.foreground, palette.inactiveForeground);
});

test('nine fixture files exist, including valid strict JSON', async () => {
  for (const extension of ['ts', 'tsx', 'js', 'jsx', 'json', 'jsonc', 'css', 'scss', 'html']) {
    const text = await readFile(new URL(`../fixtures/syntax-audit.${extension}`, import.meta.url), 'utf8');
    assert(text.length > 100, extension);
    if (extension === 'json') JSON.parse(text);
  }
});


test('legacy palette values are confined to preserved UI, diff and overlays', () => {
  const retained = ['syntaxWhite', 'syntaxInvalid', 'syntaxPurple', 'syntaxGreen', 'syntaxFencedOverlay'];
  assert.deepEqual(Object.keys(palette).filter(key => key.startsWith('syntax')).sort(), retained.sort());
  const legacy = new Set(retained.map(key => palette[key]));
  for (const rule of necromancerDark.tokenColors) {
    if (legacy.has(rule.settings.foreground)) {
      assert(['Inserted', 'Deleted', 'Changed', 'Markdown - Raw Block Fenced', 'Markdown - Fenced Bode Block'].includes(rule.name), rule.name);
    }
  }
});


test('Git roles reuse primitives and diff/merge overlays remain transparent', () => {
  assert.equal(gitPalette.modified, palette.dustyCopper);
  assert.equal(gitPalette.added, palette.sageAsh);
  assert.equal(gitPalette.deleted, palette.blood);
  assert.equal(gitPalette.conflicting, palette.ashRose);
  assert.equal(gitPalette.ignored, palette.inactiveForeground);
  assert.equal(gitPalette.submodule, palette.silver);
  for (const [id, color] of Object.entries(gitColors)) {
    assert.equal(necromancerDark.colors[id], color, id);
    if (id.endsWith('Background') || id.endsWith('.background') || id === 'diffEditor.diagonalFill') {
      // Gutter marks are solid by design; text/line overlays must let code show through.
      if (id.startsWith('editorGutter.')) continue;
      assert(/^#[0-9A-F]{8}$/i.test(color), id);
      assert(parseInt(color.slice(7), 16) > 0 && parseInt(color.slice(7), 16) < 255, id);
    }
  }
  assert.equal(gitColors['diffEditor.insertedTextBackground'].slice(0, 7), palette.sageAsh);
  assert.equal(gitColors['diffEditor.removedTextBackground'].slice(0, 7), palette.blood);
  assert(parseInt(gitPalette.insertedText.slice(7), 16) > parseInt(gitPalette.insertedLine.slice(7), 16));
  assert(parseInt(gitPalette.removedText.slice(7), 16) > parseInt(gitPalette.removedLine.slice(7), 16));
});
