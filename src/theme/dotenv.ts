export interface DotenvColors {
  variable: string;
  string: string;
  keyword: string;
  punctuation: string;
  comment: string;
  number: string;
  boolean: string;
}

// VS Code's built-in Dotenv uses source.dotenv; mikestead.dotenv uses source.env.
// The latter leaves unquoted values unscoped, so the root provides their color.
export function dotenvTokenRules(colors: DotenvColors): {
  name: string; scope: string[]; settings: { foreground: string; fontStyle?: string };
}[] {
  const roots = ['source.dotenv', 'source.env'];
  const scoped = (...scopes: string[]) => roots.flatMap(root => scopes.map(scope => `${root} ${scope}`));
  const rule = (name: string, scope: string[], foreground: string, fontStyle?: string) => ({
    name: `Dotenv — ${name}`, scope, settings: { foreground, ...(fontStyle === undefined ? {} : { fontStyle }) },
  });
  return [
    rule('Value fallback', roots, colors.string),
    rule('Values and quoted strings', scoped('property.value', 'string.quoted'), colors.string),
    rule('Variable names and substitutions', scoped('variable'), colors.variable),
    rule('Export keyword', scoped('keyword.key.export', 'keyword.other.env'), colors.keyword),
    rule('Assignment and interpolation delimiters', scoped('keyword.operator.assignment',
      'keyword.interpolation', 'keyword.other.template', 'punctuation.definition.variable',
      'constant.character.escape'), colors.punctuation),
    rule('Numbers', scoped('constant.numeric'), colors.number),
    rule('Boolean and null values', scoped('constant.language'), colors.boolean),
    rule('Comments', scoped('comment', 'comment punctuation'), colors.comment, 'italic'),
  ];
}
