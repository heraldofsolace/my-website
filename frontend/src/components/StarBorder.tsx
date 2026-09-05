// Adapted from React Bits' StarBorder (https://reactbits.dev). No "use
// client" here on purpose — nothing in this component uses state, refs, or
// browser APIs (it's just two CSS-animated gradient blobs), so it can stay
// a server component and only whatever renders it needs to be client-side.
//
// Two real changes from upstream:
//  - The inner surface's padding (`py-[16px] px-[26px]`, `rounded-[20px]`)
//    was sized for a standalone hero CTA. This site's one use of it
//    (PersonaToggle, a compact nav pill) needs to stay small — padding is
//    now a `thickness`-independent prop instead of hardcoded, and the
//    corner radius is `rounded-full` so it reads as a true pill capsule at
//    any height instead of a fixed 20px radius.
//  - Upstream's keyframes ship as a tailwind.config.js snippet; this
//    project is Tailwind v4 (CSS-first config, no JS config file), so
//    they're plain `@keyframes` + utility classes in globals.css instead
//    — same pattern already used there for the marquee animation.
import type { ComponentPropsWithoutRef, CSSProperties, ElementType, ReactNode } from "react";

type StarBorderProps<T extends ElementType> = ComponentPropsWithoutRef<T> & {
  as?: T;
  className?: string;
  children?: ReactNode;
  color?: string;
  speed?: CSSProperties["animationDuration"];
  thickness?: number;
  padding?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
};

export default function StarBorder<T extends ElementType = "button">({
  as,
  className = "",
  color = "white",
  speed = "6s",
  thickness = 1,
  padding = "0.375rem 0.75rem",
  backgroundColor = "#000000",
  textColor = "#ffffff",
  borderColor = "#222222",
  children,
  ...rest
}: StarBorderProps<T>) {
  const Component = as || "button";
  // `rest`'s own `style` (if the caller passed one) needs merging with the
  // thickness-derived padding below rather than being overwritten by it —
  // pulled out here so the spread below doesn't also re-apply a stale one.
  const { style: restStyle, ...otherRest } = rest as { style?: CSSProperties };

  return (
    <Component
      className={`relative inline-block overflow-hidden rounded-full ${className}`}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- rest is a generic polymorphic-`as` spread; typing it precisely would need a much heavier ComponentPropsWithRef<T> dance for no real safety gain here.
      {...(otherRest as any)}
      style={{
        padding: `${thickness}px 0`,
        ...restStyle,
      }}
    >
      <div
        className="absolute bottom-[-11px] right-[-250%] z-0 h-[50%] w-[300%] animate-star-movement-bottom rounded-full opacity-70"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div
        className="absolute left-[-250%] top-[-10px] z-0 h-[50%] w-[300%] animate-star-movement-top rounded-full opacity-70"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div
        className="relative z-[1] rounded-full border text-center text-[16px]"
        style={{ padding, background: backgroundColor, color: textColor, borderColor }}
      >
        {children}
      </div>
    </Component>
  );
}
