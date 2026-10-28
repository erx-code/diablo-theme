# Diablo Theme

Four themes for VS Code: **Necromancer Dark**, **Necromancer Light**,
**Paladin Dark**, and **Paladin Light**.

Paladin Dark uses the Ivory & Midnight palette: midnight surfaces,
ivory text, and gold, lavender, and sage accents.
Paladin Light pairs a light ivory background with dark text and deeper
shades of the same accents for readable syntax highlighting.

In all four themes, variables and parameters use an accent color,
while properties use the main text color: in `palette.someValue`, the `palette`
object is visually distinct from the `someValue` property. These rules apply to
TS, TSX, JS, and JSX, with or without semantic highlighting.
Functions and methods use a third color: in Paladin, variables are gold,
functions are lavender, and properties use the main text color. In Necromancer,
variables are copper, while functions are pink in Dark and burgundy in Light.

Files such as `.env`, `.env.local`, `.env.example`, and other Dotenv variants
also use the selected theme's colors for variable names, values, `export`,
`${NAME}` substitutions, escape sequences, and comments.
Both the built-in Dotenv language (`source.dotenv`) and the
`mikestead.dotenv` extension (`source.env`) are supported. If a file opens as
Plain Text, select **Dotenv / Environment Variables** in the VS Code status bar.
The precision of substitution and numeric highlighting depends on the grammar:
`mikestead.dotenv` does not tokenize unquoted substitutions, while the built-in
grammar does not distinguish numbers and booleans from other values.

## Theme generation

Development requires Node.js 22.6 or later with support for `--experimental-strip-types`.
No dependency installation is required.

```sh
npm run build
```

Theme sources are in `src/palettes/`. The Paladin palettes are defined in
`paladin-dark/primitives.ts` and `paladin-light/primitives.ts`, with shared roles
in `paladin.ts`. UI color mappings and syntax highlighting rules for the complete
themes are in `src/theme/create-theme.ts`. Highlighting for TS, TSX, JS, JSX,
JSON, JSONC, CSS, SCSS, and HTML uses consistent Blood & Bone roles.
Tailwind `@apply` supports both the built-in CSS grammar and the installed
Tailwind injection grammar. The five legacy `syntax*` fields are retained
only for diffs, UI icons, and the translucent Markdown overlay.

`src/build.ts` generates all four `themes/*-color-theme.json` files.
Edit the TypeScript sources, then run the build and commit the updated
JSON files alongside the sources. Rebuilding overwrites the JSON files.

To preview a theme, launch the **Extension** configuration with F5 and select
the theme using **Preferences: Color Theme** in the Extension Development Host.

The extension uses the generated JSON files; Node.js is only needed to generate them.
Chat styling applies to built-in VS Code components and elements that use
VS Code theme colors. Custom interfaces in third-party extensions may need
separate support for these colors.

The UI color keys used by the themes are documented in the
[VS Code Theme Color Reference](https://code.visualstudio.com/api/references/theme-color).

## Highlighting checks

```sh
npm run build:check
npm test
npm run test:syntax
npm run test:identifiers
npm run test:dotenv
```

`npm run build:check` does not write any files. It compares the output generated
from the sources and the JSON files in `themes/` against independent
[baseline files](tests/baselines/README.md). The comparison covers all colors,
semantic tokens, TextMate rule and selector order, `fontStyle`, and the exact
JSON bytes of the Necromancer themes. For Paladin, it checks that the JSON
matches the sources. The build does not update the baseline.
The baseline must remain unchanged during architectural migrations.

`npm test` checks generation, palettes, selectors, and conflicting duplicates.
It also validates the baseline and verifies that the checks detect changes.
`npm run test:syntax` checks actual TextMate/Oniguruma tokenization and TypeScript
semantic tokens from the installed VS Code against `fixtures/syntax-audit.*`.
No dependencies are installed. If the editor is installed in a nonstandard
location, set `VSCODE_APP_ROOT` to its `resources/app` directory (on macOS,
`Visual Studio Code.app/Contents/Resources/app`).

These are automated tokenization checks, not visual tests of the VS Code window.
`npm run test:identifiers` separately checks the distinction between variables,
properties, and functions using real TextMate grammars and TypeScript semantic
tokens for all themes.
`npm run test:dotenv` checks the colors of actual Dotenv tokens in all themes
using examples from `fixtures/syntax-audit.env`. Checks for `mikestead.dotenv`
use the already installed extension; set `VSCODE_DOTENV_ROOT` if it is installed
in a nonstandard location.
Audit results, adopted roles, and grammar limitations are documented in the
[report](docs/syntax-audit.md).

For the CSS/SCSS/HTML/Tailwind migration, legacy field inventory, and limitations, see
[Legacy Palette Migration](docs/legacy-palette-migration.md).
