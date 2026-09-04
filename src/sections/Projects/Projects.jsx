import React, { useEffect, useRef, useState } from "react";
import "./Projects.css";

export default function Projects() {
  const sectionRef = useRef(null);
  const [activeProject, setActiveProject] = useState(null);

  /* =====================================================
     TOP 4 PROJECTS — FROM YOUR GITHUB PROFILE
  ====================================================== */

  const projects = [
    {
      id: 1,
      title: "REMINDLY",
      category: "GENAI · PRODUCTIVITY",
      description:
        "An AI-powered productivity companion that transforms urgent tasks into clear, actionable plans.",
      details:
        "Remindly understands tasks from text or voice input and identifies deadlines, priority, risks, blockers and the next steps required to turn an urgent task into a clear action plan.",
      tech: [
        "TypeScript",
        "Generative AI",
        "AI",
        "Productivity",
      ],
      github:
        "https://github.com/Prathiksha-jain/REMINDLY",
    },

    {
      id: 2,
      title: "HYBRID RAG SYSTEMS",
      category: "GENAI · RAG",
      description:
        "Production-oriented Retrieval-Augmented Generation systems built for contextual and domain-specific AI conversations.",
      details:
        "Built RAG pipelines with follow-up query detection, topic anchoring, session-based context memory using Redis, intelligent routing and multi-stage retrieval. The systems include real-time chat interfaces and domain-focused question answering for automotive and policy/document knowledge.",
      tech: [
        "RAG",
        "LLMs",
        "Redis",
        "Embeddings",
        "Streamlit",
        "BM25",
      ],
      github: null,
    },

    {
      id: 3,
      title: "SAFEGUARD AI",
      category: "AI · FULL STACK",
      description:
        "A full-stack AI monitoring dashboard designed around real-time safety event pipelines.",
      details:
        "Safeguard AI focuses on real-world AI-powered safety monitoring. The system combines intelligent processing with real-time event pipelines to provide a responsive monitoring experience and meaningful visibility into safety-related events.",
      tech: [
        "AI",
        "Full Stack",
        "Real-Time Systems",
        "Event Pipelines",
      ],
      github: null,
    },

    {
      id: 4,
      title: "ATS · AI RESUME MATCHER",
      category: "GENAI · RECRUITMENT",
      description:
        "An intelligent resume matching system powered by LLM-based understanding rather than hardcoded skill lists.",
      details:
        "The system explores how LLMs can understand resumes and job requirements semantically. Instead of relying on manually maintained keyword lists, it focuses on understanding candidate information and determining meaningful relevance between candidates and opportunities.",
      tech: [
        "LLMs",
        "Generative AI",
        "NLP",
        "Semantic Matching",
      ],
      github: null,
    },
  ];

  /* =====================================================
     SCROLL REVEAL
  ====================================================== */

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("projects--visible");
        }
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(section);

    /* =================================================
       MOUSE PARALLAX
    ================================================== */

    const handleMouseMove = (event) => {
      const rect = section.getBoundingClientRect();

      const x =
        (event.clientX - rect.left) / rect.width - 0.5;

      const y =
        (event.clientY - rect.top) / rect.height - 0.5;

      section.style.setProperty(
        "--projects-mouse-x",
        `${x * 18}px`
      );

      section.style.setProperty(
        "--projects-mouse-y",
        `${y * 18}px`
      );
    };

    section.addEventListener(
      "mousemove",
      handleMouseMove
    );

    return () => {
      observer.disconnect();

      section.removeEventListener(
        "mousemove",
        handleMouseMove
      );
    };
  }, []);

  /* =====================================================
     LOCK WEBSITE SCROLL WHEN POPUP IS OPEN
  ====================================================== */

  useEffect(() => {
    if (activeProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [activeProject]);

  /* =====================================================
     ESCAPE TO CLOSE
  ====================================================== */

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setActiveProject(null);
      }
    };

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="projects-section"
    >

      {/* =================================================
          BACKGROUND
      ================================================== */}

      <div className="projects-background">

        <div className="projects-grid-bg"></div>

        <div className="projects-glow projects-glow--one"></div>

        <div className="projects-glow projects-glow--two"></div>

        <div className="projects-orbit projects-orbit--one"></div>

        <div className="projects-orbit projects-orbit--two"></div>

        <span className="projects-particle projects-particle--1"></span>
        <span className="projects-particle projects-particle--2"></span>
        <span className="projects-particle projects-particle--3"></span>
        <span className="projects-particle projects-particle--4"></span>

      </div>


      {/* =================================================
          WATERMARK
      ================================================== */}

      <div className="projects-watermark">
        PROJECTS
      </div>


      {/* =================================================
          TOP LINE
      ================================================== */}

      <div className="projects-topline">

        <span className="projects-index">
          04
        </span>

        <span className="projects-line"></span>

        <span className="projects-label">
          SELECTED WORK
        </span>

      </div>


      {/* =================================================
          MAIN CONTENT
      ================================================== */}

      <div className="projects-content">

        {/* =================================================
            INTRO
        ================================================== */}

        <div className="projects-intro">

          <div className="projects-kicker">

            <span className="projects-kicker-dot"></span>

            THINGS I'VE BUILT

          </div>


          <h2 className="projects-title">

            Selected
            <br />

            <span>work.</span>

          </h2>


          <div className="projects-title-line"></div>


          <p className="projects-description">
            I build intelligent systems where
            Generative AI, RAG and software engineering
            come together to solve meaningful problems.
          </p>


          <div className="projects-count">

            <strong>
              04
            </strong>

            <span>
              SELECTED PROJECTS
            </span>

          </div>

        </div>


        {/* =================================================
            PROJECT GRID
        ================================================== */}

        <div className="projects-grid">

          {projects.map((project, index) => (

            <div
              className="projects-item"
              key={project.id}
              style={{
                "--project-delay": `${index * 120}ms`,
              }}
            >

              <div className="project-card">

                <div className="project-card-top">

                  <span className="project-card-number">
                    {String(project.id).padStart(2, "0")}
                  </span>

                  <span className="project-card-category">
                    {project.category}
                  </span>

                </div>


                <h3 className="project-card-title">
                  {project.title}
                </h3>


                <p className="project-card-description">
                  {project.description}
                </p>


                <div className="project-card-tech">

                  {project.tech
                    .slice(0, 3)
                    .map((item) => (

                      <span key={item}>
                        {item}
                      </span>

                    ))}

                </div>


                {/* =================================================
                    VIEW MORE
                ================================================== */}

                <button
                  type="button"
                  className="project-view-more"
                  onClick={() =>
                    setActiveProject(project)
                  }
                >
                  <span>
                    VIEW MORE
                  </span>

                  <strong>
                    ↗
                  </strong>
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>


      {/* =================================================
          BOTTOM
      ================================================== */}

      <div className="projects-bottom">

        <span>
          EXPLORE MY WORK
        </span>

        <div className="projects-bottom-line">
          <span></span>
        </div>

        <strong>
          05 · EXPERIENCE
        </strong>

      </div>


      {/* =================================================
          PROJECT DETAILS POPUP
      ================================================== */}

      {activeProject && (

        <div
          className="project-modal"
          onClick={() =>
            setActiveProject(null)
          }
        >

          <div
            className="project-modal-content"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* CLOSE */}

            <button
              type="button"
              className="project-modal-close"
              onClick={() =>
                setActiveProject(null)
              }
            >
              ×
            </button>


            {/* NUMBER */}

            <div className="project-modal-number">

              {String(activeProject.id).padStart(2, "0")}

              <span>
                {activeProject.category}
              </span>

            </div>


            {/* TITLE */}

            <h2>
              {activeProject.title}
            </h2>


            {/* SHORT DESCRIPTION */}

            <p className="project-modal-description">
              {activeProject.description}
            </p>


            <div className="project-modal-line"></div>


            {/* OVERVIEW */}

            <div className="project-modal-section">

              <span>
                OVERVIEW
              </span>

              <p>
                {activeProject.details}
              </p>

            </div>


            {/* TECHNOLOGIES */}

            <div className="project-modal-section">

              <span>
                TECHNOLOGY
              </span>

              <div className="project-modal-tech">

                {activeProject.tech.map(
                  (item) => (

                    <span key={item}>
                      {item}
                    </span>

                  )
                )}

              </div>

            </div>


            {/* GITHUB */}

            {activeProject.github && (

              <a
                href={activeProject.github}
                target="_blank"
                rel="noopener noreferrer"
                className="project-modal-github"
              >
                VIEW ON GITHUB ↗
              </a>

            )}

          </div>

        </div>

      )}

    </section>
  );
}