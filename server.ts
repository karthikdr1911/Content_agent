import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
console.log('Loaded OPENAI_API_KEY:', process.env.OPENAI_API_KEY);
console.log('Loaded ELEVENLABS_API_KEY:', process.env.ELEVENLABS_API_KEY);
console.log('Loaded RUNWAYML_API_KEY:', process.env.RUNWAYML_API_KEY);
import renderRoutes from './routes/render';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(renderRoutes);

// Add other routes as needed
import voiceoverRoutes from './routes/voiceover';
app.use('/voiceover', voiceoverRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend API running at http://localhost:${PORT}`);
}); 