import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.__NEXT_ROUTER_BASEPATH': JSON.stringify(env.__NEXT_ROUTER_BASEPATH),
      'process.env.NEXT_PUBLIC_APP_URL': JSON.stringify(env.NEXT_PUBLIC_APP_URL),
    },
    plugins: [react()],
  }
})
