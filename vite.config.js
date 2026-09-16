import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: { manifest: true },
  ssr: { noExternal: [/^@mui\//, /^@emotion\//, 'react-helmet', 'react-scroll', 'react-player'] },
});
