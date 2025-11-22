// server/src/config/gemini.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  console.error('Missing GEMINI_API_KEY in .env');
  process.exit(1);
}

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export function getModel(modelName) {
  const model = modelName || 'gemini-2.0-flash-exp';
  return genAI.getGenerativeModel({ model });
}

console.log('✅ Gemini AI initialized (gemini-2.0-flash-exp ready)');
