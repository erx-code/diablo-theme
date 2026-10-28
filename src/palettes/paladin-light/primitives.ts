import { rgb } from '../../color/types.ts';

// Paladin — Midnight ink on ivory, with deeper accents for light surfaces.
export const primitives = {
  ivory: {
    sidebar: rgb('#E8DDCB'),
    editor: rgb('#F5EFE3'),
    elevated: rgb('#EDE4D6'),
    border: rgb('#C8BCA8'),
    selection: rgb('#D8D3E5'),
  },
  midnight: {
    base: rgb('#292C40'),
    ancient: rgb('#41465E'),
    pale: rgb('#1B1D2B'),
  },
  holyGold: rgb('#7B5B28'),
  duskLavender: rgb('#645B8E'),
  sage: rgb('#526344'),
  bronze: rgb('#865A40'),
  silver: rgb('#525D73'),
  mutedSteel: rgb('#6E6A7A'),
} as const;
