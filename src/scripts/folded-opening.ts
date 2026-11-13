export function initFoldedOpening(onRevealAudio?: () => void) {
  const overlay = document.getElementById("intro-overlay");
  const tapBtn = document.getElementById("tap-to-open-btn");
  const weddingSite = document.getElementById("wedding-site");

  if (!overlay || !tapBtn) return;

  // Pre-render the actual wedding website directly underneath the folded paper doors
  if (weddingSite) {
    weddingSite.classList.add("is-revealed");
  }

  let hasStarted = false;

  function startOpeningSequence() {
    if (hasStarted) return;
    hasStarted = true;

    // Strict Interaction: Disable button immediately to prevent multiple triggers
    tapBtn.setAttribute("disabled", "true");
    tapBtn.style.pointerEvents = "none";
    tapBtn.classList.add("is-disabled");

    // PHASE 1: RIBBON_RELEASING (Bow knot loosens, loops untie, tails cascade, straps slide away)
    overlay.setAttribute("data-state", "ribbon-releasing");

    // PHASE 2: RIBBON_REMOVED (At ~1000ms, ribbons are cleared, ivory panel & burgundy box begin dissolving smoothly)
    setTimeout(() => {
      overlay.setAttribute("data-state", "ribbon-removed");
    }, 1000);

    // PHASE 3: WEBSITE_REVEALED (At ~2800ms, dissolve finishes, website is fully revealed, scrolling and interactivity restored)
    let sequenceCompleted = false;
    const onRevealComplete = () => {
      if (sequenceCompleted) return;
      sequenceCompleted = true;

      overlay.setAttribute("data-state", "website-revealed");
      overlay.classList.add("is-hidden");
      overlay.style.display = "none";

      // Enable scrolling and interactivity immediately
      document.documentElement.classList.remove("intro-active");
      document.body.classList.remove("intro-active");

      if (weddingSite) {
        weddingSite.removeAttribute("inert");
        weddingSite.setAttribute("aria-hidden", "false");
      }

      if (onRevealAudio) {
        onRevealAudio();
      }
    };

    // Safety timeout matching the total 2800ms duration (+50ms buffer)
    setTimeout(onRevealComplete, 2850);
  }

  // Strict Activation: ONLY clicking the actual TAP TO OPEN button starts the animation
  tapBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    startOpeningSequence();
  });

  // Keyboard accessibility: Enter or Space on the button
  tapBtn.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      startOpeningSequence();
    }
  });

  // Guard against any scrolling while intro overlay is active
  window.addEventListener("scroll", () => {
    if (document.documentElement.classList.contains("intro-active") || document.body.classList.contains("intro-active")) {
      window.scrollTo(0, 0);
    }
  }, { passive: false });
}