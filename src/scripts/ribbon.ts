export function initRibbonReveal(onUnwrap?: () => void) {
  const overlay = document.getElementById("ribbon-reveal-overlay");
  if (!overlay) return;

  function unwrap() {
    if (overlay?.classList.contains("is-unwrapped")) return;

    overlay?.classList.add("is-unwrapped");
    if (onUnwrap) onUnwrap();
  }

  overlay.addEventListener("click", unwrap);
}