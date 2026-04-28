import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  const fromBase = env.VITE_API_BASE_URL?.trim().replace(/\/api\/?$/, "") || ""
  const target = (
    env.VITE_API_PROXY_TARGET?.trim() ||
    (fromBase.startsWith("http") ? fromBase : "") ||
    "https://v1.imla.io"
  ).replace(/\/$/, "")

  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        "/api": {
          target,
          changeOrigin: true,
          secure: true,
          cookieDomainRewrite: "localhost",
        },
        "/sanctum": {
          target,
          changeOrigin: true,
          secure: true,
          cookieDomainRewrite: "localhost",
        },
      },
    },
  }
})
