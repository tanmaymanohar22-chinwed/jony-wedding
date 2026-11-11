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

    // STAGE C: UNFOLDING (1.6s – 3.6s: Gatefold panels swing open in 3D)
    setTimeout(() => {
      setStageState("unfolding");
    }, 1600);

    // STAGE D: REVEALED (3.6s: Full stationery exposed inside overlay)
    setTimeout(() => {
      setStageState("revealed");

      // Hold for 700ms, then engage Theatre Curtain Reveal sequence
      setTimeout(() => {
        if (curtainOverlay) {
          // 1. Activate curtain stage
          curtainOverlay.setAttribute("data-state", "active");

          // 2. Fade out intro overlay seamlessly behind the curtain
          overlay.classList.add("is-hidden");

          // 3. Briefly settle fabric (400ms), then begin parting curtains outward
          setTimeout(() => {
            curtainOverlay.setAttribute("data-state", "opening");

            // 4. Live HTML wedding website becomes active underneath the parting curtains
            if (weddingSite) {
              weddingSite.classList.add("is-revealed");
              weddingSite.removeAttribute("inert");
              weddingSite.setAttribute("aria-hidden", "false");
            }

            // 5. Once curtains have parted completely (1.8s):
            setTimeout(() => {
              curtainOverlay.setAttribute("data-state", "opened");
              curtainOverlay.classList.add("is-fading-out");

              // 6. Start serene background audio
              if (onRevealAudio) {
                onRevealAudio();
              }

              // 7. Remove overlay elements and restore normal page scrolling
              setTimeout(() => {
                curtainOverlay.style.display = "none";
                overlay.style.display = "none";
                document.documentElement.classList.remove("intro-active");
                document.body.classList.remove("intro-active");
              }, 400);
            }, 1800);
          }, 400);
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
          }, 1000);
        }
      }, 700);
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