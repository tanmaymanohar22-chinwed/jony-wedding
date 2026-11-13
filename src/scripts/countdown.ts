// Event-Driven Live Wedding Countdown
// Activates ONLY upon receipt of the "wedding-date-revealed" event

export function setupCountdownListener(defaultIsoDate: string = "2026-12-29T16:00:00+05:30") {
  const section = document.getElementById("countdown-section");
  const daysEl = document.getElementById("countdown-days");
  const hoursEl = document.getElementById("countdown-hours");
  const minsEl = document.getElementById("countdown-mins");
  const secsEl = document.getElementById("countdown-secs");
  const containerEl = document.getElementById("countdown-container");

  if (!section || !daysEl || !hoursEl || !minsEl || !secsEl) return;

  let countdownInterval: ReturnType<typeof setInterval> | null = null;
  let isActive = false;

  function updateDigit(el: HTMLElement, val: string) {
    if (el.textContent !== val) {
      el.textContent = val;
      el.classList.remove("digit-tick");
      // Trigger reflow for smooth re-animation
      void el.offsetWidth;
      el.classList.add("digit-tick");
    }
  }

  function startCountdown(targetIsoDate: string) {
    if (isActive) return;
    isActive = true;

    console.log("Starting wedding countdown to:", targetIsoDate);
    const targetTime = new Date(targetIsoDate).getTime();

    // Reveal the countdown section with smooth entrance
    section.classList.remove("countdown-dormant");
    section.classList.add("countdown-active");
    section.setAttribute("aria-hidden", "false");

    function update() {
      const now = new Date().getTime();
      const distance = targetTime - now;

      if (distance <= 0) {
        if (countdownInterval) clearInterval(countdownInterval);
        if (containerEl) {
          containerEl.innerHTML = `
            <div class="paper-card" style="padding: 24px; text-align: center;">
              <p class="font-script text-rose" style="font-size: 2.5rem; margin-bottom: 8px;">Happily Married!</p>
              <p class="font-serif text-muted" style="font-size: 1.1rem;">Thank you for blessing our sacred wedding union.</p>
            </div>
          `;
        }
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      updateDigit(daysEl, String(days).padStart(2, "0"));
      updateDigit(hoursEl, String(hours).padStart(2, "0"));
      updateDigit(minsEl, String(minutes).padStart(2, "0"));
      updateDigit(secsEl, String(seconds).padStart(2, "0"));
    }

    update();
    countdownInterval = setInterval(update, 1000);
  }

  // Listen for the custom event dispatched by the Scratch Card
  window.addEventListener("wedding-date-revealed", (e: Event) => {
    const customEvent = e as CustomEvent<{ date?: string }>;
    const targetDate = customEvent.detail?.date || section.getAttribute("data-target-date") || defaultIsoDate;
    startCountdown(targetDate);
  });
}