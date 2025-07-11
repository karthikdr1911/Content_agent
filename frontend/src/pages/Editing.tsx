import React, { useState } from 'react';
import MainLayout from '../layout/MainLayout';

export default function Editing() {
  const [intro, setIntro] = useState('This is the intro');
  const [points, setPoints] = useState(['First point', 'Second point']);
  const [outro, setOutro] = useState('This is the outro');
  const [cta, setCta] = useState('Call to action!');
  const [images, setImages] = useState<File[]>([]); // User-uploaded images
  const [audio, setAudio] = useState<File | null>(null); // User-uploaded audio
  const [uuid, setUuid] = useState('test123'); // Simulated uuid
  const [loading, setLoading] = useState(false);
  const [videoPath, setVideoPath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle image file selection (multiple)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  // Handle audio file selection
  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudio(e.target.files[0]);
    }
  };

  const handleRender = async () => {
    setLoading(true);
    setError(null);
    setVideoPath(null);
    try {
      const formData = new FormData();
      formData.append('uuid', uuid);
      formData.append('intro', intro);
      formData.append('outro', outro);
      formData.append('cta', cta);
      points.forEach((pt, i) => formData.append(`points[${i}]`, pt));
      images.forEach((img, i) => formData.append('images', img));
      if (audio) formData.append('audio', audio);

      const res = await fetch('/api/render', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Render failed');
      }
      const data = await res.json();
      setVideoPath(data.videoPath);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-4 w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Video Rendering Test</h2>
        <label className="text-white">Intro</label>
        <input className="p-2 rounded bg-zinc-800 text-white" value={intro} onChange={e => setIntro(e.target.value)} />
        <label className="text-white">Points (comma separated)</label>
        <input className="p-2 rounded bg-zinc-800 text-white" value={points.join(', ')} onChange={e => setPoints(e.target.value.split(',').map(s => s.trim()))} />
        <label className="text-white">Outro</label>
        <input className="p-2 rounded bg-zinc-800 text-white" value={outro} onChange={e => setOutro(e.target.value)} />
        <label className="text-white">CTA</label>
        <input className="p-2 rounded bg-zinc-800 text-white" value={cta} onChange={e => setCta(e.target.value)} />
        <label className="text-white mt-2">Upload Images (for intro, points, outro, cta; order matters)</label>
        <input type="file" accept="image/*" multiple onChange={handleImageChange} className="text-white" />
        <div className="flex flex-wrap gap-2 mt-2">
          {images.map((img, i) => (
            <div key={i} className="flex flex-col items-center">
              <img src={URL.createObjectURL(img)} alt={`img${i}`} className="w-32 h-20 object-cover rounded border border-zinc-700" />
              <span className="text-xs text-zinc-400 mt-1">{img.name}</span>
            </div>
          ))}
        </div>
        <label className="text-white mt-2">Upload Voiceover (mp3)</label>
        <input type="file" accept="audio/*" onChange={handleAudioChange} className="text-white" />
        {audio && (
          <div className="mt-2 flex flex-col items-start">
            <audio controls src={URL.createObjectURL(audio)} className="w-64" />
            <span className="text-xs text-zinc-400 mt-1">{audio.name}</span>
          </div>
        )}
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold mt-4"
          onClick={handleRender}
          disabled={loading}
        >
          {loading ? 'Rendering...' : 'Render Video'}
        </button>
        {error && <div className="text-red-400 mt-2">Error: {error}</div>}
        {videoPath && (
          <div className="mt-6 w-full flex flex-col items-center">
            <h3 className="text-lg text-white mb-2">Rendered Video:</h3>
            <video src={videoPath} controls className="w-full max-w-xl rounded-lg border border-zinc-700" />
          </div>
        )}
    </div>
    </MainLayout>
  );
} 