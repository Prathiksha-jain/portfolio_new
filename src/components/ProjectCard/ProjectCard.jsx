import "./ProjectCard.css";

export default function ProjectCard({ project, index }) {
  return (
    <article className="project-card">
      <span className="project-card__index">{String(index + 1).padStart(2, "0")}</span>
      <h3>{project.name}</h3>
      <p>{project.description}</p>
      <ul className="project-card__tech">
        {project.tech.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <div className="project-card__links">
        {project.github && (
          <a href={project.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        )}
        {project.demo && (
          <a href={project.demo} target="_blank" rel="noreferrer">
            Live Demo
          </a>
        )}
      </div>
    </article>
  );
}
