import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { withAlpha } from '../src/color/alpha.ts';
import { parseColor, rgb, rgba } from '../src/color/types.ts';
import type { RGB } from '../src/color/types.ts';

test('HEX constructors validate RGB/RGBA and preserve their original case', () => {
  for (const value of ['#000000', '#FFFFFF', '#a8B59a']) {
    assert.equal(rgb(value), value);
    assert.equal(parseColor(value), value);
    assert.throws(() => rgba(value), TypeError);
  }
  for (const value of ['#00000000', '#FFFFFFFF', '#a8B59aCc']) {
    assert.equal(rgba(value), value);
    assert.equal(parseColor(value), value);
    assert.throws(() => rgb(value), TypeError);
  }
});

test('HEX constructors reject invalid lengths, characters, whitespace and non-strings', () => {
  const invalid = [
    '', '#', '#fff', '#ffff', '#12345', '#1234567', '#123456789', '123456',
    '#GG0000', '#12345Z', '#123456G0', '#1234567Z', '#１２３４５６',
    ' #123456', '#123456 ', '#123456\n', '#123456\r', '#12345678\n',
    '#12345678\r', '#123456\u2028', '#12345678\u2029', '\n#123456',
    undefined, null, 123456, true, {}, ['#123456'], new String('#123456'),
  ];
  for (const value of invalid) {
    for (const constructor of [rgb, rgba, parseColor]) assert.throws(() => constructor(value), TypeError);
  }
});

test('withAlpha handles endpoints, fractions and byte rounding', () => {
  const source = rgb('#a8B59a');
  for (const [opacity, byte] of [[0, '00'], [-0, '00'], [1, 'FF'], [0.5, '80'],
    [0.1, '1A'], [0.2, '33'], [0.8, 'CC'], [0.5 / 255, '01'],
    [0.49 / 255, '00'], [254.5 / 255, 'FF']] as const) {
    assert.equal(withAlpha(source, opacity), `#a8B59a${byte}`);
  }
});

test('withAlpha reproduces all existing alpha bytes exactly', () => {
  for (const byte of ['00', '14', '26', '33', '50', '80', 'CC']) {
    assert.equal(withAlpha(rgb('#242424'), parseInt(byte, 16) / 255), `#242424${byte}`);
  }
  // Exhaust the byte domain to catch rounding or zero-padding regressions.
  for (let byte = 0; byte <= 255; byte++) {
    assert.equal(withAlpha(rgb('#A8B59A'), byte / 255),
      `#A8B59A${byte.toString(16).padStart(2, '0').toUpperCase()}`);
  }
});

test('withAlpha rejects non-finite and out-of-range opacity instead of clamping', () => {
  for (const opacity of [NaN, Infinity, -Infinity, -0.01, 1.01, -Number.MIN_VALUE, 1 + Number.EPSILON]) {
    assert.throws(() => withAlpha(rgb('#242424'), opacity), RangeError);
  }
  for (const opacity of ['0.5', null, undefined, true, {}, new Number(0.5)]) {
    assert.throws(() => withAlpha(rgb('#242424'), opacity as number), TypeError);
  }
});

test('withAlpha rejects RGBA and unvalidated input at runtime', () => {
  assert.throws(() => {
    // @ts-expect-error RGBA cannot be used where RGB is required.
    withAlpha(rgba('#242424CC'), 0.5);
  }, TypeError);
  for (const value of ['#242424CC', '#xyzxyz', '#fff', '#242424\n', null, 42]) {
    assert.throws(() => withAlpha(value as RGB, 0.5), TypeError);
  }
  assert.throws(() => {
    // @ts-expect-error The result already has an alpha channel.
    withAlpha(withAlpha(rgb('#242424'), 0.5), 0.5);
  }, TypeError);
});

test('withAlpha reproduces every transparent value in the independent Dark baseline', async () => {
  const baseline = JSON.parse(await readFile(new URL('./baselines/necromancer-dark.json', import.meta.url), 'utf8'));
  const transparent = new Set<string>();
  const collect = (value: unknown) => {
    if (typeof value === 'string' && /^#[0-9a-f]{8}$/i.test(value)) transparent.add(value);
    else if (value && typeof value === 'object') for (const child of Object.values(value)) collect(child);
  };
  collect(baseline);
  assert.equal(transparent.size, 13);
  for (const value of transparent) {
    assert.equal(withAlpha(rgb(value.slice(0, 7)), parseInt(value.slice(7), 16) / 255), value);
  }
});
