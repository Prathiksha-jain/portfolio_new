import React, { useEffect, useRef, useState } from "react";
import "./Experience.css";


/* =========================================================
   EXPERIENCE
========================================================= */

const experience = {
  period: "March 2025 — Present",

  role: "Associate Software Engineer",

  org: "IAST Software Solutions Pvt. Ltd.",

  shortDescription:
    "Working across AI/ML, intelligent systems, automation, digital initiatives and technical training.",

  details: `
Joined IAST Software Solutions Pvt. Ltd. through campus placement as an Associate Software Engineer.

Currently exploring the AI & ML domain and working on real-world applications, intelligent systems and automation-based projects.

Alongside technical work, I contribute to digital marketing and branding initiatives under Chandram’s TechVersity (CTV), creating content, supporting campaigns and helping drive digital engagement.

I also continue to train students in Python, AI/ML and Web Development through online and offline sessions.

My teaching focuses on simplifying technical concepts through practical examples, projects and interactive learning.

I also share technical knowledge through YouTube tutorials and technical sessions, with the aim of making technology practical, accessible and engaging.
`,
};


/* =========================================================
   EDUCATION
========================================================= */

const education = [
  {
    period: "2009 — 2019",

    degree: "Schooling",

    institute: "Kendriya Vidyalaya, Kodagu",

    result: "96.33%",

    resultLabel: "10th MARKS",

    details: `
Completed schooling from Grades 1 to 10 at Kendriya Vidyalaya, Kodagu.

Completed 10th standard with an overall score of 96.33%.

The school years built a strong academic foundation and developed my interest in science, creativity, learning and problem-solving.

This foundation later encouraged me to explore technology and computer science more deeply.
`,
  },

  {
    period: "2019 — 2021",

    degree: "PCMC — Science",

    institute: "St. Joseph’s PU College, Madikeri",

    result: "99.99%",

    resultLabel: "PUC MARKS",

    details: `
Pursued the PCMC — Physics, Chemistry, Mathematics and Computer Science — stream at St. Joseph’s PU College, Madikeri.

Completed the PUC program with an overall score of 99.99%.

The PCMC curriculum strengthened my mathematical reasoning, scientific thinking and interest in programming and computer science.

This period played an important role in my decision to pursue Computer Science Engineering.
`,
  },

  {
    period: "2021 — 2025",

    degree: "B.E. — Computer Science & Engineering",

    institute: "Alva’s Institute of Engineering & Technology, Mijar",

    result: "9.33 CGPA",

    resultLabel: "B.E. CGPA",

    details: `
Completed B.E. in Computer Science & Engineering at Alva’s Institute of Engineering & Technology, Mijar.

Graduated with a CGPA of 9.33.

During engineering, I explored Artificial Intelligence and Machine Learning, Web Development, programming, automation and emerging technologies.

I worked on academic and real-world oriented projects and actively participated in technical activities, workshops and learning initiatives.

My engineering journey also gave me opportunities to train students, conduct technical sessions and explore how technology can be combined with creativity to solve meaningful problems.

This phase shaped my transition from a student interested in technology into a software engineer, developer and technical mentor.
`,
  },
];


/* =========================================================
   COMPONENT
========================================================= */

