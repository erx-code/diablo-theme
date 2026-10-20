// Source of truth. Run npm run build after editing; themes/*.json are generated.
export const palette = {
  editor: "#242424",
  sidebar: "#1B1B1B",
  elevated: "#303030",
  border: "#3A3A3A",
  selectionSurface: "#414141",
  chatBubble: "#242424CC",
  chatBubbleHover: "#303030CC",
  chatCodeBorder: "#3A3A3A80",
  bone: "#D8CBB8",
  ancientBone: "#E0D4C2",
  paleBone: "#F0E9DE",
  sageAsh: "#A8B59A",
  dustyCopper: "#C9A18B",
  blood: "#B34752",
  ashRose: "#C58F96",
  silver: "#AEB5BA",
  inactiveForeground: "#777F86",
  editorForeground: "#eeffff",
  sidebarTitle: "#bbbbbb",
  // Retained exclusively for unchanged Workbench badges, diff and transparent markup overlays.
  syntaxWhite: "#ffffff",
  syntaxInvalid: "#FF5370",
  syntaxPurple: "#C792EA",
  syntaxGreen: "#C3E88D",
  syntaxFencedOverlay: "#00000050",
} as const satisfies Record<string, `#${string}`>;

// Transparent variant of an existing base; no additional base color.
const transparentScrollbarShadow = `${palette.editor}00`;

// Git roles reference the existing primitives. Alpha suffixes are local, explicit
// overlays, not a new shade-generation architecture or additional base colors.
export const gitPalette = {
  modified: palette.dustyCopper,
  added: palette.sageAsh,
  deleted: palette.blood,
  conflicting: palette.ashRose,
  ignored: palette.inactiveForeground,
  submodule: palette.silver,
  border: palette.border,
  insertedText: `${palette.sageAsh}33`,
  insertedLine: `${palette.sageAsh}14`,
  removedText: `${palette.blood}33`,
  removedLine: `${palette.blood}14`,
  conflictHeader: `${palette.ashRose}33`,
  conflictContent: `${palette.ashRose}14`,
  neutralHeader: `${palette.silver}26`,
  neutralContent: `${palette.silver}14`,
} as const satisfies Record<string, `#${string}`>;

export const gitColors = {
  // Explorer and SCM resource decorations (including staged resources).
  "gitDecoration.modifiedResourceForeground": gitPalette.modified,
  "gitDecoration.addedResourceForeground": gitPalette.added,
  "gitDecoration.untrackedResourceForeground": gitPalette.added,
  "gitDecoration.deletedResourceForeground": gitPalette.deleted,
  "gitDecoration.conflictingResourceForeground": gitPalette.conflicting,
  "gitDecoration.ignoredResourceForeground": gitPalette.ignored,
  "gitDecoration.submoduleResourceForeground": gitPalette.submodule,
  "gitDecoration.stageModifiedResourceForeground": gitPalette.modified,
  "gitDecoration.stageDeletedResourceForeground": gitPalette.deleted,
  "gitDecoration.renamedResourceForeground": gitPalette.modified,
  "editorGutter.modifiedBackground": gitPalette.modified,
  "editorGutter.addedBackground": gitPalette.added,
  "editorGutter.deletedBackground": gitPalette.deleted,
  "diffEditor.insertedTextBackground": gitPalette.insertedText,
  "diffEditor.removedTextBackground": gitPalette.removedText,
  "diffEditor.insertedLineBackground": gitPalette.insertedLine,
  "diffEditor.removedLineBackground": gitPalette.removedLine,
  "diffEditor.border": gitPalette.border,
  "diffEditor.diagonalFill": gitPalette.neutralHeader,
  // Inline conflict markers: both sides are conflicts, the common ancestor is neutral.
  "merge.currentHeaderBackground": gitPalette.conflictHeader,
  "merge.currentContentBackground": gitPalette.conflictContent,
  "merge.incomingHeaderBackground": gitPalette.conflictHeader,
  "merge.incomingContentBackground": gitPalette.conflictContent,
  "merge.commonHeaderBackground": gitPalette.neutralHeader,
  "merge.commonContentBackground": gitPalette.neutralContent,
  "merge.border": gitPalette.conflicting,
  "mergeEditor.change.background": gitPalette.insertedLine,
  "mergeEditor.change.word.background": gitPalette.insertedText,
  "mergeEditor.changeBase.background": gitPalette.removedLine,
  "mergeEditor.changeBase.word.background": gitPalette.removedText,
  "mergeEditor.conflict.unhandledFocused.border": gitPalette.conflicting,
  "mergeEditor.conflict.unhandledUnfocused.border": gitPalette.conflicting,
  "mergeEditor.conflict.handledFocused.border": gitPalette.border,
  "mergeEditor.conflict.handledUnfocused.border": gitPalette.border,
  "mergeEditor.conflict.unhandled.minimapOverViewRuler": gitPalette.conflicting,
  "mergeEditor.conflict.handled.minimapOverViewRuler": gitPalette.ignored,
  "mergeEditor.conflictingLines.background": gitPalette.conflictContent,
  "mergeEditor.conflict.input1.background": gitPalette.conflictContent,
  "mergeEditor.conflict.input2.background": gitPalette.conflictContent,
  "editorOverviewRuler.currentContentForeground": gitPalette.conflicting,
  "editorOverviewRuler.incomingContentForeground": gitPalette.conflicting,
  "editorOverviewRuler.commonContentForeground": gitPalette.ignored,
} as const;

