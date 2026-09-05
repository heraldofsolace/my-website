"use client";

// Adapted from React Bits' InfiniteSpiral (https://reactbits.dev). This one
// has no animation-library dependency at all upstream — it's a plain
// requestAnimationFrame loop driving inline transforms directly, which is
// the right tool for a continuous self-driven helix (there's no framer-
// motion primitive that models "N cards orbiting forever," the way
// useSpring naturally models GridMotion's pointer-follow) — so unlike
// TextType/GridMotion/StaggeredMenu, this port keeps the original engine.
//
// Two real changes from upstream:
//  - `<img>` → next/image's `Image` (`fill`, `unoptimized` — same reason as
//    every other external-logo image in this codebase: arbitrary domains,
//    not worth adding each to next.config's remotePatterns).
//  - Added `onActiveChange`: upstream has no way to know which card is
//    currently front-and-center, but this site's call site wants to show
//    that item's name as text next to the spiral as it turns. The
//    callback fires from inside the same per-frame loop that already
//    computes each card's offset — cheapest place to find the minimum.
//    Stored in a ref rather than the effect's dependency array: the
//    parent's callback typically closes over state and gets a new
//    identity every render, and that render is itself often caused by
//    the callback firing — putting it in the deps array would tear the
//    whole rAF loop down and rebuild it on every single active-card
//    change instead of just reading the current callback each frame.
import {
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Image from "next/image";

export interface InfiniteSpiralItem {
  id?: string | number;
  src: string;
  alt?: string;
  href?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  label?: string;
}

export interface InfiniteSpiralProps {
  items?: Array<string | InfiniteSpiralItem>;
  speed?: number;
  direction?: "up" | "down";
  animationMode?: "auto" | "drag" | "scroll" | "all";
  radius?: number;
  cardWidth?: number;
  cardHeight?: number;
  verticalSpacing?: number;
  perspective?: number;
  cardsPerTurn?: number;
  rotation?: number;
  cardTilt?: number;
  cardRadius?: number;
  centerScale?: number;
  edgeFade?: number;
  edgeBlur?: number;
  pauseOnHover?: boolean;
  imageFit?: CSSProperties["objectFit"];
  grayscale?: number;
  className?: string;
  onActiveChange?: (item: NormalizedItem, index: number) => void;
}

type NormalizedItem = InfiniteSpiralItem & { alt: string };

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const modulo = (value: number, divisor: number) => ((value % divisor) + divisor) % divisor;
const smoothstep = (min: number, max: number, value: number) => {
  const x = clamp((value - min) / (max - min || 1), 0, 1);
  return x * x * (3 - 2 * x);
};

export default function InfiniteSpiral({
  items = [],
  speed = 0.55,
  direction = "up",
  animationMode = "auto",
  radius = 170,
  cardWidth = 100,
  cardHeight = 100,
  verticalSpacing = 60,
  perspective = 1000,
  cardsPerTurn = 7,
  rotation = 0,
  cardTilt = 0,
  cardRadius = 10,
  centerScale = 1.2,
  edgeFade = 0.3,
  edgeBlur = 6,
  pauseOnHover = true,
  imageFit = "cover",
  grayscale = 0,
  className = "",
  onActiveChange,
}: InfiniteSpiralProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLAnchorElement | HTMLDivElement | null>>([]);
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const autoSpeedRef = useRef(0);
  const hoveredRef = useRef(false);
  const visibleRef = useRef(true);
  const draggingRef = useRef(false);
  const lastPointerYRef = useRef(0);
  const dragMovedRef = useRef(false);
  const activeIndexRef = useRef(-1);
  const onActiveChangeRef = useRef(onActiveChange);

  useEffect(() => {
    onActiveChangeRef.current = onActiveChange;
  }, [onActiveChange]);

  const normalizedItems = useMemo<NormalizedItem[]>(
    () =>
      items.map((item, index) =>
        typeof item === "string"
          ? { src: item, alt: `Spiral image ${index + 1}` }
          : { alt: `Spiral image ${index + 1}`, ...item }
      ),
    [items]
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root || normalizedItems.length === 0) return;

    let frameId = 0;
    let previousTime = performance.now();
    let bounds = root.getBoundingClientRect();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const scrollEnabled = animationMode === "scroll" || animationMode === "all";
    const scrollSpeedMultiplier = Math.max(speed, 0) / 0.55;
    let lastScrollY = window.scrollY;
    const resizeObserver = new ResizeObserver(() => {
      bounds = root.getBoundingClientRect();
    });
    resizeObserver.observe(root);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
    });
    intersectionObserver.observe(root);

    const handleScroll = () => {
      const nextScrollY = window.scrollY;
      const scrollDelta = nextScrollY - lastScrollY;
      lastScrollY = nextScrollY;
      if (!scrollEnabled || !visibleRef.current || scrollDelta === 0) return;
      targetProgressRef.current += clamp(
        (scrollDelta * scrollSpeedMultiplier) / Math.max(verticalSpacing * 2, 1),
        -1.5,
        1.5
      );
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    const render = (time: number) => {
      const delta = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;
      const autoEnabled = animationMode === "auto" || animationMode === "all";
      const motionPaused = draggingRef.current || (pauseOnHover && hoveredRef.current);
      const directionMultiplier = direction === "down" ? -1 : 1;
      const desiredAutoSpeed =
        autoEnabled && visibleRef.current && !reducedMotion.matches && !motionPaused
          ? speed * directionMultiplier
          : 0;
      const speedBlend = 1 - Math.exp(-delta * 7);
      autoSpeedRef.current += (desiredAutoSpeed - autoSpeedRef.current) * speedBlend;
      targetProgressRef.current += autoSpeedRef.current * delta;

      const followBlend = 1 - Math.exp(-delta * (draggingRef.current ? 22 : 11));
      progressRef.current += (targetProgressRef.current - progressRef.current) * followBlend;

      const count = normalizedItems.length;
      const half = count / 2;
      const width = Math.max(bounds.width, 1);
      const height = Math.max(bounds.height, 1);
      const fit = Math.min(1, width / (cardWidth * 2.8), height / (cardHeight * 2.35));
      const responsiveRadius = Math.min(radius, Math.max(72, width * 0.36)) * fit;
      const fadeStart = clamp(1 - edgeFade, 0, 0.98);
      const turnSize = Math.max(cardsPerTurn, 1);

      let bestIndex = -1;
      let bestOffsetAbs = Infinity;

      cardRefs.current.forEach((card, index) => {
        const offset = modulo(index - progressRef.current + half, count) - half;
        const offsetAbs = Math.abs(offset);
        if (offsetAbs < bestOffsetAbs) {
          bestOffsetAbs = offsetAbs;
          bestIndex = index;
        }
        if (!card) return;
        const edge = Math.min(offsetAbs / Math.max(half, 1), 1);
        const opacity = 1 - smoothstep(fadeStart, 1, edge);
        const focus = 1 - Math.min(offsetAbs / Math.max(turnSize * 0.65, 1), 1);
        const scale = (1 + (centerScale - 1) * focus) * fit;
        const angle = offset * (360 / turnSize) + rotation;
        const angleRadians = (angle * Math.PI) / 180;
        const x = Math.sin(angleRadians) * responsiveRadius;
        const z = Math.cos(angleRadians) * responsiveRadius;
        const depthScale = clamp(perspective / Math.max(perspective - z, 1), 0.72, 1.45);
        const visualScale = scale * depthScale;
        const depth = (z / Math.max(responsiveRadius, 1) + 1) / 2;
        const blur = edgeBlur * smoothstep(0.35, 1, edge);
        card.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${offset * verticalSpacing * fit}px, 0) rotateZ(${cardTilt}deg) scale(${visualScale})`;
        card.style.opacity = opacity.toFixed(3);
        card.style.filter = blur > 0.01 ? `blur(${blur.toFixed(2)}px)` : "none";
        card.style.zIndex = String(Math.round(depth * 100000) + index);
        card.style.pointerEvents = opacity > 0.25 ? "auto" : "none";
      });

      if (bestIndex !== -1 && bestIndex !== activeIndexRef.current) {
        activeIndexRef.current = bestIndex;
        onActiveChangeRef.current?.(normalizedItems[bestIndex], bestIndex);
      }

      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [
    normalizedItems,
    speed,
    direction,
    animationMode,
    radius,
    perspective,
    cardWidth,
    cardHeight,
    verticalSpacing,
    cardsPerTurn,
    rotation,
    cardTilt,
    centerScale,
    edgeFade,
    edgeBlur,
    pauseOnHover,
  ]);

  const rootStyle = {
    perspective: `${perspective}px`,
    "--spiral-width": `${cardWidth}px`,
    "--spiral-height": `${cardHeight}px`,
    "--spiral-radius": `${cardRadius}px`,
    cursor: animationMode === "drag" || animationMode === "all" ? "grab" : "default",
    touchAction: animationMode === "drag" || animationMode === "all" ? "pan-x" : "auto",
    userSelect: animationMode === "drag" || animationMode === "all" ? "none" : "auto",
  } as CSSProperties;

  const dragEnabled = animationMode === "drag" || animationMode === "all";

  const stopDragging = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    event.currentTarget.style.cursor = dragEnabled ? "grab" : "default";
  };

  const setCardRef = (index: number) => (node: HTMLAnchorElement | HTMLDivElement | null) => {
    cardRefs.current[index] = node;
  };

  const cardStyle: CSSProperties = { width: cardWidth, height: cardHeight, borderRadius: cardRadius };

  // Dark-theme card chrome (bg-soft/line tokens) in place of upstream's
  // white/10-on-white/25, which assumed a light or photo-heavy background —
  // plus an inset padded wrapper around the image (upstream's fills the
  // card edge-to-edge) since this site's items are small logo marks, not
  // full-bleed photography, and want breathing room inside each card.
  const itemClassName =
    "absolute left-1/2 top-1/2 block h-[var(--spiral-height)] w-[var(--spiral-width)] overflow-hidden rounded-[var(--spiral-radius)] border border-line bg-bg-soft shadow-[0_14px_38px_rgba(0,0,0,0.4)] [backface-visibility:hidden] [transform-style:preserve-3d] [will-change:transform,opacity,filter] motion-reduce:transition-none";

  return (
    <div
      ref={rootRef}
      className={`relative isolate h-full min-h-80 w-full overflow-hidden ${className}`}
      style={rootStyle}
      onMouseEnter={() => {
        hoveredRef.current = true;
      }}
      onMouseLeave={() => {
        hoveredRef.current = false;
      }}
      onPointerDown={(event) => {
        if (!dragEnabled || event.button !== 0) return;
        draggingRef.current = true;
        dragMovedRef.current = false;
        lastPointerYRef.current = event.clientY;
        targetProgressRef.current = progressRef.current;
        event.currentTarget.setPointerCapture(event.pointerId);
        event.currentTarget.style.cursor = "grabbing";
      }}
      onPointerMove={(event) => {
        if (!draggingRef.current) return;
        const pointerDelta = event.clientY - lastPointerYRef.current;
        lastPointerYRef.current = event.clientY;
        if (Math.abs(pointerDelta) > 0.5) dragMovedRef.current = true;
        targetProgressRef.current -= pointerDelta / Math.max(verticalSpacing, 1);
      }}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      onClickCapture={(event) => {
        if (!dragMovedRef.current) return;
        event.preventDefault();
        event.stopPropagation();
        dragMovedRef.current = false;
      }}
    >
      <div className="absolute inset-0 [transform-style:preserve-3d]" role="list" aria-label="Infinite spiral gallery">
        {normalizedItems.map((item, index) => {
          const content = (
            <span className="absolute inset-[12%] block">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                unoptimized
                sizes={`${cardWidth}px`}
                loading={index < 6 ? "eager" : "lazy"}
                draggable={false}
                className="select-none"
                style={{ objectFit: imageFit, filter: `grayscale(${Math.min(1, Math.max(0, grayscale))})` }}
              />
            </span>
          );

          return item.href ? (
            <a
              key={item.id ?? `${item.src}-${index}`}
              ref={setCardRef(index)}
              className={itemClassName}
              style={cardStyle}
              href={item.href}
              target={item.target}
              rel={item.target === "_blank" ? "noreferrer" : undefined}
              role="listitem"
              aria-label={item.label ?? item.alt}
            >
              {content}
            </a>
          ) : (
            <div
              key={item.id ?? `${item.src}-${index}`}
              ref={setCardRef(index)}
              className={itemClassName}
              style={cardStyle}
              role="listitem"
              aria-label={item.label ?? item.alt}
            >
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
