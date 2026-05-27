/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      {
        plugins: [react()],
        resolve: {
          alias: {
            '@': path.resolve(__dirname, 'web/src'),
          },
        },
        test: {
          name: 'web',
          globals: true,
          environment: 'jsdom',
          setupFiles: ['web/src/test-setup.ts'],
          include: ['web/src/**/*.{test,spec}.{ts,tsx}'],
        },
      },
      {
        test: {
          name: 'convex',
          globals: true,
          environment: 'node',
          include: ['convex/**/*.{test,spec}.ts'],
          exclude: ['convex/_generated/**'],
        },
      },
    ],
  },
});
