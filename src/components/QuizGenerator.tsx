'use client';
import React, { useState, ChangeEvent } from 'react';
import { ChevronDown, Loader2, CheckCircle, XCircle } from 'lucide-react'; // Added CheckCircle, XCircle for feedback
import { generateQuiz as callGenerateQuiz, QuizResponse } from '@/lib/api';

// --- Frontend Quiz Data Interfaces (unchanged, as they define data structure) ---
type QuizType = 'single_choice' | 'multiple_choice' | 'yes_no';

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
  correctAnswer: string | string[];
  type: QuizType;
}

export interface QuizData {
  title: string;
  questions: QuizQuestion[];
}

interface QuizGeneratorProps {
  uploadedFile: File | null;
  uploadedFileId: string | null;
  onBack: () => void;
  onQuizGenerated: (quiz: QuizData) => void;
}

const QuizGenerator: React.FC<QuizGeneratorProps> = ({ uploadedFile, uploadedFileId, onBack, onQuizGenerated }) => {
  const [language, setLanguage] = useState<string>('en');
  const [numSingleChoice, setNumSingleChoice] = useState<number>(5);
  const [numMultipleChoice, setNumMultipleChoice] = useState<number>(3);
  const [numYesNo, setNumYesNo] = useState<number>(2);

  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false); // To distinguish success from error messages
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const totalQuestions = numSingleChoice + numMultipleChoice + numYesNo;

  const processQuizWithAI = async (): Promise<void> => {
    if (!uploadedFileId) {
      setMessage('No uploaded file ID found. Please upload a file first.');
      setIsError(true);
      return;
    }

    if (totalQuestions === 0) {
      setMessage('Please specify at least one question type count greater than zero.');
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setIsError(false); // Reset error state on new attempt
    setMessage(`Generating ${totalQuestions} quizzes in ${language.toUpperCase()}...`);

    try {
      const payload = {
        file_id: uploadedFileId,
        total_questions: totalQuestions,
        num_single_correct: numSingleChoice > 0 ? numSingleChoice : 0,
        num_multiple_correct: numMultipleChoice > 0 ? numMultipleChoice : 0,
        num_yes_no: numYesNo > 0 ? numYesNo : 0,
        language: language,
        quizzes_type: "mixed"
      };

      console.log("Sending quiz generation payload to backend:", payload);

      const apiResponse: QuizResponse = await callGenerateQuiz(payload);

      const transformedQuiz: QuizData = {
        title: uploadedFile?.name ? `Quiz from ${uploadedFile.name}` : 'Generated Quiz',
        questions: apiResponse.questions.map((backendQ, qIndex) => {
          const mappedOptions: QuizOption[] = backendQ.options.map((optText, optIndex) => ({
            id: `opt-${qIndex}-${optIndex}-${Date.now()}`,
            text: optText,
          }));

          let mappedCorrectAnswer: string | string[];

          if (backendQ.type === 'multiple_correct') {
            mappedCorrectAnswer = backendQ.correct_answers
              .map(correctText => mappedOptions.find(opt => opt.text === correctText)?.id)
              .filter(id => id !== undefined) as string[];
          } else {
            mappedCorrectAnswer = mappedOptions.find(opt => opt.text === backendQ.correct_answers[0])?.id || '';
          }

          return {
            id: `q-${qIndex}-${Date.now()}`,
            text: backendQ.question,
            options: mappedOptions,
            correctAnswer: mappedCorrectAnswer,
            type: backendQ.type === 'single_correct' ? 'single_choice' :
                  backendQ.type === 'multiple_correct' ? 'multiple_choice' : 'yes_no',
          };
        }),
      };

      setMessage('✨ Quizzes generated successfully! Redirecting...');
      setIsError(false); // Ensure success state
      onQuizGenerated(transformedQuiz);
    } catch (error: any) {
      setMessage(`Error during AI quiz generation: ${error.message || 'Unknown error'}`);
      setIsError(true); // Set error state
      console.error("AI quiz generation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const availableLanguages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'ja', name: 'Japanese' },
    { code: 'de', name: 'German' },
  ];

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white font-inter p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background Gradient Circles/Shapes (Visual Flourish) */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob top-10 left-1/4"></div>
        <div className="absolute w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 bottom-20 right-1/4"></div>
        <div className="absolute w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 text-center max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 border border-gray-200 dark:border-gray-700">
        <button
          onClick={onBack}
          className="absolute top-6 left-6 px-5 py-2 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 text-gray-800 dark:text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 ease-in-out flex items-center group"
        >
          <span className="mr-2 transform group-hover:-translate-x-1 transition-transform duration-200">&larr;</span> Back
        </button>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 pb-2">
          Craft Your Quiz
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Tailor your quiz settings and let the AI conjure questions from your document.
        </p>

        {uploadedFile && (
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-8 shadow-inner flex flex-col sm:flex-row items-center justify-center text-sm sm:text-base">
            <p className="text-gray-700 dark:text-gray-300 font-medium mb-2 sm:mb-0 sm:mr-4">
              Document Ready: <span className="font-semibold text-purple-600 dark:text-purple-400">{uploadedFile.name}</span>
            </p>
            
          </div>
        )}

        {/* Quiz Options Section */}
        <div className="mb-8 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-4 border-gray-200 dark:border-gray-700">
            Customize Quiz Types & Language
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            {/* Language Dropdown */}
            <div className="relative w-full text-left">
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quiz Language
              </label>
              <div
                className="relative"
                onBlur={() => setIsLanguageDropdownOpen(false)}
                tabIndex={0}
              >
                <button
                  type="button"
                  onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                  className="flex justify-between items-center w-full px-5 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 hover:border-blue-400 dark:hover:border-blue-500"
                  aria-haspopup="true"
                  aria-expanded={isLanguageDropdownOpen ? 'true' : 'false'}
                >
                  <span>{availableLanguages.find(lang => lang.code === language)?.name || 'Select Language'}</span>
                  <ChevronDown className={`transform transition-transform duration-200 ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} size={20} />
                </button>
                {isLanguageDropdownOpen && (
                  <div className="absolute z-20 mt-2 w-full bg-white dark:bg-gray-700 shadow-xl rounded-lg border border-gray-200 dark:border-gray-600 max-h-60 overflow-y-auto animate-fade-in-down">
                    {availableLanguages.map((lang) => (
                      <div
                        key={lang.code}
                        onMouseDown={(e) => { // Using onMouseDown to prevent blur
                          e.preventDefault();
                          setLanguage(lang.code);
                          setIsLanguageDropdownOpen(false);
                        }}
                        className="px-5 py-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white transition-colors duration-150 last:rounded-b-lg"
                      >
                        {lang.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* Empty div for spacing or future expansion */}
            <div></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Input for Single Choice Questions */}
            <div>
              <label htmlFor="num-single-choice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
                Single Choice
              </label>
              <input
                type="number"
                id="num-single-choice"
                value={numSingleChoice}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNumSingleChoice(Math.max(0, parseInt(e.target.value) || 0))}
                min="0"
                className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
              />
            </div>
            {/* Input for Multiple Choice Questions */}
            <div>
              <label htmlFor="num-multiple-choice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
                Multiple Choice
              </label>
              <input
                type="number"
                id="num-multiple-choice"
                value={numMultipleChoice}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNumMultipleChoice(Math.max(0, parseInt(e.target.value) || 0))}
                min="0"
                className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
              />
            </div>
            {/* Input for Yes/No Questions */}
            <div>
              <label htmlFor="num-yes-no" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
                Yes/No Questions
              </label>
              <input
                type="number"
                id="num-yes-no"
                value={numYesNo}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNumYesNo(Math.max(0, parseInt(e.target.value) || 0))}
                min="0"
                className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
              />
            </div>
          </div>

          <p className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
            Total Questions: <span className="text-blue-600 dark:text-blue-400">{totalQuestions}</span>
          </p>
        </div>

        {/* Generate Button */}
        <button
          onClick={processQuizWithAI}
          disabled={isLoading || !uploadedFileId || totalQuestions === 0}
          className={`px-10 py-5 text-xl font-bold rounded-full shadow-2xl transition-all duration-300 ease-in-out transform ${
            isLoading
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed animate-pulse'
              : (uploadedFileId && totalQuestions > 0)
              ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white hover:scale-105 hover:shadow-green-glow focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-600'
              : 'bg-gray-400 text-gray-700 cursor-not-allowed'
          } flex items-center justify-center mx-auto mt-10 space-x-3`}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={24} /> <span>Generating...</span>
            </>
          ) : (
            'Generate Quizzes'
          )}
        </button>

        {/* Message Area with Icons */}
        {message && (
          <div className={`mt-8 p-4 rounded-lg flex items-center justify-center text-lg font-semibold transition-opacity duration-300 ${
            isError ? 'bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300' : 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300'
          }`}>
            {isError ? <XCircle className="mr-3" size={24} /> : <CheckCircle className="mr-3" size={24} />}
            {message}
          </div>
        )}
      </div>
    </section>
  );
};

export default QuizGenerator;