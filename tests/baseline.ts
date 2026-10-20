import assert from 'node:assert/strict';

// The expected value must come from a frozen JSON file, never from a palette import.
export function assertThemeBaseline(actual: Record<string, unknown>, expected: Record<string, unknown>, label: string) {
  for (const section of ['colors', 'semanticTokenColors', 'tokenColors']) {
    assert.deepEqual(actual[section], expected[section], `${label}: ${section} differs from the frozen baseline`);
  }
  // Also catches metadata, semanticHighlighting, added/removed keys and absent vs empty sections.
  assert.deepEqual(actual, expected, `${label}: theme differs from the frozen baseline`);
}
