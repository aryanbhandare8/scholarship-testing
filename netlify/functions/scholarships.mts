import type { Config } from '@netlify/functions';
import { db as memDb } from '../../server/db.ts';

export const config: Config = {
  path: ['/api/scholarships', '/api/scholarships/*'],
};

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      },
    });
  }

  const url = new URL(req.url);
  const path = url.pathname;

  try {
    // 1. POST /api/scholarships/:id/save
    const saveMatch = path.match(/\/api\/scholarships\/([^/]+)\/save/);
    if (saveMatch && req.method === 'POST') {
      const scholarshipId = saveMatch[1];
      let userId = 'usr-student-1';
      try {
        const body = await req.json();
        if (body?.userId) userId = body.userId;
      } catch {}
      memDb.saveScholarship(userId, scholarshipId);
      return Response.json(
        { success: true, message: 'Saved successfully' },
        { headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // 2. DELETE /api/scholarships/:id/save
    if (saveMatch && req.method === 'DELETE') {
      const scholarshipId = saveMatch[1];
      let userId = 'usr-student-1';
      try {
        const body = await req.json();
        if (body?.userId) userId = body.userId;
      } catch {}
      memDb.unsaveScholarship(userId, scholarshipId);
      return Response.json(
        { success: true, message: 'Unsaved successfully' },
        { headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // 3. GET /api/scholarships/:id
    const singleMatch = path.match(/\/api\/scholarships\/([^/]+)$/);
    if (singleMatch && singleMatch[1] !== 'search') {
      const scholarshipId = singleMatch[1];
      const scholarship = memDb.getScholarshipById(scholarshipId);
      if (!scholarship) {
        return Response.json(
          { error: 'Scholarship not found' },
          { status: 404, headers: { 'Access-Control-Allow-Origin': '*' } }
        );
      }
      return Response.json(
        { scholarship },
        { headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // 4. GET /api/scholarships or /api/scholarships/search
    const params = url.searchParams;
    const result = memDb.searchScholarships({
      search: params.get('search') || undefined,
      educationLevel: params.get('educationLevel') || undefined,
      course: params.get('course') || undefined,
      state: params.get('state') || undefined,
      category: params.get('category') || undefined,
      annualIncomeLimit: params.get('annualIncomeLimit')
        ? Number(params.get('annualIncomeLimit'))
        : undefined,
      minAcademicScore: params.get('minAcademicScore')
        ? Number(params.get('minAcademicScore'))
        : undefined,
      gender: params.get('gender') || undefined,
      maxAmount: params.get('maxAmount') ? Number(params.get('maxAmount')) : undefined,
      provider: params.get('provider') || undefined,
      deadlineFilter: params.get('deadlineFilter') || undefined,
      sortBy: params.get('sortBy') || undefined,
      page: params.get('page') ? Number(params.get('page')) : 1,
      limit: params.get('limit') ? Number(params.get('limit')) : 50,
    });

    return Response.json(result, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    console.error('Error handling scholarship request:', error);
    return Response.json(
      {
        error: error.message || 'Failed to fetch scholarships',
        status: 500,
      },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
