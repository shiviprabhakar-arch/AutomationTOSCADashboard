import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
import { viteSingleFile } from "vite-plugin-singlefile";

import fs from 'fs';

const htmlCleanupPlugin = (): Plugin => {
  return {
    name: 'html-cleanup',
    closeBundle() {
      const htmlPath = path.resolve(__dirname, 'dist/index.html');
      if (fs.existsSync(htmlPath)) {
        let html = fs.readFileSync(htmlPath, 'utf-8');
        html = html.replace(/<script\s+type="module"\s+crossorigin([^>]*)>/g, '<script type="module"$1>')
                   .replace(/<style\s+rel="stylesheet"\s+crossorigin([^>]*)>/g, '<style$1>');
        fs.writeFileSync(htmlPath, html, 'utf-8');
      }
    }
  };
};

export default defineConfig(() => {
  return {
    base: './',
    plugins: [react(), tailwindcss(), viteSingleFile(), htmlCleanupPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
