// Scratch to Reveal & Save-the-Date Calendar Generator

export function initScratchCard() {
  const container = document.getElementById("scratch-card-container");
  const canvas = document.getElementById("scratch-canvas") as HTMLCanvasElement | null;
  const instructionPill = document.getElementById("scratch-instruction-pill");
  const accessibleBtn = document.getElementById("reveal-date-accessible-btn");
  const saveDateContainer = document.getElementById("save-date-action-container");
  const saveDateBtn = document.getElementById("save-the-date-btn");

  if (!canvas || !container) return;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return;

  let isDrawing = false;
  let isRevealed = false;
  let totalHeartPixels = 0;
  let scratchedPixels = 0;
  let moveCounter = 0;

  // Dynamic responsive canvas dimensions matching the heart container
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let displayWidth = 340;
  let displayHeight = 320;

  // Session check: ensure countdown and reveal persist within session if completed
  const isAlreadyRevealed = (() => {
    try {
      return sessionStorage.getItem("wedding_scratch_revealed") === "true";
    } catch {
      return false;
    }
  })();

  function completeReveal(immediate: boolean = false) {
    if (isRevealed) return;
    isRevealed = true;
    container.setAttribute("data-revealed", "true");

    try {
      sessionStorage.setItem("wedding_scratch_revealed", "true");
    } catch {}

    if (canvas) {
      if (immediate) {
        canvas.style.display = "none";
      } else {
        canvas.style.transition = "opacity 0.8s ease, transform 0.8s ease";
        canvas.style.opacity = "0";
        canvas.style.transform = "scale(1.05)";
        canvas.style.pointerEvents = "none";
      }
    }

    if (instructionPill) {
      instructionPill.style.display = "none";
    }

    if (accessibleBtn) {
      accessibleBtn.style.display = "none";
    }

    // Display Save the Date action button with smooth entrance
    if (saveDateContainer) {
      saveDateContainer.style.display = "block";
      if (immediate) {
        saveDateContainer.style.opacity = "1";
        saveDateContainer.style.transform = "translateY(0)";
      } else {
        saveDateContainer.style.opacity = "0";
        saveDateContainer.style.transition = "opacity 0.8s ease, transform 0.8s ease";
        saveDateContainer.style.transform = "translateY(12px)";
        setTimeout(() => {
          saveDateContainer.style.opacity = "1";
          saveDateContainer.style.transform = "translateY(0)";
        }, 50);
      }
    }

    // DISPATCH CRITICAL EVENT TO WAKE UP LIVE WEDDING COUNTDOWN (4:00 PM IST)
    console.log("Date successfully revealed! Dispatching 'wedding-date-revealed' event...");
    window.dispatchEvent(new CustomEvent("wedding-date-revealed", {
      detail: {
        date: "2026-12-29T16:00:00+05:30",
        formatted: "Tuesday, 29 December 2026"
      }
    }));
  }

  if (isAlreadyRevealed) {
    completeReveal(true);
    return;
  }

  function resizeCanvas() {
    if (!canvas || !container) return;
    const rect = container.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      displayWidth = Math.round(rect.width);
      displayHeight = Math.round(rect.height);
    } else {
      displayWidth = Math.min(Math.round(window.innerWidth * 0.82), 380);
      displayHeight = Math.round(displayWidth * (320 / 340));
    }

    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // Draw heart path matching the SVG clip-path exactly (0..1 normalized curve scaled to w x h)
  function drawHeartPath(context: CanvasRenderingContext2D, w: number, h: number) {
    context.beginPath();
    context.moveTo(w * 0.5, h * 0.16);
    // top-left lobe
    context.bezierCurveTo(w * 0.5, h * 0.05, w * 0.35, 0, w * 0.24, 0);
    context.bezierCurveTo(w * 0.10, 0, 0, h * 0.12, 0, h * 0.28);
    // left edge to bottom tip
    context.bezierCurveTo(0, h * 0.52, w * 0.33, h * 0.74, w * 0.5, h * 0.98);
    // bottom tip to right edge
    context.bezierCurveTo(w * 0.67, h * 0.74, w * 1.0, h * 0.52, w * 1.0, h * 0.28);
    // top-right lobe back to center
    context.bezierCurveTo(w * 1.0, h * 0.12, w * 0.90, 0, w * 0.76, 0);
    context.bezierCurveTo(w * 0.65, 0, w * 0.5, h * 0.05, w * 0.5, h * 0.16);
    context.closePath();
  }

  // Paint initial sage-green glitter coating with gold speckles
  function paintCoating() {
    if (!ctx) return;
    resizeCanvas();
    ctx.save();
    
    // Clip to heart shape
    drawHeartPath(ctx, displayWidth, displayHeight);
    ctx.clip();

    // Sage green base gradient
    const grad = ctx.createLinearGradient(0, 0, displayWidth, displayHeight);
    grad.addColorStop(0, "#6E8B76");
    grad.addColorStop(0.35, "#526E5A");
    grad.addColorStop(0.7, "#425C4B");
    grad.addColorStop(1, "#364E3E");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, displayWidth, displayHeight);

    // Subtle metallic sheen diagonal bands
    ctx.fillStyle = "rgba(235, 214, 168, 0.22)";
    for (let x = -displayWidth; x < displayWidth * 2; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 25, 0);
      ctx.lineTo(x + displayHeight + 25, displayHeight);
      ctx.lineTo(x + displayHeight, displayHeight);
      ctx.fill();
    }

    // Gold glitter speckles
    for (let i = 0; i < 450; i++) {
      const sx = Math.random() * displayWidth;
      const sy = Math.random() * displayHeight;
      const sr = Math.random() * 1.8 + 0.4;
      const alpha = Math.random() * 0.75 + 0.25;
      ctx.fillStyle = i % 2 === 0 ? `rgba(255, 223, 128, ${alpha})` : `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Outer heart gold rim border
    ctx.strokeStyle = "rgba(212, 175, 55, 0.85)";
    ctx.lineWidth = 3.5;
    drawHeartPath(ctx, displayWidth, displayHeight);
    ctx.stroke();

    ctx.restore();

    // Count initial solid heart pixels for threshold calculation
    calculateInitialHeartArea();
  }

  function calculateInitialHeartArea() {
    if (!ctx || !canvas) return;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    totalHeartPixels = 0;
    for (let i = 3; i < imgData.length; i += 16) { // sample every 4th pixel
      if (imgData[i] > 100) {
        totalHeartPixels++;
      }
    }
  }

  function checkScratchPercentage() {
    if (isRevealed || !ctx || !canvas || totalHeartPixels === 0) return;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let solidPixels = 0;
    for (let i = 3; i < imgData.length; i += 16) {
      if (imgData[i] > 80) {
        solidPixels++;
      }
    }
    const percentCleared = 1 - solidPixels / totalHeartPixels;

    // Trigger reveal when user has scratched 40% of the heart
    if (percentCleared >= 0.40) {
      completeReveal(false);
    }
  }

  function eraseCircle(x: number, y: number) {
    if (!ctx) return;
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    
    // Smooth scratch brush scaled with display width
    const brushRadius = Math.max(26, Math.round(displayWidth * 0.085));
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.beginPath();
    ctx.arc(x, y, brushRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function getCanvasCoords(e: PointerEvent): { x: number; y: number } {
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  function onPointerDown(e: PointerEvent) {
    if (isRevealed) return;
    isDrawing = true;
    try {
      canvas?.setPointerCapture(e.pointerId);
    } catch {}
    if (instructionPill) {
      instructionPill.style.opacity = "0";
      instructionPill.style.pointerEvents = "none";
    }
    const coords = getCanvasCoords(e);
    eraseCircle(coords.x, coords.y);
  }

  function onPointerMove(e: PointerEvent) {
    if (!isDrawing || isRevealed) return;
    const coords = getCanvasCoords(e);
    eraseCircle(coords.x, coords.y);
    moveCounter++;
    if (moveCounter % 6 === 0) {
      checkScratchPercentage();
    }
  }

  function onPointerUp(e: PointerEvent) {
    if (!isDrawing) return;
    isDrawing = false;
    try {
      canvas?.releasePointerCapture(e.pointerId);
    } catch {}
    checkScratchPercentage();
  }

  // Pointer Events Registration
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);

  // Accessible Fallback Button (if present in DOM)
  if (accessibleBtn) {
    accessibleBtn.addEventListener("click", () => {
      completeReveal(false);
    });
  }

  // PART 4: SAVE THE DATE CALENDAR (.ICS) FILE GENERATION
  if (saveDateBtn) {
    saveDateBtn.addEventListener("click", () => {
      downloadCalendarIcs();
    });
  }

  function downloadCalendarIcs() {
    const venueName = saveDateBtn?.getAttribute("data-venue") || "Baptist Church Sanathnagar";
    const venueAddress = saveDateBtn?.getAttribute("data-address") || "Bungalow No. 17, Street No. 3, Czech Colony, Sanathnagar, Hyderabad, Telangana 500018, India";
    
    // Construct valid RFC 5545 iCalendar content
    // Confirmed wedding ceremony start time: 4:00 PM IST (Asia/Kolkata)
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Jony & Sunny Wedding//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "UID:wedding-ceremony-jony-sunny-20261229@jony-wedding",
      "DTSTAMP:20261111T120000Z",
      "DTSTART;TZID=Asia/Kolkata:20261229T160000",
      "SUMMARY:Wedding Ceremony: Jony & Sunny",
      `DESCRIPTION:The Holy Wedding Ceremony of Jony and Sunny.\\n\\nTime: 4:00 PM onwards (Asia/Kolkata)\\nVenue: ${venueName}\\nAddress: ${venueAddress}\\n\\nNote: Reception & dinner will take place at 9 CONVENTION HALL immediately after ceremony.`,
      `LOCATION:${venueName}, ${venueAddress}`,
      "STATUS:CONFIRMED",
      "SEQUENCE:0",
      "BEGIN:VALARM",
      "TRIGGER:-P1D",
      "ACTION:DISPLAY",
      "DESCRIPTION:Reminder: Wedding Ceremony of Jony & Sunny tomorrow at 4:00 PM!",
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "wedding-jony-and-sunny.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  // Paint the initial coating
  paintCoating();
}