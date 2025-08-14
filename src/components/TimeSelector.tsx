// components/TimeSelector.tsx
'use client';
import React, { useState, ChangeEvent } from 'react';
import { Play, Clock, XCircle } from 'lucide-react'; // Added XCircle for validation message
import { QuizData } from './QuizGenerator'; // Assuming QuizData is still used for context

interface TimeSelectorProps {
  quizTitle: string; // To display context
  uploadedFileName: string | null; // To display context
  onTimeSelected: (timeInSeconds: number) => void;
  onBack: () => void;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({ quizTitle, uploadedFileName, onTimeSelected, onBack }) => {
  const [customMinutes, setCustomMinutes] = useState<string>('2'); // Default to 2 minutes as a string
  const [noTimeLimit, setNoTimeLimit] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleCustomMinutesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string to clear, or digits only
    if (value === '' || /^\d+$/.test(value)) {
      setCustomMinutes(value);
      setErrorMessage(''); // Clear error if typing valid input
      setNoTimeLimit(false); // Uncheck "No Time Limit" if typing custom time
    } else {
      setErrorMessage('Please enter a valid number for minutes.');
    }
  };

  const handleNoTimeLimitChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNoTimeLimit(e.target.checked);
    if (e.target.checked) {
      setCustomMinutes(''); // Clear custom minutes if no time limit is selected
      setErrorMessage(''); // Clear any error
    } else {
      // If unchecked, set a default or prompt user to type
      setCustomMinutes('2'); // Re-populate with a default if unchecked
    }
  };

  const handleStartQuiz = () => {
    if (noTimeLimit) {
      onTimeSelected(0); // 0 seconds for no time limit
      return;
    }

    const minutes = parseInt(customMinutes, 10);
    if (isNaN(minutes) || minutes <= 0) {
      setErrorMessage('Please enter a positive number of minutes, or select "No Time Limit".');
      return;
    }
    onTimeSelected(minutes * 60); // Convert minutes to seconds
  };

  const currentSelectedTimeDisplay = () => {
    if (noTimeLimit) {
      return 'No Time Limit';
    }
    if (customMinutes === '') {
      return 'Enter a time in minutes';
    }
    const minutes = parseInt(customMinutes, 10);
    if (isNaN(minutes) || minutes <= 0) {
      return 'Invalid Time';
    }
    return `${minutes} Minute${minutes === 1 ? '' : 's'}`;
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white font-inter p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background Gradient Circles/Shapes (consistent with QuizGenerator) */}
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
          Set Your Quiz Time
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Choose a time limit for your quiz based on "{quizTitle}" from {uploadedFileName}.
        </p>

        <div className="mb-8 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-4 border-gray-200 dark:border-gray-700">
            Configure Time Limit
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <Clock size={24} className="text-blue-500" />
              <label htmlFor="custom-time-input" className="block text-lg font-medium text-gray-700 dark:text-gray-300">
                Custom Time (Minutes):
              </label>
            </div>
            <input
              type="text" // Use text to allow empty string briefly and handle validation
              id="custom-time-input"
              value={customMinutes}
              onChange={handleCustomMinutesChange}
              disabled={noTimeLimit}
              className={`w-32 px-4 py-3 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200
                          ${noTimeLimit ? 'opacity-50 cursor-not-allowed' : 'border-gray-300 dark:border-gray-600'}`}
              placeholder="e.g., 5"
            />
          </div>

          <div className="flex items-center justify-center mb-6">
            <label htmlFor="no-time-limit" className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="no-time-limit"
                checked={noTimeLimit}
                onChange={handleNoTimeLimitChange}
                className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500 dark:bg-gray-800 dark:border-gray-600 transition-colors"
              />
              <span className="ml-2 text-lg font-medium text-gray-700 dark:text-gray-300">No Time Limit</span>
            </label>
          </div>

          {errorMessage && (
            <p className="flex items-center justify-center text-red-600 dark:text-red-400 text-sm font-medium mb-4 animate-fade-in">
              <XCircle size={16} className="mr-2" /> {errorMessage}
            </p>
          )}

          <p className="text-lg text-gray-700 dark:text-gray-300 mt-6 border-t pt-4 border-gray-200 dark:border-gray-700">
            Selected Option: <span className="font-bold text-blue-600 dark:text-blue-400">
              {currentSelectedTimeDisplay()}
            </span>
          </p>
        </div>

        <button
          onClick={handleStartQuiz}
          disabled={!noTimeLimit && (customMinutes === '' || parseInt(customMinutes, 10) <= 0 || isNaN(parseInt(customMinutes, 10)))}
          className={`px-10 py-5 text-xl font-bold rounded-full shadow-2xl transition-all duration-300 ease-in-out transform
            ${(!noTimeLimit && (customMinutes === '' || parseInt(customMinutes, 10) <= 0 || isNaN(parseInt(customMinutes, 10))))
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:scale-105 hover:shadow-purple-glow focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-600'
            }
            flex items-center justify-center mx-auto mt-10 space-x-3`}
        >
          <Play className="mr-3" size={24} /> Start Quiz
        </button>
      </div>
    </section>
  );
};

export default TimeSelector;