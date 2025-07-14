import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="w-60 bg-zinc-900 h-screen p-4 fixed">
      <h2 className="text-white text-lg font-bold mb-6">Content Agent</h2>
      <ul className="space-y-4">
        <li><Link to="/" className="text-white">Home</Link></li>
        <li><Link to="/script" className="text-white">Script</Link></li>
      </ul>
    </div>
  );
} 