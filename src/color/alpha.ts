import { rgb, rgba } from './types.ts';
import type { RGB, RGBA } from './types.ts';

/** Attach alpha once. RGB case is preserved; the appended alpha byte is uppercase. */
export function withAlpha(color: RGB, opacity: number): RGBA {
  // Revalidate for JavaScript callers and unchecked casts; a brand is not runtime validation.
  const source = rgb(color);
  if (typeof opacity !== 'number') throw new TypeError('Opacity must be a number');
  if (!Number.isFinite(opacity) || opacity < 0 || opacity > 1) {
    throw new RangeError('Opacity must be finite and between 0 and 1');
  }
  const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0').toUpperCase();
  return rgba(`${source}${alpha}`);
}
