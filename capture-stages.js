import puppeteer from 'puppeteer-core';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outputDir = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\004bbd67-de4a-4689-93c2-c394b55bc9f9';

async function run() {
  console.log('Launching Edge via Puppeteer...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 430, height: 932, isMobile: true, hasTouch: true });

  console.log('Navigating to http://localhost:4321/jony-wedding/ ...');
  await page.goto('http://localhost:4321/jony-wedding/', { waitUntil: 'networkidle0' });

  // 1. Initial Closed State
  console.log('Capturing Stage 1: Closed...');
  await page.screenshot({ path: path.join(outputDir, 'stage1_closed.png') });

  // 2. Click "TAP TO OPEN"
  console.log('Clicking TAP TO OPEN...');
  await page.click('#tap-to-open-btn');

  // 3. Stage B: Untying (500ms after click)
  await new Promise(r => setTimeout(r, 600));
  console.log('Capturing Stage 2: Ribbon and Bow Untying...');
  await page.screenshot({ path: path.join(outputDir, 'stage2_untying.png') });

  // 4. Stage B/C: Ribbon Slide Off (1200ms after click)
  await new Promise(r => setTimeout(r, 700));
  console.log('Capturing Stage 3: Ribbon Sliding Off...');
  await page.screenshot({ path: path.join(outputDir, 'stage3_ribbon_away.png') });

  // 5. Stage C: Unfolding begins (2000ms after click)
  await new Promise(r => setTimeout(r, 800));
  console.log('Capturing Stage 4: Paper Unfolding in 3D...');
  await page.screenshot({ path: path.join(outputDir, 'stage4_unfolding.png') });

  // 6. Stage C/D: Paper completely opened (3200ms after click)
  await new Promise(r => setTimeout(r, 1200));
  console.log('Capturing Stage 5: Paper Fully Opened...');
  await page.screenshot({ path: path.join(outputDir, 'stage5_unfolded.png') });

  // 7. Stage D: Final Revealed Invitation (4000ms after click)
  await new Promise(r => setTimeout(r, 1000));
  console.log('Capturing Stage 6: Final Revealed Invitation...');
  await page.screenshot({ path: path.join(outputDir, 'stage6_revealed.png') });

  await browser.close();
  console.log('All 6 visual verification stages captured successfully!');
}

run().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});