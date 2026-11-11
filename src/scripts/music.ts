export function initMusic(audioSrc: string) {
  const audio = new Audio(audioSrc);
  audio.loop = true;
  audio.preload = "auto";

  const toggleBtn = document.getElementById("music-toggle-btn");
  const iconPlaying = document.getElementById("music-icon-playing");
  const iconMuted = document.getElementById("music-icon-muted");

  let isPlaying = false;

  function updateUI() {
    if (isPlaying) {
      toggleBtn?.classList.remove("spin-paused");
      if (iconPlaying) iconPlaying.style.display = "block";
      if (iconMuted) iconMuted.style.display = "none";
    } else {
      toggleBtn?.classList.add("spin-paused");
      if (iconPlaying) iconPlaying.style.display = "none";
      if (iconMuted) iconMuted.style.display = "block";
    }
  }

  function playAudio() {
    audio.play().then(() => {
      isPlaying = true;
      updateUI();
    }).catch(() => {
      isPlaying = false;
      updateUI();
    });
  }

  function pauseAudio() {
    audio.pause();
    isPlaying = false;
    updateUI();
  }

  toggleBtn?.addEventListener("click", () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  });

  return {
    play: playAudio,
    pause: pauseAudio
  };
}