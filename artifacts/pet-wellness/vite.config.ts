import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';

import fs from 'fs';

// Supabase throws a warning in Node 20 if WebSocket is missing. We don't use realtime, so mock it.
if (typeof globalThis.WebSocket === 'undefined') {
  globalThis.WebSocket = class WebSocket {
    constructor() {}
  } as any;
}

// Copy small banner images to public folder
try {
  const srcDir = path.resolve(import.meta.dirname, '../../The Last Session/Small Banner');
  const destDir = path.resolve(import.meta.dirname, 'public/small-banner');
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  if (fs.existsSync(srcDir)) {
    fs.readdirSync(srcDir).forEach(file => {
      if (file.endsWith('.png')) {
        fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
      }
    });
  }

  const mainSrcDir = path.resolve(import.meta.dirname, '../../The Last Session/Main Banner');
  const mainDestDir = path.resolve(import.meta.dirname, 'public/main-banner');
  if (!fs.existsSync(mainDestDir)) {
    fs.mkdirSync(mainDestDir, { recursive: true });
  }
  if (fs.existsSync(mainSrcDir)) {
    fs.readdirSync(mainSrcDir).forEach(file => {
      if (file.endsWith('.png')) {
        fs.copyFileSync(path.join(mainSrcDir, file), path.join(mainDestDir, file));
      }
    });
  }
} catch (e) {
  console.error('Failed to copy small banner images:', e);
}

function vercelApiProxyPlugin() {
  return {
    name: 'vercel-api-proxy-plugin',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (req.url?.startsWith('/api/')) {
          try {
            // Read body manually
            let body = '';
            req.on('data', (chunk: any) => {
              body += chunk.toString();
            });
            req.on('end', async () => {
              if (body) {
                try {
                  req.body = JSON.parse(body);
                } catch(e) {
                  req.body = body; // plain text for sendBeacon
                }
              }

              // Add Express-like helpers required by Vercel handlers
              res.status = (code: number) => {
                res.statusCode = code;
                return res;
              };
              res.json = (data: any) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
              };

              const urlParts = req.url.split('?')[0]; 
              const filePath = path.resolve(import.meta.dirname, `.${urlParts}.ts`);
              
              if (!fs.existsSync(filePath)) {
                res.statusCode = 404;
                return res.end(`API route not found: ${filePath}`);
              }
              
              // Load TS file dynamically via Vite
              const module = await server.ssrLoadModule(filePath);
              if (module && module.default) {
                await module.default(req, res);
              } else {
                res.statusCode = 500;
                res.end('Handler not found');
              }
            });
          } catch(err: any) {
            console.error(err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
        } else {
          next();
        }
      });
    }
  }
}

const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');
Object.assign(process.env, env);

// Make port optional for Vercel/static builds
const rawPort = process.env.PORT || '5173';
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH || '/';

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    vercelApiProxyPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(
        import.meta.dirname,
        '..',
        '..',
        'attached_assets',
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'wouter'],
          ui: ['framer-motion', 'lucide-react']
        }
      }
    }
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
