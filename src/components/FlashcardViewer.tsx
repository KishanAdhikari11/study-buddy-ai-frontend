'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, ChevronLeft, ChevronRight, Download, Loader2, XCircle, CheckCircle } from 'lucide-react';
import { FlashcardData } from './FlashcardGenerator';

interface FlashcardViewerProps {
  flashcards: FlashcardData;
  onBack: () => void;
  uploadedFileName: string | null;
  uploadedFileId: string | null;
  flashcardLanguage: string;
}

const FlashcardViewer: React.FC<FlashcardViewerProps> = ({
  flashcards,
  onBack,
  uploadedFileName,
  uploadedFileId,
  flashcardLanguage,
}) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [downloadMessage, setDownloadMessage] = useState('');
  const [isDownloadError, setIsDownloadError] = useState(false);
  const [isDownloadingAnki, setIsDownloadingAnki] = useState(false);

  if (!flashcards || !flashcards.flashcards || flashcards.flashcards.length === 0) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 p-6">
        <div className="max-w-xl w-full text-center bg-gray-800 p-8 rounded-xl shadow-lg">
          <p className="text-xl text-red-400 font-semibold">Error: Flashcard data not found or empty.</p>
          <button
            onClick={onBack}
            className="mt-6 inline-block px-5 py-2 bg-gray-700 text-gray-100 rounded hover:bg-gray-600"
          >Go Back</button>
        </div>
      </section>
    );
  }

  const currentFlashcard = flashcards.flashcards[currentCardIndex];

  const handleNextCard = useCallback(() => {
    setShowAnswer(false);
    setCurrentCardIndex((prev) => (prev + 1) % flashcards.flashcards.length);
  }, [flashcards.flashcards.length]);

  const handlePrevCard = useCallback(() => {
    setShowAnswer(false);
    setCurrentCardIndex((prev) => (prev - 1 + flashcards.flashcards.length) % flashcards.flashcards.length);
  }, [flashcards.flashcards.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (flashcards.flashcards.length <= 1) return;
      if (event.key === 'ArrowRight') handleNextCard();
      else if (event.key === 'ArrowLeft') handlePrevCard();
      else if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        setShowAnswer((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextCard, handlePrevCard, flashcards.flashcards.length]);

  const handleDownloadAnki = async () => {
    if (!uploadedFileId || !flashcardLanguage) {
      setDownloadMessage('Missing file ID or language for Anki download.');
      setIsDownloadError(true);
      return;
    }
    setIsDownloadingAnki(true);
    setDownloadMessage('Preparing Anki deck...');
    setIsDownloadError(false);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/download-anki/${uploadedFileId}/${flashcardLanguage}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${flashcards.title.replace(/ /g, '_')}_anki.apkg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setDownloadMessage('Anki deck downloaded successfully! 🎉');
    } catch (error: any) {
      setDownloadMessage(`Failed to download Anki deck: ${error.message || 'Unknown error'}`);
      setIsDownloadError(true);
    } finally {
      setIsDownloadingAnki(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 p-6">
      <div className="w-full max-w-3xl bg-white text-gray-900 rounded-2xl shadow-xl p-8">
        <button
          onClick={onBack}
          className="text-sm text-gray-600 hover:text-black mb-4"
        >← Back</button>

        <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-2">Flashcards from</h1>
        <p className="text-base text-center font-medium text-indigo-700 break-words">
          {uploadedFileName?.replace(/\+/g, ' ') || 'Uploaded File'}
        </p>

        <div
          onClick={() => setShowAnswer(!showAnswer)}
          className="mt-6 perspective w-full min-h-[280px] flex justify-center"
        >
          <div className={`relative w-full max-w-lg h-64 transition-transform duration-700 transform-style preserve-3d ${showAnswer ? 'rotate-y-180' : ''}`}>
            <div className="absolute inset-0 bg-white rounded-xl shadow-inner p-6 backface-hidden flex flex-col justify-center items-center text-center">
              <p className="text-sm text-gray-500 mb-2">
                Card {currentCardIndex + 1} of {flashcards.flashcards.length}
              </p>
              <p className="text-xl font-medium">
                {currentFlashcard.question}
              </p>
            </div>
            <div className="absolute inset-0 bg-white rounded-xl shadow-inner p-6 backface-hidden rotate-y-180 flex items-center justify-center text-lg text-center">
              {currentFlashcard.answer}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={handlePrevCard}
            disabled={flashcards.flashcards.length <= 1}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            <ChevronLeft size={18} /> Prev
          </button>
          <button
            onClick={handleNextCard}
            disabled={flashcards.flashcards.length <= 1}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next <ChevronRight size={18} />
          </button>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={handleDownloadAnki}
            disabled={isDownloadingAnki || !uploadedFileId}
            className={`w-full sm:w-auto px-6 py-3 text-base font-semibold rounded-full transition-all duration-300 ease-in-out flex items-center justify-center ${
              isDownloadingAnki
                ? 'bg-gray-400 text-white cursor-not-allowed animate-pulse'
                : 'bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-600 text-white hover:opacity-90'
            }`}
          >
            {isDownloadingAnki ? (
              <><Loader2 className="animate-spin mr-2" size={20} /> Downloading...</>
            ) : (
              <><Download className="mr-2" size={20} /> Download Anki Deck</>
            )}
          </button>

          <button
            onClick={onBack}
            className="w-full sm:w-auto px-6 py-3 text-base font-semibold rounded-full bg-gray-300 text-gray-800 hover:bg-gray-400 transition-all duration-200 flex items-center justify-center"
          >
            <RotateCcw className="mr-2" size={20} /> Back to Generator
          </button>
        </div>

        {downloadMessage && (
          <div className={`mt-6 p-3 rounded-lg flex items-center justify-center text-base font-medium ${
            isDownloadError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}>
            {isDownloadError ? <XCircle className="mr-2" size={20} /> : <CheckCircle className="mr-2" size={20} />}
            {downloadMessage}
          </div>
        )}
      </div>

      <style jsx>{`
        .perspective {
          perspective: 1000px;
        }
        .transform-style {
          transform-style: preserve-3d;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </section>
  );
};

export default FlashcardViewer;
