import { Component } from "react";

// If WebGL is unavailable or the 3D scene throws, the rest of the
// portfolio (all plain HTML/CSS) must keep working. This is the fallback.
export default class SceneBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.warn("3D scene failed to render, falling back:", error);
  }

  render() {
    if (this.state.failed) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}
