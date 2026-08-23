import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Statement from "@/components/Statement";
import Work from "@/components/Work";
import AsciiArt from "@/components/AsciiArt";
import About from "@/components/About";
import Services from "@/components/Services";
import Clients from "@/components/Clients";
import Writing from "@/components/Writing";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Statement />
        <Work />
        <AsciiArt />
        <About />
        <Services />
        <Clients />
        <Writing />
      </main>
      <Footer />
    </>
  );
}
