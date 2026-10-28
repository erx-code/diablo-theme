import { callableTokenRule, identifierSemanticColors, identifierTokenRules } from '../theme/identifiers.ts';
import { dotenvTokenRules } from '../theme/dotenv.ts';

// Source of truth. Run npm run build after editing; themes/*.json are generated.
export const palette = {
  parchment: "#F2EDE3",
  ink: "#302D2C",
  sidebar: "#EDE5D9",
  lineHighlight: "#E8E0D4",
  border: "#D8CFC2",
  selection: "#D8B7B9",
  blood: "#912D3B",
  copper: "#865A40",
  sage: "#526344",
  silver: "#68605C",
  mutedAsh: "#776B65",
} as const satisfies Record<string, `#${string}`>;

// Match the dark themes' variable/member distinction on parchment surfaces.
export const necromancerLight = {
  "name": "Necromancer Light",
  "type": "light",
  "colors": {
    "editor.background": palette.parchment,
    "editor.foreground": palette.ink,
    "sideBar.background": palette.sidebar,
    "panel.background": palette.sidebar,
    "editor.lineHighlightBackground": palette.lineHighlight,
    "panel.border": palette.border,
    "activityBar.background": palette.sidebar,
    "editor.selectionBackground": palette.selection,
    "editorCursor.foreground": palette.blood
  },
  "semanticHighlighting": true,
  "semanticTokenColors": identifierSemanticColors(palette.copper, palette.ink, palette.blood),
  "tokenColors": [
    ...dotenvTokenRules({
      variable: palette.copper,
      string: palette.sage,
      keyword: palette.blood,
      punctuation: palette.silver,
      comment: palette.mutedAsh,
      number: palette.copper,
      boolean: palette.blood,
    }),
    ...identifierTokenRules(palette.copper, palette.ink),
    callableTokenRule(palette.blood),
  ]
};
