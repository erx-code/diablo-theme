import { rgb } from '../../color/types.ts';

// Paladin — Ivory & Midnight
export const primitives = {
  midnight: {
    sidebar: rgb('#131420'),
    editor: rgb('#1B1D2B'),
    elevated: rgb('#292C40'),
    border: rgb('#41465E'),
    selection: rgb('#454D68'),
  },
  ivory: {
    base: rgb('#D9D0C3'),
    ancient: rgb('#E8DDCB'),
    pale: rgb('#F5EFE3'),
  },
  holyGold: rgb('#d6c9ae'),
  duskLavender: rgb('#AAA7CC'),
  sage: rgb('#ABB79C'),
  bronze: rgb('#C6A188'),
  silver: rgb('#BBC2D0'),
  mutedSteel: rgb('#7E8298'),
} as const;
