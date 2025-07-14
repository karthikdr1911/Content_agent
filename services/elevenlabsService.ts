import axios from 'axios';
import fs from 'fs';
import path from 'path';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_BASE_URL = 'https://api.elevenlabs.io/v1';
const DEFAULT_VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // ElevenLabs default voice

export const synthesizeSpeech = async (
  script: string,
  outPath: string,
  voiceId?: string
): Promise<string> => {
  if (!ELEVENLABS_API_KEY) throw new Error('ELEVENLABS_API_KEY not set');
  const voice = voiceId || DEFAULT_VOICE_ID;
  const url = `${ELEVENLABS_BASE_URL}/text-to-speech/${voice}`;
  const headers = {
    'xi-api-key': ELEVENLABS_API_KEY,
    'Content-Type': 'application/json',
    'Accept': 'audio/mpeg',
  };
  const data = {
    text: script,
    model_id: 'eleven_monolingual_v1',
    voice_settings: { stability: 0.5, similarity_boost: 0.75 }
  };
  const response = await axios.post(url, data, { headers, responseType: 'arraybuffer' });
  fs.writeFileSync(outPath, response.data);
  return outPath;
}; 