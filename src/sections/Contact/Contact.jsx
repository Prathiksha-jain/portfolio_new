import React, { useEffect, useRef, useState } from "react";
import { personal } from "../../data/personal.js";
import "./Contact.css";

export default function Contact() {
  const sectionRef = useRef(null);
  const [formStatus, setFormStatus] = useState("");
  const [isSending, setIsSending] = useState(false);

  const contactApiUrl = "/api/contact";

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const form = event.currentTarget;
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const website = String(formData.get("website") || "").trim();

    if (website) {
      form.reset();
      setFormStatus("Message sent");
      return;
    }

    setIsSending(true);
    setFormStatus("Sending...");

    try {
      const response = await fetch(contactApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
          website,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          getSubmitError(result)
        );
      }

      form.reset();
      setFormStatus("Message sent");
    } catch (error) {
      setFormStatus(
        error.message || "Message could not be sent"
      );
    } finally {
      setIsSending(false);
    }
  };

  const getSubmitError = (result) => {
    if (result.error) return result.error;

    if (Array.isArray(result.errors)) {
      return result.errors
        .map((item) => item.message)
        .filter(Boolean)
        .join(", ") || "Message could not be sent";
    }

    return "Message could not be sent";
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personal.email);
      setFormStatus("Email copied");
    } catch {
      setFormStatus(personal.email);
    }
  };

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    /* =====================================================
       REVEAL
    ====================================================== */

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("contact--visible");
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
        "--contact-mouse-x",
        `${x * 18}px`
      );

      section.style.setProperty(
        "--contact-mouse-y",
        `${y * 18}px`
      );

      section.style.setProperty(
        "--contact-rotate-x",
        `${y * -4}deg`
      );

      section.style.setProperty(
        "--contact-rotate-y",
        `${x * 4}deg`
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

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="contact-section"
    >

      {/* =================================================
          BACKGROUND
      ================================================== */}

      <div className="contact-background">

        <div className="contact-grid"></div>

        <div className="contact-glow contact-glow--one"></div>

        <div className="contact-glow contact-glow--two"></div>

        <div className="contact-orbit contact-orbit--one"></div>

        <div className="contact-orbit contact-orbit--two"></div>

        <span className="contact-particle contact-particle--1"></span>
        <span className="contact-particle contact-particle--2"></span>
        <span className="contact-particle contact-particle--3"></span>
        <span className="contact-particle contact-particle--4"></span>

      </div>


      {/* =================================================
          WATERMARK
      ================================================== */}

      <div className="contact-watermark">
        CONNECT
      </div>


      {/* =================================================
          TOP LINE
      ================================================== */}

      <div className="contact-topline">

        <span className="contact-index">
          06
        </span>

        <span className="contact-line"></span>

        <span className="contact-label">
          LET'S CONNECT
        </span>

      </div>


      {/* =================================================
          MAIN CONTENT
      ================================================== */}

      <div className="contact-content">

        {/* ===============================================
            LEFT SIDE
        ================================================ */}

        <div className="contact-copy">

          <div className="contact-kicker">

            <span className="contact-kicker-dot"></span>

            HAVE AN IDEA?

          </div>


          <h2 className="contact-heading">

            Let's build
            <br />

            <span>
              something.
            </span>

          </h2>


          <div className="contact-heading-line"></div>


          <p className="contact-sub">
            Open to opportunities in applied AI, and full-stack
            development.
          </p>


          <p className="contact-message">
            Have a project, opportunity, or just
            something interesting to discuss?
            Let's make it happen.
          </p>

        </div>


        {/* ===============================================
            3D CONTACT CORE
        ================================================ */}
        <div className="contact-stage">

          <div className="contact-core">

            <div className="contact-core-ring contact-core-ring--one"></div>

            <div className="contact-core-ring contact-core-ring--two"></div>

            <div className="contact-core-ring contact-core-ring--three"></div>


            <div className="contact-core-center">

              <span>
                ↗
              </span>

            </div>


            <span className="contact-core-node contact-core-node--one">
              @
            </span>

            <span className="contact-core-node contact-core-node--two">
              ↗
            </span>

            <span className="contact-core-node contact-core-node--three">
              in
            </span>

          </div>


          <div className="contact-stage-label">
            <span>
              OPEN TO
            </span>

            <strong>
              NEW POSSIBILITIES
            </strong>
          </div>

        </div>


        {/* ===============================================
            CONTACT LINKS
        ================================================ */}

        <div className="contact-links">

          <form
            id="contact-form"
            className="contact-form"
            onSubmit={handleSubmit}
          >

            <label>
              <span>
                NAME
              </span>

              <input
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                required
              />
            </label>


            <label>
              <span>
                EMAIL
              </span>

              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
              />
            </label>


            <label>
              <span>
                MESSAGE
              </span>

              <textarea
                name="message"
                rows="4"
                placeholder="Tell me about it"
                required
              />
            </label>

            <input
              className="contact-form-honey"
              name="website"
              type="text"
              tabIndex="-1"
              autoComplete="off"
              aria-hidden="true"
            />


            <div className="contact-form-actions">

              <button
                type="submit"
                className="contact-form-submit"
                disabled={isSending}
              >
                {isSending ? "Sending" : "Send Mail"}
                <span>
                  ↗
                </span>
              </button>


              <button
                type="button"
                className="contact-form-copy"
                onClick={copyEmail}
              >
                Copy Email
              </button>

            </div>


            {formStatus && (
              <p className="contact-form-status">
                {formStatus}
              </p>
            )}

          </form>

          <a
            href="#contact-form"
            className="contact-link contact-link--primary"
          >

            <span className="contact-link-number">
              01
            </span>

            <span className="contact-link-content">

              <small>
                EMAIL
              </small>

              <strong>
                {personal.email}
              </strong>

            </span>

            <span className="contact-link-arrow">
              ↗
            </span>

          </a>


          <a
            href="https://github.com/Prathiksha-jain"
            target="_blank"
            rel="noreferrer"
            className="contact-link"
          >

            <span className="contact-link-number">
              02
            </span>

            <span className="contact-link-content">

              <small>
                CODE
              </small>

              <strong>
                GitHub
              </strong>

            </span>

            <span className="contact-link-arrow">
              ↗
            </span>

          </a>


          <a
            href="https://www.linkedin.com/in/prathiksha-jain-7bb495226/"
            target="_blank"
            rel="noreferrer"
            className="contact-link"
          >

            <span className="contact-link-number">
              03
            </span>

            <span className="contact-link-content">

              <small>
                CONNECT
              </small>

              <strong>
                LinkedIn
              </strong>

            </span>

            <span className="contact-link-arrow">
              ↗
            </span>

          </a>

        </div>

      </div>


      {/* =================================================
          BOTTOM
      ================================================== */}

      <div className="contact-bottom">

        <a
          href="#home"
          className="contact-back"
        >
          BACK TO TOP ↑
        </a>

        <div className="contact-bottom-line">
          <span></span>
        </div>

        <span className="contact-footer">
          PRATHIKSHA JAIN · 2026
        </span>

      </div>

    </section>
  );
}
