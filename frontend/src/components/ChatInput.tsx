import React from 'react';

interface ChatInputProps {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export default function ChatInput({ value, onChange, onSend, disabled }: ChatInputProps) {
  return (
    <form
      className="flex items-center gap-2 w-full"
      onSubmit={e => {
        e.preventDefault();
        onSend();
      }}
    >
      <input
        type="text"
        className="flex-1 p-4 bg-zinc-800 rounded-lg outline-none text-white text-base"
        placeholder="Ask me anything..."
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && onSend()}
        autoFocus
        disabled={disabled}
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
        disabled={disabled || !value.trim()}
      >
        Send
      </button>
    </form>
  );
} 