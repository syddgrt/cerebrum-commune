import { realpathSync } from 'node:fs'

export default defineNuxtConfig({
  site: {
    name: 'Cerebrum Commune 🧠',
  },
  css: ['~/assets/css/main.css'],
  vite: {
    server: {
      fs: {
        allow: [process.cwd(), realpathSync('node_modules')],
      },
    },
  },
})