import Hero from "@/components/Hero";
import Publications from "@/components/Publications";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Education from "@/components/Education";
import Milestones from "@/components/Milestones";
import Contact from "@/components/Contact";
import Deck from "@/components/Deck";

export default function Home() {
  return (
    <main id="top">
      <Deck>
        <Hero />
        <About />
        <Experience />
        <Publications />
        <Projects />
        <Skills />
        <Education />
        <Milestones />
        <Contact />
      </Deck>
    </main>
  );
}
