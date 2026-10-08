import type { Config } from '@netlify/functions';
import { db } from '../../server/db.ts';

export const config: Config = {
  path: '/api/match',
};

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      },
    });
  }

  try {
    let profile: any = {};
    if (req.method === 'POST') {
      try {
        profile = await req.json();
      } catch (_e) {
        profile = {};
      }
    } else {
      const url = new URL(req.url);
      const q = url.searchParams;
      profile = {
        educationLevel: q.get('educationLevel') || undefined,
        academicScore: Number(q.get('academicScore')) || 80,
        annualIncome: Number(q.get('annualIncome')) || 250000,
        state: q.get('state') || undefined,
        category: q.get('category') || undefined,
        gender: q.get('gender') || undefined,
        course: q.get('course') || undefined,
      };
    }

    const matches = db.calculateAIMatches(profile);

    return Response.json(
      {
        success: true,
        matches,
        totalEvaluated: db.scholarships.length,
        counselorInsight: `Based on your profile with ${profile.academicScore || 80}% in ${
          profile.course || 'your course'
        }, we identified ${matches.length} matching scholarship opportunities tailored for you.`,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error: any) {
    return Response.json(
      {
        error: error.message || 'Error processing AI match',
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
