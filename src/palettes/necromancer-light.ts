// Source of truth. Run npm run build after editing; themes/*.json are generated.
export const palette = {
  parchment: "#F2EDE3",
  ink: "#302D2C",
  sidebar: "#EDE5D9",
  lineHighlight: "#E8E0D4",
  border: "#D8CFC2",
  selection: "#D8B7B9",
  blood: "#912D3B",
} as const satisfies Record<string, `#${string}`>;

// Existing token rules are preserved until the syntax-highlighting pass.
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
  "tokenColors": []
};
