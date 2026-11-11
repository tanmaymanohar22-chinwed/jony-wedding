export function initEnvelope(onOpen?: () => void) {
  const envelope = document.getElementById("invitation-envelope");
  const openTrigger = document.getElementById("envelope-open-trigger");
  const introOverlay = document.getElementById("envelope-intro-overlay");
  const mainContent = document.getElementById("main-invitation-content");

  if (!envelope || !openTrigger) return;

  function handleOpen() {
    if (envelope?.classList.contains("is-open")) return;
    
    envelope?.classList.add("is-open");
    if (onOpen) onOpen();

    setTimeout(() => {
      if (mainContent) {
        mainContent.style.opacity = "1";
        mainContent.style.pointerEvents = "auto";
      }
      // Smoothly scroll down to main cover
      const cover = document.getElementById("invitation-cover");
      if (cover) {
        cover.scrollIntoView({ behavior: "smooth" });
      }
    }, 900);
  }

  openTrigger.addEventListener("click", handleOpen);
  envelope.addEventListener("click", handleOpen);
}
