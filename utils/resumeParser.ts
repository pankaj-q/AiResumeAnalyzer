import crypto from 'crypto';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import { openai, safeAICompletion } from './openai.js';
import { cacheGet, cacheSet } from './redis.js';
import logger from './logger.js';
import type { ResumeParsed } from './types.js';

export async function parseResume(buffer: Buffer, fileName: string): Promise<ResumeParsed> {
  const rawText = fileName.toLowerCase().endsWith('.pdf')
    ? (await pdf(buffer)).text
    : (await mammoth.extractRawText({ buffer })).value;

  const cacheKey = `parse:${crypto.createHash('md5').update(rawText.slice(0, 2000)).digest('hex')}`;
  const cached = await cacheGet<ResumeParsed>(cacheKey);
  if (cached) {
    logger.info('Resume parse cache hit');
    return cached;
  }

  const completion = await safeAICompletion({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Extract structured JSON from the resume with these fields:
          fullName, email, phone, summary, skills (array), experience (array of {title, company, duration, highlights}),
          education (array of {degree, institution, year}), certifications (array).
          If a field is missing, use null or empty array. Return ONLY valid JSON.`,
      },
      { role: 'user', content: rawText },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.1,
  });

  const parsed = JSON.parse(completion.choices[0].message.content!) as Omit<ResumeParsed, 'rawText'>;
  const result: ResumeParsed = { rawText, ...parsed };

  await cacheSet(cacheKey, result, 86400);
  return result;
}
