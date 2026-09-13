import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Bind IPv4 explicitly — Vite's default "localhost" binding can end up
    // IPv6-only on macOS, which browsers resolving "localhost" to 127.0.0.1
    // then can't reach (ERR_CONNECTION_REFUSED despite the server being up).
    host: '127.0.0.1',
  },
})
