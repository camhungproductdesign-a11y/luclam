import * as esbuild from 'esbuild';

/**
 * Bundles server.ts into the artifact the VPS runs.
 *
 * NODE_ENV is baked in rather than left to the environment. server.ts branches
 * on it: anything other than "production" starts Vite in middleware mode and
 * serves source instead of the 60 generated pages. Nothing in the repo set the
 * variable, and `npm start` is a bare `node dist/server.cjs`, so a deploy would
 * have run the dev path in production — silently, with no error, undoing the
 * whole point of prerendering.
 *
 * Defining it here rather than in the npm script keeps it off the shell, where
 * `NODE_ENV=production cmd` is a Linux-only idiom and would break on Windows.
 * The built file is the production build by construction; there is no way to
 * run it in the wrong mode by forgetting a variable.
 */
await esbuild.build({
  entryPoints: ['server.ts'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  packages: 'external',
  sourcemap: true,
  outfile: 'dist/server.cjs',
  define: {
    'process.env.NODE_ENV': '"production"',
  },
});

console.log('Đã build dist/server.cjs với NODE_ENV=production.');
