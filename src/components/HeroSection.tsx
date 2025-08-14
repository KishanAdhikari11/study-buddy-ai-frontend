'use client';
import React, { useState, useRef } from 'react';
import { FileUp, Play, Sparkles, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { uploadFile } from '@/lib/api';

interface HeroSectionProps {
  onFileReady: (file: File | null, fileId: string | null) => void;
  onGenerateQuizClick: () => void;
  onGenerateFlashcardClick: () => void;
  uploadedFile: File | null;
  uploadedFileId: string | null;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  onFileReady,
  onGenerateQuizClick,
  onGenerateFlashcardClick,
  uploadedFile,
  uploadedFileId,
}) => {
  const [localSelectedFile, setLocalSelectedFile] = useState<File | null>(uploadedFile);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadMessage, setUploadMessage] = useState<string>('');
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setLocalSelectedFile(uploadedFile);
    if (!uploadedFile) setUploadMessage('');
  }, [uploadedFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLocalSelectedFile(file);
      setUploadMessage('');
      onFileReady(file, null);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setLocalSelectedFile(file);
      setUploadMessage('');
      onFileReady(file, null);
      if (fileInputRef.current) {
        fileInputRef.current.files = e.dataTransfer.files;
      }
    }
  };

  const handleFileUpload = async () => {
    if (!localSelectedFile) {
      setUploadMessage('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    setUploadMessage('Uploading file...');
    try {
      const response = await uploadFile(localSelectedFile);
      setUploadMessage(response.message || 'File uploaded successfully!');
      onFileReady(localSelectedFile, response.file_id);
    } catch (error: any) {
      setUploadMessage(`Upload failed: ${error.message || 'Unknown error'}`);
      onFileReady(null, null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setLocalSelectedFile(null);
    setUploadMessage('');
    onFileReady(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isUploadDisabled = !localSelectedFile || isUploading || uploadedFileId !== null;
  const isGenerateDisabled = uploadedFileId === null || isUploading;

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden px-6">
      {/* Background blob */}
      <svg className="absolute top-[-20%] left-[-30%] w-[70vw] h-[70vw] opacity-30 animate-blob" viewBox="0 0 600 600">
        <g transform="translate(300,300)">
          <path
            fill="url(#gradient1)"
            d="M120,-140C156,-120,187,-86,195,-48C203,-9,188,34,163,67C138,100,102,124,65,143C28,161,-9,175,-47,168C-85,161,-123,134,-141,98C-160,62,-160,17,-153,-26C-146,-70,-133,-111,-102,-132C-72,-153,-36,-154,0,-154C36,-154,72,-153,120,-140Z"
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </g>
      </svg>

      {/* Main container */}
      <div className="relative z-10 w-full max-w-5xl p-6 sm:p-10 text-center text-white">
        <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
          Document to Quiz & Flashcards
        </h1>
        <p className="text-lg sm:text-xl text-white/80 mb-12 max-w-2xl mx-auto">
          Transform your documents into interactive quizzes and insightful flashcards with AI.
        </p>

        {/* Upload Card */}
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`cursor-pointer transition-all duration-300 rounded-3xl p-12 sm:p-16 mb-12 shadow-xl backdrop-blur-lg
            ${
              isDragActive
                ? 'bg-gradient-to-br from-pink-500/30 via-purple-500/30 to-indigo-500/30 border-4 border-pink-400'
                : 'bg-white/20 border-2 border-white/30 dark:border-white/10'
            }
            flex flex-col items-center justify-center w-full max-w-4xl mx-auto
          `}
          onClick={() => fileInputRef.current?.click()}
        >
          <FileUp
            className={`w-20 h-20 mb-6 ${
              isDragActive ? 'text-pink-400' : 'text-white/80 dark:text-gray-200'
            }`}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploadedFileId !== null}
          />
          <p className="text-2xl font-semibold">
            {localSelectedFile ? localSelectedFile.name : 'Drop your document here or click to browse'}
          </p>
          <p className="mt-2 text-white/70 text-sm">(PDF, DOCX, TXT — Max 10MB)</p>
        </div>

        {/* Upload Buttons */}
        <div className="flex justify-center flex-wrap gap-6 mb-8">
          {!uploadedFileId && (
            <button
              onClick={handleFileUpload}
              disabled={isUploadDisabled}
              className={`flex items-center gap-3 px-10 py-4 font-semibold rounded-full shadow-lg transition-transform duration-300
                ${
                  isUploadDisabled
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    : 'bg-pink-500 hover:bg-pink-600 text-white hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-400 focus:ring-opacity-50'
                }
              `}
            >
              {isUploading ? <Loader2 className="animate-spin w-5 h-5" /> : <FileUp className="w-5 h-5" />}
              {isUploading ? 'Uploading...' : 'Upload Document'}
            </button>
          )}
          {localSelectedFile && (
            <button
              onClick={handleReset}
              disabled={isUploading}
              className="px-10 py-4 font-semibold rounded-full bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 shadow-lg transition-colors duration-300"
            >
              Change File
            </button>
          )}
        </div>

        {/* Upload Message */}
        {uploadMessage && (
          <p
            className={`flex items-center justify-center gap-2 text-lg font-medium mb-6 ${
              uploadMessage.toLowerCase().includes('success')
                ? 'text-green-400'
                : 'text-red-400'
            }`}
          >
            {uploadMessage.toLowerCase().includes('success') ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            {uploadMessage}
          </p>
        )}

        {uploadedFileId && (
          <p className="text-green-300 font-semibold mb-8">
            Document uploaded! Ready to generate. (ID: <code>{uploadedFileId.slice(0, 8)}...</code>)
          </p>
        )}

        {/* Generate Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-md mx-auto">
          <button
            onClick={onGenerateQuizClick}
            disabled={isGenerateDisabled}
            className={`flex items-center justify-center gap-3 px-10 py-4 font-bold rounded-full shadow-lg transition-transform duration-300
              ${
                isGenerateDisabled
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:scale-105 text-white focus:outline-none focus:ring-4 focus:ring-pink-400 focus:ring-opacity-70'
              }
            `}
          >
            <Play className="w-5 h-5" /> Generate Quiz
          </button>
          <button
            onClick={onGenerateFlashcardClick}
            disabled={isGenerateDisabled}
            className={`flex items-center justify-center gap-3 px-10 py-4 font-bold rounded-full shadow-lg transition-transform duration-300
              ${
                isGenerateDisabled
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:scale-105 text-white focus:outline-none focus:ring-4 focus:ring-red-400 focus:ring-opacity-70'
              }
            `}
          >
            <Sparkles className="w-5 h-5" /> Generate Flashcards
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 15s infinite ease-in-out;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
