import { Suspense } from "react";
import { SmoothScroll } from "@/lib/scroll";
import Navigation from "./Navigation";
import Hero from "./hero/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Work from "./sections/Work";
import Certifications from "./sections/Certifications";
import Experience from "./sections/Experience";
import Achievements from "./sections/Achievements";
import Contact, { SiteFooter } from "./sections/Contact";
import RevealObserver from "./ui/RevealObserver";

/**
 * Each section sits in its own Suspense boundary so React hydrates them as
 * separate, interruptible tasks instead of one long main-thread block.
 */
const Island = ({ children }: { children: React.ReactNode }) => <Suspense fallback={null}>{children}</Suspense>;

export default function App() {
  return (
    <SmoothScroll>
      <a href="#main" className="sr-only-focusable btn btn-primary btn-sm fixed left-4 top-4 z-[80]">
        Skip to content
      </a>
      <Island>
        <Navigation />
      </Island>
      <main id="main">
        <Island>
          <Hero />
        </Island>
        <Island>
          <About />
        </Island>
        <Island>
          <Skills />
        </Island>
        <Island>
          <Work />
        </Island>
        <Certifications />
        <Island>
          <Experience />
        </Island>
        <Island>
          <Achievements />
        </Island>
        <Island>
          <Contact />
        </Island>
      </main>
      <SiteFooter />
      <RevealObserver />
    </SmoothScroll>
  );
}
