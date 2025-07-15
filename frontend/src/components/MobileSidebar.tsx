import Sidebar from './Sidebar';

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex md:hidden">
      <div className="bg-zinc-900 w-64 h-full border-r border-zinc-800 transition-transform duration-200">
        <Sidebar />
      </div>
      <div className="flex-1 bg-black bg-opacity-40" onClick={onClose} />
    </div>
  );
} 