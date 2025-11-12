// astro.config.mjs

import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';
import react from '@astrojs/react';

export default defineConfig({
  // Integrações
  integrations: [
    tailwind({
      configFile: './tailwind.config.mjs'
    }), 
    react()
  ],

  // Configuração do Servidor (SSR)
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  
  // Configuração do Vite (Build)
  vite: {
    ssr: {
      // Isso é crucial para bibliotecas que não são "ESM nativo"
      noExternal: ['pdfmake', 'xlsx'] 
    }
  }, // <--- ⬅️ ESTA ERA A VÍRGULA QUE FALTAVA!

  // Configuração do Servidor (Runtime)
  server: {
    // Força a porta a 3000 para ambientes que precisam ser explícitos (Render)
    port: 3000, 
    host: true // Garante que escute em todas as interfaces de rede
  }
});