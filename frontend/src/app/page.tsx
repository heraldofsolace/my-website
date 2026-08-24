import HomeSections from "@/components/HomeSections";
import PersonJsonLd from "@/components/PersonJsonLd";

export default function Home() {
  return (
    <>
      <PersonJsonLd persona="devrel" />
      <HomeSections />
    </>
  );
}
