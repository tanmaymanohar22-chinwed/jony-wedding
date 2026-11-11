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
  // TEST 1: Fresh Page Visit - only opening invitation appears
  // ==========================================
  console.log('\n[TEST 1] Navigating to http://localhost:4321/jony-wedding/ ...');
  await page.goto('http://localhost:4321/jony-wedding/', { waitUntil: 'networkidle0' });

  const state1 = await page.evaluate(() => {
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

  console.log('TEST 1 State:', JSON.stringify(state1, null, 2));
  await page.screenshot({ path: path.join(outputDir, 'test_1_initial_opening.png') });
  results.test1 = state1.overlayVisible && state1.siteInert && state1.siteOpacity === '0' && state1.siteVisibility === 'hidden';

  // ==========================================
  // TEST 2: Wait 10 Seconds Without Clicking
  // ==========================================
  console.log('\n[TEST 2] Waiting 10 seconds without clicking...');
  await new Promise(r => setTimeout(r, 10000));

  const state2 = await page.evaluate(() => {
    const stage = document.getElementById('invitation-opening-stage');
    const weddingSite = document.getElementById('wedding-site');
    const siteStyle = weddingSite ? window.getComputedStyle(weddingSite) : null;
    return {
      stageState: stage ? stage.getAttribute('data-state') : null,
      siteStillHidden: siteStyle ? siteStyle.visibility === 'hidden' && siteStyle.opacity === '0' : false
    };
  });
  console.log('TEST 2 State:', JSON.stringify(state2, null, 2));
  results.test2 = state2.stageState === 'closed' && state2.siteStillHidden;

  // ==========================================
  // TEST 3: Scroll Attempt - underlying website cannot scroll
  // ==========================================
  console.log('\n[TEST 3] Attempting to scroll before clicking...');
  await page.evaluate(() => {
    window.scrollTo(0, 1000);
    document.documentElement.scrollTop = 1000;
    document.body.scrollTop = 1000;
  });
  await new Promise(r => setTimeout(r, 300));

  const scrollY3 = await page.evaluate(() => window.scrollY || document.documentElement.scrollTop || document.body.scrollTop);
  console.log('TEST 3 ScrollY after attempt:', scrollY3);
  results.test3 = scrollY3 === 0;

  // ==========================================
  // TEST 4: Tap Button - ribbon opening animation starts
  // ==========================================
  console.log('\n[TEST 4] Clicking TAP TO OPEN button...');
  await page.click('#tap-to-open-btn');
  await new Promise(r => setTimeout(r, 500));

  const state4 = await page.evaluate(() => {
    const stage = document.getElementById('invitation-opening-stage');
    const tapBtn = document.getElementById('tap-to-open-btn');
    return {
      stageState: stage ? stage.getAttribute('data-state') : null,
      btnDisabled: tapBtn ? tapBtn.hasAttribute('disabled') : false
    };
  });
  console.log('TEST 4 State (Animation started):', JSON.stringify(state4, null, 2));
  results.test4 = state4.stageState === 'untying' && state4.btnDisabled;

  // ==========================================
  // TEST 5: During Animation - website remains hidden
  // ==========================================
  console.log('\n[TEST 5] Checking during unfolding animation (2.5s after click)...');
  await new Promise(r => setTimeout(r, 2000));

  const state5 = await page.evaluate(() => {
    const stage = document.getElementById('invitation-opening-stage');
    const weddingSite = document.getElementById('wedding-site');
    const siteStyle = weddingSite ? window.getComputedStyle(weddingSite) : null;
    return {
      stageState: stage ? stage.getAttribute('data-state') : null,
      siteStillHidden: siteStyle ? siteStyle.visibility === 'hidden' && siteStyle.opacity === '0' : false,
      siteInert: weddingSite ? weddingSite.hasAttribute('inert') : false
    };
  });
  console.log('TEST 5 State (Mid-animation):', JSON.stringify(state5, null, 2));
  await page.screenshot({ path: path.join(outputDir, 'test_2_mid_animation.png') });
  results.test5 = state5.stageState === 'unfolding' && state5.siteStillHidden && state5.siteInert;

  // Capture final invitation reveal inside overlay before website fade
  await new Promise(r => setTimeout(r, 1200));
  console.log('Capturing final invitation reveal inside overlay...');
  await page.screenshot({ path: path.join(outputDir, 'test_3_final_invitation_reveal.png') });

  // ==========================================
  // TEST 6: After Animation - entire website fades in
  // ==========================================
  console.log('\n[TEST 6] Waiting for cinematic crossfade completion (total 6.0s after click)...');
  await new Promise(r => setTimeout(r, 2300));

  const state6 = await page.evaluate(() => {
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
  console.log('TEST 6 State (Website revealed):', JSON.stringify(state6, null, 2));
  await page.screenshot({ path: path.join(outputDir, 'test_4_full_website_after_transition.png') });
  results.test6 = state6.siteVisible && state6.siteInertRemoved && state6.bodyIntroActiveRemoved && state6.bodyOverflowNormal;

  // ==========================================
  // TEST 7: After Opening - normal scrolling works
  // ==========================================
  console.log('\n[TEST 7] Testing normal scrolling after reveal...');
  await page.evaluate(() => window.scrollTo(0, 500));
  await new Promise(r => setTimeout(r, 300));
  const scrollY7 = await page.evaluate(() => window.scrollY);
  console.log('TEST 7 ScrollY after reveal:', scrollY7);
  results.test7 = scrollY7 > 0;

  // ==========================================
  // TEST 8: Refresh - opening screen appears again
  // ==========================================
  console.log('\n[TEST 8] Refreshing page to verify zero persistence...');
  await page.reload({ waitUntil: 'networkidle0' });

  const state8 = await page.evaluate(() => {
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
  console.log('TEST 8 State (Fresh after reload):', JSON.stringify(state8, null, 2));
  results.test8 = state8.overlayVisible && state8.siteHidden && state8.siteInert && state8.bodyHasIntroActive;

  // ==========================================
  // TEST 9: Direct /invite/priya-and-rohit/ URL
  // ==========================================
  console.log('\n[TEST 9] Opening direct URL: http://localhost:4321/jony-wedding/invite/priya-and-rohit/ ...');
  await page.goto('http://localhost:4321/jony-wedding/invite/priya-and-rohit/', { waitUntil: 'networkidle0' });

  const state9 = await page.evaluate(() => {
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
  console.log('TEST 9 State (Direct URL priya-and-rohit):', JSON.stringify(state9, null, 2));
  results.test9 = state9.overlayVisible && state9.siteHidden && state9.siteInert && state9.bodyHasIntroActive;

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
  console.log(`\nOVERALL: ${allPassed ? 'ALL 9 TESTS PASSED SUCCESSFULLY! ✓' : 'SOME TESTS FAILED ✗'}`);

  if (!allPassed) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});