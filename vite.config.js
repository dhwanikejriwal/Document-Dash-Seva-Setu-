import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Production builds are served from a sub-path on the shared server (see deploy/).
// BASE_PATH overrides it; the dev server keeps serving from the root.
const DEPLOY_BASE = process.env.BASE_PATH || '/document_dash/';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? DEPLOY_BASE : '/',
  plugins: [react()],
  server: {
    host: true,
    port: 5173
  }
}));
