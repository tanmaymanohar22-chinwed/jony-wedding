import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const viewports = [
  { name: 'mobile_360x800', width: 360, height: 800, isMobile: true },
  { name: 'mobile_390x844', width: 390, height: 844, isMobile: true },
  { name: 'mobile_430x932', width: 430, height: 932, isMobile: true },
  { name: 'desktop_1366x768', width: 1366, height: 768, isMobile: false },
  { name: 'desktop_1440x900', width: 1440, height: 900, isMobile: false },
  { name: 'desktop_1920x1080', width: 1920, height: 1080, isMobile: false }
];

const artifactDir = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\004bbd67-de4a-4689-93c2-c394b55bc9f9';

async function runAudit() {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const auditReport = [];

  for (const vp of viewports) {
    console.log(`\nAuditing viewport ${vp.name} (${vp.width}x${vp.height})...`);
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height, isMobile: vp.isMobile });
    await page.goto('http://localhost:4321/jony-wedding/', { waitUntil: 'networkidle0' });

    // Click TAP TO OPEN
    await page.click('#tap-to-open-btn');

    // Wait for curtain to finish and website to reveal
    await new Promise(r => setTimeout(r, 6800));

    // Measure elements
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
          padding: `${style.paddingTop} ${style.paddingRight} ${style.paddingBottom} ${style.paddingLeft}`,
          boxSizing: style.boxSizing
        };
      }

      const winWidth = window.innerWidth;
      const winHeight = window.innerHeight;
      const docScrollWidth = document.documentElement.scrollWidth;
      const hasHorizontalScroll = docScrollWidth > winWidth;

      return {
        window: { width: winWidth, height: winHeight, docScrollWidth, hasHorizontalScroll },
        weddingSite: getMetrics(document.getElementById('wedding-site')),
        invitationShell: getMetrics(document.querySelector('.invitation-shell')),
        invitationCover: getMetrics(document.getElementById('invitation-cover')),
        coastalSceneBg: getMetrics(document.querySelector('#invitation-cover .coastal-scene-bg')),
        coverCardOverlay: getMetrics(document.querySelector('#invitation-cover .cover-card-overlay')),
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

    // Capture screenshot
    const shotPath = path.join(artifactDir, `baseline_${vp.name}.png`);
    await page.screenshot({ path: shotPath, fullPage: false });
    console.log(`Saved screenshot: ${shotPath}`);

    auditReport.push({ viewport: vp.name, ...metrics });
    await page.close();
  }

  await browser.close();

  fs.writeFileSync(
    path.join(artifactDir, 'baseline_audit_report.json'),
    JSON.stringify(auditReport, null, 2)
  );
  console.log('\nAudit complete! Saved to baseline_audit_report.json');
}

runAudit().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
