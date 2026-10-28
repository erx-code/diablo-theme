import type { RGB, RGBA } from '../color/types.ts';
import { dotenvTokenRules } from './dotenv.ts';
import { callableTokenRule, codeLanguages, identifierTokenRules } from './identifiers.ts';
import type { semantic as necromancerRoles } from '../palettes/necromancer-dark/semantic.ts';

// Preserve RGB/RGBA brands while allowing each theme to supply its own colors.
type ColorRoles<T> = T extends RGB ? RGB : T extends RGBA ? RGBA
  : { [K in keyof T]: ColorRoles<T[K]> };
export type ThemeRoles = ColorRoles<typeof necromancerRoles>;

// One set of Workbench bindings and language selectors for all full themes.
export function createTheme(name: string, semantic: ThemeRoles, type?: 'dark' | 'light') {
  const gitColors = {
    // Explorer and SCM resource decorations (including staged resources).
    "gitDecoration.modifiedResourceForeground": semantic.git.modified,
    "gitDecoration.addedResourceForeground": semantic.git.added,
    "gitDecoration.untrackedResourceForeground": semantic.git.untracked,
    "gitDecoration.deletedResourceForeground": semantic.git.deleted,
    "gitDecoration.conflictingResourceForeground": semantic.git.conflicting,
    "gitDecoration.ignoredResourceForeground": semantic.git.ignored,
    "gitDecoration.submoduleResourceForeground": semantic.git.submodule,
    "gitDecoration.stageModifiedResourceForeground": semantic.git.stagedModified,
    "gitDecoration.stageDeletedResourceForeground": semantic.git.stagedDeleted,
    "gitDecoration.renamedResourceForeground": semantic.git.renamed,
    "editorGutter.modifiedBackground": semantic.git.gutter.modified,
    "editorGutter.addedBackground": semantic.git.gutter.added,
    "editorGutter.deletedBackground": semantic.git.gutter.deleted,
    "diffEditor.insertedTextBackground": semantic.diff.inserted.textBackground,
    "diffEditor.removedTextBackground": semantic.diff.removed.textBackground,
    "diffEditor.insertedLineBackground": semantic.diff.inserted.lineBackground,
    "diffEditor.removedLineBackground": semantic.diff.removed.lineBackground,
    "diffEditor.border": semantic.diff.border,
    "diffEditor.diagonalFill": semantic.diff.diagonalFill,
    // Inline conflict markers: both sides are conflicts, the common ancestor is neutral.
    "merge.currentHeaderBackground": semantic.merge.current.headerBackground,
    "merge.currentContentBackground": semantic.merge.current.contentBackground,
    "merge.incomingHeaderBackground": semantic.merge.incoming.headerBackground,
    "merge.incomingContentBackground": semantic.merge.incoming.contentBackground,
    "merge.commonHeaderBackground": semantic.merge.common.headerBackground,
    "merge.commonContentBackground": semantic.merge.common.contentBackground,
    "merge.border": semantic.merge.border,
    "mergeEditor.change.background": semantic.merge.change.background,
    "mergeEditor.change.word.background": semantic.merge.change.wordBackground,
    "mergeEditor.changeBase.background": semantic.merge.baseChange.background,
    "mergeEditor.changeBase.word.background": semantic.merge.baseChange.wordBackground,
    "mergeEditor.conflict.unhandledFocused.border": semantic.merge.conflict.unhandled.border,
    "mergeEditor.conflict.unhandledUnfocused.border": semantic.merge.conflict.unhandled.border,
    "mergeEditor.conflict.handledFocused.border": semantic.merge.conflict.handled.border,
    "mergeEditor.conflict.handledUnfocused.border": semantic.merge.conflict.handled.border,
    "mergeEditor.conflict.unhandled.minimapOverViewRuler": semantic.merge.conflict.unhandled.overviewForeground,
    "mergeEditor.conflict.handled.minimapOverViewRuler": semantic.merge.conflict.handled.overviewForeground,
    "mergeEditor.conflictingLines.background": semantic.merge.conflict.linesBackground,
    "mergeEditor.conflict.input1.background": semantic.merge.conflict.inputBackground,
    "mergeEditor.conflict.input2.background": semantic.merge.conflict.inputBackground,
    "editorOverviewRuler.currentContentForeground": semantic.merge.current.overviewForeground,
    "editorOverviewRuler.incomingContentForeground": semantic.merge.incoming.overviewForeground,
    "editorOverviewRuler.commonContentForeground": semantic.merge.common.overviewForeground,
  } as const;

  // Keep the existing generator: these helpers only expand language-qualified theme selectors.
  const inCode = (...scopes: string[]) => codeLanguages.flatMap(({ root }) => scopes.map(scope => `${root} ${scope}`));

  const inStyles = (...scopes: string[]) => scopes.map(scope => `source.css ${scope}`);

  const inHTML = (...scopes: string[]) => ["text.html.basic", "text.html.derivative"].flatMap(root => scopes.map(scope => `${root} ${scope}`));

  const rule = (name: string, scope: string[], foreground: string, fontStyle?: string) => ({
    name, scope, settings: { foreground, ...(fontStyle === undefined ? {} : { fontStyle }) },
  });

  // Reuse existing rule colors, styles and precedence, changing only the root context.
  // JSX-specific rules are deliberately excluded. The stock Markdown grammar maps
  // `jsx` to the same JavaScript context as `js`; ordinary JS tokens there cannot
  // be distinguished by a theme selector.
  const withMarkdownEmbedded = (rules: {
    name: string; scope: string[]; settings: { foreground?: string; fontStyle?: string };
  }[]) => {
    const contexts = [
      ["source.ts", "meta.embedded.block.typescript"],
      ["source.js", "meta.embedded.block.javascript"],
    ] as const;
    // TextMate compares the nearest parent's specificity, not just rule order.
    // Long embedded scopes would otherwise outrank short `string.regexp` and
    // `comment.line` parents. Use emitted leaf prefixes for these overrides.
    const contextualLeaves = (name: string, leaf: string, suffix: string) => {
      if (name === "Code — Quoted object keys") {
        if (leaf === "string.quoted") return ["string.quoted.double", "string.quoted.single"];
        if (leaf === "constant.character.escape") return [`constant.character.escape.${suffix}`];
      }
      if (name === "Regex — Pattern constructs") {
        if (leaf === "keyword") return ["keyword.control", "keyword.operator", "keyword.other"];
        if (leaf === "variable") return ["variable.other"];
        if (leaf === "punctuation") return ["punctuation.definition"];
      }
      if (name === "Code — Comment internals") {
        if (leaf === "keyword") return ["keyword.operator"];
        if (leaf === "storage") return ["storage.type"];
        if (leaf === "punctuation") return ["punctuation.definition", "punctuation.separator", "punctuation.whitespace"];
        if (leaf === "variable") return ["variable.other"];
        if (leaf === "constant") return ["constant.language", "constant.other"];
        if (leaf === "entity.name.type") return ["entity.name.type.instance.jsdoc"];
        if (leaf === "entity.name.tag") return ["entity.name.tag.inline.jsdoc"];
        if (leaf === "invalid") return ["invalid.illegal.syntax.jsdoc"];
      }
      return [leaf];
    };
    const additions = rules.filter(entry => !entry.name.startsWith("JSX —")).flatMap(entry => {
      const scope = contexts.flatMap(([root, embedded]) => entry.scope.flatMap(selector =>
        selector === root || selector.startsWith(`${root} `)
          ? (() => {
            const relative = selector.slice(root.length).trim();
            const parts = relative.split(" ");
            const leaf = parts.pop()!;
            return contextualLeaves(entry.name, leaf, root.slice(7)).map(specific =>
              `text.html.markdown markup.fenced_code.block.markdown ${embedded}${relative ? ` ${[...parts, specific].join(" ")}` : ""}`);
          })()
          : []));
      return scope.length ? [{ ...entry, name: `Markdown embedded — ${entry.name}`, scope }] : [];
    });
    return [...rules, ...additions];
  };

  // Per-theme diff markup and transparent Markdown overlays.
  const preservedMarkup = [
    {
      "name": "Inserted",
      "scope": [
        "markup.inserted"
      ],
      "settings": {
        "foreground": semantic.syntax.diffMarkup.inserted
      }
    },
    {
      "name": "Deleted",
      "scope": [
        "markup.deleted"
      ],
      "settings": {
        "foreground": semantic.syntax.diffMarkup.deleted
      }
    },
    {
      "name": "Changed",
      "scope": [
        "markup.changed"
      ],
      "settings": {
        "foreground": semantic.syntax.diffMarkup.changed
      }
    },
    {
      "name": "Markdown - Plain",
      "scope": [
        "text.html.markdown",
        "text.html.markdown punctuation.definition.list.begin.markdown"
      ],
      "settings": {
        "foreground": semantic.syntax.markdown.text
      }
    },
    {
      "name": "Markdown - Markup Raw Inline",
      "scope": [
        "text.html.markdown markup.inline.raw.string.markdown"
      ],
      "settings": {
        "foreground": semantic.syntax.markdown.inlineCode
      }
    },
    {
      "name": "Markdown - Markup Raw Inline Punctuation",
      "scope": [
        "text.html.markdown markup.inline.raw.string.markdown punctuation.definition.raw.markdown"
      ],
      "settings": {
        "foreground": semantic.syntax.markdown.inlineCodePunctuation
      }
    },
    {
      "name": "Markdown - Heading",
      "scope": [
        "text.html.markdown markup.heading.markdown entity.name.section.markdown",
        "markup.heading.markdown punctuation.definition.heading.markdown"
      ],
      "settings": {
        "foreground": semantic.syntax.markdown.heading
      }
    },
    {
      "name": "Markup - Italic",
      "scope": [
        "markup.italic"
      ],
      "settings": {
        "fontStyle": "italic",
        "foreground": semantic.syntax.markdown.emphasis
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
        "foreground": semantic.syntax.markdown.emphasis
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
        "foreground": semantic.syntax.markdown.emphasis
      }
    },
    {
      "name": "Markup - Underline",
      "scope": [
        "markup.underline"
      ],
      "settings": {
        "fontStyle": "underline",
        "foreground": semantic.syntax.markdown.underline
      }
    },
    {
      "name": "Markdown - Blockquote",
      "scope": [
        "text.html.markdown markup.quote.markdown punctuation.definition.quote.begin.markdown"
      ],
      "settings": {
        "foreground": semantic.syntax.markdown.quoteMarker
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
        "foreground": semantic.syntax.markdown.link
      }
    },
    {
      "name": "Markdown - Link Description",
      "scope": [
        "string.other.link.description.title.markdown"
      ],
      "settings": {
        "foreground": semantic.syntax.markdown.linkDescription
      }
    },
    {
      "name": "Markdown - Link Anchor",
      "scope": [
        "constant.other.reference.link.markdown"
      ],
      "settings": {
        "foreground": semantic.syntax.markdown.linkReference
      }
    },
    {
      "name": "Markup - Raw Block",
      "scope": [
        "markup.raw.block"
      ],
      "settings": {
        "foreground": semantic.syntax.markdown.rawCode
      }
    },
    {
      "name": "Markdown - Raw Block Fenced",
      "scope": [
        "markup.raw.block.fenced.markdown"
      ],
      "settings": {
        "foreground": semantic.syntax.markdown.fencedOverlayForeground
      }
    },
    {
      "name": "Markdown - Fenced Bode Block",
      "scope": [
        "punctuation.definition.fenced.markdown"
      ],
      "settings": {
        "foreground": semantic.syntax.markdown.fencedOverlayForeground
      }
    },
    {
      "name": "Markdown - Fenced Bode Block Variable",
      "scope": [
        "text.html.markdown markup.fenced_code.block.markdown",
        "variable.language.fenced.markdown",
        "punctuation.section.class.end"
      ],
      "settings": {
        "foreground": semantic.syntax.markdown.fencedContent
      }
    },
    {
      "name": "Markdown - Fenced Language",
      "scope": [
        "text.html.markdown fenced_code.block.language.markdown"
      ],
      "settings": {
        "foreground": semantic.syntax.markdown.fencedLanguage
      }
    },
    {
      "name": "Markdown - Separator",
      "scope": [
        "meta.separator"
      ],
      "settings": {
        "fontStyle": "bold",
        "foreground": semantic.syntax.markdown.separator
      }
    },
    {
      "name": "Markup - Table",
      "scope": [
        "markup.table"
      ],
      "settings": {
        "foreground": semantic.syntax.markdown.table
      }
    }
  ];

  // A selector without modifier restrictions covers readonly/static/defaultLibrary/etc.
  // No *.readonly or *.defaultLibrary rule can override the category hierarchy.
  const semanticRoles = {
    variable: semantic.syntax.variable, parameter: semantic.syntax.parameter, property: semantic.syntax.property, enumMember: semantic.syntax.enumMember,
    function: semantic.syntax.function, method: semantic.syntax.method, decorator: semantic.syntax.decorator,
    type: semantic.syntax.type, class: semantic.syntax.class, interface: semantic.syntax.interface,
    enum: semantic.syntax.enum, namespace: semantic.syntax.namespace, typeParameter: semantic.syntax.typeParameter,
    keyword: semantic.syntax.keyword, operator: semantic.syntax.operator, label: semantic.syntax.label,
    string: semantic.syntax.string, regexp: semantic.syntax.regexp, number: semantic.syntax.number,
    comment: semantic.syntax.comment,
  };

  const theme = {
    "name": name,
    ...(type ? { type } : {}),
    "colors": {
      ...gitColors,
      // Editor surfaces
      "editor.background": semantic.workbench.editor.background,
      "panel.background": semantic.workbench.panel.background,
      "editor.lineHighlightBackground": semantic.workbench.editor.lineHighlightBackground,
      "panel.border": semantic.workbench.panel.border,
      "editor.foreground": semantic.workbench.editor.foreground,
      "sideBarTitle.foreground": semantic.workbench.sidebar.titleForeground,
      // Workbench surfaces and boundaries
      "titleBar.activeBackground": semantic.workbench.titleBar.active.background,
      "titleBar.inactiveBackground": semantic.workbench.titleBar.inactive.background,
      "titleBar.activeForeground": semantic.workbench.titleBar.active.foreground,
      "titleBar.inactiveForeground": semantic.workbench.titleBar.inactive.foreground,
      "window.activeBorder": semantic.workbench.borders.window.active,
      "window.inactiveBorder": semantic.workbench.borders.window.inactive,
      "editorGroup.emptyBackground": semantic.workbench.editor.emptyBackground,
      "sideBarSectionHeader.background": semantic.workbench.sidebar.sectionHeaderBackground,
      // Modern UI exposes the shell through the gaps around floating panels.
      // Set both states explicitly so the transparent sash shows the same base surface.
      "modernUI.shellBackground": semantic.workbench.shell.activeBackground,
      "modernUI.inactiveShellBackground": semantic.workbench.shell.inactiveBackground,
      "sideBar.background": semantic.workbench.sidebar.background,
      "activityBarBadge.background": semantic.workbench.activityBar.badge.background,
      "foreground": semantic.workbench.text.foreground,
      "icon.foreground": semantic.workbench.icon.foreground,
      "descriptionForeground": semantic.workbench.text.descriptionForeground,
      "activityBar.background": semantic.workbench.activityBar.background,
      "editorGroupHeader.tabsBackground": semantic.workbench.tabs.header.background,
      "editorGroupHeader.noTabsBackground": semantic.workbench.tabs.header.withoutTabsBackground,
      "sideBar.border": semantic.workbench.sidebar.border,
      "activityBar.border": semantic.workbench.activityBar.border,
      "editorGroup.border": semantic.workbench.borders.editorGroup,
      // Diff pane box-shadows and scrollable-container shadows share this official token.
      "scrollbar.shadow": semantic.workbench.scrollbar.shadow,
      "sideBySideEditor.verticalBorder": semantic.workbench.borders.sideBySide.vertical,
      "sideBySideEditor.horizontalBorder": semantic.workbench.borders.sideBySide.horizontal,
      "widget.border": semantic.workbench.widget.border,
      "editorGroupHeader.tabsBorder": semantic.workbench.tabs.header.tabsBorder,
      "editorGroupHeader.border": semantic.workbench.tabs.header.border,
      "focusBorder": semantic.workbench.borders.focus,
      "sash.hoverBorder": semantic.workbench.borders.sashHover,
      "activityBar.activeBorder": semantic.workbench.activityBar.activeBorder,
      "badge.background": semantic.workbench.badge.background,
      "activityBarBadge.foreground": semantic.workbench.activityBar.badge.foreground,
      "badge.foreground": semantic.workbench.badge.foreground,
      // Explorer and other lists
      "list.hoverForeground": semantic.workbench.list.hover.foreground,
      "list.activeSelectionForeground": semantic.workbench.list.activeSelection.foreground,
      "list.inactiveSelectionForeground": semantic.workbench.list.inactiveSelection.foreground,
      "list.focusForeground": semantic.workbench.list.focus.foreground,
      "list.inactiveSelectionBackground": semantic.workbench.list.inactiveSelection.background,
      "list.inactiveFocusBackground": semantic.workbench.list.inactiveFocusBackground,
      "list.hoverBackground": semantic.workbench.list.hover.background,
      "list.activeSelectionBackground": semantic.workbench.list.activeSelection.background,
      "list.focusBackground": semantic.workbench.list.focus.background,
      "quickInputList.focusBackground": semantic.workbench.quickPick.focus.background,
      "quickInputList.focusForeground": semantic.workbench.quickPick.focus.foreground,
      "list.focusOutline": semantic.workbench.list.focus.outline,
      "list.focusAndSelectionOutline": semantic.workbench.list.focusAndSelectionOutline,
      "list.highlightForeground": semantic.workbench.list.highlightForeground,
      "list.focusHighlightForeground": semantic.workbench.list.focus.highlightForeground,
      // Inputs, buttons and links shared by workbench and chat
      "inputValidation.infoBackground": semantic.workbench.input.validation.info.background,
      "inputValidation.infoForeground": semantic.workbench.input.validation.info.foreground,
      "inputValidation.infoBorder": semantic.workbench.input.validation.info.border,
      "inputValidation.warningBackground": semantic.workbench.input.validation.warning.background,
      "inputValidation.warningForeground": semantic.workbench.input.validation.warning.foreground,
      "inputValidation.warningBorder": semantic.workbench.input.validation.warning.border,
      "inputValidation.errorBackground": semantic.workbench.input.validation.error.background,
      "inputValidation.errorForeground": semantic.workbench.input.validation.error.foreground,
      "inputValidation.errorBorder": semantic.workbench.input.validation.error.border,
      "input.foreground": semantic.workbench.input.foreground,
      "dropdown.foreground": semantic.workbench.dropdown.foreground,
      "button.secondaryForeground": semantic.workbench.button.secondary.foreground,
      "input.placeholderForeground": semantic.workbench.input.placeholderForeground,
      "button.foreground": semantic.workbench.button.primary.foreground,
      "button.hoverBackground": semantic.workbench.button.primary.hoverBackground,
      "input.background": semantic.workbench.input.background,
      "dropdown.background": semantic.workbench.dropdown.background,
      "dropdown.listBackground": semantic.workbench.dropdown.listBackground,
      "inputOption.activeBackground": semantic.workbench.input.option.active.background,
      "inputOption.hoverBackground": semantic.workbench.input.option.hoverBackground,
      "button.secondaryBackground": semantic.workbench.button.secondary.background,
      "button.secondaryHoverBackground": semantic.workbench.button.secondary.hoverBackground,
      "selection.background": semantic.workbench.text.selectionBackground,
      "input.border": semantic.workbench.input.border,
      "dropdown.border": semantic.workbench.dropdown.border,
      "inputOption.activeBorder": semantic.workbench.input.option.active.border,
      "inputOption.activeForeground": semantic.workbench.input.option.active.foreground,
      "textLink.foreground": semantic.workbench.link.foreground,
      "textLink.activeForeground": semantic.workbench.link.activeForeground,
      "button.background": semantic.workbench.button.primary.background,
      // Status Bar, including debug, remote, offline and diagnostic states
      "statusBar.foreground": semantic.workbench.statusBar.foreground,
      "statusBar.noFolderForeground": semantic.workbench.statusBar.noFolder.foreground,
      "statusBarItem.hoverForeground": semantic.workbench.statusBar.items.hover.foreground,
      "statusBarItem.prominentForeground": semantic.workbench.statusBar.items.prominent.foreground,
      "statusBarItem.prominentHoverForeground": semantic.workbench.statusBar.items.prominent.hover.foreground,
      "statusBarItem.remoteForeground": semantic.workbench.statusBar.items.remote.foreground,
      "statusBarItem.remoteHoverForeground": semantic.workbench.statusBar.items.remote.hover.foreground,
      "statusBarItem.warningForeground": semantic.workbench.statusBar.items.warning.foreground,
      "statusBarItem.warningHoverForeground": semantic.workbench.statusBar.items.warning.hover.foreground,
      "statusBar.background": semantic.workbench.statusBar.background,
      "statusBar.noFolderBackground": semantic.workbench.statusBar.noFolder.background,
      "statusBarItem.warningBackground": semantic.workbench.statusBar.items.warning.background,
      "statusBarItem.errorBackground": semantic.workbench.statusBar.items.error.background,
      "statusBar.debuggingBackground": semantic.workbench.statusBar.debugging.background,
      "statusBarItem.activeBackground": semantic.workbench.statusBar.items.activeBackground,
      "statusBarItem.hoverBackground": semantic.workbench.statusBar.items.hover.background,
      "statusBarItem.prominentBackground": semantic.workbench.statusBar.items.prominent.background,
      "statusBarItem.remoteBackground": semantic.workbench.statusBar.items.remote.background,
      "statusBarItem.warningHoverBackground": semantic.workbench.statusBar.items.warning.hover.background,
      "statusBarItem.errorHoverBackground": semantic.workbench.statusBar.items.error.hover.background,
      "statusBarItem.offlineBackground": semantic.workbench.statusBar.items.offline.background,
      "statusBarItem.offlineHoverBackground": semantic.workbench.statusBar.items.offline.hover.background,
      "statusBar.border": semantic.workbench.statusBar.border,
      "statusBar.noFolderBorder": semantic.workbench.statusBar.noFolder.border,
      "statusBarItem.prominentHoverBackground": semantic.workbench.statusBar.items.prominent.hover.background,
      "statusBarItem.remoteHoverBackground": semantic.workbench.statusBar.items.remote.hover.background,
      "statusBar.debuggingBorder": semantic.workbench.statusBar.debugging.border,
      "statusBarItem.focusBorder": semantic.workbench.statusBar.items.focusBorder,
      "statusBar.focusBorder": semantic.workbench.statusBar.focusBorder,
      "statusBar.debuggingForeground": semantic.workbench.statusBar.debugging.foreground,
      "statusBarItem.errorForeground": semantic.workbench.statusBar.items.error.foreground,
      "statusBarItem.errorHoverForeground": semantic.workbench.statusBar.items.error.hover.foreground,
      "statusBarItem.offlineForeground": semantic.workbench.statusBar.items.offline.foreground,
      "statusBarItem.offlineHoverForeground": semantic.workbench.statusBar.items.offline.hover.foreground,
      // Editor tabs, including unfocused and modified states
      "tab.activeForeground": semantic.workbench.tabs.active.foreground,
      "tab.selectedForeground": semantic.workbench.tabs.selected.foreground,
      "tab.hoverForeground": semantic.workbench.tabs.hover.foreground,
      "tab.unfocusedHoverForeground": semantic.workbench.tabs.unfocused.hover.foreground,
      "tab.inactiveForeground": semantic.workbench.tabs.inactive.foreground,
      "tab.unfocusedActiveForeground": semantic.workbench.tabs.unfocused.active.foreground,
      "tab.unfocusedInactiveForeground": semantic.workbench.tabs.unfocused.inactive.foreground,
      "tab.inactiveBackground": semantic.workbench.tabs.inactive.background,
      "tab.unfocusedInactiveBackground": semantic.workbench.tabs.unfocused.inactive.background,
      "tab.activeBackground": semantic.workbench.tabs.active.background,
      "tab.unfocusedActiveBackground": semantic.workbench.tabs.unfocused.active.background,
      "tab.selectedBackground": semantic.workbench.tabs.selected.background,
      "tab.hoverBackground": semantic.workbench.tabs.hover.background,
      "tab.unfocusedHoverBackground": semantic.workbench.tabs.unfocused.hover.background,
      "tab.border": semantic.workbench.tabs.border,
      "tab.activeBorder": semantic.workbench.tabs.active.border,
      "tab.unfocusedActiveBorder": semantic.workbench.tabs.unfocused.active.border,
      "tab.unfocusedActiveBorderTop": semantic.workbench.tabs.unfocused.active.borderTop,
      "tab.lastPinnedBorder": semantic.workbench.tabs.lastPinnedBorder,
      "tab.activeBorderTop": semantic.workbench.tabs.active.borderTop,
      "tab.selectedBorderTop": semantic.workbench.tabs.selected.borderTop,
      "tab.dragAndDropBorder": semantic.workbench.tabs.dragAndDropBorder,
      "tab.hoverBorder": semantic.workbench.tabs.hover.border,
      "tab.unfocusedHoverBorder": semantic.workbench.tabs.unfocused.hover.border,
      "tab.activeModifiedBorder": semantic.workbench.tabs.active.modifiedBorder,
      "tab.inactiveModifiedBorder": semantic.workbench.tabs.inactive.modifiedBorder,
      "tab.unfocusedActiveModifiedBorder": semantic.workbench.tabs.unfocused.active.modifiedBorder,
      "tab.unfocusedInactiveModifiedBorder": semantic.workbench.tabs.unfocused.inactive.modifiedBorder,
      // Native VS Code chat and editor widgets
      "inlineChat.foreground": semantic.workbench.inlineChat.foreground,
      "editorWidget.foreground": semantic.workbench.widget.editor.foreground,
      "inlineChatInput.placeholderForeground": semantic.workbench.inlineChatInput.placeholderForeground,
      "inlineChat.background": semantic.workbench.inlineChat.background,
      "inlineChatInput.background": semantic.workbench.inlineChatInput.background,
      "chat.requestBackground": semantic.workbench.chat.requestBackground,
      "chat.requestBubbleBackground": semantic.workbench.chat.requestBubbleBackground,
      "chat.requestBubbleHoverBackground": semantic.workbench.chat.requestBubbleHoverBackground,
      "chat.slashCommandBackground": semantic.workbench.chat.slashCommandBackground,
      "chat.avatarBackground": semantic.workbench.chat.avatarBackground,
      "editorWidget.background": semantic.workbench.widget.editor.background,
      "inlineChat.border": semantic.workbench.inlineChat.border,
      "inlineChatInput.border": semantic.workbench.inlineChatInput.border,
      "chat.requestBorder": semantic.workbench.chat.requestBorder,
      "chat.requestCodeBorder": semantic.workbench.chat.requestCodeBorder,
      "chat.checkpointSeparator": semantic.workbench.chat.checkpointSeparator,
      "editorWidget.border": semantic.workbench.widget.editor.border,
      "inlineChatInput.focusBorder": semantic.workbench.inlineChatInput.focusBorder,
      "chat.slashCommandForeground": semantic.workbench.chat.slashCommandForeground,
      "chat.avatarForeground": semantic.workbench.chat.avatarForeground,
    },
    "semanticHighlighting": true,
    "semanticTokenColors": Object.fromEntries(codeLanguages.flatMap(({ language }) =>
      Object.entries(semanticRoles).map(([type, color]) => [`${type}:${language}`, color])
    )),
    "tokenColors": withMarkdownEmbedded([
      ...preservedMarkup,
      ...dotenvTokenRules(semantic.syntax),
      // source.css also qualifies source.css.scss and source.css.tailwind, including embedded styles.
      rule("CSS — Value fallback", ["source.css"], semantic.syntax.css.valueFallback),
      rule("CSS — Selectors", inStyles("entity.name.tag", "entity.other.attribute-name", "entity.other.namespace-prefix", "entity.name.namespace-prefix"), semantic.syntax.css.selector),
      rule("CSS — Property names", inStyles("support.type.property-name", "support.type.vendored.property-name"), semantic.syntax.css.property),
      rule("CSS — Variables, values and map keys", inStyles("variable", "support.constant", "constant.other.color", "support.type.map.key"), semantic.syntax.css.variableAndValue),
      rule("CSS — Functions and mixins", inStyles("support.function", "entity.name.function"), semantic.syntax.css.functionAndMixin),
      rule("CSS — At-rules, operators and punctuation", inStyles("keyword", "storage", "punctuation"), semantic.syntax.css.controlAndPunctuation),
      rule("CSS — Numbers and dimensions", inStyles("constant.numeric", "constant.numeric keyword.other.unit"), semantic.syntax.css.number),
      rule("CSS — Strings and escapes", inStyles("string", "constant.character.escape"), semantic.syntax.css.string),
      rule("CSS — Hex color prefix", inStyles("constant.other.color punctuation.definition.constant"), semantic.syntax.css.hexColorPrefix),
      rule("CSS — Comments", inStyles("comment", "comment.block", "comment.line"), semantic.syntax.css.comment, "italic"),
      rule("CSS — Comment internals", inStyles("comment.block punctuation", "comment.line punctuation", "comment.block entity", "comment.block variable", "comment.block keyword", "comment.block storage", "comment.block support"), semantic.syntax.css.comment),
      // Tailwind CSS IntelliSense supplies this context; ordinary selectors stay Ancient Bone.
      rule("Tailwind — Apply utilities", inStyles("meta.at-rule.apply.tailwind entity.other.attribute-name.class"), semantic.syntax.tailwind.utility),
      // HTML text has no separate scope. Restrict the fallback to HTML roots, then restore embedded languages.
      rule("HTML — Text fallback", ["text.html.basic", "text.html.derivative"], semantic.syntax.markup.text),
      rule("HTML — Tag names", inHTML("entity.name.tag.html"), semantic.syntax.markup.tag),
      rule("HTML — Attributes", inHTML("entity.other.attribute-name.html"), semantic.syntax.markup.attribute, ""),
      rule("HTML — String values", inHTML("string"), semantic.syntax.markup.attributeValue),
      rule("HTML — Punctuation", inHTML("punctuation"), semantic.syntax.markup.punctuation),
      rule("HTML — Text entities", inHTML("constant.character.entity", "constant.character.entity punctuation"), semantic.syntax.markup.text),
      rule("HTML — Attribute entities", inHTML("string constant.character.entity", "string constant.character.entity punctuation"), semantic.syntax.markup.attributeValue),
      rule("HTML — Comments", inHTML("comment", "comment.block", "comment.block punctuation"), semantic.syntax.comment, "italic"),
      rule("Code — Identifier fallback", codeLanguages.map(({ root }) => root), semantic.syntax.identifierFallback),
      ...identifierTokenRules(semantic.syntax.variable, semantic.syntax.property),
      rule("Code — Keywords and modifiers", inCode("keyword", "storage"), semantic.syntax.keyword),
      rule("Code — Types, built-ins, namespaces and enums", inCode("entity.name.type", "support.type", "support.class"), semantic.syntax.type),
      callableTokenRule(semantic.syntax.function),
      rule("Code — Operators and punctuation", inCode("punctuation", "meta.brace"), semantic.syntax.punctuation),
      rule("Code — String and template content", inCode("string.quoted", "string.template", "constant.character.escape"), semantic.syntax.string),
      rule("Code — Quoted object keys", inCode("meta.object-literal.key string.quoted", "meta.object-literal.key constant.character.escape"), semantic.syntax.property),
      rule("Code — Numeric literals and BigInt suffixes", inCode("constant.numeric", "storage.type.numeric.bigint"), semantic.syntax.number),
      rule("Code — Special values", inCode("constant.language"), semantic.syntax.specialValue),
      rule("Code — Boolean values", inCode("constant.language.boolean"), semantic.syntax.boolean),
      rule("Code — Invalid syntax", inCode("invalid"), semantic.syntax.invalid),
      rule("Code — Comments", inCode("comment"), semantic.syntax.comment, "italic"),

      // Give embedded code its identifier fallback, rather than inheriting JSX/string text.
      rule("Code — Embedded expression fallback", inCode("meta.jsx.children meta.embedded.expression", "string.template meta.embedded.line"), semantic.syntax.identifierFallback),
      rule("JSX — Tag and component names", inCode("entity.name.tag", "support.class.component"), semantic.syntax.markup.tag),
      rule("JSX — Attribute names", inCode("entity.other.attribute-name"), semantic.syntax.markup.attribute),
      rule("JSX — Text content", inCode("meta.jsx.children"), semantic.syntax.markup.text),
      rule("JSX — Entities in text", inCode("meta.jsx.children constant.character.entity", "meta.jsx.children constant.character.entity punctuation.definition.entity"), semantic.syntax.markup.text),

      // Regex is a string category, not a source of unrelated keyword/number/escape colors.
      rule("Regex — Pattern", inCode("string.regexp"), semantic.syntax.regexp),
      rule("Regex — Pattern constructs", inCode("string.regexp keyword", "string.regexp constant", "string.regexp variable", "string.regexp punctuation"), semantic.syntax.regexp),
      rule("Regex — Delimiters and flags", [
        ...inCode("string.regexp punctuation.definition.string"),
        // keyword.other.back-reference.regexp is pattern content, not a flag.
        ...codeLanguages.map(({ root }) => `${root} string.regexp.${root.slice(7)} keyword.other.${root.slice(7)}`),
      ], semantic.syntax.regexpDelimiterAndFlag),
      // Retain the earlier deliberate interface-field colon exception.
      rule("TypeScript — Interface field colons", [
        "source.ts meta.interface.ts > meta.field.declaration.ts > meta.type.annotation.ts > keyword.operator.type.annotation.ts",
        "source.tsx meta.interface.tsx > meta.field.declaration.tsx > meta.type.annotation.tsx > keyword.operator.type.annotation.tsx",
      ], semantic.syntax.interfacePropertySeparator),

      // JSONC's root/source scopes extend JSON's names, so one contextual rule covers both.
      rule("JSON — Fallback and property keys", ["source.json", "source.json support.type.property-name"], semantic.syntax.json.key),
      rule("JSON — Strings and escapes", ["source.json string", "source.json constant.character.escape"], semantic.syntax.json.string),
      rule("JSON — Escapes in property keys", ["source.json support.type.property-name constant.character.escape"], semantic.syntax.json.key),
      rule("JSON — Numbers", ["source.json constant.numeric"], semantic.syntax.json.number),
      // Stock JSON/JSONC gives true, false and null the SAME scope: cannot split by text.
      rule("JSON — Shared boolean/null scope", ["source.json constant.language"], semantic.syntax.json.booleanAndNull),
      rule("JSON — Punctuation", ["source.json punctuation"], semantic.syntax.json.punctuation),
      rule("JSON — Key quotes", ["source.json punctuation.support.type.property-name"], semantic.syntax.json.keyQuote),
      rule("JSON — Comments", ["source.json comment", "source.json comment.block punctuation", "source.json comment.line punctuation"], semantic.syntax.json.comment, "italic"),
      rule("JSON — Invalid syntax", ["source.json invalid"], semantic.syntax.json.invalid),

      // JSDoc/JSX comments may contain tokenized tags and examples; keep them muted.
      rule("Code — Comment internals", inCode(...["comment.block", "comment.line"].flatMap(parent => [
        "keyword", "storage", "punctuation", "entity.name.type", "entity.name.function",
        "entity.name.tag", "entity.other.attribute-name", "support.type", "support.class", "support.function",
        "variable", "constant", "string", "invalid"
      ].map(scope => `${parent} ${scope}`))), semantic.syntax.comment, "italic"),
    ]),
  };
  return { theme, gitColors };
}
