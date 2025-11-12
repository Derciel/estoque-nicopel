import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

import react from '@astrojs/react';

export default defineConfig({
  integrations: [tailwind({
    configFile: './tailwind.config.mjs'
  }), react()],
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  vite: {
    ssr: {
      noExternal: ['pdfmake', 'xlsx']
    }
  }
});