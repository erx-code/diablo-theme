import { rgb, rgba } from '../../color/types.ts';

// Preserve these exceptions verbatim until a separate visual change is approved.
export const compatibility = {
  editorForeground: rgb('#eeffff'),
  sidebarTitle: rgb('#bbbbbb'),
  badgeForeground: rgb('#ffffff'),
  deletedMarkup: rgb('#FF5370'),
  changedMarkup: rgb('#C792EA'),
  insertedMarkup: rgb('#C3E88D'),
  // Legacy TextMate foreground; intentionally not derived from the core palette.
  markdownFencedOverlay: rgba('#00000050'),
} as const;
