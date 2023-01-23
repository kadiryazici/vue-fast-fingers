import { URL, fileURLToPath } from 'node:url'
import UnoCSS from '@unocss/vite'
import PresetUno from 'unocss/preset-uno'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueJSX from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use \'/src/assets/mixins.scss\' as *;',
      },
    },
  },
  plugins: [
    Vue(),
    VueJSX(),
    UnoCSS({
      presets: [
        PresetUno(),
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
