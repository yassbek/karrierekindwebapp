// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    css: [
        "@/assets/scss/fonts.css", "@/assets/scss/global.scss",
    ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/scss/_vars.scss" as *;',
        },
      },
    },
    optimizeDeps: {
      include: [
        '@heroicons/vue/outline',
        '@heroicons/vue/solid',
      ]
    }
  },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
  ],
  build: {
    transpile: [
      '@heroicons/vue',
    ],
  },
  runtimeConfig: {
    directusToken: process.env.DIRECTUS_TOKEN || '',
    public: {
      directusUrl: process.env.DIRECTUS_URL || '',
      siteUrl: process.env.SITE_URL || '',
    }
  },
  components: [
    '~/components'
  ]
})
