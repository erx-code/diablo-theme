import { rgb } from '../color/types.ts';
import { createTheme } from '../theme/create-theme.ts';
import { createPaladinRoles } from './paladin.ts';
import { primitives } from './paladin-dark/primitives.ts';

export const palette = {
  surfaces: primitives.midnight,
  text: primitives.ivory,
  holyGold: primitives.holyGold,
  duskLavender: primitives.duskLavender,
  sage: primitives.sage,
  bronze: primitives.bronze,
  silver: primitives.silver,
  mutedSteel: primitives.mutedSteel,
  // Keep destructive states distinct from the gold accent.
  error: rgb('#CF8690'),
} as const;

export const semantic = createPaladinRoles(palette);
const { theme } = createTheme('Paladin Dark', semantic, 'dark');
export const paladinDark = {
  ...theme,
  colors: {
    ...theme.colors,
    'editor.selectionBackground': palette.surfaces.selection,
    'editor.inactiveSelectionBackground': palette.surfaces.elevated,
    'editorCursor.foreground': palette.holyGold,
  },
};
