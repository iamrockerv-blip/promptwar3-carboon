import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'html'],
      reportsDirectory: './coverage',
      include: [
        'src/lib/**/*.ts',
        'src/services/**/*.ts'
      ],
      exclude: [
        'src/lib/demo-data.ts',
        'src/lib/constants.ts',
        'src/lib/prompts.ts',
        'src/lib/gemini.ts',
        'src/lib/logger.ts'
      ],
      thresholds: {
        statements: 90,
        branches: 75,
        functions: 90,
        lines: 90
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
