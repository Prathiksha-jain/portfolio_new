import React, { useEffect, useRef, useState } from "react";
import { personal } from "../../data/personal.js";
import "./About.css";

export default function About() {
  const sectionRef = useRef(null);

const [activeCard, setActiveCard] = useState(null);

useEffect(() => {
  const section = sectionRef.current;
  if (!section) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        section.classList.add("about--visible");
      }
    },
    {
      threshold: 0.18,
    }
  );

  observer.observe(section);

  const handleMouseMove = (event) => {
    const rect = section.getBoundingClientRect();

    const x =
      (event.clientX - rect.left) / rect.width - 0.5;

    const y =
      (event.clientY - rect.top) / rect.height - 0.5;

    section.style.setProperty(
      "--mouse-x",
      `${x * 20}px`
    );

    section.style.setProperty(
      "--mouse-y",
      `${y * 20}px`
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
===================================================== */

useEffect(() => {
  if (activeCard) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }

  return () => {
    document.body.style.overflow = "";
  };
}, [activeCard]);


/* =====================================================
   CLOSE POPUP WITH ESC
===================================================== */

useEffect(() => {
  const handleEscape = (event) => {
    if (event.key === "Escape") {
      setActiveCard(null);
    }
  };

  window.addEventListener("keydown", handleEscape);

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
      id="about"
      className="about-section"
    >

      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="about-background">

        <div className="about-grid"></div>

        <div className="about-glow about-glow--one"></div>
        <div className="about-glow about-glow--two"></div>

        <div className="about-orbit about-orbit--one"></div>
        <div className="about-orbit about-orbit--two"></div>
        <div className="about-orbit about-orbit--three"></div>

        <span className="about-particle about-particle--1"></span>
        <span className="about-particle about-particle--2"></span>
        <span className="about-particle about-particle--3"></span>
        <span className="about-particle about-particle--4"></span>
        <span className="about-particle about-particle--5"></span>

      </div>


      {/* =====================================================
          HUGE BACKGROUND TYPOGRAPHY
      ====================================================== */}

      <div className="about-watermark">
        ABOUT
      </div>


      {/* =====================================================
          TOP LABEL
      ====================================================== */}

      <div className="about-topline">

        <span className="about-index">
          02
        </span>

        <span className="about-line"></span>

        <span className="about-label">
          ABOUT ME
        </span>

      </div>


      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="about-content">

        {/* =================================================
            LEFT / MAIN INTRO
        ================================================== */}

        <div className="about-intro">

          <div className="about-kicker">

            <span className="about-kicker-dot"></span>

            GET TO KNOW ME

          </div>


          <h2 className="about-title">

            Who
            <br />

            <span>I am.</span>

          </h2>


          <div className="about-title-line"></div>


          <p className="about-lead">
            {personal.intro}
          </p>


          <p className="about-description">
            I enjoy turning ideas into experiences that
            feel thoughtful, intelligent and alive — from
            interactive interfaces to intelligent systems
            that solve real-world problems.
          </p>


          <div className="about-signature">

            <span>
              PRATHIKSHA JAIN
            </span>

            <span className="signature-arrow">
              ↗
            </span>

          </div>

        </div>


        {/* =================================================
            RIGHT INFORMATION
        ================================================== */}

        <div className="about-info">


          {/* =================================================
              FOCUS
          ================================================== */}

          <div className="about-info-card">

            <div className="about-card-number">
              01
            </div>


            <div className="about-card-content">

              <span className="about-card-label">
                FOCUS
              </span>

              <h3>
                Building with purpose.
              </h3>

              <p>
                Applied AI/ML · Embedded Systems ·
                Automation
              </p>


              <button
                type="button"
                className="about-read-more"
                onClick={() =>
                  setActiveCard({
                    label: "FOCUS",
                    title: "Building with purpose.",
                    text: `I enjoy building technology that solves
real problems rather than building technology
just for the sake of it.

My interests span Applied AI/ML, Generative AI,
intelligent systems, backend engineering,
embedded technologies and automation.

What interests me most is connecting these
different layers — data, logic, intelligence,
infrastructure and interface — into something
that people can actually use.

I believe good engineering is not just about
making something work. It is about understanding
why it works, how it can scale, and how it can
create meaningful value.`
                  })
                }
              >
                READ MORE
                <span>↗</span>
              </button>

            </div>


            <span className="about-card-arrow">
              ↗
            </span>

          </div>


          {/* =================================================
              CURRENTLY
          ================================================== */}

          <div className="about-info-card">

            <div className="about-card-number">
              02
            </div>


            <div className="about-card-content">

              <span className="about-card-label">
                CURRENTLY
              </span>

              <h3>
                Exploring what’s next.
              </h3>

              <p>
                On-device multilingual voice recognition
                and intelligent systems.
              </p>


              <button
                type="button"
                className="about-read-more"
                onClick={() =>
                  setActiveCard({
                    label: "CURRENTLY",
                    title: "Exploring what’s next.",
                    text: `I'm currently exploring the deeper side of
Generative AI and intelligent systems.

My learning and building journey includes
Retrieval-Augmented Generation, LLMs,
embeddings, semantic search, hybrid retrieval,
local models, multimodal AI and AI agents.

I'm particularly interested in what happens
after the prototype — evaluation, performance,
memory, reliability, scalability and how these
systems can become genuinely useful products.

The goal is not simply to use AI.

It is to understand how intelligent systems
are designed from the ground up.`
                  })
                }
              >
                READ MORE
                <span>↗</span>
              </button>

            </div>


            <span className="about-card-arrow">
              ↗
            </span>

          </div>


          {/* =================================================
              LOCATION
          ================================================== */}

          <div className="about-info-card">

            <div className="about-card-number">
              03
            </div>


            <div className="about-card-content">

              <span className="about-card-label">
                BASED IN
              </span>

              <h3>
                Bengaluru, India.
              </h3>

              <p>
                Creating, learning and building from
                India.
              </p>


              <button
                type="button"
                className="about-read-more"
                onClick={() =>
                  setActiveCard({
                    label: "BASED IN",
                    title: "Bengaluru, India.",
                    text: `I'm building my career around software
engineering, artificial intelligence and
emerging technologies.

Being part of a fast-moving technology
ecosystem keeps me curious about what is
being built, how it is being built and where
technology is heading next.

I enjoy learning across disciplines and then
bringing those ideas together through projects,
experimentation and problem solving.

For me, the journey is just as important as
the destination — keep learning, keep building,
and keep asking better questions.`
                  })
                }
              >
                READ MORE
                <span>↗</span>
              </button>

            </div>


            <span className="about-card-arrow">
              ↗
            </span>

          </div>

        </div>

      </div>


      {/* =====================================================
          BOTTOM AREA
      ====================================================== */}

      <div className="about-bottom">

        <div className="about-scroll-text">
          SCROLL TO DISCOVER
        </div>

        <div className="about-bottom-line">
          <span></span>
        </div>

        <div className="about-next">
          03 · SKILLS
        </div>

      </div>


      {/* =====================================================
          READ MORE POPUP
      ====================================================== */}

      {activeCard && (

        <div
          className="about-modal-overlay"
          onClick={() => setActiveCard(null)}
        >

          <div
            className="about-modal"
            onClick={(event) => event.stopPropagation()}
          >

            {/* Close */}

            <button
              type="button"
              className="about-modal-close"
              onClick={() => setActiveCard(null)}
              aria-label="Close"
            >
              ×
            </button>


            {/* Label */}

            <span className="about-modal-label">
              {activeCard.label}
            </span>


            {/* Title */}

            <h3>
              {activeCard.title}
            </h3>


            {/* Divider */}

            <div className="about-modal-line"></div>


            {/* Detailed Content */}

            <p>
              {activeCard.text}
            </p>

          </div>

        </div>

      )}

    </section>
  );
}