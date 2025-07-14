import { Request, Response } from 'express';
import { generateTopics } from '../agents/ideationAgent';

export const ideateController = async (req: Request, res: Response) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt in request body' });
  }
  try {
    const topics = await generateTopics(prompt);
    res.json({ topics });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message || 'Failed to generate topics' });
  }
}; 