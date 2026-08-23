import { clients } from "@/lib/data";

export default function Clients() {
  return (
    <section className="border-t border-line py-16">
      <p className="mx-auto mb-10 max-w-7xl px-6 font-mono text-xs uppercase tracking-[0.3em] text-accent md:px-10">
        Companies I&apos;ve helped
      </p>

      <div className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-bg to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-bg to-transparent"
        />

        <div className="animate-marquee flex w-max gap-16 whitespace-nowrap">
          {[...clients, ...clients].map((client, i) => (
            <span
              key={i}
              className="font-display text-3xl font-medium text-muted transition-colors hover:text-fg sm:text-4xl"
            >
              {client}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
