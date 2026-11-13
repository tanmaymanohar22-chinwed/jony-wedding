// Event-Driven Live Wedding Countdown
// Manages the 4 circular SVG progress rings and digit updates

const RING_CIRCUMFERENCE = 263.89; // 2 * Math.PI * 42

function setRingProgress(el: HTMLElement | null, ratio: number) {
  if (!el) return;
  const clamped = Math.max(0, Math.min(1, ratio));
  // At ratio = 1 (full), offset = 0; at ratio = 0 (empty), offset = RING_CIRCUMFERENCE
  const offset = RING_CIRCUMFERENCE * (1 - clamped);
  el.style.strokeDashoffset = offset.toFixed(2);
}

export function setupCountdownListener(defaultIsoDate: string = "2026-12-29T16:00:00+05:30") {
  const section = document.getElementById("countdown-section");
  const daysEl = document.getElementById("countdown-days");
  const hoursEl = document.getElementById("countdown-hours");
  const minsEl = document.getElementById("countdown-mins");
  const secsEl = document.getElementById("countdown-secs");
  const ringsContainer = document.getElementById("countdown-rings-container");

  const ringDays = document.getElementById("ring-days-meter");
  const ringHours = document.getElementById("ring-hours-meter");
  const ringMins = document.getElementById("ring-mins-meter");
  const ringSecs = document.getElementById("ring-secs-meter");

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

    const targetTime = new Date(targetIsoDate).getTime();

    // Reveal the countdown section with smooth entrance if classes are used
    section.classList.remove("countdown-dormant");
    section.classList.add("countdown-active");
    section.setAttribute("aria-hidden", "false");

    function update() {
      const now = new Date().getTime();
      const distance = targetTime - now;

      if (distance <= 0) {
        if (countdownInterval) clearInterval(countdownInterval);
        setRingProgress(ringDays, 0);
        setRingProgress(ringHours, 0);
        setRingProgress(ringMins, 0);
        setRingProgress(ringSecs, 0);
        updateDigit(daysEl, "00");
        updateDigit(hoursEl, "00");
        updateDigit(minsEl, "00");
        updateDigit(secsEl, "00");

        if (ringsContainer) {
          ringsContainer.innerHTML = `
            <div style="padding: 24px; text-align: center; grid-column: 1 / -1;">
              <p class="font-script text-rose" style="font-size: 2.2rem; margin-bottom: 6px;">Happily Married!</p>
              <p class="font-serif text-muted" style="font-size: 1rem; line-height: 1.5;">Thank you for blessing our sacred wedding union.</p>
            </div>
          `;
        }
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Update numbers
      updateDigit(daysEl, String(days).padStart(2, "0"));
      updateDigit(hoursEl, String(hours).padStart(2, "0"));
      updateDigit(minsEl, String(minutes).padStart(2, "0"));
      updateDigit(secsEl, String(seconds).padStart(2, "0"));

      // Update circular SVG progress rings
      setRingProgress(ringSecs, seconds / 60);
      setRingProgress(ringMins, minutes / 60);
      setRingProgress(ringHours, hours / 24);
      setRingProgress(ringDays, Math.min(1, days / 365));
    }

    update();
    countdownInterval = setInterval(update, 1000);
  }

  const targetDate = section.getAttribute("data-target-date") || defaultIsoDate;

  // Session check: only start immediately on page load if scratch was already completed in this session
  const isAlreadyRevealed = (() => {
    try {
      return sessionStorage.getItem("wedding_scratch_revealed") === "true";
    } catch {
      return false;
    }
  })();

  if (isAlreadyRevealed) {
    startCountdown(targetDate);
  }

  // Listener for scratch-completion event: reveals countdown smoothly
  window.addEventListener("wedding-date-revealed", (e: Event) => {
    const customEvent = e as CustomEvent<{ date?: string }>;
    const date = customEvent.detail?.date || targetDate;
    startCountdown(date);
  });
}