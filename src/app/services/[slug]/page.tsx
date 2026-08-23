import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { profile, services, serviceDetails } from "@/lib/data";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};

  return {
    title: `${service.title} — ${profile.name}`,
    description: service.description,
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  const detail = serviceDetails[slug];
  if (!service || !detail) notFound();

  const i = services.findIndex((s) => s.slug === slug);
  const prev = services[(i - 1 + services.length) % services.length];
  const next = services[(i + 1) % services.length];

  return (
    <>
      <Nav />
      <main>
        <section className="relative overflow-hidden border-b border-line px-6 pb-20 pt-36 md:px-10">
          <span
            aria-hidden
            className="pointer-events-none absolute -right-[8vw] top-1/2 -translate-y-1/2 select-none font-display text-[36vw] font-semibold leading-none text-bg-soft"
          >
            {service.index}
          </span>

          <div className="relative mx-auto max-w-4xl">
            <Link
              href="/#services"
              data-cursor-hover
              className="font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-fg"
            >
              ← All services
            </Link>

            <p className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-accent">
              Services — {service.index}/{String(services.length).padStart(2, "0")}
            </p>
            <p className="mt-4 font-mono text-sm text-accent-soft">{service.price}</p>

            <Reveal>
              <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
                {service.title}
              </h1>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-8 max-w-2xl space-y-4 text-lg text-muted sm:text-xl">
                {detail.overview.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-10 flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-line px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <a
                href={`mailto:${profile.email}?subject=${encodeURIComponent(
                  `${service.title} — let's talk`
                )}`}
                data-cursor-hover
                className="mt-10 inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3 font-mono text-xs uppercase tracking-widest text-bg transition-colors hover:bg-accent"
              >
                Get in touch
                <span aria-hidden>→</span>
              </a>
            </Reveal>
          </div>
        </section>

        {detail.requirements && (
          <section className="border-b border-line px-6 py-20 md:px-10">
            <div className="mx-auto max-w-4xl">
              <Reveal>
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
                  What I need from you
                </span>
              </Reveal>
              <div className="mt-8 divide-y divide-line border-t border-line">
                {detail.requirements.map((item, idx) => (
                  <Reveal key={item} delay={Math.min(idx * 0.05, 0.3)}>
                    <div className="flex items-start gap-6 py-5">
                      <span className="font-mono text-sm text-muted">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <p className="text-lg text-fg">{item}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {detail.deliverables && (
          <section className="border-b border-line px-6 py-20 md:px-10">
            <div className="mx-auto max-w-4xl">
              <Reveal>
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
                  What you get
                </span>
              </Reveal>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {detail.deliverables.map((item, idx) => (
                  <Reveal key={item} delay={Math.min(idx * 0.05, 0.3)}>
                    <div className="flex items-start gap-3 rounded-xl border border-line px-5 py-4">
                      <span aria-hidden className="mt-1 text-accent">
                        ✦
                      </span>
                      <p className="text-fg">{item}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {detail.process && (
          <section className="border-b border-line px-6 py-20 md:px-10">
            <div className="mx-auto max-w-4xl">
              <Reveal>
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
                  How it works
                </span>
              </Reveal>
              <div className="mt-8 border-t border-line">
                {detail.process.map((step, idx) => (
                  <Reveal key={step} delay={Math.min(idx * 0.05, 0.3)}>
                    <div className="flex items-start gap-6 border-b border-line py-6">
                      <span className="font-display text-2xl text-muted">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <p className="mt-1 text-lg text-fg">{step}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="border-b border-line px-6 py-20 md:px-10">
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
                Pricing
              </span>
            </Reveal>

            <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
              {detail.pricing.map((tier, idx) => (
                <Reveal key={tier.label} delay={Math.min(idx * 0.06, 0.3)} className="h-full">
                  <div className="flex h-full flex-col gap-3 bg-bg p-8">
                    <span className="font-mono text-xs uppercase tracking-widest text-muted">
                      {tier.label}
                    </span>
                    <span className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                      {tier.price}
                    </span>
                    {tier.description && (
                      <p className="text-muted">{tier.description}</p>
                    )}
                    {tier.bullets && tier.bullets.length > 0 && (
                      <ul className="mt-2 space-y-1.5">
                        {tier.bullets.map((b) => (
                          <li
                            key={b}
                            className="flex items-start gap-2 text-sm text-muted"
                          >
                            <span aria-hidden className="mt-1 text-accent">
                              ✦
                            </span>
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>

            {detail.note && (
              <Reveal delay={0.2}>
                <p className="mt-8 max-w-2xl font-mono text-sm text-muted">
                  <span className="text-accent">Good to know — </span>
                  {detail.note}
                </p>
              </Reveal>
            )}
          </div>
        </section>

        <section className="px-6 py-14 md:px-10">
          <div className="mx-auto flex max-w-4xl flex-col gap-6 font-mono text-xs uppercase tracking-widest sm:flex-row sm:items-center sm:justify-between">
            <Link
              href={`/services/${prev.slug}`}
              data-cursor-hover
              className="text-muted transition-colors hover:text-fg"
            >
              ← {prev.title}
            </Link>
            <Link
              href={`/services/${next.slug}`}
              data-cursor-hover
              className="text-muted transition-colors hover:text-fg"
            >
              {next.title} →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
