import { defineConfig } from 'vitest/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    passWithNoTests: false,
    coverage: {
      provider: 'istanbul',
      all: true,
      include: [
        'src/lib/api.ts',
        'src/lib/format-money.ts',
        'src/lib/utils.ts',
        'src/store/useCartStore.ts',
      ],
      exclude: [
        'src/**/*.{test,spec}.{ts,tsx}',
        'src/**/*.d.ts',
      ],
      reporter: ['text', 'text-summary', 'html'],
      thresholds: {
        lines: 65,
        functions: 65,
        branches: 65,
        statements: 65,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(rootDir, 'src'),
    },
  },
});
