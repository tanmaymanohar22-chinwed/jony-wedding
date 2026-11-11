export function initGallery() {
  const items = document.querySelectorAll<HTMLElement>(".gallery-item");
  const modal = document.getElementById("gallery-modal");
  const modalImg = document.getElementById("modal-image") as HTMLImageElement;
  const modalCaption = document.getElementById("modal-caption");
  const closeBtn = document.getElementById("modal-close");

  if (!modal || !modalImg || !closeBtn) return;

  items.forEach(item => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img");
      const caption = item.getAttribute("data-caption") || "";
      if (img) {
        modalImg.src = img.src;
        if (modalCaption) modalCaption.textContent = caption;
        modal.style.display = "flex";
        setTimeout(() => modal.classList.add("is-active"), 10);
      }
    });
  });

  function closeModal() {
    modal?.classList.remove("is-active");
    setTimeout(() => {
      if (modal) modal.style.display = "none";
    }, 300);
  }

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

export function initScrollReveal() {
  const elements = document.querySelectorAll(".reveal-on-scroll");
  if (!("IntersectionObserver" in window)) {
    elements.forEach(el => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => observer.observe(el));
}
