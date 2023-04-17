import { resolve } from 'path';
import { defineConfig } from 'vite';
import { ViteMinifyPlugin } from 'vite-plugin-minify';

const root = resolve(__dirname, 'src');
const outDir = resolve(__dirname, 'dist');

export default defineConfig({
  root,
  base: '/11-odin-weather-app',
  plugins: [ViteMinifyPlugin({})],
  build: {
    outDir,
    emptyOutDir: true,
    minify: 'terser',
    terserOptions: {
      output: {
        comments: false,
      },
    },
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
      },
    },
  },
});
