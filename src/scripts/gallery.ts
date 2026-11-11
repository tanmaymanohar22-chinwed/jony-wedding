export function initGallery() {
  const cards = document.querySelectorAll<HTMLElement>(".gallery-card");
  const modal = document.getElementById("gallery-lightbox");
  const previewImg = document.getElementById("lightbox-preview-img") as HTMLImageElement;
  const previewTitle = document.getElementById("lightbox-preview-title");
  const previewCaption = document.getElementById("lightbox-preview-caption");
  const closeBtn = document.getElementById("lightbox-close");

  if (!modal || !previewImg || !closeBtn) return;

  cards.forEach(card => {
    card.addEventListener("click", () => {
      const src = card.getAttribute("data-src") || "";
      const title = card.getAttribute("data-title") || "";
      const caption = card.getAttribute("data-caption") || "";

      previewImg.src = src;
      if (previewTitle) previewTitle.textContent = title;
      if (previewCaption) previewCaption.textContent = caption;

      modal.style.display = "flex";
      setTimeout(() => modal.classList.add("is-active"), 10);
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
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
}