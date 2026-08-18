import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';
import vercel from '@astrojs/vercel';

// https://astro.build/config
// output: 'static' + адаптер Vercel = статические страницы + серверные роуты
// по требованию (у нас это /api/lead с `export const prerender = false`).
export default defineConfig({
  site: 'https://sdano-perm.ru',
  output: 'static',
  adapter: vercel(),
  integrations: [
    // applyBaseStyles: false — базовые стили держим в src/styles/global.css
    tailwind({ applyBaseStyles: false }),
    icon(),
  ],
  image: {
    // astro:assets — оптимизация изображений на этапе билда
    responsiveStyles: true,
  },
});
