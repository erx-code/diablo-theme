# Markdown / diff tokenization diagnostics

`markdown-diff-report.json` freezes actual TextMate output from the installed
VS Code 1.142.0 built-in grammars and the current theme after Step 22. It is a
test fixture, separate from the immutable theme files in `tests/baselines/`.
Builds and tests never update it automatically.

Inputs are `fixtures/syntax-audit.md` and `fixtures/syntax-audit.diff`.
The report covers every nonempty raw token, including whitespace, with:

- line/column range and token text;
- the complete emitted scope stack;
- effective TextMate foreground decoded from `tokenizeLine2` metadata;
- the winning foreground rule's original index/name, or null for editor fallback;
- whether foreground falls back to `editor.foreground`.

Foreground provenance is measured with a second TextMate registry assigning a
unique marker to each existing foreground rule. It preserves scopes, ordering
and fontStyle, and adds no foreground to style-only rules. The resulting winner
is checked against the original registry's real color. No handwritten selector
matcher or semantic-role-name inference is used. The field identifies the
foreground supplier, not every matching rule or the source of inherited styles.

The integration suite compares current output with this explicitly reviewed
diagnostic report. Grammar SHA-256 and VS Code version make upgrades visible.
Step 22.1 approved the 19 appended embedded TS/JS rules as the current Dark
baseline. The strict tokenization comparison, `npm test` baseline guard and
`build:check` compare against this approved result. The preceding Step 20.1
baseline is preserved in `tests/baselines/necromancer-dark-pre-embedded-tsjs.json`;
the original Step 1 bytes remain in
`tests/baselines/necromancer-dark-pre-markdown-fix.json`.

Additional Step 20 tests compare the approved Step 20.1 baseline to the original
snapshot and prove that only the seven arrays enumerated in
`markdown-selectors-step20.json` differ from the historical theme, and that
only explicitly targeted tokens change. Every neighboring token, all emitted
scopes/text and all diff tokens must remain identical to historical output.
The Step 20 delta and neighboring-token checks explicitly compare the preserved
pre-embedded snapshot against the pre-Markdown-fix snapshot. They supplement, rather than replace or disable, strict checks
against the current baseline.
`markdown-selectors-step20.diff` contains the exact generated Dark JSON diff.

Run `npm run test:syntax`. For the full current report on stdout:

```sh
DIABLO_TOKEN_REPORT=1 npm run test:syntax
```

Current observations after the Step 20 selector correction:

- H1–H6 markers and `entity.name.section.markdown` text match `Markdown - Heading`
  and use Ancient Bone. Setext text still has paragraph scopes and remains Bone.
- Inline code uses Sage Ash; `punctuation.definition.raw.markdown` delimiters
  use Muted Ash under `markup.inline.raw.string.markdown`.
- Modern `markup.fenced_code.block.markdown` matches the existing Bone content
  rule. Delimiters stay Bone; language labels use Muted Ash through
  `fenced_code.block.language.markdown`.
- Both legacy overlay rules stay unchanged and still supply foreground, not
  background. An in-memory experiment proves that correcting the delimiter
  overlay selector would turn four fence markers into `#00000050`; it is not
  applied to the theme. The broad overlay would lose to the later content rule.
- The labelled TypeScript fence has actual `.ts` scopes under
  `meta.embedded.block.typescript`, without a `source.ts` parent. Step 22 adds
  Markdown-qualified TS/JS rules derived from the original rules and their
  existing semantic colors. The original source-file rules are unchanged.
- Actual quote markers now use Muted Ash; list markers use the existing Plain
  Bone role through their corrected selector. No new color role was introduced.
- URLs in links/autolinks use `Markup - Underline`; a bare URL stays plain text.
- Tables match `Markup - Table`; horizontal rules match `Markdown - Separator`.
- Real diff input emits `markup.inserted.diff`, `markup.deleted.diff` and
  `markup.changed.diff`, matched by the three legacy semantic diffMarkup rules.
  Diff headers instead exercise true editor-foreground fallback.

Diff binding tests separately inspect source expressions referencing
`semantic.syntax.diffMarkup`. Tokenization tests use actual grammar output,
never synthetic scope stacks. If a grammar stops emitting a target scope,
the integration test fails explicitly rather than treating binding checks as
successful tokenization coverage.

This measures TextMate foreground, including alpha, not the final UI after
semantic highlighting, user color customizations or third-party injections.
Only installed built-in grammar contributions are loaded. No extension is
activated and no new dependencies are installed.

## Step 22: embedded TypeScript and JavaScript

`fixtures/markdown-embedded.md` exercises the real `typescript`, `ts`,
`javascript` and `js` aliases, with keywords, variables, parameters, functions,
method calls, interfaces/types, strings, numbers, booleans, nullish values,
comments/JSDoc, punctuation, operators, template expressions and regex.
It also contains regression blocks for TSX, JSX, JSON, CSS, SCSS, HTML, Go and
an unknown language. The integration tests tokenize them with installed built-in
grammars; expected scopes are never injected into a synthetic stack.

`tests/markdown-embedded.ts` checks effective foreground and winning rules,
compares every token in each supported block to the same body tokenized as an
ordinary source file, and repeats this comparison with the complete existing
TS/JS audit fixtures. Source-file output is also compared with the approved
pre-embedded snapshot. All existing Markdown and diff tokens outside TS/JS embedded contexts
must remain identical, including fence delimiters and language labels.

The builder appends 19 rules, reusing original settings and order. Contextual
regex, comment and quoted-key overrides need more specific emitted leaf scopes:
TextMate compares the specificity of the nearest parent, so the long embedded
parent would otherwise let generic rules win. Full source/fenced parity tests
cover these exceptions. `markdown-embedded-step22.diff` records the exact Dark
JSON delta against the approved Step 20.1 baseline.

The installed Markdown grammar groups `jsx`, `js`, `javascript`, `es6`, `mjs`,
`cjs`, `dataviewjs` and its JS attribute form into one JavaScript context.
A theme cannot distinguish these fence labels after tokenization. Therefore
ordinary JS tokens inside `jsx` also receive the new colors. No JSX-specific
rules are copied: JSX tags/text retain the Bone fallback. TSX and the other
embedded language contexts remain unchanged. Excluding the JSX alias entirely
would require grammar changes, outside Step 22.
