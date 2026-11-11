import puppeteer from 'puppeteer-core';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outputDir = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\004bbd67-de4a-4689-93c2-c394b55bc9f9';

async function runTests() {
  console.log('--- STARTING COMPREHENSIVE OVERLAY & VISIBILITY VERIFICATION ---');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 430, height: 932, isMobile: true, hasTouch: true });

  const results = {};

  // ==========================================
  // TEST A: Fresh Page Visit
  // ==========================================
  console.log('\n[TEST A] Navigating to http://localhost:4321/jony-wedding/ ...');
  await page.goto('http://localhost:4321/jony-wedding/', { waitUntil: 'networkidle0' });

  const stateA = await page.evaluate(() => {
    const overlay = document.getElementById('intro-overlay');
    const weddingSite = document.getElementById('wedding-site');
    const tapBtn = document.getElementById('tap-to-open-btn');
    const bodyClass = document.body.className;
    const bodyOverflow = window.getComputedStyle(document.body).overflow;
    const overlayStyle = overlay ? window.getComputedStyle(overlay) : null;
    const siteStyle = weddingSite ? window.getComputedStyle(weddingSite) : null;

    return {
      overlayExists: !!overlay,
      overlayVisible: overlayStyle ? overlayStyle.visibility === 'visible' && overlayStyle.opacity === '1' : false,
      overlayZIndex: overlayStyle ? overlayStyle.zIndex : null,
      siteExists: !!weddingSite,
      siteInert: weddingSite ? weddingSite.hasAttribute('inert') : false,
      siteAriaHidden: weddingSite ? weddingSite.getAttribute('aria-hidden') : null,
      siteOpacity: siteStyle ? siteStyle.opacity : null,
      siteVisibility: siteStyle ? siteStyle.visibility : null,
      bodyHasIntroActive: bodyClass.includes('intro-active'),
      bodyOverflow: bodyOverflow,
      tapBtnExists: !!tapBtn
    };
  });

  console.log('TEST A State:', JSON.stringify(stateA, null, 2));
  await page.screenshot({ path: path.join(outputDir, 'test_a_fresh_visit.png') });
  results.testA = stateA.overlayVisible && stateA.siteInert && stateA.siteOpacity === '0' && stateA.siteVisibility === 'hidden';

  // ==========================================
  // TEST B: Wait 10 Seconds Without Clicking
  // ==========================================
  console.log('\n[TEST B] Waiting 10 seconds without interaction...');
  await new Promise(r => setTimeout(r, 10000));

  const stateB = await page.evaluate(() => {
    const overlay = document.getElementById('intro-overlay');
    const stage = document.getElementById('invitation-opening-stage');
    const weddingSite = document.getElementById('wedding-site');
    const siteStyle = weddingSite ? window.getComputedStyle(weddingSite) : null;
    return {
      stageState: stage ? stage.getAttribute('data-state') : null,
      overlayDataState: overlay ? overlay.getAttribute('data-state') : null,
      siteStillHidden: siteStyle ? siteStyle.visibility === 'hidden' && siteStyle.opacity === '0' : false
    };
  });
  console.log('TEST B State:', JSON.stringify(stateB, null, 2));
  await page.screenshot({ path: path.join(outputDir, 'test_b_after_wait.png') });
  results.testB = stateB.stageState === 'closed' && stateB.siteStillHidden;

  // ==========================================
  // TEST C: Try to Scroll Before Clicking
  // ==========================================
  console.log('\n[TEST C] Attempting to scroll before clicking...');
  await page.evaluate(() => {
    window.scrollTo(0, 1000);
    document.documentElement.scrollTop = 1000;
    document.body.scrollTop = 1000;
  });
  await new Promise(r => setTimeout(r, 500));

  const scrollY = await page.evaluate(() => window.scrollY || document.documentElement.scrollTop || document.body.scrollTop);
  console.log('TEST C ScrollY after attempt:', scrollY);
  await page.screenshot({ path: path.join(outputDir, 'test_c_scrolled.png') });
  results.testC = scrollY === 0;

  // ==========================================
  // TEST D: Click TAP TO OPEN
  // ==========================================
  console.log('\n[TEST D] Clicking TAP TO OPEN button...');
  await page.click('#tap-to-open-btn');
  await new Promise(r => setTimeout(r, 600));

  const stateD = await page.evaluate(() => {
    const stage = document.getElementById('invitation-opening-stage');
    const tapBtn = document.getElementById('tap-to-open-btn');
    return {
      stageState: stage ? stage.getAttribute('data-state') : null,
      btnDisabled: tapBtn ? tapBtn.hasAttribute('disabled') : false
    };
  });
  console.log('TEST D State (Untying started):', JSON.stringify(stateD, null, 2));
  await page.screenshot({ path: path.join(outputDir, 'test_d_anim_started.png') });
  results.testD = stateD.stageState === 'untying' && stateD.btnDisabled;

  // ==========================================
  // TEST E: During the Animation (at 2500ms after click)
  // ==========================================
  console.log('\n[TEST E] Checking during unfolding animation...');
  await new Promise(r => setTimeout(r, 1900));

  const stateE = await page.evaluate(() => {
    const stage = document.getElementById('invitation-opening-stage');
    const weddingSite = document.getElementById('wedding-site');
    const siteStyle = weddingSite ? window.getComputedStyle(weddingSite) : null;
    return {
      stageState: stage ? stage.getAttribute('data-state') : null,
      siteStillHidden: siteStyle ? siteStyle.visibility === 'hidden' && siteStyle.opacity === '0' : false,
      siteInert: weddingSite ? weddingSite.hasAttribute('inert') : false
    };
  });
  console.log('TEST E State (During unfolding):', JSON.stringify(stateE, null, 2));
  await page.screenshot({ path: path.join(outputDir, 'test_e_during_anim.png') });
  results.testE = stateE.stageState === 'unfolding' && stateE.siteStillHidden && stateE.siteInert;

  // ==========================================
  // TEST F: After Animation Completes (at 5500ms total after click)
  // ==========================================
  console.log('\n[TEST F] Waiting for full reveal and smooth website fade-in...');
  await new Promise(r => setTimeout(r, 3000));

  const stateF = await page.evaluate(() => {
    const overlay = document.getElementById('intro-overlay');
    const weddingSite = document.getElementById('wedding-site');
    const overlayStyle = overlay ? window.getComputedStyle(overlay) : null;
    const siteStyle = weddingSite ? window.getComputedStyle(weddingSite) : null;
    const bodyClass = document.body.className;
    const bodyOverflow = window.getComputedStyle(document.body).overflow;

    return {
      overlayHidden: overlayStyle ? overlayStyle.visibility === 'hidden' || overlayStyle.display === 'none' || overlayStyle.opacity === '0' : true,
      siteVisible: siteStyle ? siteStyle.visibility === 'visible' && parseFloat(siteStyle.opacity) > 0.8 : false,
      siteInertRemoved: weddingSite ? !weddingSite.hasAttribute('inert') : false,
      siteAriaHiddenFalse: weddingSite ? weddingSite.getAttribute('aria-hidden') === 'false' : false,
      bodyIntroActiveRemoved: !bodyClass.includes('intro-active'),
      bodyOverflowNormal: bodyOverflow !== 'hidden'
    };
  });
  console.log('TEST F State (Website revealed):', JSON.stringify(stateF, null, 2));
  await page.screenshot({ path: path.join(outputDir, 'test_f_after_anim.png') });

  // Test scrolling after reveal
  await page.evaluate(() => window.scrollTo(0, 400));
  await new Promise(r => setTimeout(r, 300));
  const scrollYAfter = await page.evaluate(() => window.scrollY);
  console.log('TEST F ScrollY after reveal:', scrollYAfter);

  results.testF = stateF.siteVisible && stateF.siteInertRemoved && stateF.bodyIntroActiveRemoved && scrollYAfter > 0;

  // ==========================================
  // TEST G: Refresh Page
  // ==========================================
  console.log('\n[TEST G] Refreshing page to verify zero persistence...');
  await page.reload({ waitUntil: 'networkidle0' });

  const stateG = await page.evaluate(() => {
    const overlay = document.getElementById('intro-overlay');
    const weddingSite = document.getElementById('wedding-site');
    const overlayStyle = overlay ? window.getComputedStyle(overlay) : null;
    const siteStyle = weddingSite ? window.getComputedStyle(weddingSite) : null;

    return {
      overlayVisible: overlayStyle ? overlayStyle.visibility === 'visible' && overlayStyle.opacity === '1' : false,
      siteHidden: siteStyle ? siteStyle.visibility === 'hidden' && siteStyle.opacity === '0' : false,
      siteInert: weddingSite ? weddingSite.hasAttribute('inert') : false,
      bodyHasIntroActive: document.body.className.includes('intro-active')
    };
  });
  console.log('TEST G State (Fresh after reload):', JSON.stringify(stateG, null, 2));
  await page.screenshot({ path: path.join(outputDir, 'test_g_refreshed.png') });
  results.testG = stateG.overlayVisible && stateG.siteHidden && stateG.siteInert && stateG.bodyHasIntroActive;

  // ==========================================
  // TEST H: Direct Invitation URL (/invite/jony-and-sunny/)
  // ==========================================
  console.log('\n[TEST H] Opening direct invitation URL: http://localhost:4321/jony-wedding/invite/jony-and-sunny/ ...');
  await page.goto('http://localhost:4321/jony-wedding/invite/jony-and-sunny/', { waitUntil: 'networkidle0' });

  const stateH = await page.evaluate(() => {
    const overlay = document.getElementById('intro-overlay');
    const weddingSite = document.getElementById('wedding-site');
    const overlayStyle = overlay ? window.getComputedStyle(overlay) : null;
    const siteStyle = weddingSite ? window.getComputedStyle(weddingSite) : null;

    return {
      overlayVisible: overlayStyle ? overlayStyle.visibility === 'visible' && overlayStyle.opacity === '1' : false,
      siteHidden: siteStyle ? siteStyle.visibility === 'hidden' && siteStyle.opacity === '0' : false,
      siteInert: weddingSite ? weddingSite.hasAttribute('inert') : false,
      bodyHasIntroActive: document.body.className.includes('intro-active')
    };
  });
  console.log('TEST H State (Direct URL):', JSON.stringify(stateH, null, 2));
  await page.screenshot({ path: path.join(outputDir, 'test_h_direct_url.png') });
  results.testH = stateH.overlayVisible && stateH.siteHidden && stateH.siteInert && stateH.bodyHasIntroActive;

  // ==========================================
  // RESPONSIVE VIEWPORT TESTS
  // ==========================================
  const viewports = [
    { name: 'resp_360x800', width: 360, height: 800 },
    { name: 'resp_375x812', width: 375, height: 812 },
    { name: 'resp_390x844', width: 390, height: 844 },
    { name: 'resp_430x932', width: 430, height: 932 },
    { name: 'resp_1280x800_desktop', width: 1280, height: 800, isMobile: false }
  ];

  console.log('\n--- TESTING RESPONSIVE VIEWPORTS ---');
  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height, isMobile: vp.isMobile !== false, hasTouch: vp.isMobile !== false });
    await page.goto('http://localhost:4321/jony-wedding/', { waitUntil: 'networkidle0' });
    
    // Check for unwanted horizontal or vertical scrollbars
    const overflowCheck = await page.evaluate(() => {
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        hasHorizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        scrollY: window.scrollY
      };
    });
    console.log(`Viewport ${vp.name} (${vp.width}x${vp.height}):`, JSON.stringify(overflowCheck));
    await page.screenshot({ path: path.join(outputDir, `${vp.name}.png`) });
  }

  await browser.close();

  console.log('\n==========================================');
  console.log('TEST RESULTS SUMMARY:');
  console.log('==========================================');
  let allPassed = true;
  for (const [t, passed] of Object.entries(results)) {
    console.log(`  ${t.toUpperCase()}: ${passed ? '✓ PASSED' : '✗ FAILED'}`);
    if (!passed) allPassed = false;
  }
  console.log(`\nOVERALL: ${allPassed ? 'ALL TESTS PASSED SUCCESSFULLY! ✓' : 'SOME TESTS FAILED ✗'}`);

  if (!allPassed) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});