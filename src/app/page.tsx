import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import PracticeAreas from "@/components/PracticeAreas";
import Team from "@/components/Team";
import News from "@/components/News";
import Locations from "@/components/Locations";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <Navbar />
      <main className="w-full">
        <Hero />
        <About />
        <PracticeAreas />
        <Team />
        <News />
        <Locations />
      </main>
      <Footer />
    </div>
  );
}