// Keep the existing generator: these helpers only expand language-qualified theme selectors.
const codeLanguages = [
  { root: "source.ts", language: "typescript" },
  { root: "source.tsx", language: "typescriptreact" },
  { root: "source.js", language: "javascript" },
  { root: "source.js.jsx", language: "javascriptreact" },
] as const;
const inCode = (...scopes: string[]) => codeLanguages.flatMap(({ root }) => scopes.map(scope => `${root} ${scope}`));
const inStyles = (...scopes: string[]) => scopes.map(scope => `source.css ${scope}`);
const inHTML = (...scopes: string[]) => ["text.html.basic", "text.html.derivative"].flatMap(root => scopes.map(scope => `${root} ${scope}`));
const rule = (name: string, scope: string[], foreground: string, fontStyle?: string) => ({
  name, scope, settings: { foreground, ...(fontStyle === undefined ? {} : { fontStyle }) },
});

// Diff colors and transparent overlays are intentionally preserved.
const preservedMarkup = [
  {
    "name": "Inserted",
    "scope": [
      "markup.inserted"
    ],
    "settings": {
      "foreground": palette.syntaxGreen
    }
  },
  {
    "name": "Deleted",
    "scope": [
      "markup.deleted"
    ],
    "settings": {
      "foreground": palette.syntaxInvalid
    }
  },
  {
    "name": "Changed",
    "scope": [
      "markup.changed"
    ],
    "settings": {
      "foreground": palette.syntaxPurple
    }
  },
  {
    "name": "Markdown - Plain",
    "scope": [
      "text.html.markdown",
      "punctuation.definition.list_item.markdown"
    ],
    "settings": {
      "foreground": palette.bone
    }
  },
  {
    "name": "Markdown - Markup Raw Inline",
    "scope": [
      "text.html.markdown markup.inline.raw.markdown"
    ],
    "settings": {
      "foreground": palette.sageAsh
    }
  },
  {
    "name": "Markdown - Markup Raw Inline Punctuation",
    "scope": [
      "text.html.markdown markup.inline.raw.markdown punctuation.definition.raw.markdown"
    ],
    "settings": {
      "foreground": palette.inactiveForeground
    }
  },
  {
    "name": "Markdown - Heading",
    "scope": [
      "markdown.heading",
      "markup.heading | markup.heading entity.name",
      "markup.heading.markdown punctuation.definition.heading.markdown"
    ],
    "settings": {
      "foreground": palette.ancientBone
    }
  },
  {
    "name": "Markup - Italic",
    "scope": [
      "markup.italic"
    ],
    "settings": {
      "fontStyle": "italic",
      "foreground": palette.ashRose
    }
  },
  {
    "name": "Markup - Bold",
    "scope": [
      "markup.bold",
      "markup.bold string"
    ],
    "settings": {
      "fontStyle": "bold",
      "foreground": palette.ashRose
    }
  },
  {
    "name": "Markup - Bold-Italic",
    "scope": [
      "markup.bold markup.italic",
      "markup.italic markup.bold",
      "markup.quote markup.bold",
      "markup.bold markup.italic string",
      "markup.italic markup.bold string",
      "markup.quote markup.bold string"
    ],
    "settings": {
      "fontStyle": "bold",
      "foreground": palette.ashRose
    }
  },
  {
    "name": "Markup - Underline",
    "scope": [
      "markup.underline"
    ],
    "settings": {
      "fontStyle": "underline",
      "foreground": palette.silver
    }
  },
  {
    "name": "Markdown - Blockquote",
    "scope": [
      "markup.quote punctuation.definition.blockquote.markdown"
    ],
    "settings": {
      "foreground": palette.inactiveForeground
    }
  },
  {
    "name": "Markup - Quote",
    "scope": [
      "markup.quote"
    ],
    "settings": {
      "fontStyle": "italic"
    }
  },
  {
    "name": "Markdown - Link",
    "scope": [
      "string.other.link.title.markdown"
    ],
    "settings": {
      "foreground": palette.ashRose
    }
  },
  {
    "name": "Markdown - Link Description",
    "scope": [
      "string.other.link.description.title.markdown"
    ],
    "settings": {
      "foreground": palette.sageAsh
    }
  },
  {
    "name": "Markdown - Link Anchor",
    "scope": [
      "constant.other.reference.link.markdown"
    ],
    "settings": {
      "foreground": palette.ashRose
    }
  },
  {
    "name": "Markup - Raw Block",
    "scope": [
      "markup.raw.block"
    ],
    "settings": {
      "foreground": palette.sageAsh
    }
  },
  {
    "name": "Markdown - Raw Block Fenced",
    "scope": [
      "markup.raw.block.fenced.markdown"
    ],
    "settings": {
      "foreground": palette.syntaxFencedOverlay
    }
  },
  {
    "name": "Markdown - Fenced Bode Block",
    "scope": [
      "punctuation.definition.fenced.markdown"
    ],
    "settings": {
      "foreground": palette.syntaxFencedOverlay
    }
  },
  {
    "name": "Markdown - Fenced Bode Block Variable",
    "scope": [
      "markup.raw.block.fenced.markdown",
      "variable.language.fenced.markdown",
      "punctuation.section.class.end"
    ],
    "settings": {
      "foreground": palette.bone
    }
  },
  {
    "name": "Markdown - Fenced Language",
    "scope": [
      "variable.language.fenced.markdown"
    ],
    "settings": {
      "foreground": palette.inactiveForeground
    }
  },
  {
    "name": "Markdown - Separator",
    "scope": [
      "meta.separator"
    ],
    "settings": {
      "fontStyle": "bold",
      "foreground": palette.inactiveForeground
    }
  },
  {
    "name": "Markup - Table",
    "scope": [
      "markup.table"
    ],
    "settings": {
      "foreground": palette.bone
    }
  }
];

