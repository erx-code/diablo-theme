import { withAlpha } from '../../color/alpha.ts';
import { primitives } from './primitives.ts';
import { compatibility } from './compatibility.ts';

// Shared neutral overlay; its two destinations retain distinct names below.
const neutralHeader = withAlpha(primitives.silver, 0x26 / 255);

export const derived = {
  chat: {
    bubble: withAlpha(primitives.charcoal.editor, 0xCC / 255),
    bubbleHover: withAlpha(primitives.charcoal.elevated, 0xCC / 255),
    codeBorder: withAlpha(primitives.charcoal.border, 0x80 / 255),
  },
  diff: {
    insertedText: withAlpha(primitives.sageAsh, 0x33 / 255),
    insertedLine: withAlpha(primitives.sageAsh, 0x14 / 255),
    removedText: withAlpha(primitives.blood, 0x33 / 255),
    removedLine: withAlpha(primitives.blood, 0x14 / 255),
    diagonalFill: neutralHeader,
  },
  merge: {
    conflictHeader: withAlpha(primitives.ashRose, 0x33 / 255),
    conflictContent: withAlpha(primitives.ashRose, 0x14 / 255),
    commonHeader: neutralHeader,
    commonContent: withAlpha(primitives.silver, 0x14 / 255),
  },
  workbench: {
    scrollbarShadow: withAlpha(primitives.charcoal.editor, 0x00 / 255),
  },
  markdown: {
    // Legacy foreground, not a shade of any of the 14 core primitives.
    fencedOverlay: compatibility.markdownFencedOverlay,
  },
} as const;
