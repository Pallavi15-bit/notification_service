echo import { defineConfig } from 'vite'; > vite.config.js
echo import react from '@vitejs/plugin-react'; >> vite.config.js
echo. >> vite.config.js
echo export default defineConfig({ >> vite.config.js
echo   plugins: [react()], >> vite.config.js
echo   server: { >> vite.config.js
echo     proxy: { >> vite.config.js
echo       '/api': { >> vite.config.js
echo         target: 'http://localhost:3000', >> vite.config.js
echo         changeOrigin: true, >> vite.config.js
echo         rewrite: (path) ^=> path.replace(/^\/api/, '') >> vite.config.js
echo       } >> vite.config.js
echo     } >> vite.config.js
echo   } >> vite.config.js
echo }); >> vite.config.js
