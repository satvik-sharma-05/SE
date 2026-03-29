import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ mode }) => {
  // Load env variables properly
  const env = loadEnv(mode, process.cwd(), '')

  // Log the API URL for debugging (optional in production)
  if (env.VITE_API_BASE_URL) {
    console.log('✅ Using VITE_API_BASE_URL:', env.VITE_API_BASE_URL)
  } else {
    console.log('⚠️ VITE_API_BASE_URL not set, using fallback in api.js')
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    define: {
      __API_BASE__: JSON.stringify(env.VITE_API_BASE_URL || ''),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
