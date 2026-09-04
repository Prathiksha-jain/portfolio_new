# Prathiksha Jain — Portfolio

React + Vite + Three.js (via React Three Fiber) portfolio.

## Design system

- **Colors**: `--bg #0a0b14`, `--surface #12131f`, `--accent #7c6fff` (electric violet), `--accent-warm #ff9f5a` (amber, used sparingly for CTAs/highlights)
- **Type**: Space Grotesk (display), Inter (body), JetBrains Mono (labels/data)
- **Signature visual**: a "voice orb" in the Hero — a ring of animated bars behaving like an audio waveform/equalizer around a rotating wireframe core. It's a direct metaphor for voice-command recognition, tied to real project work, not a generic rotating shape.

All tokens live in `src/index.css` under `:root` — change them there and the whole site updates.

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

## Editing your content

Everything personal lives in `src/data/`:

- `personal.js` — name, email, links, resume path
- `projects.js` — your 4–6 strongest projects
- `skills.js` — grouped skills
- `experience.js` — work + education

Edit these files; you should rarely need to touch component code just to update content.

## Adding your resume

Drop your PDF at `public/resume/Prathiksha_Jain_Resume.pdf` (or update the path in `personal.js`).

## Deploying to GitHub Pages

1. Create a repo named `your-username.github.io` (user site) **or** any name for a project site.
2. If it's a project site (not `username.github.io`), edit `vite.config.js` and set `base: "/your-repo-name/"`.
3. In your repo settings → Pages, set the source to **GitHub Actions**.
4. Push to `main` — `.github/workflows/deploy.yml` builds and deploys automatically.

## Notes

- The 3D scene lazy-loads and is wrapped in an error boundary (`src/three/SceneBoundary.jsx`) — if WebGL fails, the rest of the site still works.
- Reduced-motion is respected globally in `src/index.css`.
