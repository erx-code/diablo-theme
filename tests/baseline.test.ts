import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { assertThemeBaseline } from './baseline.ts';

const dark = JSON.parse(await readFile(new URL('./baselines/necromancer-dark.json', import.meta.url), 'utf8'));
const light = JSON.parse(await readFile(new URL('./baselines/necromancer-light.json', import.meta.url), 'utf8'));

test('baseline comparison accepts the frozen themes unchanged', () => {
  for (const baseline of [dark, light]) assertThemeBaseline(structuredClone(baseline), baseline, baseline.name);
});

// Exercise the guard with in-memory mutations. No source, output or snapshot is modified.
const mutations: [string, typeof dark, (theme: typeof dark) => void][] = [
  ['Workbench color', dark, theme => { theme.colors['editor.background'] = '#000000'; }],
  ['Git decoration', dark, theme => { theme.colors['gitDecoration.modifiedResourceForeground'] = '#000000'; }],
  ['semantic color', dark, theme => { theme.semanticTokenColors['variable:typescript'] = '#000000'; }],
  ['TextMate foreground', dark, theme => { theme.tokenColors[0].settings.foreground = '#000000'; }],
  ['TextMate rule order', dark, theme => { [theme.tokenColors[0], theme.tokenColors[1]] = [theme.tokenColors[1], theme.tokenColors[0]]; }],
  ['selector order', dark, theme => {
    const rule = theme.tokenColors.find((rule: any) => rule.scope.length > 1);
    [rule.scope[0], rule.scope[1]] = [rule.scope[1], rule.scope[0]];
  }],
  ['fontStyle', dark, theme => {
    const rule = theme.tokenColors.find((rule: any) => rule.settings.fontStyle === 'italic');
    rule.settings.fontStyle = 'bold';
  }],
  ['semanticHighlighting', dark, theme => { theme.semanticHighlighting = false; }],
  ['added color ID', dark, theme => { theme.colors['baseline.test'] = '#000000'; }],
  ['removed color ID', dark, theme => { delete theme.colors['editor.background']; }],
  ['Light color', light, theme => { theme.colors['editor.background'] = '#000000'; }],
  ['Light syntax', light, theme => { theme.tokenColors.push({ scope: ['source.ts'], settings: { foreground: '#000000' } }); }],
];

for (const [name, baseline, mutate] of mutations) {
  test(`baseline comparison rejects changed ${name}`, () => {
    const changed = structuredClone(baseline);
    mutate(changed);
    assert.throws(() => assertThemeBaseline(changed, baseline, name), { code: 'ERR_ASSERTION' });
  });
}
