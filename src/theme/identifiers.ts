export const codeLanguages = [
  { root: 'source.ts', language: 'typescript' },
  { root: 'source.tsx', language: 'typescriptreact' },
  { root: 'source.js', language: 'javascript' },
  { root: 'source.js.jsx', language: 'javascriptreact' },
] as const;

// Receivers (palette) and members (someValue) have distinct grammar scopes.
// Include constant/readonly forms so `as const` objects keep the distinction.
export function identifierTokenRules(variable: string, property: string): {
  name: string; scope: string[]; settings: { foreground: string; fontStyle?: string };
}[] {
  const scoped = (...scopes: string[]) => codeLanguages.flatMap(({ root }) => scopes.map(scope => `${root} ${scope}`));
  return [
    {
      name: 'Code — Variables and parameters',
      scope: scoped('variable', 'support.variable'),
      settings: { foreground: variable },
    },
    {
      name: 'Code — Properties, keys, enum members and labels',
      scope: scoped('variable.other.property', 'variable.other.object.property',
        'variable.other.constant.property', 'variable.other.constant.object.property',
        'variable.object.property', 'support.variable.property', 'variable.other.enummember',
        'meta.object-literal.key', 'entity.name.label'),
      settings: { foreground: property },
    },
  ];
}

export function callableTokenRule(foreground: string): ReturnType<typeof identifierTokenRules>[number] {
  return {
    name: 'Code — Functions, methods and hooks',
    scope: codeLanguages.flatMap(({ root }) =>
      ['entity.name.function', 'entity.name.method', 'support.function', 'variable.function']
        .map(scope => `${root} ${scope}`)),
    settings: { foreground },
  };
}

export function identifierSemanticColors(variable: string, property: string, callable: string) {
  return Object.fromEntries(codeLanguages.flatMap(({ language }) =>
    Object.entries({ variable, parameter: variable, property, enumMember: property, namespace: variable,
      function: callable, method: callable, decorator: callable })
      .map(([role, color]) => [`${role}:${language}`, color])));
}
