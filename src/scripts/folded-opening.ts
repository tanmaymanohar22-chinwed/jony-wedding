export function initFoldedOpening(onRevealAudio?: () => void) {
  const stage = document.getElementById("invitation-opening-stage");
  const tapBtn = document.getElementById("tap-to-open-btn");
  const coverSection = document.getElementById("invitation-cover");

  if (!stage || !tapBtn) return;

  let hasStarted = false;

  function startOpeningSequence() {
    if (hasStarted) return;
    hasStarted = true;

    // Disable button immediately
    tapBtn.setAttribute("disabled", "true");
    tapBtn.style.pointerEvents = "none";

    // STAGE B: UNTYING (Bow unravels, ribbon bands eject)
    stage.setAttribute("data-state", "untying");

    // STAGE C: UNFOLDING (Paper panels flip open in 3D)
    setTimeout(() => {
      stage.setAttribute("data-state", "unfolding");
    }, 1600);

    // STAGE D: REVEALED (Full stationery exposed, audio starts, ready to read)
    setTimeout(() => {
      stage.setAttribute("data-state", "revealed");
      if (onRevealAudio) {
        onRevealAudio();
      }

      // Smooth scroll gently to focus on revealed invitation
      if (coverSection) {
        coverSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 3600);
  }

  // Click & Touch activation
  tapBtn.addEventListener("click", startOpeningSequence);
  stage.addEventListener("click", (e) => {
    if (stage.getAttribute("data-state") === "closed") {
      startOpeningSequence();
    }
  });

  // Keyboard accessibility (Enter or Space)
  tapBtn.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      startOpeningSequence();
    }
  });
}