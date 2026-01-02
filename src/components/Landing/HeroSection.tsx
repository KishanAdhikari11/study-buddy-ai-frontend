'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, ArrowRight, FileText, Zap, UserPlus, 
  GraduationCap, PlayCircle, LucideIcon, LayoutDashboard 
} from 'lucide-react';
import { SectionWrapper, HeroHeading } from '@/components/Base';
import { useAuthStore } from '@/store/useAuthStore'; // Import your store

// --- CONSTANTS ---
const CAPABILITIES = [
  {
    num: "01",
    title: "Content Ingestion",
    icon: FileText,
    desc: "Upload PDFs, PPTs, and DOCX files. Our AI handles complex math formulas and diagrams with surgical precision."
  },
  {
    num: "02",
    title: "Instant Generation",
    icon: Zap,
    desc: "Receive comprehensive notes, flashcards, and quizzes tailored to your needs in as little as 30 seconds."
  },
  {
    num: "03",
    title: "Universal Sync",
    icon: GraduationCap,
    desc: "Access study materials anywhere. Your notes sync automatically across web, tablet, and mobile devices."
  }
];

// --- REUSABLE SUB-COMPONENTS ---

const BackgroundAmbience = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent opacity-70" />
    <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-purple-600/10 blur-[120px] rounded-full animate-pulse" />
    <div className="absolute top-[20%] right-[5%] w-96 h-96 bg-blue-600/10 blur-[140px] rounded-full" />
  </div>
);

