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

export default async function Home() {
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
      <main>
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
