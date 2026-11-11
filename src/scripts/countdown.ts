export function initCountdown(targetIsoDate: string) {
  const targetTime = new Date(targetIsoDate).getTime();
  const daysEl = document.getElementById("countdown-days");
  const hoursEl = document.getElementById("countdown-hours");
  const minsEl = document.getElementById("countdown-mins");
  const secsEl = document.getElementById("countdown-secs");
  const containerEl = document.getElementById("countdown-container");

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  function update() {
    const now = new Date().getTime();
    const distance = targetTime - now;

    if (distance <= 0) {
      if (containerEl) {
        containerEl.innerHTML = `
          <div class="paper-card" style="padding: 24px; text-align: center;">
            <p class="font-script text-rose" style="font-size: 2.5rem; margin-bottom: 8px;">Happily Married!</p>
            <p class="font-serif text-muted" style="font-size: 1.1rem;">Thank you for blessing our sacred union.</p>
          </div>
        `;
      }
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl!.textContent = String(days).padStart(2, "0");
    hoursEl!.textContent = String(hours).padStart(2, "0");
    minsEl!.textContent = String(minutes).padStart(2, "0");
    secsEl!.textContent = String(seconds).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}
