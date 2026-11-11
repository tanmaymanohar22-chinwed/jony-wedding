export function initFoldedOpening(onRevealAudio?: () => void) {
  const overlay = document.getElementById("intro-overlay");
  const stage = document.getElementById("invitation-opening-stage");
  const tapBtn = document.getElementById("tap-to-open-btn");
  const weddingSite = document.getElementById("wedding-site");
  const curtainOverlay = document.getElementById("theatre-curtain-overlay");

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

    // STAGE C: UNFOLDING (1.6s – 3.4s: Gatefold panels swing open in 3D)
    setTimeout(() => {
      setStageState("unfolding");
    }, 1600);

    // STAGE D: INSTANT THEATRE CURTAIN COVERAGE (Doors reach open state at 3.4s)
    setTimeout(() => {
      setStageState("revealed");

      if (curtainOverlay) {
        // 1. Instantly activate curtain in fully CLOSED state covering 100% of viewport
        curtainOverlay.style.display = "block";
        curtainOverlay.setAttribute("data-state", "active");

        // 2. Hide intro overlay underneath the solid curtain
        overlay.classList.add("is-hidden");
        overlay.style.display = "none";

        // 3. Set live HTML wedding website visible (opacity 1) underneath the closed curtains
        if (weddingSite) {
          weddingSite.classList.add("is-revealed");
        }

        // 4. Brief hold (250ms) with closed curtains rendered before starting parting motion
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTimeout(() => {
              // 5. Curtains begin smoothly parting outward (1.8s) revealing the real website
              curtainOverlay.setAttribute("data-state", "opening");

              // 6. Curtains complete parting outward (1.8s)
              setTimeout(() => {
                curtainOverlay.setAttribute("data-state", "opened");
                curtainOverlay.classList.add("is-fading-out");

                // 7. Website becomes fully interactive
                if (weddingSite) {
                  weddingSite.removeAttribute("inert");
                  weddingSite.setAttribute("aria-hidden", "false");
                }

                // 8. Start serene wedding background audio
                if (onRevealAudio) {
                  onRevealAudio();
                }

                // 9. Remove curtain overlay element and restore normal scrolling
                setTimeout(() => {
                  curtainOverlay.style.display = "none";
                  document.documentElement.classList.remove("intro-active");
                  document.body.classList.remove("intro-active");
                }, 400);
              }, 1800);
            }, 250);
          });
        });
      } else {
        // Fallback if curtain overlay element not present
        if (weddingSite) {
          weddingSite.classList.add("is-revealed");
          weddingSite.removeAttribute("inert");
          weddingSite.setAttribute("aria-hidden", "false");
        }
        overlay.classList.add("is-hidden");
        if (onRevealAudio) onRevealAudio();
        setTimeout(() => {
          overlay.style.display = "none";
          document.documentElement.classList.remove("intro-active");
          document.body.classList.remove("intro-active");
        }, 800);
      }
    }, 3400);
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