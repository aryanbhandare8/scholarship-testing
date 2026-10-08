import { db } from '../server/db.ts';

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const query = req.query || {};
    const result = db.searchScholarships({
      search: query.search as string,
      educationLevel: query.educationLevel as string,
      course: query.course as string,
      state: query.state as string,
      category: query.category as string,
      annualIncomeLimit: query.annualIncomeLimit ? Number(query.annualIncomeLimit) : undefined,
      minAcademicScore: query.minAcademicScore ? Number(query.minAcademicScore) : undefined,
      gender: query.gender as string,
      maxAmount: query.maxAmount ? Number(query.maxAmount) : undefined,
      provider: query.provider as string,
      deadlineFilter: query.deadlineFilter as string,
      sortBy: query.sortBy as string,
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 50,
    });

    return res.status(200).json(result);
  } catch (err: any) {
    console.error('Vercel scholarships API error:', err);
    return res.status(500).json({ error: err.message || 'Error fetching scholarships' });
  }
}
