import { closeSync, existsSync, mkdirSync, mkdtempSync, openSync, readFileSync, readSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Integration tests reuse the user's installed VS Code engines; nothing is downloaded
// or installed in this repository. Set this to the editor's resources/app directory.
export function loadVSCodeTools() {
  const candidates = [process.env.VSCODE_APP_ROOT,
    '/Applications/Visual Studio Code.app/Contents/Resources/app',
    '/usr/share/code/resources/app', '/usr/share/code-insiders/resources/app',
  ].filter((path): path is string => Boolean(path));
  const appRoot = candidates.find(path => existsSync(join(path, 'extensions/typescript-basics')));
  if (!appRoot) throw new Error('Set VSCODE_APP_ROOT to an installed VS Code resources/app directory.');
  const extracted = mkdtempSync(join(tmpdir(), 'diablo-syntax-'));
  const require = createRequire(import.meta.url);
  const archive = join(appRoot, 'node_modules.asar');
  let archiveFd: number | undefined;
  let tree: any;
  let dataOffset = 0;
  if (existsSync(archive)) {
    archiveFd = openSync(archive, 'r');
    const header = Buffer.alloc(16);
    readSync(archiveFd, header, 0, 16, 0);
    const json = Buffer.alloc(header.readUInt32LE(12));
    readSync(archiveFd, json, 0, json.length, 16);
    tree = JSON.parse(json.toString());
    dataOffset = 8 + header.readUInt32LE(4);
  }
  try {
    for (const name of ['vscode-textmate', 'vscode-oniguruma']) {
      if (!tree) {
        if (!existsSync(join(appRoot, 'node_modules', name))) throw new Error(`VS Code is missing ${name}`);
        continue;
      }
      const visit = (entry: any, parts: string[]) => {
        if (entry.files) {
          for (const [key, child] of Object.entries(entry.files)) visit(child, [...parts, key]);
        } else if (['main.js', 'package.json', 'onig.wasm'].includes(parts.at(-1)!)) {
          const destination = join(extracted, ...parts);
          mkdirSync(join(destination, '..'), { recursive: true });
          if (entry.unpacked) writeFileSync(destination, readFileSync(join(`${archive}.unpacked`, ...parts)));
          else {
            const bytes = Buffer.alloc(entry.size);
            readSync(archiveFd!, bytes, 0, bytes.length, dataOffset + Number(entry.offset));
            writeFileSync(destination, bytes);
          }
        }
      };
      if (!tree.files[name]) throw new Error(`VS Code archive is missing ${name}`);
      visit(tree.files[name], [name]);
    }
  } finally {
    if (archiveFd !== undefined) closeSync(archiveFd);
  }
  const enginePath = tree ? extracted : join(appRoot, 'node_modules');
  return {
    appRoot, extracted,
    version: JSON.parse(readFileSync(join(appRoot, 'package.json'), 'utf8')).version,
    tm: require(join(enginePath, 'vscode-textmate/release/main.js')),
    onig: require(join(enginePath, 'vscode-oniguruma/release/main.js')),
    wasm: readFileSync(join(enginePath, 'vscode-oniguruma/release/onig.wasm')),
    ts: require(join(appRoot, 'extensions/node_modules/typescript/lib/typescript.js')),
  };
}
