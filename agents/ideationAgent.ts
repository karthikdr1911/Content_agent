// Content Ideation Agent
// Usage: await generateTopics(prompt)

import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { appendToSheet } from '../services/googleSheetsService';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const IDEATION_PATH = path.join(__dirname, '../data/ideation.json');

export async function generateTopics(prompt: string): Promise<string[]> {
  if (!OPENAI_API_KEY) throw new Error('OPENAI_API_KEY not set');

  const systemPrompt = `Generate 5-10 trending content topics based on: ${prompt}`;
  const res = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a content ideation assistant.' },
        { role: 'user', content: systemPrompt }
      ],
      max_tokens: 256,
      temperature: 0.8
    },
    {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  // Parse topics from response
  const text = res.data.choices[0].message.content;
  const topics = text
    .split('\n')
    .map(line => line.replace(/^\d+\.\s*/, '').trim())
    .filter(Boolean);

  // Store in ideation.json
  let allIdeas: string[][] = [];
  if (fs.existsSync(IDEATION_PATH)) {
    allIdeas = JSON.parse(fs.readFileSync(IDEATION_PATH, 'utf-8'));
  }
  allIdeas.push(topics);
  fs.writeFileSync(IDEATION_PATH, JSON.stringify(allIdeas, null, 2));

  // Send to Google Sheets
  await appendToSheet([new Date().toISOString(), ...topics]);

  return topics;
}

export async function runIdeation(): Promise<string[]> {
  // TODO: Implement OpenAI call
  return [
    'AI in Content Creation',
    'Trends in Short-Form Video',
    'How to Automate Social Media',
    'Voice Cloning for Creators',
    'YouTube Analytics Deep Dive'
  ];
} 