import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import BlocksContent from "@/components/BlocksContent";
import { profile } from "@/lib/data";
import { getServices, getServiceBySlug, type ServicePricingData } from "@/lib/strapi";

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};

  const title = `${service.name} — ${profile.name}`;

  return {
    title,
    description: service.summary,
    alternates: {
      canonical: `/services/${slug}`,
    },
    openGraph: {
      title,
      description: service.summary,
      type: "website",
    },
    // See the blog post page's generateMetadata for why this is repeated
    // here rather than inherited from the root layout.
    twitter: {
      card: "summary_large_image",
      title,
      description: service.summary,
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [service, services] = await Promise.all([
    getServiceBySlug(slug),
    getServices(),
  ]);
  if (!service) notFound();

  const i = services.findIndex((s) => s.slug === slug);
  const index = String(i + 1).padStart(2, "0");
  const prev = services[(i - 1 + services.length) % services.length];
  const next = services[(i + 1) % services.length];
  // The relation's typed shape omits id/documentId even though the API
  // response includes them — see ServicePricingData for the accurate shape.
  const pricings = (service.service_pricings ?? []) as ServicePricingData[];

  return (
    <>
      <Nav />
      <main id="main-content">
        <section className="relative overflow-hidden border-b border-line px-6 pb-20 pt-36 md:px-10">
          <span
            aria-hidden
            className="pointer-events-none absolute -right-[8vw] top-1/2 -translate-y-1/2 select-none font-display text-[36vw] font-semibold leading-none text-bg-soft"
          >
            {index}
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
              Services — {index}/{String(services.length).padStart(2, "0")}
            </p>
            <p className="mt-4 font-mono text-sm text-accent-soft">
              {service.starting_price}
            </p>

            <Reveal>
              <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
                {service.name}
              </h1>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-8 max-w-2xl text-lg text-muted sm:text-xl">
                {service.summary}
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <a
                href={`mailto:${profile.email}?subject=${encodeURIComponent(
                  `${service.name} — let's talk`
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

        {service.description && service.description.length > 0 && (
          <section className="border-b border-line px-6 py-20 md:px-10">
            <div className="mx-auto max-w-4xl">
              <Reveal>
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
                  Overview
                </span>
              </Reveal>
              <div className="mt-8">
                <BlocksContent content={service.description} />
              </div>
            </div>
          </section>
        )}

        {pricings.length > 0 && (
          <section className="border-b border-line px-6 py-20 md:px-10">
            <div className="mx-auto max-w-4xl">
              <Reveal>
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
                  Pricing
                </span>
              </Reveal>

              <div
                className={`mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line ${
                  pricings.length > 1 ? "sm:grid-cols-2" : ""
                }`}
              >
                {pricings.map((tier, idx) => (
                  <Reveal
                    key={tier.documentId}
                    delay={Math.min(idx * 0.06, 0.3)}
                    className="h-full"
                  >
                    <div className="flex h-full flex-col gap-3 bg-bg p-8">
                      <span className="font-mono text-xs uppercase tracking-widest text-muted">
                        {tier.name}
                      </span>
                      <span className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                        {tier.price}
                      </span>
                      {tier.details && tier.details.length > 0 && (
                        <div className="mt-2 text-sm">
                          <BlocksContent content={tier.details} />
                        </div>
                      )}
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="px-6 py-14 md:px-10">
          <div className="mx-auto flex max-w-4xl flex-col gap-6 font-mono text-xs uppercase tracking-widest sm:flex-row sm:items-center sm:justify-between">
            <Link
              href={`/services/${prev.slug}`}
              data-cursor-hover
              className="text-muted transition-colors hover:text-fg"
            >
              ← {prev.name}
            </Link>
            <Link
              href={`/services/${next.slug}`}
              data-cursor-hover
              className="text-muted transition-colors hover:text-fg"
            >
              {next.name} →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
