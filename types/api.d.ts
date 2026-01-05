
export interface UploadResponse {
    file_id: string;
    message: string;
}

export interface QuizRequest {
    file_id: string;
    total_questions: number;
    num_single_correct?: number; 
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
