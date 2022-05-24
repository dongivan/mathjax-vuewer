import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'

const resolvePath = (str: string) => path.resolve(__dirname, str)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  build: {
    lib: {
      entry: resolvePath('packages/index.ts'),
      name: 'mathjax-vuewer',
      fileName: (format) => `mathjax-vuewer.${format}.js`
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
