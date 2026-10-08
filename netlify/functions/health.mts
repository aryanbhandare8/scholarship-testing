import type { Config } from '@netlify/functions';

export const config: Config = {
  path: '/api/health',
};

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
    });
  }

  return Response.json(
    { status: 'ok', timestamp: new Date().toISOString() },
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}

// Legacy AWS handler fallback
export async function handlerLegacy(event: any, _context: any) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }),
  };
}
