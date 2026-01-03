'use client';

import React, { useState } from 'react';
import { Home, Settings, Menu, LogOut, X, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import ProtectedRoute from '@/components/auth/ProtectedRoute'; 

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { icon: Home, href: '/dashboard', label: 'Home' },
    { icon: Settings, href: '/dashboard/account', label: 'Account' },
  ];

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[#0a0a0a]">
        {/* Mobile Top Bar */}
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 z-[60]">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-gray-400">
            <Menu className="w-6 h-6" />
          </button>
          <span className="text-white font-bold text-sm tracking-widest uppercase italic">Neural Engine</span>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 shadow-lg shadow-purple-500/20" />
        </div>

        {/* Backdrop for Mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-[80] w-72 bg-[#0b0b0b] border-r border-white/5 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:w-20 flex flex-col items-center py-8
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>

          <div className="mb-12 hidden lg:block">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <nav className="flex flex-col gap-4 lg:gap-8 w-full lg:w-auto px-6 lg:px-0 flex-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  onClick={() => setIsSidebarOpen(false)}
                  className="group relative flex items-center gap-4 lg:justify-center p-3 lg:p-0 rounded-xl hover:bg-white/5 lg:hover:bg-transparent transition-all"
                >
                  <item.icon className={`w-6 h-6 transition-colors ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`} />
                  <span className={`lg:hidden font-bold text-sm uppercase tracking-widest ${isActive ? 'text-white' : 'text-gray-500'}`}>
                    {item.label}
                  </span>
                  {isActive && (
                     <div className="absolute -left-6 lg:-left-5 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-purple-500 rounded-r-full shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          <button 
            onClick={() => logout()}
            className="group relative mt-auto flex items-center gap-4 w-full lg:w-auto px-6 lg:px-0 py-4 text-gray-500 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-6 h-6" />
            <span className="lg:hidden font-bold text-sm uppercase tracking-widest">Sign Out</span>
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pt-20 lg:pt-0">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}