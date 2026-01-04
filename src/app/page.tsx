'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/Landing/HeroSection';
import FileUploadZone from '@/components/FileUploadZone';
import QuizGenerator from '@/components/QuizGenerator';
import FlashcardGenerator from '@/components/FlashcardGenerator';
import { Loader2 } from 'lucide-react';

export default function LandingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'hero' | 'quiz-gen' | 'fc-gen'>('hero');
  const [fileData, setFileData] = useState<{file: File, id: string} | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('user');
    if (token) {
      setIsAuthenticated(true);
      if (savedUser) {
        try { setUser(JSON.parse(savedUser)); } catch (e) { console.error(e); }
      }
    }
    setIsLoading(false);
  }, []);

  const handleStartAction = (view: 'quiz-gen' | 'fc-gen') => {
    if (!isAuthenticated) {
      window.location.href = '/auth/login';
    } else {
      setCurrentView(view);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <Loader2 className="animate-spin text-purple-500 w-10 h-10" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30">
      <Navbar 
        username={user?.username} 
        isAuthenticated={isAuthenticated}
        onLogout={() => { localStorage.clear(); window.location.reload(); }} 
      />
      
      <main className="max-w-7xl mx-auto pt-24 px-6">
        {currentView === 'hero' && (
          <HeroSection 
            onStartQuiz={() => handleStartAction('quiz-gen')} 
            onStartFlashcards={() => handleStartAction('fc-gen')} 
          />
        )}

        {(currentView === 'quiz-gen' || currentView === 'fc-gen') && !fileData && (
          <div className="py-20 animate-fade-in">
            <button onClick={() => setCurrentView('hero')} className="text-gray-500 hover:text-white mb-8 flex items-center gap-2">
              ← Back to Overview
            </button>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 tracking-tight">Step 1: Ingest Material</h2>
              <p className="text-gray-400">Upload your study notes for semantic analysis.</p>
            </div>
            <FileUploadZone onSuccess={(file, id) => setFileData({file, id})} />
          </div>
        )}

        {fileData && currentView === 'quiz-gen' && (
          <QuizGenerator uploadedFile={fileData.file} uploadedFileId={fileData.id} onBack={() => setFileData(null)} />
        )}

        {fileData && currentView === 'fc-gen' && (
          <FlashcardGenerator uploadedFile={fileData.file} uploadedFileId={fileData.id} onBack={() => setFileData(null)} />
        )}
      </main>
    </div>
  );
}