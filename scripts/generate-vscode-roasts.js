import { writeFile } from 'node:fs/promises';
import { roasts } from '../roasts.js';

const data = '// Generated from ../roasts.js. Do not edit by hand.\nconst roasts = ' + JSON.stringify(roasts, null, 2) + ';\nfunction pickRoast(kind) {\n  const pool = roasts[kind] || roasts.push;\n  return pool[Math.floor(Math.random() * pool.length)];\n}\nmodule.exports = { roasts, pickRoast };\n';
await writeFile(new URL('../vscode-extension/roasts.cjs', import.meta.url), data);