const CapabilityCard = ({ num, title, desc, icon: Icon }: { num: string, title: string, desc: string, icon: LucideIcon }) => (
  <div className="group relative flex flex-col items-start p-10 rounded-[3rem] bg-white/[0.01] border border-white/[0.04] hover:bg-white/[0.03] hover:border-white/[0.08] transition-all duration-700 ease-out overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    <div className="relative w-14 h-14 rounded-2xl bg-[#111111] border border-white/5 flex items-center justify-center mb-10 text-purple-400 group-hover:text-white group-hover:scale-110 transition-all duration-500">
      <div className="absolute inset-0 bg-purple-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <Icon size={24} className="relative z-10" />
    </div>
    <div className="flex items-center gap-3 mb-6">
      <span className="text-[10px] font-black tracking-[0.4em] text-purple-500/80 uppercase italic">Phase {num}</span>
      <div className="h-[1px] w-6 bg-purple-500/20" />
    </div>
    <h4 className="text-2xl font-bold mb-4 text-white tracking-tight leading-tight">{title}</h4>
    <p className="text-gray-500 text-sm lg:text-base leading-relaxed font-medium group-hover:text-gray-400 transition-colors duration-500">{desc}</p>
  </div>
);

// --- MAIN COMPONENT ---

export default function HeroSection() {
  // 1. Hook into your production store
  const { isAuthenticated, isHydrated, checkAuth } = useAuthStore();
  const [hasMounted, setHasMounted] = useState(false);

  // 2. Handle Hydration & Initial Check
  useEffect(() => {
    setHasMounted(true);
    checkAuth();
  }, [checkAuth]);

  // 3. Prevent Hydration Mismatch Flicker
  // While we haven't mounted or checked auth, we show a neutral state
  const showDashboardButton = hasMounted && isHydrated && isAuthenticated;

  return (
    <div className="relative flex flex-col items-center w-full bg-[#0a0a0a] overflow-hidden min-h-screen">
      <BackgroundAmbience />

      <SectionWrapper className="relative flex flex-col items-center pt-24 sm:pt-44 pb-24 text-center z-10">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-10 backdrop-blur-xl animate-fade-in hover:border-purple-500/30 transition-all cursor-default shadow-2xl shadow-purple-500/10">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-[10px] font-bold tracking-[0.25em] text-gray-300 uppercase">Neural Engine v2.0 is Live</span>
        </div>

       <HeroHeading className="group cursor-default select-none">
  <span className="inline-block transition-all duration-500 ease-out group-hover:scale-[1.02] group-hover:brightness-125">
    Study smarter
  </span>
  <br />
  <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/30 transition-all duration-700 ease-out group-hover:scale-[1.05] group-hover:tracking-tight">
    Not harder
    {/* Subtle underline glow that appears on hover */}
    <span className="absolute bottom-2 left-0 w-0 h-[2px] bg-purple-500/50 transition-all duration-700 group-hover:w-full blur-[1px]" />
  </span>
</HeroHeading>
        <p className="mt-10 text-gray-400 text-lg sm:text-2xl max-w-3xl leading-relaxed px-4 font-medium">
          AI Study Buddy transforms anything into <span className="text-white font-bold">notes, flashcards, and quizzes</span> instantly. <br />
          The ultimate AI-powered companion designed for students and professionals.
        </p>

        {/* Dynamic Action Buttons based on Auth State */}
        <div className="mt-14 flex flex-col sm:flex-row gap-6 w-full sm:w-auto px-6 min-h-[80px]">
          {showDashboardButton ? (
             <Link 
             href="/dashboard"
             className="group w-full sm:w-auto px-12 py-5 bg-purple-600 text-white hover:bg-purple-500 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-2xl shadow-purple-500/20"
           >
             Go to Dashboard
             <LayoutDashboard size={22} className="group-hover:rotate-12 transition-transform" />
           </Link>
          ) : (
            <Link 
              href="/auth/login?mode=signup"
              className="group w-full sm:w-auto px-12 py-5 bg-white text-black hover:bg-gray-100 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-2xl shadow-white/5"
            >
              Get Started — It&apos;s Free 
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
          
          <Link 
            href="/demo"
            className="w-full sm:w-auto px-12 py-5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-[2rem] font-bold text-xl backdrop-blur-md transition-all text-center flex items-center justify-center gap-3"
          >
            <PlayCircle size={22} className="text-gray-400" />
            Watch Demo
          </Link>
        </div>
        
        {/* Trust Bar */}
        <div className="mt-20 flex items-center gap-5 px-6 py-3 rounded-3xl bg-[#111111]/40 border border-white/5 backdrop-blur-sm">
            <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0a0a0a] bg-gradient-to-br from-purple-500 to-indigo-700 opacity-90 shadow-xl" />
                ))}
            </div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Trusted by 5M+ students globally</p>
        </div>
      </SectionWrapper>

      {/* Grid Section */}
      <div className="relative w-full bg-[#0d0d0d]/40 backdrop-blur-2xl py-28 border-white/5">
        <SectionWrapper>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 relative z-10">
            {CAPABILITIES.map((capability) => (
              <CapabilityCard key={capability.num} {...capability} />
            ))}
          </div>
        </SectionWrapper>
      </div>

      {/* Final CTA Area */}
      <SectionWrapper className="py-32">
  <div className="group relative w-full max-w-6xl mx-auto p-12 sm:p-28 rounded-[3rem] sm:rounded-[4rem] bg-[#0d0d0d] border border-white/5 text-center overflow-hidden transition-all duration-700 hover:border-purple-500/30 shadow-3xl">
    
    {/* 1. Animated Ambient Glows */}
    <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
    <div className="absolute -bottom-24 -left-24 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
    
    {/* 2. Subtle Grid Pattern (SVG) */}
    <div className="absolute inset-0 opacity-[0.03] [mask-image:radial-gradient(ellipse_at_center,white,transparent)] pointer-events-none">
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M0 32V.5H32" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>

    {/* 3. Content */}
    <div className="relative z-10 flex flex-col items-center">
      <div className="mb-8 flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Limited Access v2.0</span>
      </div>

      <h2 className="text-5xl sm:text-7xl font-black mb-10 text-white tracking-tighter leading-tight transition-transform duration-700 group-hover:scale-[1.01]">
        The last notetaker <br /> 
        <span className="text-gray-500 group-hover:text-white transition-colors duration-700">you&apos;ll ever need.</span>
      </h2>
      
      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full">
        <Link 
          href={isAuthenticated ? "/dashboard" : "/auth/login?mode=signup"} 
          className="group/btn relative w-full sm:w-auto px-14 py-6 bg-white text-black rounded-2xl sm:rounded-[2rem] font-black text-2xl hover:bg-gray-100 transition-all flex items-center justify-center gap-4 active:scale-95 overflow-hidden"
        >
          {/* Subtle Button Shine Animation */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
          
          <span className="relative z-10 flex items-center gap-4">
            {isAuthenticated ? <LayoutDashboard size={26} /> : <UserPlus size={26} />}
            {isAuthenticated ? "Go to My Dashboard" : "Join AI Study Buddy"}
          </span>
        </Link>
      </div>

      {/* 4. Social Proof / Stats */}
      <div className="mt-12 flex flex-col items-center gap-4">
        <div className="flex -space-x-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0d0d0d] bg-gray-800 flex items-center justify-center overflow-hidden">
               <div className="w-full h-full bg-gradient-to-tr from-purple-500/40 to-blue-500/40" />
            </div>
          ))}
          <div className="w-8 h-8 rounded-full border-2 border-[#0d0d0d] bg-purple-600 flex items-center justify-center text-[10px] font-bold text-white">+2k</div>
        </div>
        <p className="text-gray-500 font-bold text-[10px] tracking-[0.4em] uppercase italic flex items-center gap-2">
          <span className="w-8 h-[1px] bg-white/10" />
          Over 15 Million Notes Generated
          <span className="w-8 h-[1px] bg-white/10" />
        </p>
      </div>
    </div>
  </div>
</SectionWrapper>
    
    </div>
  );
}