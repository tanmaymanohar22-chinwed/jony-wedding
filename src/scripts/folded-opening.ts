export function initFoldedOpening(onRevealAudio?: () => void) {
  const stage = document.getElementById("invitation-opening-stage");
  const tapBtn = document.getElementById("tap-to-open-btn");
  const coverSection = document.getElementById("invitation-cover");

  if (!stage || !tapBtn) return;

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
      if (coverSection) {
        coverSection.setAttribute("data-state", state);
      }
    }

    // STAGE B: UNTYING (Knot loosens, bow loops deform, tails move, X-ribbon slides off)
    setStageState("untying");

    // STAGE C: UNFOLDING (Gatefold panels swing open in 3D)
    setTimeout(() => {
      setStageState("unfolding");
    }, 1600);

    // STAGE D: REVEALED (Full stationery exposed, audio plays, ready to explore)
    setTimeout(() => {
      setStageState("revealed");
      if (onRevealAudio) {
        onRevealAudio();
      }

      // Smooth scroll gently to focus on revealed invitation
      if (coverSection) {
        coverSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
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
}