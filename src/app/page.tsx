// app/page.tsx
'use client';

import React, { useState } from 'react';
import HeroSection from '@/components/HeroSection';
import QuizGenerator, { QuizData } from '@/components/QuizGenerator';
import QuizTaker from '@/components/QuizTaker';
import FlashcardGenerator, { FlashcardData } from '@/components/FlashcardGenerator';
import FlashcardViewer from '@/components/FlashcardViewer';
import TimeSelector from '@/components/TimeSelector'; // Assuming you still want this for quizzes

type AppView = 'hero' | 'quiz-generator' | 'time-selector' | 'quiz-taker' | 'flashcard-generator' | 'flashcard-viewer';

export default function HomePage() {
  const [currentView, setCurrentView] = useState<AppView>('hero');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);
  const [generatedQuiz, setGeneratedQuiz] = useState<QuizData | null>(null);
  const [generatedFlashcards, setGeneratedFlashcards] = useState<FlashcardData | null>(null);
  const [selectedQuizTime, setSelectedQuizTime] = useState<number>(0);

  const handleFileReady = (file: File | null, fileId: string | null) => {
    setUploadedFile(file);
    setUploadedFileId(fileId);
    setGeneratedQuiz(null);
    setGeneratedFlashcards(null);
    setSelectedQuizTime(0);
  };

  const handleQuizGenerated = (quiz: QuizData) => {
    setGeneratedQuiz(quiz);
    setCurrentView('time-selector');
  };

  const handleTimeSelected = (timeInSeconds: number) => {
    setSelectedQuizTime(timeInSeconds);
    setCurrentView('quiz-taker');
  };

  const handleFlashcardsGenerated = (flashcards: FlashcardData) => {
    setGeneratedFlashcards(flashcards);
    setCurrentView('flashcard-viewer');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'hero':
        return (
          <HeroSection
            onFileReady={handleFileReady}
            onGenerateQuizClick={() => setCurrentView('quiz-generator')}
            onGenerateFlashcardClick={() => setCurrentView('flashcard-generator')}
            uploadedFile={uploadedFile}
            uploadedFileId={uploadedFileId}
          />
        );
      case 'quiz-generator':
        return (
          <QuizGenerator
            uploadedFile={uploadedFile}
            uploadedFileId={uploadedFileId}
            onBack={() => setCurrentView('hero')}
            onQuizGenerated={handleQuizGenerated}
          />
        );
      case 'time-selector':
        if (!generatedQuiz || !uploadedFile) {
          setCurrentView('quiz-generator');
          return null;
        }
        return (
          <TimeSelector
            quizTitle={generatedQuiz.title || 'Your Quiz'}
            uploadedFileName={uploadedFile.name}
            onTimeSelected={handleTimeSelected}
            onBack={() => setCurrentView('quiz-generator')}
          />
        );
      case 'quiz-taker':
        if (!generatedQuiz || !uploadedFile) {
          setCurrentView('quiz-generator');
          return null;
        }
        return (
          <QuizTaker
            quiz={generatedQuiz}
            onBack={() => setCurrentView('time-selector')}
            uploadedFileName={uploadedFile ? uploadedFile.name : null}
            initialTime={selectedQuizTime}
          />
        );
      case 'flashcard-generator':
        return (
          <FlashcardGenerator
            uploadedFile={uploadedFile}
            uploadedFileId={uploadedFileId}
            onBack={() => setCurrentView('hero')}
            onFlashcardsGenerated={handleFlashcardsGenerated}
          />
        );
      case 'flashcard-viewer':
        // ✨ This check is crucial. If generatedFlashcards is null, it means data isn't ready.
        if (!generatedFlashcards) {
            // Log an error or handle gracefully, perhaps redirecting back to the generator.
            console.error("Attempted to view flashcards before they were generated.");
            setCurrentView('flashcard-generator'); // Redirect back
            return null; // Don't render anything for this frame
        }
        return (
            <FlashcardViewer
                flashcards={generatedFlashcards} // Pass the generatedFlashcards object
                onBack={() => setCurrentView('flashcard-generator')} // Go back to flashcard generator options
                uploadedFileName={uploadedFile ? uploadedFile.name : null}
            />
        );
      default:
        return null;
    }
  };

  return <>{renderContent()}</>;
}