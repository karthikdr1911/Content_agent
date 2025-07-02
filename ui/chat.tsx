import React, { useState } from 'react';

const ChatUI = () => {
  const [prompt, setPrompt] = useState('Give me a topic');
  const [topics, setTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePrompt = async () => {
    setLoading(true);
    setError('');
    setTopics([]);
    try {
      const res = await fetch('/api/generate-topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      if (!res.ok) throw new Error('Failed to generate topics');
      const data = await res.json();
      setTopics(data.topics);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleSendToSheets = () => {
    // TODO: Send to Google Sheets
    alert('Sent to Google Sheets');
  };

  const handleGenerateVO = () => {
    // TODO: Generate Voiceover
    alert('Voiceover generated');
  };

  const handleRenderVideo = () => {
    // TODO: Render Video
    alert('Video rendered');
  };

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: 'auto' }}>
      <h2>Content Agent Chat</h2>
      <input
        type="text"
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        style={{ width: '100%', marginBottom: 12 }}
      />
      <button onClick={handlePrompt} disabled={loading}>
        {loading ? 'Generating...' : 'Submit'}
      </button>
      {error && <div style={{ color: 'red', margin: '12px 0' }}>{error}</div>}
      <div style={{ margin: '16px 0', minHeight: 40 }}>
        {topics.length > 0 && (
          <ul>
            {topics.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        )}
      </div>
      <button onClick={handleSendToSheets}>Send to Sheets</button>
      <button onClick={handleGenerateVO}>Generate VO</button>
      <button onClick={handleRenderVideo}>Render Video</button>
    </div>
  );
};

export default ChatUI;

// Minimal Express backend for local API
if (require.main === module) {
  const express = require('express');
  const bodyParser = require('body-parser');
  const cors = require('cors');
  const { generateTopics } = require('../agents/ideationAgent');

  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  app.post('/api/generate-topics', async (req, res) => {
    try {
      const { prompt } = req.body;
      const topics = await generateTopics(prompt);
      res.json({ topics });
    } catch (err) {
      res.status(500).json({ error: err.message || 'Unknown error' });
    }
  });

  const PORT = process.env.PORT || 5173;
  app.listen(PORT, () => {
    console.log(`UI/Backend running at http://localhost:${PORT}`);
  });
} 