import { createTheme } from '../theme/create-theme.ts';
import { primitives } from './necromancer-dark/primitives.ts';
import { compatibility } from './necromancer-dark/compatibility.ts';
import { derived } from './necromancer-dark/derived.ts';
import { semantic } from './necromancer-dark/semantic.ts';

// Compatibility facade. Run npm run build after editing; themes/*.json are generated.
export const palette = {
  editor: primitives.charcoal.editor,
  sidebar: primitives.charcoal.sidebar,
  elevated: primitives.charcoal.elevated,
  border: primitives.charcoal.border,
  selectionSurface: primitives.charcoal.selection,
  chatBubble: derived.chat.bubble,
  chatBubbleHover: derived.chat.bubbleHover,
  chatCodeBorder: derived.chat.codeBorder,
  bone: primitives.bone.base,
  ancientBone: primitives.bone.ancient,
  paleBone: primitives.bone.pale,
  sageAsh: primitives.sageAsh,
  dustyCopper: primitives.dustyCopper,
  blood: primitives.blood,
  ashRose: primitives.ashRose,
  silver: primitives.silver,
  inactiveForeground: primitives.mutedAsh,
  editorForeground: compatibility.editorForeground,
  sidebarTitle: compatibility.sidebarTitle,
  // Retained exclusively for unchanged Workbench badges, diff and transparent markup overlays.
  syntaxWhite: compatibility.badgeForeground,
  syntaxInvalid: compatibility.deletedMarkup,
  syntaxPurple: compatibility.changedMarkup,
  syntaxGreen: compatibility.insertedMarkup,
  syntaxFencedOverlay: derived.markdown.fencedOverlay,
} as const satisfies Record<string, `#${string}`>;

// Compatibility aliases; bindings below use domain-specific semantic roles directly.
export const gitPalette = {
  modified: semantic.git.modified,
  added: semantic.git.added,
  deleted: semantic.git.deleted,
  conflicting: semantic.git.conflicting,
  ignored: semantic.git.ignored,
  submodule: semantic.git.submodule,
  border: semantic.diff.border,
  insertedText: semantic.diff.inserted.textBackground,
  insertedLine: semantic.diff.inserted.lineBackground,
  removedText: semantic.diff.removed.textBackground,
  removedLine: semantic.diff.removed.lineBackground,
  conflictHeader: semantic.merge.current.headerBackground,
  conflictContent: semantic.merge.current.contentBackground,
  neutralHeader: semantic.merge.common.headerBackground,
  neutralContent: semantic.merge.common.contentBackground,
} as const satisfies Record<string, `#${string}`>;

export const { theme: necromancerDark, gitColors } = createTheme('Necromancer Dark', semantic);
