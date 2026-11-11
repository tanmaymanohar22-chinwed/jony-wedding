export function initFoldedOpening(onRevealAudio?: () => void) {
  const overlay = document.getElementById("intro-overlay");
  const stage = document.getElementById("invitation-opening-stage");
  const tapBtn = document.getElementById("tap-to-open-btn");
  const weddingSite = document.getElementById("wedding-site");

  if (!overlay || !stage || !tapBtn) return;

  let hasStarted = false;

  function startOpeningSequence() {
    if (hasStarted) return;
    hasStarted = true;

    // Strict Interaction: Disable button immediately to prevent multiple triggers
    tapBtn.setAttribute("disabled", "true");
    tapBtn.style.pointerEvents = "none";
    tapBtn.classList.add("is-disabled");

    function setStageState(state: string) {
      stage.setAttribute("data-state", state);
      overlay.setAttribute("data-state", state);
    }

    // STAGE B: UNTYING (0.0s – 1.6s)
    setStageState("untying");

    // STAGE C: UNFOLDING (1.6s – 3.6s: Gatefold panels swing open in 3D)
    setTimeout(() => {
      setStageState("unfolding");
    }, 1600);

    // STAGE D: REVEALED (3.6s: Full stationery exposed inside overlay)
    setTimeout(() => {
      setStageState("revealed");

      // Hold on the fully revealed stationery inside the overlay for 800ms,
      // then initiate the seamless 1000ms cinematic crossfade to the complete wedding site
      setTimeout(() => {
        // 1. Simultaneously fade in the complete wedding website
        if (weddingSite) {
          weddingSite.classList.add("is-revealed");
          weddingSite.removeAttribute("inert");
          weddingSite.setAttribute("aria-hidden", "false");
        }

        // 2. Begin smooth fade-out of intro overlay
        overlay.classList.add("is-hidden");

        // 3. Start serene background audio
        if (onRevealAudio) {
          onRevealAudio();
        }

        // 4. Once the overlay fade finishes (1000ms):
        setTimeout(() => {
          overlay.style.display = "none";
          // Remove overflow lock on html & body to restore normal page scrolling
          document.documentElement.classList.remove("intro-active");
          document.body.classList.remove("intro-active");
        }, 1000);
      }, 800);
    }, 3600);
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