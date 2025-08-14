// lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000/api/v1';

// --- Shared Interfaces ---
export interface UploadResponse {
    file_id: string;
    message: string;
}

// --- Quiz Interfaces ---
export interface QuizRequest {
    file_id: string;
    total_questions: number;
    num_single_correct?: number; // Backend expects 0 for "none", not -1
    num_multiple_correct?: number;
    num_yes_no?: number;
    language: string;
    quizzes_type: string; // e.g., "mixed"
}

export interface BackendQuizQuestion { // Renamed to avoid conflict, represents backend's format
    type: 'single_correct' | 'multiple_correct' | 'yes_no';
    question: string;
    options: string[]; // Array of option texts
    correct_answers: string[]; // Array of correct answer texts
}

export interface QuizResponse { // Backend's full quiz response
    file_id: string;
    language: string;
    total_questions: number;
    questions: BackendQuizQuestion[]; // Array of backend quiz questions
}

// --- Flashcard Interfaces ---
export interface FlashcardRequest {
    file_id: string;
    total_flashcards: number;
    language: string;
}

export interface BackendFlashcard { // Represents backend's flashcard format
    question: string;
    answer: string;
}

export interface FlashcardResponse { // Backend's full flashcard response
    file_id: string;
    language: string;
    total_flashcards: number;
    flashcards: BackendFlashcard[]; // Array of backend flashcards
}


// --- API Functions ---
export async function uploadFile(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to upload file');
  }

  return res.json();
}

export async function generateQuiz(request: QuizRequest): Promise<QuizResponse> {
  const res = await fetch(`${API_BASE}/quizzes/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to generate quiz');
  }

  return res.json();
}

export async function generateFlashcards(request: FlashcardRequest): Promise<FlashcardResponse> {
    const res = await fetch(`${API_BASE}/generate-flashcards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.detail || 'Failed to generate flashcards');
    }

    return res.json();
}