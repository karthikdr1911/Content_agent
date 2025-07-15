
interface ChatBubbleProps {
  text: string;
  sender: 'user' | 'agent';
}

export default function ChatBubble({ text, sender }: ChatBubbleProps) {
  return (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
      <div
        className={`rounded-lg px-4 py-3 max-w-[75%] break-words shadow-md text-base sm:text-lg ${
          sender === 'user'
            ? 'bg-blue-600 text-white self-end'
            : 'bg-zinc-800 text-zinc-100 self-start'
        }`}
      >
        {text}
      </div>
    </div>
  );
} 