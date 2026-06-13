import crypto from 'crypto';
import { openai, safeAICompletion } from './openai.js';
import { cacheGet, cacheSet } from './redis.js';
import logger from './logger.js';
import type { ResumeParsed, ATSResult } from './types.js';

export async function calculateATSScore(resume: ResumeParsed, jobDescription: string): Promise<ATSResult> {
  const hashInput = JSON.stringify({ text: resume.rawText?.slice(0, 2000), jd: jobDescription.slice(0, 2000) });
  const cacheKey = `ats:${crypto.createHash('md5').update(hashInput).digest('hex')}`;

  const cached = await cacheGet<ATSResult>(cacheKey);
  if (cached) {
    logger.info('ATS cache hit');
    return cached;
  }

  const completion = await safeAICompletion({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are an ATS expert. Analyze the resume against the job description and return ONLY valid JSON with:
        {
          "atsScore": <0-100>,
          "keywordMatch": { "score": <0-100>, "matched": [string], "missing": [string] },
          "formatScore": <0-100>,
          "experienceScore": <0-100>,
          "educationScore": <0-100>,
          "skillsScore": <0-100>,
          "sections": { "contact": bool, "summary": bool, "experience": bool, "education": bool, "skills": bool, "certifications": bool },
          "strengths": [string],
          "improvements": [string],
          "suggestions": [string],
          "summary": "<2-3 sentence analysis>"
        }`,
      },
      {
        role: 'user',
        content: `RESUME:\n${JSON.stringify(resume, null, 2)}\n\nJOB DESCRIPTION:\n${jobDescription}`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.1,
  });

  const result = JSON.parse(completion.choices[0].message.content!) as ATSResult;
  await cacheSet(cacheKey, result, 86400);
  return result;
}
