import { chromium } from 'playwright';
import path from 'path';
const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
await p.goto('file://' + path.resolve('schedule.html'));
await p.waitForLoadState('networkidle'); await p.evaluate(() => document.fonts.ready);
console.log(await p.evaluate(() => [...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family+' '+f.weight).join(', ')));
await p.screenshot({ path: 'png/schedule.png' });
await b.close();
