import axios from 'axios';

const RUNWAY_API_URL = 'https://api.runwayml.com/v1/generate/video';

/**
 * Generate a video from a text prompt and image using RunwayML Gen-4
 * @param prompt Text prompt for video generation
 * @param image_url Publicly accessible image URL for the first frame
 * @param duration Video duration in seconds (5 or 10, default 5)
 * @param ratio Aspect ratio (e.g., '16:9', default '16:9')
 * @returns Video download URL
 */
export async function generateRunwayVideo(prompt: string, image_url: string, duration = 5, ratio = '16:9'): Promise<string> {
  const RUNWAY_API_KEY = process.env.RUNWAYML_API_KEY;
  if (!RUNWAY_API_KEY) {
    throw new Error('RUNWAYML_API_KEY not set in environment');
  }
  if (!prompt || !image_url) {
    throw new Error('Both prompt and image_url are required for Gen-4 video generation');
  }

  // Debug log: show request details
  console.log('RunwayML API POST URL:', RUNWAY_API_URL);
  console.log('RunwayML API POST headers:', { Authorization: `Bearer ${RUNWAY_API_KEY}` });
  console.log('RunwayML API POST body:', {
    input: {
      prompt,
      image_url,
      duration,
      ratio
    }
  });

  // 1. Submit prompt + image
  let submitRes;
  try {
    submitRes = await axios.post(
      RUNWAY_API_URL,
      {
        input: {
          prompt,
          image_url,
          duration,
          ratio
        }
      },
      { headers: { Authorization: `Bearer ${RUNWAY_API_KEY}` } }
    );
    // Debug log: show response status and data
    console.log('RunwayML POST response status:', submitRes.status);
    console.log('RunwayML POST response data:', submitRes.data);
  } catch (err: any) {
    if (err.response) {
      console.error('RunwayML API error:', err.response.status, err.response.data);
      throw new Error(`RunwayML API error: ${err.response.status} ${JSON.stringify(err.response.data)}`);
    }
    throw err;
  }

  const jobId = submitRes.data.id || submitRes.data.generation_id;
  if (!jobId) {
    throw new Error('RunwayML: No job ID returned');
  }

  // 2. Poll for completion
  let status = 'pending';
  let videoUrl = '';
  for (let i = 0; i < 60; i++) { // Poll up to 60s
    await new Promise(r => setTimeout(r, 2000));
    let pollRes;
    try {
      pollRes = await axios.get(
        `${RUNWAY_API_URL}/${jobId}`,
        { headers: { Authorization: `Bearer ${RUNWAY_API_KEY}` } }
      );
    } catch (err: any) {
      if (err.response) {
        console.error('RunwayML status poll error:', err.response.status, err.response.data);
        throw new Error(`RunwayML status poll error: ${err.response.status} ${JSON.stringify(err.response.data)}`);
      }
      throw err;
    }
    status = pollRes.data.status;
    if (status === 'succeeded' && pollRes.data.output && pollRes.data.output.video_url) {
      videoUrl = pollRes.data.output.video_url;
      break;
    }
    if (status === 'failed') {
      throw new Error('RunwayML: Video generation failed');
    }
  }
  if (!videoUrl) throw new Error('RunwayML: Timed out waiting for video');
  return videoUrl;
} 