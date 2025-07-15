import { useState } from 'react';
import MainLayout from '../layout/MainLayout';

export default function Voiceover() {
  const [script, setScript] = useState('');
  const [voiceId, setVoiceId] = useState('21m00Tcm4TlvDq8ikWAM'); // Default AI female voice
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generatedVoiceover, setGeneratedVoiceover] = useState<{voiceoverPath: string, uuid: string, message?: string} | null>(null);

  const voices = [
    { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel (Female)', gender: 'Female' },
    { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi (Female)', gender: 'Female' },
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella (Female)', gender: 'Female' },
    { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold (Male)', gender: 'Male' },
    { id: 'pNInz6obpgDQGcFmaJgB', name: 'Josh (Male)', gender: 'Male' },
  ];

  const handleGenerateVoiceover = async () => {
    if (!script.trim()) {
      setError('Please enter a script to generate voiceover');
      return;
    }

    setLoading(true);
    setError(null);
    setAudioUrl(null);
    setGeneratedVoiceover(null);

    try {
      const response = await fetch('http://localhost:5000/voiceover/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: script,
          voice_id: voiceId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Voiceover generation failed');
      }

      // Debug: Check response content type
      const contentType = response.headers.get('content-type');
      console.log('Response content type:', contentType);
      
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log('Received JSON data:', data);
        setGeneratedVoiceover(data);
        
        // Create audio URL for preview using the file path
        const audioResponse = await fetch(`http://localhost:5000/voiceover/file/${data.uuid}`);
        if (audioResponse.ok) {
          const blob = await audioResponse.blob();
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
        } else {
          console.error('Failed to fetch audio file:', audioResponse.status);
        }
      } else {
        // If it's not JSON, it might be the audio file directly
        console.log('Received non-JSON response, treating as audio file');
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        // Create a mock voiceover object for display
        setGeneratedVoiceover({
          uuid: `temp_${Date.now()}`,
          voiceoverPath: 'temp_voiceover.mp3',
          message: 'Voiceover generated (direct file response)'
        });
        return;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate voiceover');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (audioUrl) {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = 'voiceover.mp3';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2 text-white">AI Voiceover Generator</h2>
          <p className="text-zinc-400">Generate professional voiceovers from your script using AI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Script Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-white font-semibold mb-2">Script</label>
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Enter your script here... The AI will convert this text to speech with natural intonation and pacing."
                className="w-full h-64 p-4 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none resize-none"
              />
              <div className="text-xs text-zinc-400 mt-1">
                {script.length} characters
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Voice Selection</label>
              <select
                value={voiceId}
                onChange={(e) => setVoiceId(e.target.value)}
                className="w-full p-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
              >
                {voices.map((voice) => (
                  <option key={voice.id} value={voice.id}>
                    {voice.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleGenerateVoiceover}
              disabled={loading || !script.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {loading ? 'Generating Voiceover...' : 'Generate Voiceover'}
            </button>
          </div>

          {/* Audio Preview */}
          <div className="space-y-4">
            <div>
              <label className="block text-white font-semibold mb-2">Preview</label>
              <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700 min-h-[200px] flex items-center justify-center">
                {audioUrl ? (
                  <div className="w-full space-y-4">
                    <audio controls src={audioUrl} className="w-full" />
                    <button
                      onClick={handleDownload}
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
                    >
                      Download MP3
                    </button>
                  </div>
                ) : (
                  <div className="text-zinc-500 text-center">
                    <div className="text-4xl mb-2">🎤</div>
                    <p>Generated voiceover will appear here</p>
                  </div>
                )}
              </div>
            </div>

            {/* Voiceover Payload for Editing */}
            {generatedVoiceover && (
              <div className="bg-green-900/20 border border-green-500 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-green-400 mb-2">✅ Voiceover Generated Successfully!</h4>
                <div className="text-xs text-green-300 space-y-1">
                  <p><strong>UUID:</strong> {generatedVoiceover.uuid}</p>
                  <p><strong>File Path:</strong> {generatedVoiceover.voiceoverPath}</p>
                  <p><strong>Status:</strong> Ready for video rendering</p>
                </div>
                <div className="mt-3 p-2 bg-zinc-900 rounded text-xs">
                  <p className="text-yellow-400 mb-1"><strong>📋 Copy this UUID for Editing Screen:</strong></p>
                  <code className="text-green-400 break-all">{generatedVoiceover.uuid}</code>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-900/20 border border-red-500 text-red-400 p-4 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-zinc-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">💡 Tips for Better Voiceovers</h3>
          <ul className="text-zinc-300 space-y-2 text-sm">
            <li>• <strong>Natural pauses:</strong> Use commas and periods for natural speech breaks</li>
            <li>• <strong>Clear pronunciation:</strong> Avoid complex words or spell out acronyms</li>
            <li>• <strong>Optimal length:</strong> Keep scripts under 500 words for best results</li>
            <li>• <strong>Emotion:</strong> The AI will naturally emphasize important words</li>
            <li>• <strong>Format:</strong> Use proper punctuation for natural intonation</li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
} 