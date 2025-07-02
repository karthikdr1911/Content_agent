import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [prompt, setPrompt] = useState('')
  const [topics, setTopics] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setTopics([])
    try {
      const res = await fetch('http://localhost:3001/api/generate-topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      if (!res.ok) throw new Error('Failed to generate topics')
      const data = await res.json()
      setTopics(data.topics)
    } catch (err: any) {
      setError(err.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: 'auto' }}>
      <h2>Content Agent: Topic Generator</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Enter a prompt (e.g. AI for marketing)"
          style={{ width: '100%', marginBottom: 12 }}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Topics'}
        </button>
      </form>
      {error && <div style={{ color: 'red', margin: '12px 0' }}>{error}</div>}
      <div style={{ margin: '16px 0', minHeight: 40 }}>
        {topics.length > 0 && (
          <ul>
            {topics.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App
