/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import pkg from './package.json';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      fileName: (format, entryName) =>
        `${format}/${entryName}.${format === 'cjs' ? 'cjs' : 'js'}`,
      formats: ['cjs', 'es'],
    },
    rollupOptions: {
      external: ['react/jsx-runtime', ...Object.keys(pkg.devDependencies)],
    },
    sourcemap: true,
  },
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
});
