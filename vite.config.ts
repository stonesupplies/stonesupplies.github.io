import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ command }) => {
  return {
    // Si se compila para GitHub Pages usa rutas relativas, en local usa la raíz
    base: command === 'build' ? './' : '/',
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        // Solución limpia para el alias sin usar dependencias de "node:path"
        '@': '/src',
      },
    },
    server: {
      port: 4500,
      host: '0.0.0.0',
      strictPort: true, // Forzar puerto 4500 limpio
    },
  };
});
