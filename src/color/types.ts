declare const rgbBrand: unique symbol;
declare const rgbaBrand: unique symbol;

export type RGB = `#${string}` & { readonly [rgbBrand]: true };
export type RGBA = `#${string}` & { readonly [rgbaBrand]: true };
export type Color = RGB | RGBA;

/** Validate an opaque #RRGGBB value without changing its case. */
export function rgb(value: unknown): RGB {
  if (typeof value !== 'string' || value.length !== 7 || !/^#[0-9a-f]{6}$/i.test(value)) {
    throw new TypeError('Expected RGB in #RRGGBB format');
  }
  return value as RGB;
}

/** Validate a #RRGGBBAA value without changing its case. */
export function rgba(value: unknown): RGBA {
  if (typeof value !== 'string' || value.length !== 9 || !/^#[0-9a-f]{8}$/i.test(value)) {
    throw new TypeError('Expected RGBA in #RRGGBBAA format');
  }
  return value as RGBA;
}

/** Parse either supported HEX format; shorthand and surrounding whitespace are invalid. */
export function parseColor(value: unknown): Color {
  return typeof value === 'string' && value.length === 9 ? rgba(value) : rgb(value);
}
