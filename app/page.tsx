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
import Denoise from "@/components/Denoise";
import ScrollCompare from "@/components/ScrollCompare";

export default function Home() {
  return (
    <main id="top">
      <ScrollCompare
        // Four cards for the big moments (Hero, Papers, Projects, Contact); the
        // sections between them scroll normally and denoise in.
        current={
          <Deck>
            <>
              <Hero />
              <Denoise><About /></Denoise>
              <Denoise><Experience /></Denoise>
            </>
            <Publications />
            <>
              <Projects />
              <Denoise><Skills /></Denoise>
              <Denoise><Education /></Denoise>
              <Denoise><Milestones /></Denoise>
            </>
            <Contact />
          </Deck>
        }
        classic={
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
        }
      />
    </main>
  );
}
