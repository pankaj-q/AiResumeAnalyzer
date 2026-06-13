import OpenAI from 'openai';
import logger from './logger.js';
import type { OpenAIError } from './types.js';

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function safeAICompletion(params: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming) {
  try {
    return await openai.chat.completions.create(params);
  } catch (err: unknown) {
    const error = err as OpenAIError;
    logger.error('OpenAI API error', { status: error.status, message: error.message });

    if (error.status === 401) {
      const e = new Error('Invalid OpenAI API key. Set a valid OPENAI_API_KEY in .env');
      (e as OpenAIError).statusCode = 502;
      throw e;
    }
    if (error.status === 429) {
      const e = new Error(
        'OpenAI quota exceeded. Add billing credits at https://platform.openai.com/settings/organization/billing'
      );
      (e as OpenAIError).statusCode = 502;
      throw e;
    }
    if (error.status === 400) {
      const e = new Error('OpenAI request failed. Check your resume text is readable.');
      (e as OpenAIError).statusCode = 502;
      throw e;
    }

    const e = new Error(`AI service error: ${error.message}`);
    (e as OpenAIError).statusCode = 502;
    throw e;
  }
}
