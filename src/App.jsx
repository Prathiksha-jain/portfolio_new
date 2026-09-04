import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Hero from "./sections/Hero/Hero.jsx";
import About from "./sections/About/About.jsx";
import Skills from "./sections/Skills/Skills.jsx";
import Projects from "./sections/Projects/Projects.jsx";
import Experience from "./sections/Experience/Experience.jsx";
import Contact from "./sections/Contact/Contact.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <div className="divider" />
        <Skills />
        <div className="divider" />
        <Projects />
        <div className="divider" />
        <Experience />
        <div className="divider" />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
