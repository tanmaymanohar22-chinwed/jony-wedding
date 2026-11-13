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

    // Direct callback executed immediately when paper doors finish opening
    function triggerImmediateCurtainOpening() {
      // 1. Mark stage as revealed & hide paper door overlay cleanly
      setStageState("revealed");
      overlay.classList.add("is-hidden");
      overlay.style.display = "none";

      // 2. Set live wedding website visible underneath
      if (weddingSite) {
        weddingSite.classList.add("is-revealed");
      }

      // 3. ZERO INTENTIONAL WAIT: Trigger curtains immediately in this exact callback
      if (curtainOverlay) {
        curtainOverlay.setAttribute("data-state", "opening");

        // Curtains open outward for exactly 1000ms
        const leftCurtainPanel = curtainOverlay.querySelector(".curtain-panel-left");

        let sequenceCompleted = false;
        const onCurtainsFinished = () => {
          if (sequenceCompleted) return;
          sequenceCompleted = true;

          curtainOverlay.setAttribute("data-state", "opened");
          curtainOverlay.style.display = "none";

          // Enable normal scrolling immediately at 1000ms
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

        if (leftCurtainPanel) {
          const handleCurtainEnd = (e: Event) => {
            const te = e as TransitionEvent;
            if (te.target === leftCurtainPanel && te.propertyName === "transform") {
              leftCurtainPanel.removeEventListener("transitionend", handleCurtainEnd);
              onCurtainsFinished();
            }
          };
          leftCurtainPanel.addEventListener("transitionend", handleCurtainEnd);
        }

        // Exact 1000ms timer matching CSS transition duration
        setTimeout(onCurtainsFinished, 1000);
      } else {
        // Fallback if no curtain overlay
        if (weddingSite) {
          weddingSite.classList.add("is-revealed");
          weddingSite.removeAttribute("inert");
          weddingSite.setAttribute("aria-hidden", "false");
        }
        document.documentElement.classList.remove("intro-active");
        document.body.classList.remove("intro-active");
        if (onRevealAudio) onRevealAudio();
      }
    }

    // STAGE B: UNTYING (0.0s – 1.6s)
    setStageState("untying");

    // STAGE C: UNFOLDING (1.6s – Gatefold panels swing open in 3D)
    setTimeout(() => {
      setStageState("unfolding");

      const leftDoor = stage.querySelector(".folio-panel-left");
      let doorsFinished = false;

      const handleDoorTransitionEnd = (e: Event) => {
        const te = e as TransitionEvent;
        if (te.target === leftDoor && te.propertyName === "transform") {
          if (!doorsFinished) {
            doorsFinished = true;
            if (leftDoor) leftDoor.removeEventListener("transitionend", handleDoorTransitionEnd);
            triggerImmediateCurtainOpening();
          }
        }
      };

      if (leftDoor) {
        leftDoor.addEventListener("transitionend", handleDoorTransitionEnd);
      }

      // Safety fallback matching exact 1.8s door transition duration
      setTimeout(() => {
        if (!doorsFinished) {
          doorsFinished = true;
          if (leftDoor) leftDoor.removeEventListener("transitionend", handleDoorTransitionEnd);
          triggerImmediateCurtainOpening();
        }
      }, 1800);
    }, 1600);
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