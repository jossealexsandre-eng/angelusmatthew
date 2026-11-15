import { ThemeProvider } from "./context/ThemeContext.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Skills from "./components/Skills.jsx";
import Projects from "./components/Projects.jsx";
import Experience from "./components/Experience.jsx";
import Achievements from "./components/Achievements.jsx";
import Gallery from "./components/Gallery.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import BackToTop from "./components/BackToTop.jsx";
import ScrollMotion from "./components/ScrollMotion.jsx";

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ScrollMotion />
        <Navbar />
        <main id="main" tabIndex={-1}>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Achievements />
          <Gallery />
          <Contact />
        </main>
        <Footer />
        <BackToTop />
      </LanguageProvider>
    </ThemeProvider>
  );
}
