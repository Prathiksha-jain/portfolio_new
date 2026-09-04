import React, { useCallback, useState } from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";
import ScrollIntro from "./components/IntroLoader/ScrollIntro.jsx";

import "./index.css";


function Root() {
  const [introComplete, setIntroComplete] = useState(false);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  /*
   * Scroll-driven cinematic intro first — the visitor scrolls
   * through it themselves, nothing is on a timer.
   */

  if (!introComplete) {
    return <ScrollIntro onComplete={handleIntroComplete} />;
  }

  return <App />;
}


ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);