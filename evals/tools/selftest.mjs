// Self-test of the measured-facts tool on fixtures whose answers are known.
//   node evals/tools/selftest.mjs        exit 0 = facts.mjs measures the fixtures correctly
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, copyFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const dir = mkdtempSync(join(tmpdir(), 'facts-selftest-'));
copyFileSync(join(here, 'fixtures/frame-edge.html'), join(dir, 'index.html'));
writeFileSync(join(dir, 'brief.md'), '```render-manifest\n{"items": [{"html": "index.html", "png": "index.png", "width": 800, "height": 600, "dpr": 1, "full_page": true}]}\n```\n');
let out;
try { out = execFileSync('node', [join(here, 'facts.mjs'), join(dir, 'brief.md'), dir], { encoding: 'utf8' }); }
catch (e) { out = e.stdout; }
const [r] = JSON.parse(out);
const checks = [
  ['every text node is measured', r.contrast_measured === 4 && r.contrast_unmeasured === 0],
  ['light text on the dark band at the frame edge passes', !r.contrast_failure_examples.some((e) => e.includes('npm install'))],
  ['grey text on white is the only failure', r.contrast_failures === 1 && r.contrast_failure_examples[0].includes('grey text on white')],
];
for (const [name, ok] of checks) console.log(ok ? 'PASS' : 'FAIL', name);
if (!checks.every(([, ok]) => ok)) { console.log(JSON.stringify(r, null, 1)); process.exit(1); }
