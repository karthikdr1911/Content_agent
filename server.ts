import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
console.log('Loaded OPENAI_API_KEY:', process.env.OPENAI_API_KEY);
import { generateTopics } from './agents/ideationAgent.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/generate-topics', async (req, res) => {
  console.log('Received /api/generate-topics request:', req.body);
  try {
    const { prompt } = req.body;
    const topics = await generateTopics(prompt);
    res.json({ topics });
  } catch (err: any) {
    console.error('Error in /api/generate-topics:', err, err?.stack);
    res.status(500).json({ error: err.message || 'Unknown error' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend API running at http://localhost:${PORT}`);
}); 