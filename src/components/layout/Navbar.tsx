'use client';
import { User, LogOut, UserPlus, Brain } from 'lucide-react';
import Link from 'next/link';

export default function Navbar({ username, isAuthenticated, onLogout }: any) {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0a0a0a]/90 backdrop-blur-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tighter">
          <div className="p-1.5 bg-purple-600 rounded-lg"><Brain size={20} className="text-white" /></div>
          <span>AI<span className="text-purple-400">StudyBuddy</span></span>
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <User size={14} className="text-purple-400" />
                <span className="text-sm font-medium text-gray-300">{username}</span>
              </div>
              <button onClick={onLogout} className="text-gray-400 hover:text-red-400 transition-colors text-sm flex items-center gap-2 font-medium">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth/login" className="text-gray-400 hover:text-white text-sm font-medium px-2 transition-colors">Log In</Link>
              <Link href="/auth/login?mode=signup" className="px-5 py-2.5 bg-white text-black hover:bg-gray-200 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg">
                <UserPlus size={16} /> <span className="hidden sm:inline">Join Now</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}