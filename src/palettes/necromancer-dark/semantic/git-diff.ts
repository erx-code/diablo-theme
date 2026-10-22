import { primitives } from '../primitives.ts';
import { derived } from '../derived.ts';

export const gitDiff = {
  git: {
    added: primitives.sageAsh,
    untracked: primitives.sageAsh,
    modified: primitives.dustyCopper,
    stagedModified: primitives.dustyCopper,
    renamed: primitives.dustyCopper,
    deleted: primitives.blood,
    stagedDeleted: primitives.blood,
    conflicting: primitives.ashRose,
    ignored: primitives.mutedAsh,
    submodule: primitives.silver,
    gutter: {
      added: primitives.sageAsh,
      modified: primitives.dustyCopper,
      deleted: primitives.blood,
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
    border: primitives.charcoal.border,
    diagonalFill: derived.diff.diagonalFill,
  },
  merge: {
    current: {
      headerBackground: derived.merge.conflictHeader,
      contentBackground: derived.merge.conflictContent,
      overviewForeground: primitives.ashRose,
    },
    incoming: {
      headerBackground: derived.merge.conflictHeader,
      contentBackground: derived.merge.conflictContent,
      overviewForeground: primitives.ashRose,
    },
    common: {
      headerBackground: derived.merge.commonHeader,
      contentBackground: derived.merge.commonContent,
      overviewForeground: primitives.mutedAsh,
    },
    border: primitives.ashRose,
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
        border: primitives.ashRose,
        overviewForeground: primitives.ashRose,
      },
      handled: {
        border: primitives.charcoal.border,
        overviewForeground: primitives.mutedAsh,
      },
      linesBackground: derived.merge.conflictContent,
      inputBackground: derived.merge.conflictContent,
    },
  },
} as const;
