import { workbench } from './semantic/workbench.ts';
import { gitDiff } from './semantic/git-diff.ts';
import { syntax } from './semantic/syntax.ts';

// Assemble the existing public API without changing role names or values.
export const semantic = {
  workbench,
  ...gitDiff,
  syntax,
} as const;
