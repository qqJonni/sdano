import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
// output: 'static' + адаптер Node (standalone) = статические страницы +
// серверные роуты по требованию (у нас /api/lead с `export const prerender = false`).
// Самохостинг на VPS: `node ./dist/server/entry.mjs` (HOST/PORT из env).
export default defineConfig({
  site: 'https://sdano-perm.ru',
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  integrations: [
    // applyBaseStyles: false — базовые стили держим в src/styles/global.css
    tailwind({ applyBaseStyles: false }),
    icon(),
    // sitemap: исключаем noindex-страницы и служебные
    sitemap({
      filter: (page) =>
        !page.includes('/design-system') &&
        !page.includes('/spasibo') &&
        !page.includes('/api/'),
    }),
  ],
  image: {
    // astro:assets — оптимизация изображений на этапе билда
    responsiveStyles: true,
  },
});
