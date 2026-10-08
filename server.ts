import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiRouter } from './server/apiRouter.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

// Mount the unified API router at standard prefixes
app.use('/api', apiRouter);
app.use('/.netlify/functions/api', apiRouter);
app.use('/.netlify/functions', apiRouter);

// Global Express error handler to return JSON for API errors
app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  if (req.path.startsWith('/api') || req.path.startsWith('/.netlify/functions')) {
    return res.status(err.status || 500).json({
      error: err.message || 'Internal server error',
      status: err.status || 500,
    });
  }
  return res.status(500).send('Internal Server Error');
});

// Vite dev server mounting or static serving (only run if not inside serverless execution)
async function setupServer() {
  if (process.env.NETLIFY === 'true' || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.VERCEL) {
    // When running inside a serverless runtime, avoid spawning Vite dev server or listening on port
    return;
  }

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api') || req.path.startsWith('/.netlify/functions')) {
        return res.status(404).json({
          error: 'API endpoint not found',
          message: `Cannot ${req.method} ${req.originalUrl || req.path}`,
          status: 404,
        });
      }
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Scholarship Finder server listening on http://0.0.0.0:${PORT}`);
  });
}

// Only start the HTTP listener if this file was executed directly
setupServer();
