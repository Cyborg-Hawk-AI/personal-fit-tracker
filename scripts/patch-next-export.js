/**
 * Patches Next.js export to use overwrite: true when copying static files.
 * Fixes EEXIST on volumes that create macOS ._ resource fork files (e.g. network drives).
 * Run after npm install (postinstall).
 */
const fs = require('fs');
const path = require('path');

const exportPath = path.join(
  __dirname,
  '..',
  'node_modules',
  'next',
  'dist',
  'export',
  'index.js'
);

if (!fs.existsSync(exportPath)) {
  console.warn('scripts/patch-next-export.js: next/dist/export/index.js not found, skipping');
  process.exit(0);
}

let content = fs.readFileSync(exportPath, 'utf8');

const replacements = [
  [
    'recursiveCopy)((0, _path.join)(dir, "static"), (0, _path.join)(outDir, "static")));',
    'recursiveCopy)((0, _path.join)(dir, "static"), (0, _path.join)(outDir, "static"), { overwrite: true }));',
  ],
  [
    'recursiveCopy)((0, _path.join)(distDir, _constants1.CLIENT_STATIC_FILES_PATH), (0, _path.join)(outDir, "_next", _constants1.CLIENT_STATIC_FILES_PATH)));',
    'recursiveCopy)((0, _path.join)(distDir, _constants1.CLIENT_STATIC_FILES_PATH), (0, _path.join)(outDir, "_next", _constants1.CLIENT_STATIC_FILES_PATH), { overwrite: true }));',
  ],
  [
    'recursiveCopy)(publicDir, outDir, {\n                filter (path)',
    'recursiveCopy)(publicDir, outDir, {\n                overwrite: true,\n                filter (path)',
  ],
];

let changed = false;
for (const [from, to] of replacements) {
  if (content.includes(from) && !content.includes(to)) {
    content = content.replace(from, to);
    changed = true;
  }
}

if (changed) {
  fs.writeFileSync(exportPath, content);
  console.log('scripts/patch-next-export.js: Patched next/dist/export/index.js (overwrite: true)');
} else if (!content.includes('overwrite: true')) {
  console.warn('scripts/patch-next-export.js: Patch pattern not found; build may fail with EEXIST on this volume.');
}
