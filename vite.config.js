import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const base =
  process.env.VITE_BASE_PATH ||
  (process.env.VERCEL ? "/" : "/portfolio_new/");

export default defineConfig({
  plugins: [react()],

  base,

  server: {
    proxy: {
      "/api": "http://127.0.0.1:8787",
    },
  },
});
