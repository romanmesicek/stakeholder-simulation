import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('react-markdown') || id.includes('remark') || id.includes('rehype') ||
              id.includes('micromark') || id.includes('mdast') || id.includes('hast') ||
              id.includes('unified') || id.includes('unist') || id.includes('vfile')) {
            return 'markdown';
          }
          if (id.includes('@supabase')) return 'supabase';
          if (id.includes('qrcode')) return 'qrcode';
          return 'vendor';
        },
      },
    },
  },
})
