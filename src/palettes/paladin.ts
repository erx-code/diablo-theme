import type { RGB } from '../color/types.ts';
import { withAlpha } from '../color/alpha.ts';
import type { ThemeRoles } from '../theme/create-theme.ts';

export interface PaladinPalette {
  surfaces: { sidebar: RGB; editor: RGB; elevated: RGB; border: RGB; selection: RGB };
  text: { base: RGB; ancient: RGB; pale: RGB };
  holyGold: RGB;
  duskLavender: RGB;
  sage: RGB;
  bronze: RGB;
  silver: RGB;
  mutedSteel: RGB;
  error: RGB;
}

export function createPaladinRoles(palette: PaladinPalette): ThemeRoles {
  const derived = {
    chat: {
      bubble: withAlpha(palette.surfaces.editor, 0xCC / 255),
      bubbleHover: withAlpha(palette.surfaces.elevated, 0xCC / 255),
      codeBorder: withAlpha(palette.surfaces.border, 0x80 / 255),
    },
    diff: {
      insertedText: withAlpha(palette.sage, 0x33 / 255),
      insertedLine: withAlpha(palette.sage, 0x14 / 255),
      removedText: withAlpha(palette.error, 0x33 / 255),
      removedLine: withAlpha(palette.error, 0x14 / 255),
      diagonalFill: withAlpha(palette.silver, 0x26 / 255),
    },
    merge: {
      conflictHeader: withAlpha(palette.duskLavender, 0x33 / 255),
      conflictContent: withAlpha(palette.duskLavender, 0x14 / 255),
      commonHeader: withAlpha(palette.silver, 0x26 / 255),
      commonContent: withAlpha(palette.silver, 0x14 / 255),
    },
    workbench: { scrollbarShadow: withAlpha(palette.surfaces.editor, 0) },
    markdown: { fencedOverlay: withAlpha(palette.sage, 0x50 / 255) },
  };
  const workbench = {
    editor: {
      background: palette.surfaces.editor,
      foreground: palette.text.base,
      lineHighlightBackground: palette.surfaces.elevated,
      emptyBackground: palette.surfaces.editor,
    },
    panel: {
      background: palette.surfaces.sidebar,
      border: palette.surfaces.border,
    },
    sidebar: {
      titleForeground: palette.text.ancient,
      sectionHeaderBackground: palette.surfaces.sidebar,
      background: palette.surfaces.sidebar,
      border: palette.surfaces.border,
    },
    activityBar: {
      background: palette.surfaces.sidebar,
      border: palette.surfaces.border,
      activeBorder: palette.holyGold,
      badge: {
        background: palette.holyGold,
        foreground: palette.surfaces.sidebar,
      },
    },
    titleBar: {
      active: {
        background: palette.surfaces.sidebar,
        foreground: palette.text.base,
      },
      inactive: {
        background: palette.surfaces.sidebar,
        foreground: palette.mutedSteel,
      },
    },
    tabs: {
      header: {
        background: palette.surfaces.sidebar,
        withoutTabsBackground: palette.surfaces.sidebar,
        tabsBorder: palette.surfaces.border,
        border: palette.surfaces.border,
      },
      active: {
        foreground: palette.text.base,
        background: palette.surfaces.editor,
        border: palette.surfaces.border,
        borderTop: palette.holyGold,
        modifiedBorder: palette.duskLavender,
      },
      selected: {
        foreground: palette.text.base,
        background: palette.surfaces.editor,
        borderTop: palette.holyGold,
      },
      inactive: {
        foreground: palette.silver,
        background: palette.surfaces.sidebar,
        modifiedBorder: palette.duskLavender,
      },
      hover: {
        foreground: palette.text.base,
        background: palette.surfaces.elevated,
        border: palette.duskLavender,
      },
      unfocused: {
        active: {
          foreground: palette.silver,
          background: palette.surfaces.editor,
          border: palette.surfaces.border,
          borderTop: palette.surfaces.border,
          modifiedBorder: palette.duskLavender,
        },
        inactive: {
          foreground: palette.silver,
          background: palette.surfaces.sidebar,
          modifiedBorder: palette.duskLavender,
        },
        hover: {
          foreground: palette.text.base,
          background: palette.surfaces.elevated,
          border: palette.duskLavender,
        },
      },
      border: palette.surfaces.border,
      lastPinnedBorder: palette.surfaces.border,
      dragAndDropBorder: palette.holyGold,
    },
    borders: {
      window: {
        active: palette.surfaces.border,
        inactive: palette.surfaces.border,
      },
      editorGroup: palette.surfaces.border,
      sideBySide: {
        vertical: palette.surfaces.border,
        horizontal: palette.surfaces.border,
      },
      focus: palette.holyGold,
      sashHover: palette.holyGold,
    },
    statusBar: {
      background: palette.surfaces.sidebar,
      foreground: palette.text.base,
      border: palette.surfaces.border,
      focusBorder: palette.holyGold,
      noFolder: {
        background: palette.surfaces.sidebar,
        foreground: palette.text.base,
        border: palette.surfaces.border,
      },
      debugging: {
        background: palette.surfaces.elevated,
        foreground: palette.duskLavender,
        border: palette.holyGold,
      },
      items: {
        hover: {
          foreground: palette.text.base,
          background: palette.surfaces.elevated,
        },
        activeBackground: palette.surfaces.elevated,
        focusBorder: palette.holyGold,
        prominent: {
          foreground: palette.text.base,
          hover: {
            foreground: palette.text.base,
            background: palette.surfaces.border,
          },
          background: palette.surfaces.elevated,
        },
        remote: {
          foreground: palette.text.base,
          hover: {
            foreground: palette.text.base,
            background: palette.surfaces.border,
          },
          background: palette.surfaces.elevated,
        },
        warning: {
          foreground: palette.text.base,
          hover: {
            foreground: palette.text.base,
            background: palette.surfaces.elevated,
          },
          background: palette.surfaces.editor,
        },
        error: {
          foreground: palette.error,
          hover: {
            foreground: palette.error,
            background: palette.surfaces.elevated,
          },
          background: palette.surfaces.editor,
        },
        offline: {
          foreground: palette.duskLavender,
          hover: {
            foreground: palette.duskLavender,
            background: palette.surfaces.elevated,
          },
          background: palette.surfaces.elevated,
        },
      },
    },
    shell: {
      activeBackground: palette.surfaces.sidebar,
      inactiveBackground: palette.surfaces.sidebar,
    },
    text: {
      foreground: palette.text.base,
      descriptionForeground: palette.silver,
      selectionBackground: palette.surfaces.elevated,
    },
    icon: {
      foreground: palette.text.base,
    },
    scrollbar: {
      shadow: derived.workbench.scrollbarShadow,
    },
    widget: {
      border: palette.surfaces.border,
      editor: {
        foreground: palette.text.base,
        background: palette.surfaces.elevated,
        border: palette.surfaces.border,
      },
    },
    badge: {
      background: palette.holyGold,
      foreground: palette.surfaces.sidebar,
    },
    list: {
      hover: {
        foreground: palette.text.base,
        background: palette.surfaces.selection,
      },
      activeSelection: {
        foreground: palette.text.base,
        background: palette.surfaces.selection,
      },
      inactiveSelection: {
        foreground: palette.text.base,
        background: palette.surfaces.selection,
      },
      focus: {
        foreground: palette.text.base,
        background: palette.surfaces.selection,
        outline: palette.holyGold,
        highlightForeground: palette.duskLavender,
      },
      inactiveFocusBackground: palette.surfaces.editor,
      focusAndSelectionOutline: palette.holyGold,
      highlightForeground: palette.duskLavender,
    },
    quickPick: {
      focus: {
        background: palette.surfaces.selection,
        foreground: palette.text.base,
      },
    },
    input: {
      foreground: palette.text.base,
      background: palette.surfaces.editor,
      placeholderForeground: palette.silver,
      border: palette.surfaces.border,
      option: {
        active: {
          background: palette.surfaces.elevated,
          foreground: palette.duskLavender,
          border: palette.holyGold,
        },
        hoverBackground: palette.surfaces.elevated,
      },
      validation: {
        info: {
          background: palette.surfaces.editor,
          foreground: palette.text.base,
          border: palette.duskLavender,
        },
        warning: {
          background: palette.surfaces.editor,
          foreground: palette.text.base,
          border: palette.text.base,
        },
        error: {
          background: palette.surfaces.editor,
          foreground: palette.error,
          border: palette.error,
        },
      },
    },
    dropdown: {
      foreground: palette.text.base,
      background: palette.surfaces.editor,
      listBackground: palette.surfaces.editor,
      border: palette.surfaces.border,
    },
    button: {
      primary: {
        foreground: palette.surfaces.sidebar,
        background: palette.duskLavender,
        hoverBackground: palette.text.base,
      },
      secondary: {
        foreground: palette.text.base,
        background: palette.surfaces.elevated,
        hoverBackground: palette.surfaces.elevated,
      },
    },
    link: {
      foreground: palette.duskLavender,
      activeForeground: palette.duskLavender,
    },
    chat: {
      requestBackground: palette.surfaces.editor,
      requestBubbleBackground: derived.chat.bubble,
      requestBubbleHoverBackground: derived.chat.bubbleHover,
      requestBorder: palette.surfaces.border,
      requestCodeBorder: derived.chat.codeBorder,
      checkpointSeparator: palette.surfaces.border,
      slashCommandBackground: palette.surfaces.elevated,
      slashCommandForeground: palette.duskLavender,
      avatarBackground: palette.surfaces.elevated,
      avatarForeground: palette.duskLavender,
    },
    inlineChat: {
      foreground: palette.text.base,
      background: palette.surfaces.editor,
      border: palette.surfaces.border,
    },
    inlineChatInput: {
      placeholderForeground: palette.silver,
      background: palette.surfaces.editor,
      border: palette.surfaces.border,
      focusBorder: palette.holyGold,
    },
  } as const;
  const syntax = {
    keyword: palette.silver,
    function: palette.duskLavender,
    method: palette.holyGold,
    variable: palette.duskLavender,
    parameter: palette.silver,
    property: palette.text.base,
    type: palette.holyGold,
    string: palette.sage,
    number: palette.bronze,
    boolean: palette.duskLavender,
    comment: palette.mutedSteel,
    punctuation: palette.silver,
    enumMember: palette.text.base,
    decorator: palette.duskLavender,
    class: palette.holyGold,
    interface: palette.holyGold,
    enum: palette.holyGold,
    namespace: palette.holyGold,
    typeParameter: palette.text.ancient,
    operator: palette.silver,
    label: palette.text.base,
    regexp: palette.sage,
    identifierFallback: palette.text.base,
    variableLike: palette.holyGold,
    specialValue: palette.silver,
    invalid: palette.error,
    regexpDelimiterAndFlag: palette.silver,
    interfacePropertySeparator: palette.text.base,
    markup: {
      tag: palette.text.ancient,
      attribute: palette.silver,
      attributeValue: palette.sage,
      text: palette.text.pale,
      punctuation: palette.silver,
    },
    css: {
      valueFallback: palette.text.base,
      selector: palette.text.ancient,
      property: palette.silver,
      variableAndValue: palette.text.base,
      functionAndMixin: palette.duskLavender,
      controlAndPunctuation: palette.silver,
      number: palette.bronze,
      string: palette.sage,
      hexColorPrefix: palette.text.base,
      comment: palette.mutedSteel,
    },
    tailwind: {
      utility: palette.text.base,
    },
    json: {
      key: palette.text.base,
      string: palette.sage,
      number: palette.bronze,
      booleanAndNull: palette.silver,
      punctuation: palette.silver,
      keyQuote: palette.silver,
      comment: palette.mutedSteel,
      invalid: palette.error,
    },
    markdown: {
      text: palette.text.base,
      inlineCode: palette.sage,
      inlineCodePunctuation: palette.mutedSteel,
      heading: palette.text.ancient,
      emphasis: palette.duskLavender,
      underline: palette.silver,
      quoteMarker: palette.mutedSteel,
      link: palette.duskLavender,
      linkDescription: palette.sage,
      linkReference: palette.duskLavender,
      rawCode: palette.sage,
      fencedOverlayForeground: derived.markdown.fencedOverlay,
      fencedContent: palette.text.base,
      fencedLanguage: palette.mutedSteel,
      separator: palette.mutedSteel,
      table: palette.text.base,
    },
    diffMarkup: {
      inserted: palette.sage,
      deleted: palette.error,
      changed: palette.bronze,
    },
  } as const;
  const gitDiff = {
    git: {
      added: palette.sage,
      untracked: palette.sage,
      modified: palette.bronze,
      stagedModified: palette.bronze,
      renamed: palette.bronze,
      deleted: palette.error,
      stagedDeleted: palette.error,
      conflicting: palette.duskLavender,
      ignored: palette.mutedSteel,
      submodule: palette.silver,
      gutter: {
        added: palette.sage,
        modified: palette.bronze,
        deleted: palette.error,
      },
    },
    diff: {
      inserted: {
        textBackground: derived.diff.insertedText,
        lineBackground: derived.diff.insertedLine,
      },
      removed: {
        textBackground: derived.diff.removedText,
        lineBackground: derived.diff.removedLine,
      },
      border: palette.surfaces.border,
      diagonalFill: derived.diff.diagonalFill,
    },
    merge: {
      current: {
        headerBackground: derived.merge.conflictHeader,
        contentBackground: derived.merge.conflictContent,
        overviewForeground: palette.duskLavender,
      },
      incoming: {
        headerBackground: derived.merge.conflictHeader,
        contentBackground: derived.merge.conflictContent,
        overviewForeground: palette.duskLavender,
      },
      common: {
        headerBackground: derived.merge.commonHeader,
        contentBackground: derived.merge.commonContent,
        overviewForeground: palette.mutedSteel,
      },
      border: palette.duskLavender,
      change: {
        background: derived.diff.insertedLine,
        wordBackground: derived.diff.insertedText,
      },
      baseChange: {
        background: derived.diff.removedLine,
        wordBackground: derived.diff.removedText,
      },
      conflict: {
        unhandled: {
          border: palette.duskLavender,
          overviewForeground: palette.duskLavender,
        },
        handled: {
          border: palette.surfaces.border,
          overviewForeground: palette.mutedSteel,
        },
        linesBackground: derived.merge.conflictContent,
        inputBackground: derived.merge.conflictContent,
      },
    },
  } as const;
  return { workbench, syntax, ...gitDiff };
}
