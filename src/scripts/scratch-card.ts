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

  // Dynamic responsive canvas dimensions matching the heart container
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let displayWidth = 340;
  let displayHeight = 320;

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
      if (imgData[i] > 100) {
        solidPixels++;
      }
    }
    const percentCleared = 1 - solidPixels / totalHeartPixels;

    // Trigger reveal when approximately 60% scratched
    if (percentCleared >= 0.58) {
      completeReveal();
    }
  }

  function eraseCircle(x: number, y: number) {
    if (!ctx) return;
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    
    // Soft circular scratch brush scaled with display width
    const brushRadius = Math.max(22, Math.round(displayWidth * 0.075));
    const radialGrad = ctx.createRadialGradient(x, y, brushRadius * 0.4, x, y, brushRadius);
    radialGrad.addColorStop(0, "rgba(0,0,0,1)");
    radialGrad.addColorStop(1, "rgba(0,0,0,0.85)");
    
    ctx.fillStyle = radialGrad;
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
    canvas?.setPointerCapture(e.pointerId);
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

  function completeReveal() {
    if (isRevealed) return;
    isRevealed = true;
    container.setAttribute("data-revealed", "true");

    // Fade out canvas coating smoothly
    canvas.style.transition = "opacity 0.8s ease, transform 0.8s ease";
    canvas.style.opacity = "0";
    canvas.style.transform = "scale(1.05)";
    canvas.style.pointerEvents = "none";

    if (instructionPill) {
      instructionPill.style.display = "none";
    }

    if (accessibleBtn) {
      accessibleBtn.style.display = "none";
    }

    // Display Save the Date action button with smooth entrance
    if (saveDateContainer) {
      saveDateContainer.style.display = "block";
      saveDateContainer.style.opacity = "0";
      saveDateContainer.style.transition = "opacity 0.8s ease, transform 0.8s ease";
      saveDateContainer.style.transform = "translateY(12px)";
      setTimeout(() => {
        saveDateContainer.style.opacity = "1";
        saveDateContainer.style.transform = "translateY(0)";
      }, 50);
    }

    // DISPATCH CRITICAL EVENT TO WAKE UP LIVE WEDDING COUNTDOWN
    console.log("Date successfully revealed! Dispatching 'wedding-date-revealed' event...");
    window.dispatchEvent(new CustomEvent("wedding-date-revealed", {
      detail: {
        date: "2026-12-29T00:00:00+05:30",
        formatted: "Tuesday, December 29, 2026"
      }
    }));
  }

  // Accessible Fallback Button
  if (accessibleBtn) {
    accessibleBtn.addEventListener("click", () => {
      completeReveal();
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
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Jony & Sunny Wedding//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "UID:wedding-jony-sunny-20261229@jony-wedding",
      "DTSTAMP:20261111T120000Z",
      "DTSTART;TZID=Asia/Kolkata:20261229T103000",
      "DTEND;TZID=Asia/Kolkata:20261229T230000",
      "SUMMARY:Wedding of Jony & Sunny",
      `DESCRIPTION:Join us in celebrating the holy wedding ceremony and grand reception of Jony and Sunny.\\n\\nVenue: ${venueName}\\nAddress: ${venueAddress}`,
      `LOCATION:${venueName}, ${venueAddress}`,
      "STATUS:CONFIRMED",
      "SEQUENCE:0",
      "BEGIN:VALARM",
      "TRIGGER:-P1D",
      "ACTION:DISPLAY",
      "DESCRIPTION:Reminder: Wedding of Jony & Sunny tomorrow!",
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