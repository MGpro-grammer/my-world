import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  build: {
    // The server build only renders the pages: the public files (videos, …)
    // are already in dist/, they must not be copied a second time.
    copyPublicDir: !isSsrBuild,
  },
}));
