import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\004bbd67-de4a-4689-93c2-c394b55bc9f9';

const viewports = [
  { name: 'mobile_360x800', width: 360, height: 800, isMobile: true },
  { name: 'mobile_390x844', width: 390, height: 844, isMobile: true },
  { name: 'mobile_430x932', width: 430, height: 932, isMobile: true },
  { name: 'desktop_1366x768', width: 1366, height: 768, isMobile: false },
  { name: 'desktop_1440x900', width: 1440, height: 900, isMobile: false },
  { name: 'desktop_1920x1080', width: 1920, height: 1080, isMobile: false }
];

async function runVerification() {
  console.log('=== STARTING POST-ALIGNMENT VERIFICATION & SCREENSHOT CAPTURE ===\n');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const verificationReport = [];
  let allChecksPassed = true;

  for (const vp of viewports) {
    console.log(`Checking viewport: ${vp.name} (${vp.width}x${vp.height})...`);
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height, isMobile: vp.isMobile });

    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => consoleErrors.push(err.message));

    await page.goto('http://localhost:4321/jony-wedding/', { waitUntil: 'networkidle0' });

    // Open invitation
    await page.click('#tap-to-open-btn');
    // Wait for opening and curtain animation to complete
    await new Promise(r => setTimeout(r, 6800));

    const metrics = await page.evaluate(() => {
      function getMetrics(el) {
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        return {
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          top: Math.round(rect.top),
          left: Math.round(rect.left),
          computedWidth: style.width,
          computedMaxWidth: style.maxWidth,
          computedHeight: style.height,
          computedMinHeight: style.minHeight,
          margin: `${style.marginTop} ${style.marginRight} ${style.marginBottom} ${style.marginLeft}`,
          padding: `${style.paddingTop} ${style.paddingRight} ${style.paddingBottom} ${style.paddingLeft}`
        };
      }

      const winW = window.innerWidth;
      const winH = window.innerHeight;
      const docScrollWidth = document.documentElement.scrollWidth;
      const hasHorizontalScroll = docScrollWidth > winW;

      return {
        window: { width: winW, height: winH, docScrollWidth, hasHorizontalScroll },
        weddingSite: getMetrics(document.getElementById('wedding-site')),
        invitationShell: getMetrics(document.querySelector('.invitation-shell')),
        invitationCover: getMetrics(document.getElementById('invitation-cover')),
        scratchSection: getMetrics(document.getElementById('scratch-reveal-section')),
        scratchCardContainer: getMetrics(document.getElementById('scratch-card-container')),
        scratchCanvas: getMetrics(document.getElementById('scratch-canvas')),
        countdownSection: getMetrics(document.getElementById('countdown-section')),
        eventSchedule: getMetrics(document.getElementById('event-schedule')),
        ourStory: getMetrics(document.getElementById('our-story')),
        photoGallery: getMetrics(document.getElementById('photo-gallery')),
        closingSection: getMetrics(document.getElementById('closing-section'))
      };
    });

    const isCoverFullWidth = metrics.invitationCover?.width === vp.width;
    const isCoverFullHeight = metrics.invitationCover?.height >= vp.height;
    const isScratchFullWidth = metrics.scratchSection?.width === vp.width;
    const isScratchFullHeight = metrics.scratchSection?.height >= vp.height;
    const noHScroll = !metrics.window.hasHorizontalScroll;
    const noConsoleErrors = consoleErrors.length === 0;

    const vpPassed = isCoverFullWidth && isCoverFullHeight && isScratchFullWidth && isScratchFullHeight && noHScroll && noConsoleErrors;
    if (!vpPassed) allChecksPassed = false;

    console.log(`  Cover: ${metrics.invitationCover?.width}x${metrics.invitationCover?.height} (Expected: ${vp.width}x>=${vp.height}) -> ${isCoverFullWidth && isCoverFullHeight ? '✓' : '✗'}`);
    console.log(`  Scratch: ${metrics.scratchSection?.width}x${metrics.scratchSection?.height} (Expected: ${vp.width}x>=${vp.height}) -> ${isScratchFullWidth && isScratchFullHeight ? '✓' : '✗'}`);
    console.log(`  No H-Scroll: ${noHScroll ? '✓' : '✗'}`);
    console.log(`  Console Errors: ${consoleErrors.length}`);

    // Capture viewport after-screenshot
    const shotPath = path.join(artifactDir, `after_${vp.name}.png`);
    await page.screenshot({ path: shotPath, fullPage: false });

    // Capture specific requested screenshots
    if (vp.name === 'mobile_430x932') {
      // Mobile Section 1
      await page.evaluate(() => window.scrollTo(0, 0));
      await new Promise(r => setTimeout(r, 400));
      await page.screenshot({ path: path.join(artifactDir, 'mobile_section_1.png') });

      // Mobile Section 2
      await page.evaluate(() => document.getElementById('scratch-reveal-section').scrollIntoView({ behavior: 'instant', block: 'start' }));
      await new Promise(r => setTimeout(r, 400));
      await page.screenshot({ path: path.join(artifactDir, 'mobile_section_2.png') });

      // Mobile Full Page
      await page.screenshot({ path: path.join(artifactDir, 'mobile_full_page.png'), fullPage: true });
    }

    if (vp.name === 'desktop_1920x1080') {
      // Desktop Section 1
      await page.evaluate(() => window.scrollTo(0, 0));
      await new Promise(r => setTimeout(r, 400));
      await page.screenshot({ path: path.join(artifactDir, 'desktop_section_1.png') });

      // Desktop Section 2
      await page.evaluate(() => document.getElementById('scratch-reveal-section').scrollIntoView({ behavior: 'instant', block: 'start' }));
      await new Promise(r => setTimeout(r, 400));
      await page.screenshot({ path: path.join(artifactDir, 'desktop_section_2.png') });

      // Desktop Full Page
      await page.screenshot({ path: path.join(artifactDir, 'desktop_full_page.png'), fullPage: true });
    }

    verificationReport.push({ viewport: vp.name, passed: vpPassed, consoleErrors, ...metrics });
    await page.close();
  }

  await browser.close();

  fs.writeFileSync(
    path.join(artifactDir, 'after_audit_report.json'),
    JSON.stringify(verificationReport, null, 2)
  );

  console.log(`\n==========================================`);
  console.log(`VERIFICATION RESULT: ${allChecksPassed ? 'ALL VIEWPORT CHECKS PASSED! ✓' : 'SOME CHECKS FAILED ✗'}`);
  console.log(`==========================================`);
}

runVerification().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
