import { useEffect, useState } from "react";
import "./Navbar.css";

const LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#home");

  useEffect(() => {
    const sections = LINKS.map((link) =>
      document.querySelector(link.href)
    ).filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
          );

        if (visible.length > 0) {
          setActive(`#${visible[0].target.id}`);
        }
      },
      {
        threshold: [0.2, 0.4, 0.6],
        rootMargin: "-15% 0px -55% 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleClick = (href) => {
    setActive(href);
    setOpen(false);
  };

  return (
    <header className="navbar">

      {/* Desktop floating paper notes */}
      <nav className="navbar__links navbar__links--desktop">
        {LINKS.map((link, index) => {
          const isActive = active === link.href;

          return (
            <a
              key={link.href}
              href={link.href}
              className={`nav-note ${
                isActive ? "nav-note--active" : ""
              }`}
              data-index={index + 1}
              onClick={() => handleClick(link.href)}
            >
              <span className="nav-note__number">
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className="nav-note__label">
                {link.label}
              </span>

              {isActive && (
                <span className="nav-note__dot" />
              )}
            </a>
          );
        })}
      </nav>

      {/* Mobile brand */}
      <a href="#top" className="navbar__brand">
        PRATHIKSHA
      </a>

      {/* Mobile menu button */}
      <button
        className="navbar__toggle"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "✕" : "☰"}
      </button>

      {/* Mobile menu */}
      {open && (
        <nav className="navbar__links navbar__links--mobile">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => handleClick(link.href)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}