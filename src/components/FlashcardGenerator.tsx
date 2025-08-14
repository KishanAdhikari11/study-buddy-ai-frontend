// components/FlashcardGenerator.tsx
'use client';
import React, { useState, ChangeEvent, useRef } from 'react';
import { ChevronDown, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { generateFlashcards as callGenerateFlashcards, FlashcardResponse } from '@/lib/api';

// --- Frontend Flashcard Data Interfaces (unchanged) ---
export interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export interface FlashcardData {
  title: string;
  flashcards: Flashcard[];
}

interface FlashcardGeneratorProps {
  uploadedFile: File | null;
  uploadedFileId: string | null;
  onBack: () => void;
  onFlashcardsGenerated: (flashcards: FlashcardData, language: string) => void; // Pass language here
}

const FlashcardGenerator: React.FC<FlashcardGeneratorProps> = ({ uploadedFile, uploadedFileId, onBack, onFlashcardsGenerated }) => {
  const [language, setLanguage] = useState<string>('en');
  const [numFlashcards, setNumFlashcards] = useState<number>(10);

  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for dropdown focus management

  const [message, setMessage] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const processFlashcardsWithAI = async (): Promise<void> => {
    if (!uploadedFileId) {
      setMessage('No uploaded file ID found. Please upload a file first.');
      setIsError(true);
      return;
    }

    if (numFlashcards <= 0) {
      setMessage('Please specify a number of flashcards greater than zero.');
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setMessage(`Generating ${numFlashcards} flashcards in ${language.toUpperCase()}...`);

    try {
      const payload = {
        file_id: uploadedFileId,
        total_flashcards: numFlashcards,
        language: language,
      };

      console.log("Sending flashcard generation payload to backend:", payload);

      const apiResponse: FlashcardResponse = await callGenerateFlashcards(payload);

      const transformedFlashcards: FlashcardData = {
        title: uploadedFile?.name ? `Flashcards from ${uploadedFile.name}` : 'Generated Flashcards',
        flashcards: apiResponse.flashcards.map((f) => ({
          id: crypto.randomUUID(),
          question: f.question,
          answer: f.answer,
        })),
      };

      setMessage('✨ Flashcards generated successfully! Redirecting to viewer...');
      setIsError(false);
      setTimeout(() => onFlashcardsGenerated(transformedFlashcards, language), 1500); // Pass language here
    } catch (error: any) {
      setMessage(`Error during AI flashcard generation: ${error.message || 'Unknown error'}`);
      setIsError(true);
      console.error("AI flashcard generation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const availableLanguages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'ja', name: 'Japanese' },
    { code: 'zh', name: 'Chinese (Simplified)' },
    { code: 'ko', name: 'Korean' },
    { code: 'ar', name: 'Arabic' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'it', name: 'Italian' },
    { code: 'hi', name: 'Hindi' },
  ];

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-sans p-4 sm:p-6 lg:p-8">
      <div className="relative z-10 container mx-auto px-4 py-12 text-center max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 animate-fadeIn">
        <button
          onClick={onBack}
          className="absolute top-6 left-6 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 flex items-center text-sm font-medium group"
        >
          <span className="mr-2 transform group-hover:-translate-x-1 transition-transform duration-200">&larr;</span> Back
        </button>

        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4 text-primary-600 dark:text-primary-400">
          Generate Flashcards
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Craft custom flashcards from your document with AI.
        </p>

        {uploadedFile && (
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-8 shadow-inner flex flex-col sm:flex-row items-center justify-center text-sm sm:text-base border border-gray-200 dark:border-gray-600 animate-popIn">
            <p className="text-gray-700 dark:text-gray-300 font-medium mb-2 sm:mb-0 sm:mr-4">
              Document Ready: <span className="font-semibold text-primary-600 dark:text-primary-400">{uploadedFile.name}</span>
            </p>
            {uploadedFileId && (
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                (ID: <span className="font-mono">{uploadedFileId.substring(0, 8)}...</span>)
              </p>
            )}
          </div>
        )}

        {/* Flashcard Options Section */}
        <div className="mb-8 p-8 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-inner border border-gray-200 dark:border-gray-600 max-w-2xl mx-auto animate-fadeIn">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 border-b pb-4 border-gray-300 dark:border-gray-600">
            Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Language Dropdown */}
            <div className="relative w-full text-left">
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Flashcard Language
              </label>
              <div
                className="relative"
                ref={dropdownRef}
                onBlur={() => setIsLanguageDropdownOpen(false)}
                tabIndex={0}
              >
                <button
                  type="button"
                  onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                  className="flex justify-between items-center w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200 hover:border-primary-300 dark:hover:border-primary-500"
                  aria-haspopup="true"
                  aria-expanded={isLanguageDropdownOpen ? 'true' : 'false'}
                >
                  <span>{availableLanguages.find(lang => lang.code === language)?.name || 'Select Language'}</span>
                  <ChevronDown className={`transform transition-transform duration-200 ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} size={18} />
                </button>
                {isLanguageDropdownOpen && (
                  <div className="absolute z-20 mt-2 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto animate-fadeIn">
                    {availableLanguages.map((lang) => (
                      <div
                        key={lang.code}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setLanguage(lang.code);
                          setIsLanguageDropdownOpen(false);
                          dropdownRef.current?.focus(); // Return focus to the button to dismiss keyboard
                        }}
                        className="px-4 py-2 cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-900 text-gray-900 dark:text-white transition-colors duration-150 last:rounded-b-lg"
                      >
                        {lang.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Number of Flashcards */}
            <div>
              <label htmlFor="num-flashcards" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
                Number of Flashcards
              </label>
              <input
                type="number"
                id="num-flashcards"
                value={numFlashcards}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNumFlashcards(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-primary-400 focus:border-primary-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200"
              />
            </div>
          </div>
        </div>

  {/* Generate Button */}
<button
  onClick={processFlashcardsWithAI}
  disabled={isLoading || !uploadedFileId || numFlashcards <= 0}
  className={`px-8 py-4 text-lg font-semibold rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-purple-600 flex items-center justify-center mx-auto space-x-3 w-full max-w-xs ${
    isLoading
      ? 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed animate-pulse'
      : 'bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 text-white hover:shadow-xl'
  }`}
>
  {isLoading ? (
    <>
      <Loader2 className="animate-spin mr-2" size={20} /> <span>Generating...</span>
    </>
  ) : (
    'Generate Flashcards'
  )}
</button>


        {/* Message Area with Icons */}
        {message && (
          <div className={`mt-6 p-3 rounded-lg flex items-center justify-center text-base font-medium animate-fadeIn ${
            isError ? 'bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700' : 'bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700'
          }`}>
            {isError ? <XCircle className="mr-2" size={20} /> : <CheckCircle className="mr-2" size={20} />}
            {message}
          </div>
        )}
      </div>
    </section>
  );
};

export default FlashcardGenerator;