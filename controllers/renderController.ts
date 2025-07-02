import { Request, Response } from 'express';
export const renderController = async (req: Request, res: Response) => {
  // TODO: Implement video rendering
  res.json({ videoPath: 'stub-video-path.mp4' });
}; 