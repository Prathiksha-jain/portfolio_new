import React from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
} from "@react-three/drei";

import Character3D from "./Character3D";
import "./Hero.css";

const HERO_AVATAR_SRC = `${import.meta.env.BASE_URL}profile.png`;

export default function Hero() {
  return (
    <section className="hero" id="home">

      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="hero-background">
        <div className="hero-glow hero-glow-purple" />
        <div className="hero-glow hero-glow-blue" />

        <div className="hero-stars">
          {Array.from({ length: 45 }).map((_, index) => (
            <span
              key={index}
              className="hero-star"
              style={{
                left: `${(index * 37) % 100}%`,
                top: `${(index * 61) % 100}%`,
                animationDelay: `${(index % 7) * 0.4}s`,
              }}
            />
          ))}
        </div>
      </div>


      {/* =====================================================
          LEFT CONTENT
      ====================================================== */}

      <div className="hero-content">

        {/* Availability */}

        <div className="availability-pill">
          <span className="availability-dot" />

          <span>
            AVAILABLE FOR OPPORTUNITIES
          </span>
        </div>


        {/* Heading */}

        <h1 className="hero-title">

          <span className="hero-title-white">
            Hi, I'm
          </span>

          <span className="hero-title-gradient">
            Prathiksha.
          </span>

        </h1>


        {/* Tagline */}

        <h2 className="hero-subtitle">
          I build things where{" "}
          <span>technology</span>{" "}
          meets creativity.
        </h2>


        {/* Description */}

        <p className="hero-description">
          Computer Science Engineer building intelligent,
          interactive, and meaningful digital experiences —
          from AI-powered systems and scalable backends
          to immersive web interfaces.
        </p>


        {/* Buttons */}

        <div className="hero-actions">

          <a
            href="#projects"
            className="hero-button hero-button-primary"
          >
            <span>Explore My Work</span>

            <span className="button-arrow">
              ↗
            </span>
          </a>


          {/* <a
            href="/resume.pdf"
            download
            className="hero-button hero-button-secondary"
          >
            <span>Download Resume</span>

            <span className="button-arrow">
              ↓
            </span>
          </a> */}

        </div>


        {/* Scroll */}

        <div className="hero-scroll">

          <span className="hero-scroll-text">
            Scroll to explore
          </span>

          <div className="hero-scroll-mouse">
            <span />
          </div>

        </div>

      </div>


      {/* =====================================================
          3D AREA
      ====================================================== */}

      <div className="hero-visual">

        <img
          className="hero-avatar-backup"
          src={HERO_AVATAR_SRC}
          alt=""
          aria-hidden="true"
        />

        <Canvas
          className="hero-canvas"
          camera={{
            position: [0, 0, 8],
            fov: 32,
            near: 0.1,
            far: 100,
          }}
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
        >

          <ambientLight intensity={1.8} />

          <directionalLight
            position={[3, 6, 5]}
            intensity={3.5}
          />

          <pointLight
            position={[-4, 3, 4]}
            intensity={10}
            color="#7668ff"
          />

          <pointLight
            position={[4, 2, -2]}
            intensity={7}
            color="#3bbfff"
          />

          <Environment preset="studio" />

          <Character3D />

        </Canvas>


        {/* =================================================
            3D BADGE
        ================================================== */}

       


        {/* =================================================
            FOCUSED ON
        ================================================== */}

        <div className="focused-card">

          <div className="focused-card-title">
            Focused On
          </div>

<div className="focused-card-item">
            <span>◈</span>
            AI &amp; GenAI
          </div>
          
          <div className="focused-card-item">
            <span>◉</span>
            Web Development
          </div>

          

          <div className="focused-card-item">
            <span>✦</span>
            Problem Solving
          </div>

        </div>

      </div>


      {/* =====================================================
          SOCIAL BAR
      ====================================================== */}

      <div className="hero-socials">

        {/* LinkedIn */}

        <a
          href="https://www.linkedin.com/in/prathiksha-jain-7bb495226/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          in
        </a>


        {/* GitHub */}

        <a
          href="https://github.com/Prathiksha-jain"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          GH
        </a>


        {/* Email */}

        <a
          href="#contact-form"
          aria-label="Contact form"
        >
          @
        </a>


        {/* YouTube */}

        <a
          href="https://www.youtube.com/@beforeifade"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube"
        >
          YT
        </a>

      </div>

    </section>
  );
}
