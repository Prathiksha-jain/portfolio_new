import React, { useEffect, useRef, useState } from "react";
import { skillGroups } from "../../data/skills.js";
import "./Skills.css";

export default function Skills() {
  const sectionRef = useRef(null);

  const [activeSkill, setActiveSkill] = useState(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    /* =====================================================
       SCROLL REVEAL
    ====================================================== */

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("skills--visible");
        }
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(section);


    /* =====================================================
       MOUSE PARALLAX
    ====================================================== */

    const handleMouseMove = (event) => {
      const rect = section.getBoundingClientRect();

      const x =
        (event.clientX - rect.left) / rect.width - 0.5;

      const y =
        (event.clientY - rect.top) / rect.height - 0.5;

      section.style.setProperty(
        "--skills-mouse-x",
        `${x * 18}px`
      );

      section.style.setProperty(
        "--skills-mouse-y",
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
     LOCK WEBSITE SCROLL WHILE POPUP IS OPEN
  ====================================================== */

  useEffect(() => {
    if (activeSkill) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [activeSkill]);


  /* =====================================================
     CLOSE POPUP WITH ESC
  ====================================================== */

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setActiveSkill(null);
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


  /* =====================================================
     BEST SKILL AREAS
  ===================================================== */

  const skills = [
    {
      number: "01",
      group: "GENERATIVE AI",
      items: [
        "RAG Systems",
        "LLMs",
        "Prompt Engineering",
        "Embeddings",
      ],
      description:
        "Building intelligent applications around modern Generative AI technologies.",

      details: `
        Generative AI is one of my primary areas of focus.

        I work with Retrieval-Augmented Generation, LLM-based
        applications, embeddings, semantic search and prompt
        engineering.

        My interest goes beyond simply calling an LLM API. I
        focus on understanding the complete pipeline — from
        document ingestion and chunking to retrieval,
        context management, generation and evaluation.

        I also explore local LLMs, multimodal RAG and
        intelligent agent architectures.
      `,
    },

    {
      number: "02",
      group: "PYTHON & AI",
      items: [
        "Python",
        "Machine Learning",
        "NLP",
        "OpenCV",
      ],
      description:
        "Python is my primary language for AI, automation and problem solving.",

      details: `
        Python is one of the technologies I use most extensively.

        I use it for AI and ML experimentation, automation,
        backend services, data processing and problem solving.

        My experience also includes areas such as NLP,
        computer vision and OpenCV-based applications.

        Python gives me the flexibility to move quickly from
        an idea or experiment to a working system.
      `,
    },

    {
      number: "03",
      group: "BACKEND & SYSTEMS",
      items: [
        "Node.js",
        "REST APIs",
        "Redis",
        "System Design",
      ],
      description:
        "Designing backend systems that connect applications, data and intelligence.",

      details: `
        I enjoy working on the engineering layer behind
        applications.

        My backend interests include REST APIs, Node.js,
        Redis, asynchronous processing, session management
        and scalable system architecture.

        While building AI systems, I pay particular attention
        to bottlenecks, latency, concurrency, memory and
        worker-based architectures.

        I believe a strong AI application needs strong
        engineering underneath it.
      `,
    },

    {
      number: "04",
      group: "WEB DEVELOPMENT",
      items: [
        "React",
        "JavaScript",
        "HTML & CSS",
        "Interactive UI",
      ],
      description:
        "Creating interfaces that make complex technology feel simple and engaging.",

      details: `
        I use modern web technologies to turn systems into
        experiences people can actually interact with.

        React and JavaScript are central to my frontend work,
        along with HTML and CSS for creating responsive and
        visually engaging interfaces.

        I'm particularly interested in interactive interfaces
        that combine clean design with meaningful motion,
        real-time behaviour and intelligent functionality.
      `,
    },

    {
      number: "05",
      group: "DATA & INFRASTRUCTURE",
      items: [
        "MongoDB",
        "SQL",
        "Git & GitHub",
        "Deployment",
      ],
      description:
        "Working with the data and development infrastructure that keeps systems moving.",

      details: `
        Data is an important part of every system I build.

        I work with databases such as MongoDB and SQL-based
        systems, while Git and GitHub are part of my regular
        development workflow.

        I also explore deployment and production concerns,
        including API configuration, environment management,
        debugging and making applications reliable outside
        the local development environment.
      `,
    },

    {
      number: "06",
      group: "ENGINEERING",
      items: [
        "Problem Solving",
        "DSA",
        "Embedded Systems",
        "Automation",
      ],
      description:
        "A foundation in engineering that shapes how I approach technical problems.",

      details: `
        My engineering interests extend beyond software alone.

        Problem solving and data structures help me reason
        about efficiency, while my exposure to embedded
        systems and automation gives me a broader view of
        how software interacts with real-world systems.

        I enjoy understanding problems from first principles,
        breaking them into smaller pieces and building
        practical solutions.
      `,
    },
  ];


  return (
    <section
      ref={sectionRef}
      id="skills"
      className="skills-section"
    >

      {/* =================================================
          BACKGROUND
      ================================================== */}

      <div className="skills-background">

        <div className="skills-grid-bg"></div>

        <div className="skills-glow skills-glow--one"></div>
        <div className="skills-glow skills-glow--two"></div>

        <div className="skills-orbit skills-orbit--one"></div>
        <div className="skills-orbit skills-orbit--two"></div>

        <span className="skills-particle skills-particle--1"></span>
        <span className="skills-particle skills-particle--2"></span>
        <span className="skills-particle skills-particle--3"></span>
        <span className="skills-particle skills-particle--4"></span>
        <span className="skills-particle skills-particle--5"></span>

      </div>


      {/* =================================================
          WATERMARK
      ================================================== */}

      <div className="skills-watermark">
        SKILLS
      </div>


      {/* =================================================
          TOP LINE
      ================================================== */}

      <div className="skills-topline">

        <span className="skills-index">
          03
        </span>

        <span className="skills-line"></span>

        <span className="skills-label">
          WHAT I WORK WITH
        </span>

      </div>


      {/* =================================================
          MAIN CONTENT
      ================================================== */}

      <div className="skills-content">


        {/* =================================================
            INTRO
        ================================================== */}

        <div className="skills-intro">

          <div className="skills-kicker">

            <span className="skills-kicker-dot"></span>

            MY TOOLKIT

          </div>


          <h2 className="skills-title">

            What I
            <br />

            <span>work with.</span>

          </h2>


          <div className="skills-title-line"></div>


          <p className="skills-description">
            Technologies I use to build intelligent
            systems, real-world applications and
            meaningful digital experiences.
          </p>


          <div className="skills-counter">

            <strong>
              {String(skills.length).padStart(2, "0")}
            </strong>

            <span>
              CORE AREAS
            </span>

          </div>

        </div>


        {/* =================================================
            SKILL GROUPS
        ================================================== */}

        <div className="skills-groups">

          {skills.map((skill, index) => (

            <div
              className="skills-group"
              key={skill.group}
              style={{
                "--skill-delay": `${index * 100}ms`,
              }}
            >

              <div className="skills-group-top">

                <span className="skills-group-number">
                  {skill.number}
                </span>

                <span className="skills-group-arrow">
                  ↗
                </span>

              </div>


              <h3>
                {skill.group}
              </h3>


              <ul>

                {skill.items.map((item) => (

                  <li key={item}>

                    <span className="skill-dot"></span>

                    {item}

                  </li>

                ))}

              </ul>


              <button
                type="button"
                className="skills-read-more"
                onClick={() =>
                  setActiveSkill(skill)
                }
              >
                READ MORE
                <span>↗</span>
              </button>


              <div className="skills-group-line"></div>

            </div>

          ))}

        </div>

      </div>


      {/* =================================================
          BOTTOM
      ================================================== */}

      <div className="skills-bottom">

        <span>
          EXPLORE THE STACK
        </span>

        <div className="skills-bottom-line">
          <span></span>
        </div>

        <strong>
          04 · PROJECTS
        </strong>

      </div>


      {/* =================================================
          SKILL DETAIL POPUP
      ================================================== */}

      {activeSkill && (

        <div
          className="skills-modal-overlay"
          onClick={() => setActiveSkill(null)}
        >

          <div
            className="skills-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="skills-modal-close"
              onClick={() =>
                setActiveSkill(null)
              }
              aria-label="Close"
            >
              ×
            </button>


            <span className="skills-modal-label">
              {activeSkill.group}
            </span>


            <h3>
              {activeSkill.description}
            </h3>


            <div className="skills-modal-line"></div>


            <p>
              {activeSkill.details}
            </p>

          </div>

        </div>

      )}

    </section>
  );
}