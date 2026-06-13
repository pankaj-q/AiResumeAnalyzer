import OpenAI from 'openai';
import logger from './logger.js';

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function safeAICompletion(params) {
  try {
    return await openai.chat.completions.create(params);
  } catch (err) {
    logger.error('OpenAI API error', { status: err.status, message: err.message });

    if (err.status === 401) {
      throw Object.assign(new Error('Invalid OpenAI API key. Set a valid OPENAI_API_KEY in .env'), { statusCode: 502 });
    }
    if (err.status === 429) {
      throw Object.assign(
        new Error('OpenAI quota exceeded. Add billing credits at https://platform.openai.com/settings/organization/billing'),
        { statusCode: 502 }
      );
    }
    if (err.status === 400) {
      throw Object.assign(new Error('OpenAI request failed. Check your resume text is readable.'), { statusCode: 502 });
    }

    throw Object.assign(new Error(`AI service error: ${err.message}`), { statusCode: 502 });
  }
}
