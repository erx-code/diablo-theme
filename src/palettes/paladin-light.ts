import { rgb } from '../color/types.ts';
import { createTheme } from '../theme/create-theme.ts';
import { createPaladinRoles } from './paladin.ts';
import { primitives } from './paladin-light/primitives.ts';

export const palette = {
  surfaces: primitives.ivory,
  text: primitives.midnight,
  holyGold: primitives.holyGold,
  duskLavender: primitives.duskLavender,
  sage: primitives.sage,
  bronze: primitives.bronze,
  silver: primitives.silver,
  mutedSteel: primitives.mutedSteel,
  error: rgb('#A03D4B'),
} as const;

export const semantic = createPaladinRoles(palette);
const { theme } = createTheme('Paladin Light', semantic, 'light');
export const paladinLight = {
  ...theme,
  colors: {
    ...theme.colors,
    'editor.selectionBackground': palette.surfaces.selection,
    'editor.inactiveSelectionBackground': palette.surfaces.elevated,
    'editorCursor.foreground': palette.holyGold,
  },
};
