import { db } from '../server/db.ts';

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let profileData: any = {};
    if (req.method === 'POST') {
      profileData = req.body || {};
    } else {
      const q = req.query || {};
      profileData = {
        educationLevel: q.educationLevel,
        course: q.course,
        state: q.state,
        annualIncome: q.annualIncome ? Number(q.annualIncome) : undefined,
        academicScore: q.academicScore ? Number(q.academicScore) : undefined,
        category: q.category,
        gender: q.gender,
        disabilityStatus: q.disabilityStatus === 'true',
      };
    }

    const matches = db.calculateAIMatches(profileData);
    return res.status(200).json({
      matches,
      totalMatched: matches.length,
      profile: profileData,
    });
  } catch (err: any) {
    console.error('Vercel match API error:', err);
    return res.status(500).json({ error: err.message || 'Error calculating matches' });
  }
}
