import { primitives } from '../primitives.ts';
import { derived } from '../derived.ts';
import { compatibility } from '../compatibility.ts';

// Independent syntax roles, even when their current colors coincide.
// TextMate context roles stay independent of semantic-provider symbol categories.
export const syntax = {
  keyword: primitives.silver,
  function: primitives.ashRose,
  method: primitives.ashRose,
  variable: primitives.dustyCopper,
  parameter: primitives.dustyCopper,
  property: primitives.bone.base,
  // type: primitives.bone.ancient,
  type: primitives.blood,
  string: primitives.sageAsh,
  number: primitives.dustyCopper,
  boolean: primitives.ashRose,
  comment: primitives.mutedAsh,
  punctuation: primitives.silver,
  enumMember: primitives.bone.base,
  decorator: primitives.ashRose,
  // class: primitives.bone.ancient,
  class: primitives.blood,
  // interface: primitives.bone.ancient,
  interface: primitives.blood,
  // enum: primitives.bone.ancient,
  enum: primitives.blood,
  // namespace: primitives.bone.ancient,
  namespace: primitives.dustyCopper,
  typeParameter: primitives.bone.ancient,
  operator: primitives.silver,
  label: primitives.bone.base,
  regexp: primitives.sageAsh,
  identifierFallback: primitives.bone.base,
  // Compatibility alias for variable-like identifiers; properties have their own role.
  variableLike: primitives.dustyCopper,
  specialValue: primitives.silver,
  invalid: primitives.blood,
  regexpDelimiterAndFlag: primitives.silver,
  interfacePropertySeparator: primitives.bone.base,
  markup: {
    // JSX component names share the existing tag-name rule.
    tag: primitives.bone.ancient,
    attribute: primitives.silver,
    attributeValue: primitives.sageAsh,
    text: primitives.bone.pale,
    punctuation: primitives.silver,
  },
  // These roles follow the existing CSS-family rule groups, including SCSS.
  css: {
    valueFallback: primitives.bone.base,
    selector: primitives.bone.ancient,
    property: primitives.silver,
    // Custom properties, SCSS variables/interpolation, values and map keys share one rule.
    variableAndValue: primitives.bone.base,
    functionAndMixin: primitives.ashRose,
    controlAndPunctuation: primitives.silver,
    number: primitives.dustyCopper,
    string: primitives.sageAsh,
    hexColorPrefix: primitives.bone.base,
    comment: primitives.mutedAsh,
  },
  tailwind: {
    utility: primitives.bone.base,
  },
  json: {
    // The existing key rule also provides the JSON/JSONC root fallback.
    key: primitives.bone.base,
    string: primitives.sageAsh,
    number: primitives.dustyCopper,
    // The grammar assigns true, false and null the same scope.
    booleanAndNull: primitives.silver,
    punctuation: primitives.silver,
    keyQuote: primitives.silver,
    comment: primitives.mutedAsh,
    invalid: primitives.blood,
  },
  markdown: {
    text: primitives.bone.base,
    inlineCode: primitives.sageAsh,
    inlineCodePunctuation: primitives.mutedAsh,
    heading: primitives.bone.ancient,
    emphasis: primitives.ashRose,
    underline: primitives.silver,
    quoteMarker: primitives.mutedAsh,
    link: primitives.ashRose,
    linkDescription: primitives.sageAsh,
    linkReference: primitives.ashRose,
    rawCode: primitives.sageAsh,
    // Legacy foreground. Preserve both overlay rules and the later content override.
    fencedOverlayForeground: derived.markdown.fencedOverlay,
    fencedContent: primitives.bone.base,
    fencedLanguage: primitives.mutedAsh,
    separator: primitives.mutedAsh,
    table: primitives.bone.base,
  },
  // Legacy TextMate diff markup stays independent of Workbench Git/Diff colors.
  diffMarkup: {
    inserted: compatibility.insertedMarkup,
    deleted: compatibility.deletedMarkup,
    changed: compatibility.changedMarkup,
  },
} as const;
