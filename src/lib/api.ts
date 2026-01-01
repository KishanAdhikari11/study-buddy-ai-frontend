const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000/api/';

// --- Interfaces ---
export interface UploadResponse { file_id: string; message: string; }
export interface OAuthResponse { auth_url: string; }
export interface AuthResponse {
  user: { id: string; username: string; email: string; };
  token: { access_token: string; refresh_token: string; token_type: string; };
}

export interface QuizRequest {
    file_id: string; total_questions: number; num_single_correct?: number;
    num_multiple_correct?: number; num_yes_no?: number; language: string; quizzes_type: string; 
}
export interface BackendQuizQuestion { 
    type: 'single_correct' | 'multiple_correct' | 'yes_no';
    question: string; options: string[]; correct_answers: string[]; 
}
export interface ResetPasswordRequest { email: string; }
export interface QuizResponse { 
    file_id: string; language: string; total_questions: number; questions: BackendQuizQuestion[];
}
export interface FlashcardRequest { file_id: string; total_flashcards: number; language: string; }
export interface BackendFlashcard { question: string; answer: string; }
export interface FlashcardResponse { 
    file_id: string; language: string; total_flashcards: number; flashcards: BackendFlashcard[]; 
}

export interface PasswordUpdateRequest {
    access_token: string;
    new_password: string;
}
// --- Helper for Auth ---
const getAuthHeader = (): Record<string, string> => {
    if (typeof window === 'undefined') return {};
    const token = localStorage.getItem('authToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// --- AUTH FUNCTIONS ---

export async function getGoogleOAuthUrl(): Promise<string> { 
    const params = new URLSearchParams({
        provider: 'google',
        redirect_url: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : ''
    });
    const res = await fetch(`${API_BASE}/auth/google-login?${params.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to fetch Google Auth URL');
    const data: OAuthResponse = await res.json();
    return data.auth_url;
}



export async function resetPassword(request: ResetPasswordRequest): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.detail || 'Failed to send reset password email');
    }
    return res.json();
}

export async function handleGoogleOAuthCallback(code: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          provider: 'google',
          code,
          redirect_url: typeof window !== 'undefined' ? window.location.origin + '/auth/callback' : ''
        }),
    });
    if (!res.ok) throw new Error('Failed to handle Google OAuth callback');
    return res.json();
}



export async function registerUser(email: string, password: string, firstName: string, lastName: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
        email, 
        password, 
        first_name: firstName, 
        last_name: lastName,
    }), 
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || 'Registration failed');
  }
  return res.json();
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }), 
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || 'Invalid email or password');
  }
  return res.json();
}

export async function updatePassword(request: PasswordUpdateRequest): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/auth/update-password`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
            'Authorization': `Bearer ${request.access_token}`
        },
        body: JSON.stringify({ new_password: request.new_password }),
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.detail || 'Failed to update password');
    }
    return res.json();
}
// --- CORE LOGIC FUNCTIONS ---

export async function uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE}/file/upload`, {
        method: 'POST',
        headers: getAuthHeader(), // Important: Don't set Content-Type for FormData
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
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(request),
    });
    if (!res.ok) throw new Error('Failed to generate quiz');
    return res.json();
}

export async function generateFlashcards(request: FlashcardRequest): Promise<FlashcardResponse> {
    const res = await fetch(`${API_BASE}/generate-flashcards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(request),
    });
    if (!res.ok) throw new Error('Failed to generate flashcards');
    return res.json();
}