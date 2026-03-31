import electron from 'vite-plugin-electron/simple'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    electron({
      main: {
        entry: 'electron/main.ts',
      },
      preload: {
        input: 'electron/preload.ts',
      },
    }),
  ],
})
