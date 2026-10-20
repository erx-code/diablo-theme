// Source of truth. Run npm run build after editing; themes/*.json are generated.
export const palette = {
  editor: "#22272E",
  sidebar: "#1C2026",
  elevated: "#2B3038",
  border: "#383E46",
  chatBubble: "#22272ECC",
  chatBubbleHover: "#2B3038CC",
  chatCodeBorder: "#383E4680",
  bone: "#D8CBB8",
  blood: "#B34752",
  ashRose: "#C58F96",
  silver: "#AEB5BA",
  inactiveForeground: "#777F86",
  editorForeground: "#eeffff",
  sidebarTitle: "#bbbbbb",
  syntaxComment: "#546E7A",
  syntaxForeground: "#EEFFFF",
  syntaxWhite: "#ffffff",
  syntaxInvalid: "#FF5370",
  syntaxPurple: "#C792EA",
  syntaxCyan: "#89DDFF",
  syntaxCoral: "#f07178",
  syntaxBlue: "#82AAFF",
  syntaxOrange: "#F78C6C",
  syntaxGreen: "#C3E88D",
  syntaxGold: "#FFCB6B",
  syntaxBlueGray: "#B2CCD6",
  syntaxClay: "#C17E70",
  syntaxMuted: "#65737E",
  syntaxFencedOverlay: "#00000050",
} as const satisfies Record<string, `#${string}`>;

