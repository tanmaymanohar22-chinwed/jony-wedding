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

    function setStageState(state: string) {
      stage.setAttribute("data-state", state);
      overlay.setAttribute("data-state", state);
    }

    // STAGE B: UNTYING (0.0s – 1.6s)
    setStageState("untying");

    // STAGE C: UNFOLDING (1.6s – 3.4s: Gatefold panels swing open in 3D revealing curtains underneath)
    setTimeout(() => {
      setStageState("unfolding");
    }, 1600);

    // STAGE D: THEATRE CURTAIN REVEAL (Doors finish swinging open at 3.4s)
    setTimeout(() => {
      setStageState("revealed");

      if (curtainOverlay) {
        // 1. Paper doors are now open; hide intro overlay cleanly
        overlay.classList.add("is-hidden");
        overlay.style.display = "none";

        // 2. Set live HTML wedding website visible underneath the closed curtains
        if (weddingSite) {
          weddingSite.classList.add("is-revealed");
        }

        // 3. Hold closed curtains for 250ms before smoothly parting outward
        setTimeout(() => {
          // 4. Curtains begin parting outward (2.2s transition) revealing the real website
          curtainOverlay.setAttribute("data-state", "opening");

          // 5. Curtains complete parting outward after 2200ms
          setTimeout(() => {
            curtainOverlay.setAttribute("data-state", "opened");
            curtainOverlay.classList.add("is-fading-out");

            // 6. Website becomes fully interactive
            if (weddingSite) {
              weddingSite.removeAttribute("inert");
              weddingSite.setAttribute("aria-hidden", "false");
            }

            // 7. Start serene wedding background audio
            if (onRevealAudio) {
              onRevealAudio();
            }

            // 8. Remove curtain overlay element and restore normal scrolling after fade-out
            setTimeout(() => {
              curtainOverlay.style.display = "none";
              document.documentElement.classList.remove("intro-active");
              document.body.classList.remove("intro-active");
            }, 650);
          }, 2200);
        }, 250);
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