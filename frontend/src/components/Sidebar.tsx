import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="flex flex-col bg-zinc-900 border-r border-zinc-800 p-6 h-full">
      <h2 className="text-white text-xl font-bold mb-8">Halloha</h2>
      <nav aria-label="Main navigation">
        <ul className="space-y-4">
          <li><Link to="/about" className="text-white hover:text-blue-400 transition-colors">About</Link></li>
          <li><Link to="/" className="text-white hover:text-blue-400 transition-colors">Home</Link></li>
          <li><Link to="/script" className="text-white hover:text-blue-400 transition-colors">Script</Link></li>
          <li><Link to="/voiceover" className="text-white hover:text-blue-400 transition-colors">Voiceover</Link></li>
          <li><Link to="/editing" className="text-white hover:text-blue-400 transition-colors">Editing</Link></li>
        </ul>
      </nav>
    </div>
  );
} 