import { rgb } from '../../color/types.ts';

// Blood Wave
export const primitives = {
  charcoal: {
    sidebar: rgb('#1B1517'),
    editor: rgb('#24191C'),
    elevated: rgb('#322328'),
    border: rgb('#453037'),
    selection: rgb('#50343C'),
  },
  bone: {
    base: rgb('#D5C4BB'),
    ancient: rgb('#E4D1C5'),
    pale: rgb('#F1E4D8'),
  },
  blood: rgb('#A93446'),
  ashRose: rgb('#D16A78'),
  sageAsh: rgb('#9BA78F'),
  dustyCopper: rgb('#C39A85'),
  silver: rgb('#B4ABB0'),
  mutedAsh: rgb('#82777B'),
} as const;
