import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const processEnv = {};
  for (const key in env) {
    processEnv[`process.env.${key}`] = JSON.stringify(env[key]);
  }

  return {
    plugins: [react()],
    define: processEnv,
  }
});
