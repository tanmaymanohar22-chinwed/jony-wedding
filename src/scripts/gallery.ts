export function initGallery() {
  const cards = Array.from(document.querySelectorAll<HTMLElement>(".gallery-card"));
  const modal = document.getElementById("gallery-lightbox");
  const previewImg = document.getElementById("lightbox-preview-img") as HTMLImageElement;
  const previewTitle = document.getElementById("lightbox-preview-title");
  const previewCaption = document.getElementById("lightbox-preview-caption");
  const counterEl = document.getElementById("lightbox-counter");
  const closeBtn = document.getElementById("lightbox-close");
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");

  if (!modal || !previewImg || !closeBtn || !cards.length) return;

  let currentIndex = 0;
  let isOpen = false;

  function renderSlide(index: number) {
    if (index < 0) index = cards.length - 1;
    if (index >= cards.length) index = 0;
    currentIndex = index;

    const card = cards[currentIndex];
    const src = card.getAttribute("data-src") || "";
    const title = card.getAttribute("data-title") || "";
    const caption = card.getAttribute("data-caption") || "";

    // Subtle fade transition on image swap
    previewImg.style.opacity = "0.4";
    previewImg.style.transform = "scale(0.98)";
    
    setTimeout(() => {
      previewImg.src = src;
      previewImg.alt = title;
      if (previewTitle) previewTitle.textContent = title;
      if (previewCaption) previewCaption.textContent = caption;
      if (counterEl) counterEl.textContent = `${currentIndex + 1} / ${cards.length}`;
      previewImg.style.opacity = "1";
      previewImg.style.transform = "scale(1)";
    }, 120);
  }

  function openModal(index: number) {
    isOpen = true;
    renderSlide(index);
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    
    // Trigger CSS opacity / scale transition
    requestAnimationFrame(() => {
      modal.classList.add("is-active");
      closeBtn.focus();
    });
  }

  function closeModal() {
    if (!isOpen) return;
    isOpen = false;
    modal.classList.remove("is-active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    setTimeout(() => {
      if (!isOpen) {
        modal.style.display = "none";
        cards[currentIndex]?.focus();
      }
    }, 280);
  }

  function showNext() {
    renderSlide(currentIndex + 1);
  }

  function showPrev() {
    renderSlide(currentIndex - 1);
  }

  cards.forEach((card, idx) => {
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `View photo: ${card.getAttribute("data-title") || "Wedding photo"}`);

    card.addEventListener("click", () => openModal(idx));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(idx);
      }
    });
  });

  closeBtn.addEventListener("click", closeModal);
  prevBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    showPrev();
  });
  nextBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    showNext();
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Keyboard navigation: Escape, Left Arrow, Right Arrow
  window.addEventListener("keydown", (e) => {
    if (!isOpen) return;
    if (e.key === "Escape") {
      closeModal();
    } else if (e.key === "ArrowRight") {
      showNext();
    } else if (e.key === "ArrowLeft") {
      showPrev();
    }
  });

  // Mobile Touch Swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  modal.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  modal.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (diff < -45) {
      showNext();
    } else if (diff > 45) {
      showPrev();
    }
  }, { passive: true });
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
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  elements.forEach(el => observer.observe(el));
}