import path from 'path'
import VueI18n from '@intlify/vite-plugin-vue-i18n'
import Vue from '@vitejs/plugin-vue'
import Prism from 'markdown-it-prism'
import { UserConfig } from 'vite'
import ViteComponents from 'vite-plugin-components'
import ViteIcons, { ViteIconsResolver } from 'vite-plugin-icons'
import Markdown from 'vite-plugin-md'
import { VitePWA } from 'vite-plugin-pwa'
import Voie from 'vite-plugin-voie'

const config: UserConfig = {
  alias: {
    '/~/': `${path.resolve(__dirname, 'src')}/`,
  },
  plugins: [
    Vue({
      ssr: !!process.env.SSG,
    }),

    // https://github.com/vamplate/vite-plugin-voie
    Voie({
      // load index page sync and bundled with the landing page to improve first loading time.
      // feel free to remove if you don't need it
      importMode(path: string) {
        return path === '/src/pages/index.vue' ? 'sync' : 'async'
      },
      extensions: ['vue', 'md'],
    }),

    // https://github.com/antfu/vite-plugin-md
    Markdown({
      // for https://github.com/tailwindlabs/tailwindcss-typography
      wrapperClasses: 'prose prose-sm m-auto',
      markdownItSetup(md) {
        // https://prismjs.com/
        md.use(Prism)
      },
    }),

    // https://github.com/antfu/vite-plugin-components
    ViteComponents({
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md'],

      // allow auto import and register components used in markdown
      customLoaderMatcher: id => id.endsWith('.md'),

      // auto import icons
      customComponentResolvers: [
        // https://github.com/antfu/vite-plugin-icons
        ViteIconsResolver({
          componentPrefix: '',
          // enabledCollections: ['carbon']
        }),
      ],
    }),

    // https://github.com/antfu/vite-plugin-icons
    ViteIcons(),

    // https://github.com/antfu/vite-plugin-pwa
    VitePWA({
      manifest: {
        name: 'Woof',
        short_name: 'Woof',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),

    // https://github.com/intlify/vite-plugin-vue-i18n
    VueI18n({
      include: [path.resolve(__dirname, 'locales/**')],
    }),
  ],
}

export default config