// A selector without modifier restrictions covers readonly/static/defaultLibrary/etc.
// No *.readonly or *.defaultLibrary rule can override the category hierarchy.
const semanticRoles = {
  variable: palette.bone, parameter: palette.bone, property: palette.bone, enumMember: palette.bone,
  function: palette.ashRose, method: palette.ashRose, decorator: palette.ashRose,
  type: palette.ancientBone, class: palette.ancientBone, interface: palette.ancientBone,
  enum: palette.ancientBone, namespace: palette.ancientBone, typeParameter: palette.ancientBone,
  keyword: palette.silver, operator: palette.silver, label: palette.bone,
  string: palette.sageAsh, regexp: palette.sageAsh, number: palette.dustyCopper,
  comment: palette.inactiveForeground,
};

export const necromancerDark = {
  "name": "Necromancer Dark",
  "colors": {
    ...gitColors,
    // Editor surfaces
    "editor.background": palette.editor,
    "panel.background": palette.sidebar,
    "editor.lineHighlightBackground": palette.elevated,
    "panel.border": palette.border,
    "editor.foreground": palette.editorForeground,
    "sideBarTitle.foreground": palette.sidebarTitle,
    // Workbench surfaces and boundaries
    "titleBar.activeBackground": palette.sidebar,
    "titleBar.inactiveBackground": palette.sidebar,
    "titleBar.activeForeground": palette.bone,
    "titleBar.inactiveForeground": palette.inactiveForeground,
    "window.activeBorder": palette.border,
    "window.inactiveBorder": palette.border,
    "editorGroup.emptyBackground": palette.editor,
    "sideBarSectionHeader.background": palette.sidebar,
    // Modern UI exposes the shell through the gaps around floating panels.
    // Set both states explicitly so the transparent sash shows the same base surface.
    "modernUI.shellBackground": palette.sidebar,
    "modernUI.inactiveShellBackground": palette.sidebar,
    "sideBar.background": palette.sidebar,
    "activityBarBadge.background": palette.blood,
    "foreground": palette.bone,
    "icon.foreground": palette.bone,
    "descriptionForeground": palette.silver,
    "activityBar.background": palette.sidebar,
    "editorGroupHeader.tabsBackground": palette.sidebar,
    "editorGroupHeader.noTabsBackground": palette.sidebar,
    "sideBar.border": palette.border,
    "activityBar.border": palette.border,
    "editorGroup.border": palette.border,
    // Diff pane box-shadows and scrollable-container shadows share this official token.
    "scrollbar.shadow": transparentScrollbarShadow,
    "sideBySideEditor.verticalBorder": palette.border,
    "sideBySideEditor.horizontalBorder": palette.border,
    "widget.border": palette.border,
    "editorGroupHeader.tabsBorder": palette.border,
    "editorGroupHeader.border": palette.border,
    "focusBorder": palette.blood,
    "sash.hoverBorder": palette.blood,
    "activityBar.activeBorder": palette.blood,
    "badge.background": palette.blood,
    "activityBarBadge.foreground": palette.syntaxWhite,
    "badge.foreground": palette.syntaxWhite,
    // Explorer and other lists
    "list.hoverForeground": palette.bone,
    "list.activeSelectionForeground": palette.bone,
    "list.inactiveSelectionForeground": palette.bone,
    "list.focusForeground": palette.bone,
    "list.inactiveSelectionBackground": palette.selectionSurface,
    "list.inactiveFocusBackground": palette.editor,
    "list.hoverBackground": palette.selectionSurface,
    "list.activeSelectionBackground": palette.selectionSurface,
    "list.focusBackground": palette.selectionSurface,
    "quickInputList.focusBackground": palette.selectionSurface,
    "quickInputList.focusForeground": palette.bone,
    "list.focusOutline": palette.blood,
    "list.focusAndSelectionOutline": palette.blood,
    "list.highlightForeground": palette.ashRose,
    "list.focusHighlightForeground": palette.ashRose,
    // Inputs, buttons and links shared by workbench and chat
    "inputValidation.infoBackground": palette.editor,
    "inputValidation.infoForeground": palette.bone,
    "inputValidation.infoBorder": palette.ashRose,
    "inputValidation.warningBackground": palette.editor,
    "inputValidation.warningForeground": palette.bone,
    "inputValidation.warningBorder": palette.bone,
    "inputValidation.errorBackground": palette.editor,
    "inputValidation.errorForeground": palette.ashRose,
    "inputValidation.errorBorder": palette.blood,
    "input.foreground": palette.bone,
    "dropdown.foreground": palette.bone,
    "button.secondaryForeground": palette.bone,
    "input.placeholderForeground": palette.silver,
    "button.foreground": palette.sidebar,
    "button.hoverBackground": palette.bone,
    "input.background": palette.editor,
    "dropdown.background": palette.editor,
    "dropdown.listBackground": palette.editor,
    "inputOption.activeBackground": palette.elevated,
    "inputOption.hoverBackground": palette.elevated,
    "button.secondaryBackground": palette.elevated,
    "button.secondaryHoverBackground": palette.elevated,
    "selection.background": palette.elevated,
    "input.border": palette.border,
    "dropdown.border": palette.border,
    "inputOption.activeBorder": palette.blood,
    "inputOption.activeForeground": palette.ashRose,
    "textLink.foreground": palette.ashRose,
    "textLink.activeForeground": palette.ashRose,
    "button.background": palette.ashRose,
    // Status Bar, including debug, remote, offline and diagnostic states
    "statusBar.foreground": palette.bone,
    "statusBar.noFolderForeground": palette.bone,
    "statusBarItem.hoverForeground": palette.bone,
    "statusBarItem.prominentForeground": palette.bone,
    "statusBarItem.prominentHoverForeground": palette.bone,
    "statusBarItem.remoteForeground": palette.bone,
    "statusBarItem.remoteHoverForeground": palette.bone,
    "statusBarItem.warningForeground": palette.bone,
    "statusBarItem.warningHoverForeground": palette.bone,
    "statusBar.background": palette.sidebar,
    "statusBar.noFolderBackground": palette.sidebar,
    "statusBarItem.warningBackground": palette.editor,
    "statusBarItem.errorBackground": palette.editor,
    "statusBar.debuggingBackground": palette.elevated,
    "statusBarItem.activeBackground": palette.elevated,
    "statusBarItem.hoverBackground": palette.elevated,
    "statusBarItem.prominentBackground": palette.elevated,
    "statusBarItem.remoteBackground": palette.elevated,
    "statusBarItem.warningHoverBackground": palette.elevated,
    "statusBarItem.errorHoverBackground": palette.elevated,
    "statusBarItem.offlineBackground": palette.elevated,
    "statusBarItem.offlineHoverBackground": palette.elevated,
    "statusBar.border": palette.border,
    "statusBar.noFolderBorder": palette.border,
    "statusBarItem.prominentHoverBackground": palette.border,
    "statusBarItem.remoteHoverBackground": palette.border,
    "statusBar.debuggingBorder": palette.blood,
    "statusBarItem.focusBorder": palette.blood,
    "statusBar.focusBorder": palette.blood,
    "statusBar.debuggingForeground": palette.ashRose,
    "statusBarItem.errorForeground": palette.ashRose,
    "statusBarItem.errorHoverForeground": palette.ashRose,
    "statusBarItem.offlineForeground": palette.ashRose,
    "statusBarItem.offlineHoverForeground": palette.ashRose,
    // Editor tabs, including unfocused and modified states
    "tab.activeForeground": palette.bone,
    "tab.selectedForeground": palette.bone,
    "tab.hoverForeground": palette.bone,
    "tab.unfocusedHoverForeground": palette.bone,
    "tab.inactiveForeground": palette.silver,
    "tab.unfocusedActiveForeground": palette.silver,
    "tab.unfocusedInactiveForeground": palette.silver,
    "tab.inactiveBackground": palette.sidebar,
    "tab.unfocusedInactiveBackground": palette.sidebar,
    "tab.activeBackground": palette.editor,
    "tab.unfocusedActiveBackground": palette.editor,
    "tab.selectedBackground": palette.editor,
    "tab.hoverBackground": palette.elevated,
    "tab.unfocusedHoverBackground": palette.elevated,
    "tab.border": palette.border,
    "tab.activeBorder": palette.border,
    "tab.unfocusedActiveBorder": palette.border,
    "tab.unfocusedActiveBorderTop": palette.border,
    "tab.lastPinnedBorder": palette.border,
    "tab.activeBorderTop": palette.blood,
    "tab.selectedBorderTop": palette.blood,
    "tab.dragAndDropBorder": palette.blood,
    "tab.hoverBorder": palette.ashRose,
    "tab.unfocusedHoverBorder": palette.ashRose,
    "tab.activeModifiedBorder": palette.ashRose,
    "tab.inactiveModifiedBorder": palette.ashRose,
    "tab.unfocusedActiveModifiedBorder": palette.ashRose,
    "tab.unfocusedInactiveModifiedBorder": palette.ashRose,
    // Native VS Code chat and editor widgets
    "inlineChat.foreground": palette.bone,
    "editorWidget.foreground": palette.bone,
    "inlineChatInput.placeholderForeground": palette.silver,
    "inlineChat.background": palette.editor,
    "inlineChatInput.background": palette.editor,
    "chat.requestBackground": palette.editor,
    "chat.requestBubbleBackground": palette.chatBubble,
    "chat.requestBubbleHoverBackground": palette.chatBubbleHover,
    "chat.slashCommandBackground": palette.elevated,
    "chat.avatarBackground": palette.elevated,
    "editorWidget.background": palette.elevated,
    "inlineChat.border": palette.border,
    "inlineChatInput.border": palette.border,
    "chat.requestBorder": palette.border,
    "chat.requestCodeBorder": palette.chatCodeBorder,
    "chat.checkpointSeparator": palette.border,
    "editorWidget.border": palette.border,
    "inlineChatInput.focusBorder": palette.blood,
    "chat.slashCommandForeground": palette.ashRose,
    "chat.avatarForeground": palette.ashRose,
  },
  "semanticHighlighting": true,
  "semanticTokenColors": Object.fromEntries(codeLanguages.flatMap(({ language }) =>
    Object.entries(semanticRoles).map(([type, color]) => [`${type}:${language}`, color])
  )),
  "tokenColors": [
    ...preservedMarkup,
    // source.css also qualifies source.css.scss and source.css.tailwind, including embedded styles.
    rule("CSS — Value fallback", ["source.css"], palette.bone),
    rule("CSS — Selectors", inStyles("entity.name.tag", "entity.other.attribute-name", "entity.other.namespace-prefix", "entity.name.namespace-prefix"), palette.ancientBone),
    rule("CSS — Property names", inStyles("support.type.property-name", "support.type.vendored.property-name"), palette.silver),
    rule("CSS — Variables, values and map keys", inStyles("variable", "support.constant", "constant.other.color", "support.type.map.key"), palette.bone),
    rule("CSS — Functions and mixins", inStyles("support.function", "entity.name.function"), palette.ashRose),
    rule("CSS — At-rules, operators and punctuation", inStyles("keyword", "storage", "punctuation"), palette.silver),
    rule("CSS — Numbers and dimensions", inStyles("constant.numeric", "constant.numeric keyword.other.unit"), palette.dustyCopper),
    rule("CSS — Strings and escapes", inStyles("string", "constant.character.escape"), palette.sageAsh),
    rule("CSS — Hex color prefix", inStyles("constant.other.color punctuation.definition.constant"), palette.bone),
    rule("CSS — Comments", inStyles("comment", "comment.block", "comment.line"), palette.inactiveForeground, "italic"),
    rule("CSS — Comment internals", inStyles("comment.block punctuation", "comment.line punctuation", "comment.block entity", "comment.block variable", "comment.block keyword", "comment.block storage", "comment.block support"), palette.inactiveForeground),
    // Tailwind CSS IntelliSense supplies this context; ordinary selectors stay Ancient Bone.
    rule("Tailwind — Apply utilities", inStyles("meta.at-rule.apply.tailwind entity.other.attribute-name.class"), palette.bone),
    // HTML text has no separate scope. Restrict the fallback to HTML roots, then restore embedded languages.
    rule("HTML — Text fallback", ["text.html.basic", "text.html.derivative"], palette.paleBone),
    rule("HTML — Tag names", inHTML("entity.name.tag.html"), palette.ancientBone),
    rule("HTML — Attributes", inHTML("entity.other.attribute-name.html"), palette.silver, ""),
    rule("HTML — String values", inHTML("string"), palette.sageAsh),
    rule("HTML — Punctuation", inHTML("punctuation"), palette.silver),
    rule("HTML — Text entities", inHTML("constant.character.entity", "constant.character.entity punctuation"), palette.paleBone),
    rule("HTML — Attribute entities", inHTML("string constant.character.entity", "string constant.character.entity punctuation"), palette.sageAsh),
    rule("HTML — Comments", inHTML("comment", "comment.block", "comment.block punctuation"), palette.inactiveForeground, "italic"),
    rule("Code — Identifier fallback", codeLanguages.map(({ root }) => root), palette.bone),
    rule("Code — Variables, parameters, properties and enum members", inCode("variable", "support.variable", "meta.object-literal.key", "entity.name.label"), palette.bone),
    rule("Code — Keywords and modifiers", inCode("keyword", "storage"), palette.silver),
    rule("Code — Types, built-ins, namespaces and enums", inCode("entity.name.type", "support.type", "support.class"), palette.ancientBone),
    rule("Code — Functions, methods and hooks", inCode("entity.name.function", "entity.name.method", "support.function", "variable.function"), palette.ashRose),
    rule("Code — Operators and punctuation", inCode("punctuation", "meta.brace"), palette.silver),
    rule("Code — String and template content", inCode("string.quoted", "string.template", "constant.character.escape"), palette.sageAsh),
    rule("Code — Quoted object keys", inCode("meta.object-literal.key string.quoted", "meta.object-literal.key constant.character.escape"), palette.bone),
    rule("Code — Numeric literals and BigInt suffixes", inCode("constant.numeric", "storage.type.numeric.bigint"), palette.dustyCopper),
    rule("Code — Special values", inCode("constant.language"), palette.silver),
    rule("Code — Boolean values", inCode("constant.language.boolean"), palette.ashRose),
    rule("Code — Invalid syntax", inCode("invalid"), palette.blood),
    rule("Code — Comments", inCode("comment"), palette.inactiveForeground, "italic"),

    // Give embedded code its identifier fallback, rather than inheriting JSX/string text.
    rule("Code — Embedded expression fallback", inCode("meta.jsx.children meta.embedded.expression", "string.template meta.embedded.line"), palette.bone),
    rule("JSX — Tag and component names", inCode("entity.name.tag", "support.class.component"), palette.ancientBone),
    rule("JSX — Attribute names", inCode("entity.other.attribute-name"), palette.silver),
    rule("JSX — Text content", inCode("meta.jsx.children"), palette.paleBone),
    rule("JSX — Entities in text", inCode("meta.jsx.children constant.character.entity", "meta.jsx.children constant.character.entity punctuation.definition.entity"), palette.paleBone),

    // Regex is a string category, not a source of unrelated keyword/number/escape colors.
    rule("Regex — Pattern", inCode("string.regexp"), palette.sageAsh),
    rule("Regex — Pattern constructs", inCode("string.regexp keyword", "string.regexp constant", "string.regexp variable", "string.regexp punctuation"), palette.sageAsh),
    rule("Regex — Delimiters and flags", [
      ...inCode("string.regexp punctuation.definition.string"),
      // keyword.other.back-reference.regexp is pattern content, not a flag.
      ...codeLanguages.map(({ root }) => `${root} string.regexp.${root.slice(7)} keyword.other.${root.slice(7)}`),
    ], palette.silver),
    // Retain the earlier deliberate interface-field colon exception.
    rule("TypeScript — Interface field colons", [
      "source.ts meta.interface.ts > meta.field.declaration.ts > meta.type.annotation.ts > keyword.operator.type.annotation.ts",
      "source.tsx meta.interface.tsx > meta.field.declaration.tsx > meta.type.annotation.tsx > keyword.operator.type.annotation.tsx",
    ], palette.bone),

    // JSONC's root/source scopes extend JSON's names, so one contextual rule covers both.
    rule("JSON — Fallback and property keys", ["source.json", "source.json support.type.property-name"], palette.bone),
    rule("JSON — Strings and escapes", ["source.json string", "source.json constant.character.escape"], palette.sageAsh),
    rule("JSON — Escapes in property keys", ["source.json support.type.property-name constant.character.escape"], palette.bone),
    rule("JSON — Numbers", ["source.json constant.numeric"], palette.dustyCopper),
    // Stock JSON/JSONC gives true, false and null the SAME scope: cannot split by text.
    rule("JSON — Shared boolean/null scope", ["source.json constant.language"], palette.silver),
    rule("JSON — Punctuation", ["source.json punctuation"], palette.silver),
    rule("JSON — Key quotes", ["source.json punctuation.support.type.property-name"], palette.silver),
    rule("JSON — Comments", ["source.json comment", "source.json comment.block punctuation", "source.json comment.line punctuation"], palette.inactiveForeground, "italic"),
    rule("JSON — Invalid syntax", ["source.json invalid"], palette.blood),

    // JSDoc/JSX comments may contain tokenized tags and examples; keep them muted.
    rule("Code — Comment internals", inCode(...["comment.block", "comment.line"].flatMap(parent => [
      "keyword", "storage", "punctuation", "entity.name.type", "entity.name.function",
      "entity.name.tag", "entity.other.attribute-name", "support.type", "support.class", "support.function",
      "variable", "constant", "string", "invalid"
    ].map(scope => `${parent} ${scope}`))), palette.inactiveForeground, "italic"),
  ],
};
