import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import test, { after } from 'node:test';
import { necromancerDark } from '../src/palettes/necromancer-dark.ts';
import { semantic as necromancerRoles } from '../src/palettes/necromancer-dark/semantic.ts';
import { necromancerLight, palette } from '../src/palettes/necromancer-light.ts';
import { paladinDark, semantic as paladinDarkRoles } from '../src/palettes/paladin-dark.ts';
import { paladinLight, semantic as paladinLightRoles } from '../src/palettes/paladin-light.ts';
import { loadVSCodeTools } from './vscode-tools.ts';

const tools = loadVSCodeTools();
const { tm, onig } = tools;
await onig.loadWASM(tools.wasm);
after(() => rmSync(tools.extracted, { recursive: true, force: true }));
const source = readFileSync(new URL('../fixtures/syntax-audit.env', import.meta.url), 'utf8');
const extensions = join(homedir(), '.vscode/extensions');
const legacyRoot = process.env.VSCODE_DOTENV_ROOT ?? (existsSync(extensions)
  ? readdirSync(extensions).filter(name => name.startsWith('mikestead.dotenv-')).sort().reverse()
    .map(name => join(extensions, name))[0] : undefined);
const grammars = [
  { root: 'source.dotenv', file: join(tools.appRoot, 'extensions/dotenv/syntaxes/dotenv.tmLanguage.json') },
  { root: 'source.env', file: legacyRoot ? join(legacyRoot, 'syntaxes/env.tmLanguage') : undefined },
];
const themes = [
  [necromancerDark, necromancerRoles.syntax],
  [necromancerLight, { variable: palette.copper, string: palette.sage, keyword: palette.blood,
    punctuation: palette.silver, comment: palette.mutedAsh, number: palette.copper, boolean: palette.blood }],
  [paladinDark, paladinDarkRoles.syntax],
  [paladinLight, paladinLightRoles.syntax],
] as const;

for (const [theme, colors] of themes) {
  for (const { root, file } of grammars) {
    test(`${theme.name}: ${root} actual Dotenv token colors`, {
      skip: !file || !existsSync(file) ? `Install the ${root} grammar or set VSCODE_DOTENV_ROOT` : false,
    }, async () => {
      const registry = new tm.Registry({
        theme: { settings: [
          { settings: { foreground: theme.colors['editor.foreground'], background: theme.colors['editor.background'] } },
          ...theme.tokenColors,
        ] },
        onigLib: Promise.resolve({
          createOnigScanner: (patterns: string[]) => new onig.OnigScanner(patterns),
          createOnigString: (text: string) => new onig.OnigString(text),
        }),
        loadGrammar: async (scope: string) => scope === root
          ? tm.parseRawGrammar(readFileSync(file!, 'utf8'), file) : null,
      });
      try {
        const grammar = await registry.loadGrammar(root);
        const colorMap = registry.getColorMap();
        const parsed = new Map<string, { line: string; tokens: Uint32Array }>();
        let state = null;
        for (const line of source.split('\n')) {
          const result = grammar.tokenizeLine2(line, state);
          state = result.ruleStack;
          parsed.set(line.split('=')[0], { line, tokens: result.tokens });
        }
        const expect = (key: string, text: string, expected: string, last = false) => {
          const entry = parsed.get(key)!;
          assert(entry, key);
          const position = last ? entry.line.lastIndexOf(text) : entry.line.indexOf(text);
          assert(position >= 0, `${key}: missing ${text}`);
          for (let i = 0; i < entry.tokens.length; i += 2) {
            const end = entry.tokens[i + 2] ?? entry.line.length;
            if (entry.tokens[i] <= position && position < end) {
              const actual = colorMap[(entry.tokens[i + 1] >> 15) & 0x1FF];
              assert.equal(actual.toUpperCase(), expected.toUpperCase(), `${key}: ${text}`);
              return;
            }
          }
          assert.fail(`${key}: no token for ${text}`);
        };
        assert.notEqual(colors.variable, colors.string);
        expect('# Theme fixture with public example values', '#', colors.comment);
        expect('export APP_NAME', 'export', colors.keyword);
        expect('export APP_NAME', 'APP_NAME', colors.variable);
        expect('export APP_NAME', '=', colors.punctuation);
        expect('export APP_NAME', 'Sanctuary', colors.string);
        expect('APP_PORT', 'APP_PORT', colors.variable);
        expect('APP_PORT', '3000', root === 'source.env' ? colors.number : colors.string);
        expect('APP_ENABLED', 'true', root === 'source.env' ? colors.boolean : colors.string);
        expect('APP_EMPTY', 'APP_EMPTY', colors.variable);
        expect('APP_TITLE', 'Ivory', colors.string);
        expect('APP_LITERAL', '${APP_NAME}', colors.string);
        expect('APP_URL', 'https', colors.string);
        expect('APP_URL', 'APP_NAME', colors.variable, true);
        expect('APP_URL', '${', colors.punctuation);
        expect('APP_URL', '}', colors.punctuation);
        expect('APP_BARE_URL', 'APP_NAME', root === 'source.dotenv' ? colors.variable : colors.string, true);
        expect('APP_ESCAPED', '\\n', colors.punctuation);
        expect('APP_INLINE', 'value', colors.string);
        expect('APP_INLINE', '#', colors.comment);
        expect('APP_INLINE', 'inline comment', colors.comment);
        if (root === 'source.env') expect('APP_PATH', 'APP_NAME', colors.variable, true);
      } finally {
        registry.dispose();
      }
    });
  }
}