// Existing token rules are preserved until the syntax-highlighting pass.
export const necromancerDark = {
  "name": "Necromancer Dark",
  "colors": {
    // Editor surfaces (existing colors preserved)
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
    // Set both states explicitly so the transparent sash shows the same graphite.
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
    "list.inactiveSelectionBackground": palette.editor,
    "list.inactiveFocusBackground": palette.editor,
    "list.hoverBackground": palette.elevated,
    "list.activeSelectionBackground": palette.elevated,
    "list.focusBackground": palette.elevated,
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
  "tokenColors": [
    {
      "name": "Comment",
      "scope": [
        "comment",
        "punctuation.definition.comment"
      ],
      "settings": {
        "fontStyle": "italic",
        "foreground": palette.syntaxComment
      }
    },
    {
      "name": "Variables",
      "scope": [
        "variable",
        "string constant.other.placeholder"
      ],
      "settings": {
        "foreground": palette.syntaxForeground
      }
    },
    {
      "name": "Colors",
      "scope": [
        "constant.other.color"
      ],
      "settings": {
        "foreground": palette.syntaxWhite
      }
    },
    {
      "name": "Invalid",
      "scope": [
        "invalid",
        "invalid.illegal"
      ],
      "settings": {
        "foreground": palette.syntaxInvalid
      }
    },
    {
      "name": "Keyword, Storage",
      "scope": [
        "keyword",
        "storage.type",
        "storage.modifier"
      ],
      "settings": {
        "foreground": palette.syntaxPurple
      }
    },
    {
      "name": "Operator, Misc",
      "scope": [
        "keyword.control",
        "constant.other.color",
        "punctuation",
        "meta.tag",
        "punctuation.definition.tag",
        "punctuation.separator.inheritance.php",
        "punctuation.definition.tag.html",
        "punctuation.definition.tag.begin.html",
        "punctuation.definition.tag.end.html",
        "punctuation.section.embedded",
        "keyword.other.template",
        "keyword.other.substitution"
      ],
      "settings": {
        "foreground": palette.syntaxCyan
      }
    },
    {
      "name": "Tag",
      "scope": [
        "entity.name.tag",
        "meta.tag.sgml",
        "markup.deleted.git_gutter"
      ],
      "settings": {
        "foreground": palette.syntaxCoral
      }
    },
    {
      "name": "Function, Special Method",
      "scope": [
        "entity.name.function",
        "meta.function-call",
        "variable.function",
        "support.function",
        "keyword.other.special-method"
      ],
      "settings": {
        "foreground": palette.syntaxBlue
      }
    },
    {
      "name": "Block Level Variables",
      "scope": [
        "meta.block variable.other"
      ],
      "settings": {
        "foreground": palette.syntaxCoral
      }
    },
    {
      "name": "Other Variable, String Link",
      "scope": [
        "support.other.variable",
        "string.other.link"
      ],
      "settings": {
        "foreground": palette.syntaxCoral
      }
    },
    {
      "name": "Number, Constant, Function Argument, Tag Attribute, Embedded",
      "scope": [
        "constant.numeric",
        "constant.language",
        "support.constant",
        "constant.character",
        "constant.escape",
        "variable.parameter",
        "keyword.other.unit",
        "keyword.other"
      ],
      "settings": {
        "foreground": palette.syntaxOrange
      }
    },
    {
      "name": "String, Symbols, Inherited Class, Markup Heading",
      "scope": [
        "string",
        "constant.other.symbol",
        "constant.other.key",
        "entity.other.inherited-class",
        "markup.heading",
        "markup.inserted.git_gutter",
        "meta.group.braces.curly constant.other.object.key.js string.unquoted.label.js"
      ],
      "settings": {
        "foreground": palette.syntaxGreen
      }
    },
    {
      "name": "Class, Support",
      "scope": [
        "entity.name",
        "support.type",
        "support.class",
        "support.other.namespace.use.php",
        "meta.use.php",
        "support.other.namespace.php",
        "markup.changed.git_gutter",
        "support.type.sys-types"
      ],
      "settings": {
        "foreground": palette.syntaxGold
      }
    },
    {
      "name": "Entity Types",
      "scope": [
        "support.type"
      ],
      "settings": {
        "foreground": palette.syntaxBlueGray
      }
    },
    {
      "name": "CSS Class and Support",
      "scope": [
        "source.css support.type.property-name",
        "source.sass support.type.property-name",
        "source.scss support.type.property-name",
        "source.less support.type.property-name",
        "source.stylus support.type.property-name",
        "source.postcss support.type.property-name"
      ],
      "settings": {
        "foreground": palette.syntaxBlueGray
      }
    },
    {
      "name": "Sub-methods",
      "scope": [
        "entity.name.module.js",
        "variable.import.parameter.js",
        "variable.other.class.js"
      ],
      "settings": {
        "foreground": palette.syntaxInvalid
      }
    },
    {
      "name": "Language methods",
      "scope": [
        "variable.language"
      ],
      "settings": {
        "fontStyle": "italic",
        "foreground": palette.syntaxInvalid
      }
    },
    {
      "name": "entity.name.method.js",
      "scope": [
        "entity.name.method.js"
      ],
      "settings": {
        "fontStyle": "italic",
        "foreground": palette.syntaxBlue
      }
    },
    {
      "name": "meta.method.js",
      "scope": [
        "meta.class-method.js entity.name.function.js",
        "variable.function.constructor"
      ],
      "settings": {
        "foreground": palette.syntaxBlue
      }
    },
    {
      "name": "Attributes",
      "scope": [
        "entity.other.attribute-name"
      ],
      "settings": {
        "foreground": palette.syntaxPurple
      }
    },
    {
      "name": "HTML Attributes",
      "scope": [
        "text.html.basic entity.other.attribute-name.html",
        "text.html.basic entity.other.attribute-name"
      ],
      "settings": {
        "fontStyle": "italic",
        "foreground": palette.syntaxGold
      }
    },
    {
      "name": "CSS Classes",
      "scope": [
        "entity.other.attribute-name.class"
      ],
      "settings": {
        "foreground": palette.syntaxGold
      }
    },
    {
      "name": "CSS ID's",
      "scope": [
        "source.sass keyword.control"
      ],
      "settings": {
        "foreground": palette.syntaxBlue
      }
    },
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
      "name": "Regular Expressions",
      "scope": [
        "string.regexp"
      ],
      "settings": {
        "foreground": palette.syntaxCyan
      }
    },
    {
      "name": "Escape Characters",
      "scope": [
        "constant.character.escape"
      ],
      "settings": {
        "foreground": palette.syntaxCyan
      }
    },
    {
      "name": "URL",
      "scope": [
        "*url*",
        "*link*",
        "*uri*"
      ],
      "settings": {
        "fontStyle": "underline"
      }
    },
    {
      "name": "Decorators",
      "scope": [
        "tag.decorator.js entity.name.tag.js",
        "tag.decorator.js punctuation.definition.tag.js"
      ],
      "settings": {
        "fontStyle": "italic",
        "foreground": palette.syntaxBlue
      }
    },
    {
      "name": "ES7 Bind Operator",
      "scope": [
        "source.js constant.other.object.key.js string.unquoted.label.js"
      ],
      "settings": {
        "fontStyle": "italic",
        "foreground": palette.syntaxInvalid
      }
    },
    {
      "name": "JSON Key - Level 0",
      "scope": [
        "source.json meta.structure.dictionary.json support.type.property-name.json"
      ],
      "settings": {
        "foreground": palette.syntaxPurple
      }
    },
    {
      "name": "JSON Key - Level 1",
      "scope": [
        "source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json"
      ],
      "settings": {
        "foreground": palette.syntaxGold
      }
    },
    {
      "name": "JSON Key - Level 2",
      "scope": [
        "source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json"
      ],
      "settings": {
        "foreground": palette.syntaxOrange
      }
    },
    {
      "name": "JSON Key - Level 3",
      "scope": [
        "source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json"
      ],
      "settings": {
        "foreground": palette.syntaxInvalid
      }
    },
    {
      "name": "JSON Key - Level 4",
      "scope": [
        "source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json"
      ],
      "settings": {
        "foreground": palette.syntaxClay
      }
    },
    {
      "name": "JSON Key - Level 5",
      "scope": [
        "source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json"
      ],
      "settings": {
        "foreground": palette.syntaxBlue
      }
    },
    {
      "name": "JSON Key - Level 6",
      "scope": [
        "source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json"
      ],
      "settings": {
        "foreground": palette.syntaxCoral
      }
    },
    {
      "name": "JSON Key - Level 7",
      "scope": [
        "source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json"
      ],
      "settings": {
        "foreground": palette.syntaxPurple
      }
    },
    {
      "name": "JSON Key - Level 8",
      "scope": [
        "source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json"
      ],
      "settings": {
        "foreground": palette.syntaxGreen
      }
    },
    {
      "name": "Markdown - Plain",
      "scope": [
        "text.html.markdown",
        "punctuation.definition.list_item.markdown"
      ],
      "settings": {
        "foreground": palette.syntaxForeground
      }
    },
    {
      "name": "Markdown - Markup Raw Inline",
      "scope": [
        "text.html.markdown markup.inline.raw.markdown"
      ],
      "settings": {
        "foreground": palette.syntaxPurple
      }
    },
    {
      "name": "Markdown - Markup Raw Inline Punctuation",
      "scope": [
        "text.html.markdown markup.inline.raw.markdown punctuation.definition.raw.markdown"
      ],
      "settings": {
        "foreground": palette.syntaxMuted
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
        "foreground": palette.syntaxGreen
      }
    },
    {
      "name": "Markup - Italic",
      "scope": [
        "markup.italic"
      ],
      "settings": {
        "fontStyle": "italic",
        "foreground": palette.syntaxCoral
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
        "foreground": palette.syntaxCoral
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
        "foreground": palette.syntaxCoral
      }
    },
    {
      "name": "Markup - Underline",
      "scope": [
        "markup.underline"
      ],
      "settings": {
        "fontStyle": "underline",
        "foreground": palette.syntaxOrange
      }
    },
    {
      "name": "Markdown - Blockquote",
      "scope": [
        "markup.quote punctuation.definition.blockquote.markdown"
      ],
      "settings": {
        "foreground": palette.syntaxMuted
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
        "foreground": palette.syntaxBlue
      }
    },
    {
      "name": "Markdown - Link Description",
      "scope": [
        "string.other.link.description.title.markdown"
      ],
      "settings": {
        "foreground": palette.syntaxPurple
      }
    },
    {
      "name": "Markdown - Link Anchor",
      "scope": [
        "constant.other.reference.link.markdown"
      ],
      "settings": {
        "foreground": palette.syntaxGold
      }
    },
    {
      "name": "Markup - Raw Block",
      "scope": [
        "markup.raw.block"
      ],
      "settings": {
        "foreground": palette.syntaxPurple
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
        "foreground": palette.syntaxForeground
      }
    },
    {
      "name": "Markdown - Fenced Language",
      "scope": [
        "variable.language.fenced.markdown"
      ],
      "settings": {
        "foreground": palette.syntaxMuted
      }
    },
    {
      "name": "Markdown - Separator",
      "scope": [
        "meta.separator"
      ],
      "settings": {
        "fontStyle": "bold",
        "foreground": palette.syntaxMuted
      }
    },
    {
      "name": "Markup - Table",
      "scope": [
        "markup.table"
      ],
      "settings": {
        "foreground": palette.syntaxForeground
      }
    }
  ]
};
