import express from 'express';
import cookieParser from 'cookie-parser';
import { apiRouter } from '../server/apiRouter.ts';

const app = express();

app.use(express.json());
app.use(cookieParser());

// Enable CORS headers for Vercel Serverless Function
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Mount router on both '/api' and root '/'
// This ensures routes match regardless of how Vercel rewrites the path
app.use('/api', apiRouter);
app.use('/', apiRouter);

// Global Express error handler returning JSON
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Vercel API Error]:', err);
  return res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    status: err.status || 500,
  });
});

export default function handler(req: any, res: any) {
  return app(req, res);
}
