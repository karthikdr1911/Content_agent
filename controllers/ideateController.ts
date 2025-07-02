import { Request, Response } from 'express';
export const ideateController = async (req: Request, res: Response) => {
  // TODO: Implement topic generation using OpenAI
  res.json({ topics: ['stub topic 1', 'stub topic 2'] });
}; 