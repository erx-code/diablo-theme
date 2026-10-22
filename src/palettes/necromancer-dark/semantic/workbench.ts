import { primitives } from '../primitives.ts';
import { compatibility } from '../compatibility.ts';
import { derived } from '../derived.ts';

export const workbench = {
  editor: {
    background: primitives.charcoal.editor,
    foreground: compatibility.editorForeground,
    lineHighlightBackground: primitives.charcoal.elevated,
    emptyBackground: primitives.charcoal.editor,
  },
  panel: {
    background: primitives.charcoal.sidebar,
    border: primitives.charcoal.border,
  },
  sidebar: {
    titleForeground: compatibility.sidebarTitle,
    sectionHeaderBackground: primitives.charcoal.sidebar,
    background: primitives.charcoal.sidebar,
    border: primitives.charcoal.border,
  },
  activityBar: {
    background: primitives.charcoal.sidebar,
    border: primitives.charcoal.border,
    activeBorder: primitives.blood,
    badge: {
      background: primitives.blood,
      foreground: compatibility.badgeForeground,
    },
  },
  titleBar: {
    active: {
      background: primitives.charcoal.sidebar,
      foreground: primitives.bone.base,
    },
    inactive: {
      background: primitives.charcoal.sidebar,
      foreground: primitives.mutedAsh,
    },
  },
  tabs: {
    header: {
      background: primitives.charcoal.sidebar,
      withoutTabsBackground: primitives.charcoal.sidebar,
      tabsBorder: primitives.charcoal.border,
      border: primitives.charcoal.border,
    },
    active: {
      foreground: primitives.bone.base,
      background: primitives.charcoal.editor,
      border: primitives.charcoal.border,
      borderTop: primitives.blood,
      modifiedBorder: primitives.ashRose,
    },
    selected: {
      foreground: primitives.bone.base,
      background: primitives.charcoal.editor,
      borderTop: primitives.blood,
    },
    inactive: {
      foreground: primitives.silver,
      background: primitives.charcoal.sidebar,
      modifiedBorder: primitives.ashRose,
    },
    hover: {
      foreground: primitives.bone.base,
      background: primitives.charcoal.elevated,
      border: primitives.ashRose,
    },
    unfocused: {
      active: {
        foreground: primitives.silver,
        background: primitives.charcoal.editor,
        border: primitives.charcoal.border,
        borderTop: primitives.charcoal.border,
        modifiedBorder: primitives.ashRose,
      },
      inactive: {
        foreground: primitives.silver,
        background: primitives.charcoal.sidebar,
        modifiedBorder: primitives.ashRose,
      },
      hover: {
        foreground: primitives.bone.base,
        background: primitives.charcoal.elevated,
        border: primitives.ashRose,
      },
    },
    border: primitives.charcoal.border,
    lastPinnedBorder: primitives.charcoal.border,
    dragAndDropBorder: primitives.blood,
  },
  borders: {
    window: {
      active: primitives.charcoal.border,
      inactive: primitives.charcoal.border,
    },
    editorGroup: primitives.charcoal.border,
    sideBySide: {
      vertical: primitives.charcoal.border,
      horizontal: primitives.charcoal.border,
    },
    focus: primitives.blood,
    sashHover: primitives.blood,
  },
  statusBar: {
    background: primitives.charcoal.sidebar,
    foreground: primitives.bone.base,
    border: primitives.charcoal.border,
    focusBorder: primitives.blood,
    noFolder: {
      background: primitives.charcoal.sidebar,
      foreground: primitives.bone.base,
      border: primitives.charcoal.border,
    },
    debugging: {
      background: primitives.charcoal.elevated,
      foreground: primitives.ashRose,
      border: primitives.blood,
    },
    items: {
      hover: {
        foreground: primitives.bone.base,
        background: primitives.charcoal.elevated,
      },
      activeBackground: primitives.charcoal.elevated,
      focusBorder: primitives.blood,
      prominent: {
        foreground: primitives.bone.base,
        hover: {
          foreground: primitives.bone.base,
          background: primitives.charcoal.border,
        },
        background: primitives.charcoal.elevated,
      },
      remote: {
        foreground: primitives.bone.base,
        hover: {
          foreground: primitives.bone.base,
          background: primitives.charcoal.border,
        },
        background: primitives.charcoal.elevated,
      },
      warning: {
        foreground: primitives.bone.base,
        hover: {
          foreground: primitives.bone.base,
          background: primitives.charcoal.elevated,
        },
        background: primitives.charcoal.editor,
      },
      error: {
        foreground: primitives.ashRose,
        hover: {
          foreground: primitives.ashRose,
          background: primitives.charcoal.elevated,
        },
        background: primitives.charcoal.editor,
      },
      offline: {
        foreground: primitives.ashRose,
        hover: {
          foreground: primitives.ashRose,
          background: primitives.charcoal.elevated,
        },
        background: primitives.charcoal.elevated,
      },
    },
  },
  shell: {
    activeBackground: primitives.charcoal.sidebar,
    inactiveBackground: primitives.charcoal.sidebar,
  },
  text: {
    foreground: primitives.bone.base,
    descriptionForeground: primitives.silver,
    selectionBackground: primitives.charcoal.elevated,
  },
  icon: {
    foreground: primitives.bone.base,
  },
  scrollbar: {
    shadow: derived.workbench.scrollbarShadow,
  },
  widget: {
    border: primitives.charcoal.border,
    editor: {
      foreground: primitives.bone.base,
      background: primitives.charcoal.elevated,
      border: primitives.charcoal.border,
    },
  },
  badge: {
    background: primitives.blood,
    foreground: compatibility.badgeForeground,
  },
  list: {
    hover: {
      foreground: primitives.bone.base,
      background: primitives.charcoal.selection,
    },
    activeSelection: {
      foreground: primitives.bone.base,
      background: primitives.charcoal.selection,
    },
    inactiveSelection: {
      foreground: primitives.bone.base,
      background: primitives.charcoal.selection,
    },
    focus: {
      foreground: primitives.bone.base,
      background: primitives.charcoal.selection,
      outline: primitives.blood,
      highlightForeground: primitives.ashRose,
    },
    inactiveFocusBackground: primitives.charcoal.editor,
    focusAndSelectionOutline: primitives.blood,
    highlightForeground: primitives.ashRose,
  },
  quickPick: {
    focus: {
      background: primitives.charcoal.selection,
      foreground: primitives.bone.base,
    },
  },
  input: {
    foreground: primitives.bone.base,
    background: primitives.charcoal.editor,
    placeholderForeground: primitives.silver,
    border: primitives.charcoal.border,
    option: {
      active: {
        background: primitives.charcoal.elevated,
        foreground: primitives.ashRose,
        border: primitives.blood,
      },
      hoverBackground: primitives.charcoal.elevated,
    },
    validation: {
      info: {
        background: primitives.charcoal.editor,
        foreground: primitives.bone.base,
        border: primitives.ashRose,
      },
      warning: {
        background: primitives.charcoal.editor,
        foreground: primitives.bone.base,
        border: primitives.bone.base,
      },
      error: {
        background: primitives.charcoal.editor,
        foreground: primitives.ashRose,
        border: primitives.blood,
      },
    },
  },
  dropdown: {
    foreground: primitives.bone.base,
    background: primitives.charcoal.editor,
    listBackground: primitives.charcoal.editor,
    border: primitives.charcoal.border,
  },
  button: {
    primary: {
      foreground: primitives.charcoal.sidebar,
      background: primitives.ashRose,
      hoverBackground: primitives.bone.base,
    },
    secondary: {
      foreground: primitives.bone.base,
      background: primitives.charcoal.elevated,
      hoverBackground: primitives.charcoal.elevated,
    },
  },
  link: {
    foreground: primitives.ashRose,
    activeForeground: primitives.ashRose,
  },
  chat: {
    requestBackground: primitives.charcoal.editor,
    requestBubbleBackground: derived.chat.bubble,
    requestBubbleHoverBackground: derived.chat.bubbleHover,
    requestBorder: primitives.charcoal.border,
    requestCodeBorder: derived.chat.codeBorder,
    checkpointSeparator: primitives.charcoal.border,
    slashCommandBackground: primitives.charcoal.elevated,
    slashCommandForeground: primitives.ashRose,
    avatarBackground: primitives.charcoal.elevated,
    avatarForeground: primitives.ashRose,
  },
  inlineChat: {
    foreground: primitives.bone.base,
    background: primitives.charcoal.editor,
    border: primitives.charcoal.border,
  },
  inlineChatInput: {
    placeholderForeground: primitives.silver,
    background: primitives.charcoal.editor,
    border: primitives.charcoal.border,
    focusBorder: primitives.blood,
  },
} as const;
