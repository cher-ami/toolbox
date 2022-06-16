import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    root: "_example",
    plugins: [react()],
  };
});
