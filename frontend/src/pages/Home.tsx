import React, { useState, useRef, useEffect } from 'react';
import MainLayout from '../layout/MainLayout';
import ChatBubble from '../components/ChatBubble';
import ChatInput from '../components/ChatInput';

export default function Home() {
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'agent' }[]>([]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
      try {
        const res = await fetch('/api/ideate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: input })
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to generate topics');
        }
        const data = await res.json();
        if (Array.isArray(data.topics)) {
          const topicsText = data.topics.map((t: any) =>
            t.title && t.category ? `• ${t.title}  [${t.category}]` : `• ${JSON.stringify(t)}`
          ).join('\n');
          setMessages(msgs => [...msgs, { text: topicsText, sender: 'agent' }]);
        } else {
          setMessages(msgs => [...msgs, { text: 'Agent returned an unexpected response.', sender: 'agent' }]);
        }
      } catch (err: any) {
        setMessages(msgs => [...msgs, { text: `Error: ${err.message || 'Unknown error'}`, sender: 'agent' }]);
      }
    }
  };

  const samplePrompts = [
    'AI for marketing',
    'Build a script about product launches',
    'How to automate YouTube content?',
    'Podcast ideas for tech founders',
  ];

  return (
    <MainLayout>
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-zinc-400 select-none">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-white text-center">What's on the agenda today?</h1>
          <div className="text-base mb-2">Try a sample prompt:</div>
          <ul className="mb-6 space-y-2 w-full max-w-xs">
            {samplePrompts.map((p, i) => (
              <li key={i}>
                <button
                  className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm w-full text-left"
                  onClick={() => setInput(p)}
                >
                  {p}
                </button>
              </li>
            ))}
          </ul>
          <div className="text-sm text-zinc-500 text-center">e.g. "AI for marketing", "Build a script about product launches"</div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-full">
          {messages.map((msg, i) => (
            <ChatBubble key={i} text={msg.text} sender={msg.sender} />
          ))}
          <div ref={chatEndRef} />
        </div>
      )}
      <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-zinc-950 border-t border-zinc-800 px-2 sm:px-6 py-4 w-full max-w-2xl mx-auto" style={{ zIndex: 30 }}>
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
          disabled={false}
        />
      </div>
    </MainLayout>
  );
} 