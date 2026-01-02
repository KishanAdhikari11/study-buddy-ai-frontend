'use client';
import React from 'react';
import { BrainCircuit, Github, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-16 border-t border-white/5 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <BrainCircuit size={20} className="text-purple-500" />
            <span className="text-sm font-bold tracking-tighter text-white">NEURALINK.AI</span>
          </div>
          
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Neuralink AI. Transforming static content into active mastery.
          </p>

          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-500 hover:text-white transition-colors"><Twitter size={18} /></a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors"><Github size={18} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}