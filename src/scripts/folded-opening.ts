export function initFoldedOpening(onRevealAudio?: () => void) {
  const overlay = document.getElementById("intro-overlay");
  const stage = document.getElementById("invitation-opening-stage");
  const tapBtn = document.getElementById("tap-to-open-btn");
  const weddingSite = document.getElementById("wedding-site");

  if (!overlay || !stage || !tapBtn) return;

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

    // Start logo fade and paper doors unfolding simultaneously (Target duration ~2.8s)
    stage.setAttribute("data-state", "opening");
    overlay.setAttribute("data-state", "opening");

    let sequenceCompleted = false;
    const onDoorOpeningComplete = () => {
      if (sequenceCompleted) return;
      sequenceCompleted = true;

      stage.setAttribute("data-state", "revealed");
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

    // Listen for paper door transition completion on the left panel
    const leftDoorPanel = stage.querySelector(".folio-panel-left");
    if (leftDoorPanel) {
      const handleDoorEnd = (e: Event) => {
        const te = e as TransitionEvent;
        if (te.target === leftDoorPanel && te.propertyName === "transform") {
          leftDoorPanel.removeEventListener("transitionend", handleDoorEnd);
          onDoorOpeningComplete();
        }
      };
      leftDoorPanel.addEventListener("transitionend", handleDoorEnd);
    }

    // Safety timeout matching the 2800ms transition duration (+60ms grace)
    setTimeout(onDoorOpeningComplete, 2860);
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