export default function Experience() {

  const sectionRef = useRef(null);

  const [activeModal, setActiveModal] = useState(null);


  /* =====================================================
     SCROLL REVEAL
  ====================================================== */

  useEffect(() => {

    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {

        if (entry.isIntersecting) {
          section.classList.add(
            "experience--visible"
          );
        }

      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(section);


    /* ===================================================
       MOUSE PARALLAX
    ==================================================== */

    const handleMouseMove = (event) => {

      const rect =
        section.getBoundingClientRect();

      const x =
        (event.clientX - rect.left) /
          rect.width -
        0.5;

      const y =
        (event.clientY - rect.top) /
          rect.height -
        0.5;

      section.style.setProperty(
        "--experience-mouse-x",
        `${x * 14}px`
      );

      section.style.setProperty(
        "--experience-mouse-y",
        `${y * 14}px`
      );

      section.style.setProperty(
        "--experience-rotate-y",
        `${x * 5}deg`
      );

      section.style.setProperty(
        "--experience-rotate-x",
        `${y * -5}deg`
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
     ESCAPE MODAL
  ====================================================== */

  useEffect(() => {

    if (!activeModal) return;

    const handleKeyDown = (event) => {

      if (event.key === "Escape") {
        setActiveModal(null);
      }

    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

    };

  }, [activeModal]);


  /* =====================================================
     BODY LOCK
  ====================================================== */

  useEffect(() => {

    if (!activeModal) return;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {

      document.body.style.overflow =
        previousOverflow;

    };

  }, [activeModal]);


  /* =====================================================
     OPEN MODAL
  ====================================================== */

  const openModal = (type, data) => {

    setActiveModal({
      type,
      data,
    });

  };


  return (
    <section
      ref={sectionRef}
      id="experience"
      className="experience-section"
    >

      {/* =================================================
          BACKGROUND
      ================================================== */}

      <div className="experience-background">

        <div className="experience-grid-bg" />

        <div className="experience-glow experience-glow--one" />

        <div className="experience-glow experience-glow--two" />

        <div className="experience-orbit experience-orbit--one" />

        <div className="experience-orbit experience-orbit--two" />

        <span className="experience-particle experience-particle--1" />
        <span className="experience-particle experience-particle--2" />
        <span className="experience-particle experience-particle--3" />
        <span className="experience-particle experience-particle--4" />

      </div>


      {/* =================================================
          WATERMARK
      ================================================== */}

      <div className="experience-watermark">
        JOURNEY
      </div>


      {/* =================================================
          TOP LINE
      ================================================== */}

      <div className="experience-topline">

        <span className="experience-index">
          05
        </span>

        <span className="experience-line" />

        <span className="experience-label">
          EXPERIENCE & EDUCATION
        </span>

      </div>


      {/* =================================================
          MAIN
      ================================================== */}

      <div className="experience-content">


        {/* =================================================
            LEFT INTRO
        ================================================= */}

        <div className="experience-intro">

          <div className="experience-kicker">

            <span className="experience-kicker-dot" />

            MY JOURNEY

          </div>


          <h2 className="experience-title">

            Where I've
            <br />

            <span>grown.</span>

          </h2>


          <div className="experience-title-line" />


          <p className="experience-description">

            From building my foundation in computer
            science to working on real-world software,
            AI and technology initiatives, every step
            has shaped how I learn, build and create.

          </p>


          <div className="experience-stats">

            <div>

              <strong>
                01
              </strong>

              <span>
                EXPERIENCE
              </span>

            </div>


            <div>

              <strong>
                03
              </strong>

              <span>
                EDUCATION
              </span>

            </div>

          </div>

        </div>


        {/* =================================================
            RIGHT JOURNEY
        ================================================== */}

        <div className="experience-stage">


          {/* =================================================
              EXPERIENCE BOX
          ================================================== */}

          <div className="experience-cards">

            <article className="experience-card">

              <div className="experience-card-inner">


                {/* HEADING */}

                <div className="experience-card-heading">

                  <span>
                    EXPERIENCE
                  </span>

                  <span className="experience-card-heading-line" />

                </div>


                {/* PERIOD */}

                <div className="experience-card-top">

                  <span className="experience-card-period">
                    {experience.period}
                  </span>

                </div>


                {/* ROLE */}

                <h3>
                  {experience.role}
                </h3>


                {/* ORGANIZATION */}

                <p className="experience-card-org">
                  {experience.org}
                </p>


                {/* DESCRIPTION */}

                <p className="experience-card-summary">
                  {experience.shortDescription}
                </p>


                {/* READ MORE */}

                <button
                  type="button"
                  className="experience-read-more"
                  onClick={() =>
                    openModal(
                      "experience",
                      experience
                    )
                  }
                >
                  READ MORE
                  <span>↗</span>
                </button>


                <div className="experience-card-footer">

                  <span>
                    ASSOCIATE SOFTWARE ENGINEER
                  </span>

                  <span className="experience-card-arrow">
                    ↗
                  </span>

                </div>

              </div>

            </article>

          </div>


          {/* =================================================
              EDUCATION
          ================================================== */}

          <div className="education-panel">


            <div className="education-panel-header">

              <span>
                EDUCATION
              </span>

            </div>


            <div className="education-panel-line" />


            <div className="education-list">

              {education.map((ed, index) => (

                <div
                  className="education-item"
                  key={index}
                >

                  <div className="education-item-main">

                    <span className="education-period">
                      {ed.period}
                    </span>


                    <h3>
                      {ed.degree}
                    </h3>


                    <p>
                      {ed.institute}
                    </p>

                  </div>


                  <div className="education-item-result">

                    <strong>
                      {ed.result}
                    </strong>

                    <span>
                      {ed.resultLabel}
                    </span>

                  </div>


                  <button
                    type="button"
                    className="education-read-more"
                    onClick={() =>
                      openModal(
                        "education",
                        ed
                      )
                    }
                  >
                    READ MORE
                    <span>↗</span>
                  </button>

                </div>

              ))}

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          BOTTOM
      ================================================== */}

      <div className="experience-bottom">

        <span>
          KEEP MOVING FORWARD
        </span>

        <div className="experience-bottom-line">
          <span />
        </div>

        <strong>
          06 · CONTACT
        </strong>

      </div>


      {/* =================================================
          MODAL
      ================================================== */}

      {activeModal && (

        <div
          className="experience-modal-overlay"
          onClick={() => setActiveModal(null)}
        >

          <div
            className="experience-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >


            <button
              type="button"
              className="experience-modal-close"
              onClick={() =>
                setActiveModal(null)
              }
            >
              ×
            </button>


            <span className="experience-modal-label">

              {activeModal.type === "experience"
                ? "EXPERIENCE"
                : "EDUCATION"}

            </span>


            <span className="experience-modal-period">

              {activeModal.data.period}

            </span>


            <h3>

              {activeModal.data.role ||
                activeModal.data.degree}

            </h3>


            <p className="experience-modal-org">

              {activeModal.data.org ||
                activeModal.data.institute}

            </p>


            {activeModal.data.result && (

              <div className="experience-modal-result">

                <strong>
                  {activeModal.data.result}
                </strong>

                <span>
                  {activeModal.data.resultLabel}
                </span>

              </div>

            )}


            <div className="experience-modal-line" />


            <div className="experience-modal-details">

              {activeModal.data.details
                .trim()
                .split("\n\n")
                .map((paragraph, index) => (

                  <p key={index}>
                    {paragraph.trim()}
                  </p>

                ))}

            </div>

          </div>

        </div>

      )}

    </section>
  );
}