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

      // Give 1.0s to admire the fully revealed stationery inside the overlay,
      // then seamlessly cross-fade to reveal the complete wedding site
      setTimeout(() => {
        // 1. Begin smooth fade-out of intro overlay
        overlay.classList.add("is-hidden");

        // 2. Simultaneously fade in the complete wedding website
        if (weddingSite) {
          weddingSite.classList.add("is-revealed");
          weddingSite.removeAttribute("inert");
          weddingSite.setAttribute("aria-hidden", "false");
        }

        // 3. Remove overflow lock on html & body to enable normal page scrolling
        document.documentElement.classList.remove("intro-active");
        document.body.classList.remove("intro-active");

        // 4. Start serene background audio
        if (onRevealAudio) {
          onRevealAudio();
        }

        // 5. Completely unmount/hide overlay after fade finishes (900ms)
        setTimeout(() => {
          overlay.style.display = "none";
        }, 900);
      }, 1000);
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