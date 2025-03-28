import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/components/core/index.tsx'],
    format: ['cjs', 'esm'],
    dts: true,
});