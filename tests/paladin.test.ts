import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { necromancerDark } from '../src/palettes/necromancer-dark.ts';
import { paladinDark, palette as darkPalette } from '../src/palettes/paladin-dark.ts';
import { paladinLight, palette as lightPalette } from '../src/palettes/paladin-light.ts';
import { primitives } from '../src/palettes/paladin-dark/primitives.ts';

function luminance(hex: string) {
  const channels = [1, 3, 5].map(offset => {
    const value = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrast(a: string, b: string) {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test('Paladin Dark preserves the supplied Ivory & Midnight primitives', () => {
  assert.deepEqual(primitives, {
    midnight: { sidebar: '#131420', editor: '#1B1D2B', elevated: '#292C40', border: '#41465E', selection: '#454D68' },
    ivory: { base: '#D9D0C3', ancient: '#E8DDCB', pale: '#F5EFE3' },
    holyGold: '#C7A66E', duskLavender: '#AAA7CC', sage: '#ABB79C',
    bronze: '#C6A188', silver: '#BBC2D0', mutedSteel: '#7E8298',
  });
});

for (const [theme, palette] of [[paladinDark, darkPalette], [paladinLight, lightPalette]] as const) {
  test(`${theme.name}: extension registration and generated JSON match the source`, async () => {
    const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
    const entry = manifest.contributes.themes.find((entry: { label: string }) => entry.label === theme.name);
    assert(entry, theme.name);
    assert.equal(entry.uiTheme, theme.type === 'light' ? 'vs' : 'vs-dark');
    const generated = await readFile(new URL(`../${entry.path}`, import.meta.url), 'utf8');
    assert.equal(generated, `${JSON.stringify(theme, null, 2)}\n`);
  });

  test(`${theme.name}: all full-theme bindings and selector precedence are retained`, () => {
    assert.deepEqual(Object.keys(theme.colors), [...Object.keys(necromancerDark.colors),
      'editor.selectionBackground', 'editor.inactiveSelectionBackground', 'editorCursor.foreground']);
    assert.deepEqual(Object.keys(theme.semanticTokenColors), Object.keys(necromancerDark.semanticTokenColors));
    assert.deepEqual(theme.tokenColors.map(({ name, scope, settings }) => [name, scope, settings.fontStyle]),
      necromancerDark.tokenColors.map(({ name, scope, settings }) => [name, scope, settings.fontStyle]));
    assert(theme.semanticHighlighting);
    assert.equal(theme.colors['editor.background'], palette.surfaces.editor);
    assert.equal(theme.colors['editor.foreground'], palette.text.base);
    assert.equal(theme.colors['editor.selectionBackground'], palette.surfaces.selection);
    assert.equal(theme.colors['editorCursor.foreground'], palette.holyGold);
    assert.equal(theme.colors['sideBar.background'], palette.surfaces.sidebar);
    assert.equal(theme.colors['focusBorder'], palette.holyGold);
    assert.equal(theme.colors['gitDecoration.deletedResourceForeground'], palette.error);
    assert.notEqual(palette.error, palette.holyGold);
    for (const color of Object.values(theme.colors)) assert(/^#[\da-f]{6}([\da-f]{2})?$/i.test(color), color);
    for (const [key, color] of Object.entries(theme.colors)) {
      if (/^diffEditor\.(inserted|removed)(Text|Line)Background$/.test(key)) {
        assert.equal(color.length, 9, key);
        const alpha = parseInt(color.slice(7), 16);
        assert(alpha > 0 && alpha < 255, key);
      }
    }
  });

  test(`${theme.name}: code and controls retain readable foregrounds`, () => {
    for (const [selector, color] of Object.entries(theme.semanticTokenColors)) {
      const ratio = contrast(color, palette.surfaces.editor);
      // The supplied dark mutedSteel has 4.40:1 contrast; retain that exact primitive.
      const minimum = theme === paladinDark && selector.startsWith('comment:') ? 4.4 : 4.5;
      assert(ratio >= minimum, `${selector}: contrast ${ratio.toFixed(2)}`);
    }
    for (const [foreground, background] of [
      ['editor.foreground', 'editor.background'],
      ['list.activeSelectionForeground', 'list.activeSelectionBackground'],
      ['button.foreground', 'button.background'],
      ['badge.foreground', 'badge.background'],
    ]) {
      const ratio = contrast(theme.colors[foreground], theme.colors[background]);
      assert(ratio >= 4.5, `${foreground}: contrast ${ratio.toFixed(2)}`);
    }
  });
}
