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

    // C. Make the real wedding website visible underneath the curtains
    if (weddingSite) {
      weddingSite.classList.add("is-revealed");
    }

    // STATE 2 & 3: Fast door separation (260ms) while curtains remain solidly closed underneath
    stage.setAttribute("data-state", "doors-opening");
    overlay.setAttribute("data-state", "doors-opening");
    if (curtainOverlay) {
      curtainOverlay.setAttribute("data-state", "doors-opening");
    }

    // At 260ms: Doors are fully open. Establish the CLOSED CURTAIN visible state
    setTimeout(() => {
      // Unmount the doors layer so the entire viewport displays the closed theatre curtain
      overlay.style.display = "none";
      overlay.setAttribute("data-state", "curtain-visible");
      stage.setAttribute("data-state", "curtain-visible");

      if (curtainOverlay) {
        curtainOverlay.setAttribute("data-state", "curtain-visible");
      }

      // Establish browser paint boundary so the closed curtain is visibly painted
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // STATE 5: CURTAIN OPENING (1000ms transition)
          if (curtainOverlay) {
            curtainOverlay.setAttribute("data-state", "curtain-opening");
          }

          let sequenceCompleted = false;
          const onCurtainComplete = () => {
            if (sequenceCompleted) return;
            sequenceCompleted = true;

            // STATE 6: WEBSITE REVEALED
            if (curtainOverlay) {
              curtainOverlay.setAttribute("data-state", "website-revealed");
              curtainOverlay.style.display = "none";
            }

            overlay.setAttribute("data-state", "website-revealed");
            overlay.classList.add("is-hidden");

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

          // Exact 1000ms timeout matching CSS transition duration (+20ms buffer)
          setTimeout(onCurtainComplete, 1020);
        });
      });
    }, 260);
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