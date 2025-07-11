import axios from 'axios';
import fs from 'fs';

/**
 * Generate an image using DALL·E 3 for a given prompt and save it to outPath.
 * @param prompt - The prompt describing the image to generate.
 * @param outPath - The file path to save the generated image.
 * @returns The path to the saved image.
 */
export async function generateImageForSection(prompt: string, outPath: string): Promise<string> {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set in environment variables');
  }
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1280x720',
        response_format: 'url',
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const imageUrl = response.data.data[0].url;
    const imageResp = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    fs.writeFileSync(outPath, imageResp.data);
    return outPath;
  } catch (err: any) {
    console.error('DALL·E image generation failed:', err.message);
    throw new Error('DALL·E image generation failed');
  }
} 