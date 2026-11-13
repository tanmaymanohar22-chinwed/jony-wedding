export function initFoldedOpening(onRevealAudio?: () => void) {
  const overlay = document.getElementById("intro-overlay");
  const stage = document.getElementById("invitation-opening-stage");
  const tapBtn = document.getElementById("tap-to-open-btn");
  const weddingSite = document.getElementById("wedding-site");
  const curtainOverlay = document.getElementById("theatre-curtain-overlay");

  if (!overlay || !stage || !tapBtn) return;

  // Layer 2: Ensure Theatre Curtains are rendered in closed state directly underneath Layer 3
  if (curtainOverlay) {
    curtainOverlay.style.display = "block";
    curtainOverlay.setAttribute("data-state", "closed");
  }

  let hasStarted = false;

  function startOpeningSequence() {
    if (hasStarted) return;
    hasStarted = true;

    // Strict Interaction: Disable button immediately to prevent multiple triggers
    tapBtn.setAttribute("disabled", "true");
    tapBtn.style.pointerEvents = "none";
    tapBtn.classList.add("is-disabled");

    // A. Immediately add the opening state to the theatre curtain
    if (curtainOverlay) {
      curtainOverlay.setAttribute("data-state", "opening");
    }

    // B. Simultaneously start the logo disappearance and folded-door exit animation
    stage.setAttribute("data-state", "opening");
    overlay.setAttribute("data-state", "opening");

    // C. Make the real wedding website visible underneath the curtains
    if (weddingSite) {
      weddingSite.classList.add("is-revealed");
    }

    // D. Keep the website non-interactive until the curtains have completely opened (1000ms)
    let sequenceCompleted = false;
    const onCurtainComplete = () => {
      if (sequenceCompleted) return;
      sequenceCompleted = true;

      // Finish curtain state and clean up overlays
      if (curtainOverlay) {
        curtainOverlay.setAttribute("data-state", "opened");
        curtainOverlay.style.display = "none";
      }

      overlay.setAttribute("data-state", "revealed");
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

    const leftCurtainPanel = curtainOverlay ? curtainOverlay.querySelector(".curtain-panel-left") : null;
    if (leftCurtainPanel) {
      const handleCurtainEnd = (e: Event) => {
        const te = e as TransitionEvent;
        if (te.target === leftCurtainPanel && te.propertyName === "transform") {
          leftCurtainPanel.removeEventListener("transitionend", handleCurtainEnd);
          onCurtainComplete();
        }
      };
      leftCurtainPanel.addEventListener("transitionend", handleCurtainEnd);
    }

    // Exact 1000ms timeout matching CSS transition duration
    setTimeout(onCurtainComplete, 1000);
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