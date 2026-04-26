import {defineConfig} from 'vitest/config';

export default defineConfig({
  esbuild: {
    tsconfigRaw: {
      compilerOptions: {
        experimentalDecorators: true,
        emitDecoratorMetadata: true
      }
    }
  },
  test: {
    include: ['tests/**/*.{test,spec}.ts', 'tests/**/*.{test,spec}.tsx']
  }
});
