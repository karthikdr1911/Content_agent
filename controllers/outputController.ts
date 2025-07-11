import { Request, Response } from 'express';
export const outputController = async (req: Request, res: Response) => {
  // TODO: Implement output fetch by ID
  res.json({ id: req.params.id, topic: 'stub', script: 'stub', audioUrl: 'stub', videoPath: 'stub' });
}; 