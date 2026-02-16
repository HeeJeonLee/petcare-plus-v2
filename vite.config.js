import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'PetCare+ 펫보험 비교',
        short_name: 'PetCare+',
        description: 'AI 기반 펫보험 비교 및 상담 플랫폼',
        theme_color: '#2563eb'
      }
    })
  ],
})
