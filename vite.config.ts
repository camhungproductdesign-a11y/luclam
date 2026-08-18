import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    base: '/',
    plugins: [react(), tailwindcss()],
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
      watch:
        process.env.DISABLE_HMR === 'true'
          ? null
          : {
              // These are written by the app itself, not by a developer.
              // Saving in Creator Studio POSTs to /api/config, the server
              // writes public/config.json, and Vite — which watches everything
              // under the project root — answered the change with a full page
              // reload. Every save threw away whatever was being typed. An
              // image upload does the same through public/uploads.
              //
              // Ignoring them costs nothing: neither is part of the client
              // module graph, and the app reads config.json over fetch rather
              // than importing it, so a reload was never how the new values
              // arrived.
              //
              // scripts/ and dist/ are the same case, confirmed by watching the
              // dev server log while touching each: editing a prerender script
              // or a verifier logs "page reload", not "hmr update", because
              // Vite watches the whole root and cannot hot-swap a file the
              // browser never loaded — so it falls back to reloading. The
              // browser never loads any of these; they run under tsx at build
              // time. A build running beside the dev server rewrites sixty HTML
              // files in dist/ and would do it sixty times over.
              //
              // The cost of leaving them in is not the reload itself but what
              // it discards: the language you had picked, the page you had
              // scrolled to, the panel you had open.
              ignored: [
                '**/public/config.json',
                '**/public/uploads/**',
                '**/scripts/**',
                '**/dist/**',
              ],
            },
    },
  };
});
