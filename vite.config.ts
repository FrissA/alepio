import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from '@tailwindcss/vite'
import path from "path";


const root = path.resolve(__dirname, "./src");

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": root, // Map @ to ./src
      "@components": path.resolve(root, "components"),
      "@assets": path.resolve(root, "assets"),
      "@helpers": path.resolve(root, "helpers"),
      "@hooks": path.resolve(root, "hooks"),
      "@zustand": path.resolve(root, "zustand"),
    },
  },
});
