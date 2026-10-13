import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey || apiKey === 'your_google_gemini_api_key') {
  console.warn('\n⚠️ [AgriAdvisor Server] WARNING: GEMINI_API_KEY is not set or using placeholder.');
  console.warn('Set GEMINI_API_KEY in server/.env to enable live Google Gemini 2.5 AI calls.\n');
}

export const ai = apiKey && apiKey !== 'your_google_gemini_api_key'
  ? new GoogleGenAI({ apiKey })
  : null;

export const GEMINI_MODEL = 'gemini-2.5-flash';

export const isGeminiConfigured = () => {
  return Boolean(ai && process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_google_gemini_api_key');
};
