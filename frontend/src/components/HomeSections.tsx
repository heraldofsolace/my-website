import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Statement from "@/components/Statement";
import Work from "@/components/Work";
import AsciiArt from "@/components/AsciiArt";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Services from "@/components/Services";
import Clients from "@/components/Clients";
import Testimonials from "@/components/Testimonials";
import Writing, { type GalleryPhoto } from "@/components/Writing";
import Footer from "@/components/Footer";
import {
  getServices,
  getLatestPosts,
  getWorkItems,
  getAstrophotos,
  strapiMediaUrl,
} from "@/lib/strapi";

/**
 * The shared homepage body — rendered at both `/` (devrel, the primary
 * persona) and `/math` (the mathematician/astrophotographer persona, kept
 * at its own URL so it's actually indexable — see app/math/page.tsx).
 * Which persona is displayed is a client-side toggle (PersonaProvider);
 * this just fetches the data both need.
 */
export default async function HomeSections() {
  const [services, posts, workItems, astrophotos] = await Promise.all([
    getServices(),
    getLatestPosts(4),
    getWorkItems(),
    getAstrophotos(),
  ]);

  // Resolve media URLs here (server-side) rather than in the "use client"
  // Writing component — STRAPI_URL isn't inlined into the client bundle,
  // so strapiMediaUrl() would resolve relative Strapi upload paths wrong.
  const galleryPhotos: GalleryPhoto[] = astrophotos
    .filter((photo) => photo.image?.url)
    .map((photo) => {
      const image = photo.image!;
      return {
        documentId: photo.documentId,
        src: strapiMediaUrl(
          image.formats?.large?.url ?? image.formats?.medium?.url ?? image.url
        ),
        alt: photo.Object ?? "Astrophotography shot",
        caption: [photo.Object, photo.Location].filter(Boolean).join(" · "),
        date: photo.Date,
      };
    });

  return (
    <>
      <Nav />
      <main id="main-content">
        <Hero />
        <Statement />
        <Work items={workItems} />
        <AsciiArt />
        <About />
        <Experience />
        <Services services={services} />
        <Clients />
        <Testimonials />
        <Writing posts={posts} astrophotos={galleryPhotos} />
      </main>
      <Footer />
    </>
  );
}
