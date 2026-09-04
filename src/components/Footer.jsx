import { personal } from "../data/personal.js";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--line)",
        padding: "1.5rem clamp(1.25rem, 5vw, 4rem)",
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "0.5rem",
        fontFamily: "var(--font-mono)",
        fontSize: "0.78rem",
        color: "var(--muted)",
      }}
    >
      <span>© {new Date().getFullYear()} {personal.name}</span>
      <span>Built with React · Three.js</span>
    </footer>
  );
}
