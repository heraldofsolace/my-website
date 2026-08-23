import { Reveal } from "./Reveal";

export default function Statement() {
  return (
    <section className="flex min-h-[100svh] items-center border-t border-line px-6 py-24 md:px-10">
      <Reveal className="mx-auto max-w-6xl">
        <p className="font-display text-[7vw] font-medium leading-[1.15] tracking-tight text-fg sm:text-[5vw] lg:text-[3.6vw]">
          I&apos;m a{" "}
          <span className="text-accent-soft">
            Software Developer and Developer Advocate
          </span>
          . I specialize in Full Stack Web Development using{" "}
          <span className="text-accent-soft">
            Next.js and Ruby on Rails
          </span>
          . I help companies produce technically solid content that
          resonates with developers.
        </p>
      </Reveal>
    </section>
  );
}
