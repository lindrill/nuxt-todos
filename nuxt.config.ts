// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    'nuxt-quasar-ui',
    '@vueuse/nuxt'
  ],
  css: ['~/assets/css/main.css'],
  quasar: {
    // Configurable Component Defaults
    iconSet: 'fontawesome-v6', // Sets the default icon set for Quasar components
    components: {
      defaults: {
        QBtn: {
          // dense: true,
          // flat: true,
        },
        QInput: {
          // dense: true
        }
      }
    },
    extras: {
      fontIcons: [
        'material-icons', // Standard Quasar icons
        'mdi-v7',         // Material Design Icons
        'fontawesome-v6'  // FontAwesome
      ],
      svgIcons: [
        'material-icons'  // Optional: for SVG-based icons
      ]
    },
    plugins: [
      'Notify' // Required to enable the $q.notify functionality
    ],
  },
  runtimeConfig: {
    // Keys inside public are available client-side and server-side
    public: {
      apiBase: 'http://localhost:3300', // Automatically overridden by NUXT_PUBLIC_API_BASE at runtime
    }
  }
  // vueuse: {
  //   autoImports: true
  // }
})