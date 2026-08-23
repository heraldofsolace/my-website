import { Reveal, RevealWords } from "./Reveal";
import Counter from "./Counter";
import { stats } from "@/lib/data";

export default function About() {
  return (
    <section
      id="about"
      className="border-t border-line px-6 py-28 md:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
          About
        </span>

        <h2 className="mt-6 max-w-4xl font-display text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
          <RevealWords text="Reach your developer audience with" />{" "}
          <span className="text-accent-soft">
            <RevealWords text="confidence." delay={0.3} />
          </span>
        </h2>

        <Reveal delay={0.15}>
          <p className="mt-8 max-w-2xl text-lg text-muted">
            Speaking to developers isn&apos;t easy — they value quality over
            buzzwords and can see right through marketing speak. I bridge that
            gap: five years as a developer, three years in developer relations,
            and a habit of shipping content that reads like it was written by
            someone who&apos;s actually shipped code.
          </p>
        </Reveal>

        <div className="mt-20 grid grid-cols-2 gap-x-8 gap-y-12 border-t border-line pt-12 md:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08}>
              <p className="font-display text-5xl font-semibold tracking-tight text-fg sm:text-6xl">
                <Counter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-3 font-mono text-xs uppercase tracking-widest text-muted">
                {stat.label}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
