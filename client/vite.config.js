import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ mode }) => {
  // 👇 Load env variables properly
  const env = loadEnv(mode, process.cwd(), '')

  if (!env.VITE_API_BASE_URL) {
    throw new Error('❌ VITE_API_BASE_URL is missing at build time')
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    define: {
      __API_BASE__: JSON.stringify(env.VITE_API_BASE_URL),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
