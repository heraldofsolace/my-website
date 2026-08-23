"use client";

import { useEffect, useRef } from "react";

// Density ramp, sparse → dense.
const CHARS = " .:-=+*#%@";

/**
 * Animated ASCII noise field rendered on canvas. Reused by the standalone
 * ASCII section (with a center clearing for the overlaid headline) and the
 * Services panels (full-bleed, no clearing — panels add their own scrim).
 */
export default function AsciiField({
  className,
  clearCenter = false,
  glowRgb = "255, 178, 122", // rgb of --accent-soft; canvas can't read CSS vars
}: {
  className?: string;
  clearCenter?: boolean;
  glowRgb?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let cellSize = 16;
    let cols = 0;
    let rows = 0;
    const pointer = { x: -9999, y: -9999, active: false };

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cellSize = rect.width < 640 ? 13 : 17;
      cols = Math.ceil(rect.width / cellSize);
      rows = Math.ceil(rect.height / cellSize);
      canvas!.width = cols * cellSize * dpr;
      canvas!.height = rows * cellSize * dpr;
      canvas!.style.width = `${rect.width}px`;
      canvas!.style.height = `${rect.height}px`;

      // Resolve the actual font stack next/font generated (CSS vars don't
      // work inside canvas' `font` property) via the element's own computed style.
      const family = getComputedStyle(canvas!).fontFamily;
      ctx!.font = `${cellSize * dpr * 0.8}px ${family}`;
      ctx!.textBaseline = "top";
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    function onPointerMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      pointer.x = (e.clientX - rect.left) / cellSize;
      pointer.y = (e.clientY - rect.top) / cellSize;
      pointer.active = true;
    }
    function onPointerLeave() {
      pointer.active = false;
    }
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);

    let raf = 0;
    let t = 0;
    let last = 0;
    let visible = true;
    const frameInterval = 1000 / 30; // calmer, cheaper than 60fps

    function smoothstep(edge0: number, edge1: number, x: number) {
      const t2 = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
      return t2 * t2 * (3 - 2 * t2);
    }

    function draw() {
      const step = cellSize * dpr;
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      // Elliptical clearing at dead-center so overlaid centered content
      // reads cleanly against the field instead of fighting it.
      const clearRadiusX = Math.max(cols * 0.3, 10);
      const clearRadiusY = Math.max(rows * 0.24, 6);
      const cx = cols / 2;
      const cy = rows / 2;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let v =
            0.5 +
            0.5 *
              ((Math.sin(x * 0.15 + t * 0.6) * Math.cos(y * 0.15 - t * 0.4) +
                Math.sin((x + y) * 0.08 - t * 0.8) +
                Math.cos((x - y) * 0.1 + t * 0.5)) /
                3);

          if (pointer.active) {
            const dx = x - pointer.x;
            const dy = y - pointer.y;
            v += Math.exp(-(dx * dx + dy * dy) / 60) * 0.9;
          }

          if (clearCenter) {
            const edx = (x - cx) / clearRadiusX;
            const edy = (y - cy) / clearRadiusY;
            v *= smoothstep(0.55, 1.15, Math.sqrt(edx * edx + edy * edy));
          }

          v = Math.max(0, Math.min(1, v));
          if (v < 0.1) continue;

          const ch = CHARS[Math.min(CHARS.length - 1, Math.floor(v * CHARS.length))];
          if (ch === " ") continue;

          ctx!.fillStyle = `rgba(${glowRgb}, ${Math.min(0.85, v).toFixed(2)})`;
          ctx!.fillText(ch, x * step, y * step);
        }
      }
    }

    function frame(now: number) {
      if (!visible) {
        raf = 0; // let the IntersectionObserver callback restart the loop
        return;
      }
      raf = requestAnimationFrame(frame);
      if (now - last < frameInterval) return;
      last = now;
      draw();
      if (!reduceMotion) t += 0.02;
    }

    // Only animate while actually on screen. Several of these canvases can
    // be mounted at once (the standalone section + multiple Services
    // panels), and redrawing a full character grid on all of them
    // unconditionally tanks the frame rate site-wide — including on
    // sections nowhere near a canvas, since main-thread work is global.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !raf) {
          last = 0;
          raf = requestAnimationFrame(frame);
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(canvas);

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [clearCenter, glowRgb]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`font-mono ${className ?? ""}`}
    />
  );
}
