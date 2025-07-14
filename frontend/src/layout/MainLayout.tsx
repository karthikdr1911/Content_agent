import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import MobileSidebar from '../components/MobileSidebar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen flex bg-zinc-950">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:min-h-screen bg-zinc-900 border-r border-zinc-800">
        <Sidebar />
      </aside>
      {/* Mobile sidebar drawer */}
      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* Main content */}
      <div className="flex-1 flex items-center justify-center relative min-h-screen">
        {/* Mobile sidebar toggle */}
        <button
          className="md:hidden absolute top-4 left-4 z-50 bg-zinc-800 text-white p-2 rounded-lg shadow-md"
          aria-label="Open sidebar"
          onClick={() => setSidebarOpen(true)}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-menu"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
        </button>
        <main className="w-full max-w-2xl px-2 sm:px-6">
          <section className="bg-zinc-900 rounded-2xl shadow-lg p-8 w-full min-h-[60vh] flex flex-col justify-center items-center" role="main">
            {children}
          </section>
        </main>
      </div>
    </div>
  );
} 