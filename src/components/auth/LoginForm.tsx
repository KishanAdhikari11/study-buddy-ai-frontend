'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { loginUser, registerUser, resetPassword, getGoogleOAuthUrl } from '@/lib/api'; 
import { useAuthStore } from '@/store/useAuthStore';
import { AuthCard, InputField, PrimaryButton } from '@/components/Base';

type AuthMode = 'signin' | 'signup' | 'reset';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Accessing Zustand store actions
  const login = useAuthStore((state) => state.login);
  
  // Component State
  const [mode, setMode] = useState<AuthMode>('signin');
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    firstName: '', 
    lastName: '' 
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<{ message: string; showReset: boolean } | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Sync mode with URL query params
  useEffect(() => {
    const urlMode = searchParams.get('mode') as AuthMode;
    if (urlMode === 'signin' || urlMode === 'signup' || urlMode === 'reset') {
      setMode(urlMode);
    }
  }, [searchParams]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, field: keyof typeof formData) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleGoogleClick = async () => {
    setIsGoogleLoading(true);
    setError(null);
    try {
      const url = await getGoogleOAuthUrl();
      if (typeof url === 'string') {
        window.location.href = url;
      } else {
        throw new Error("Invalid OAuth URL");
      }
    } catch (err: unknown) {
      setIsGoogleLoading(false);
      const msg = err instanceof Error ? err.message : "Failed to initialize Google login";
      setError({ message: msg, showReset: false });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'reset') {
        await resetPassword({ email: formData.email });
        setIsSuccess(true); 
      } else {
        // API Call
        const data = mode === 'signup' 
          ? await registerUser(formData.email, formData.password, formData.firstName, formData.lastName)
          : await loginUser(formData.email, formData.password);

        // 1. Update the Zustand Store (Handles localStorage & State)
        login(data.token.access_token, data.user);

        // 2. Redirect to Dashboard
        // Using replace prevents the user from going 'back' to the login page
        router.replace('/dashboard');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      setError({
        message: errorMessage,
        showReset: mode === 'signin' && errorMessage.toLowerCase().includes('password')
      });
      setIsLoading(false);
    }
  };

  if (isSuccess && mode === 'reset') {
    return (
      <AuthCard className="text-center py-10">
        <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-white">Check your email</h2>
        <p className="text-gray-400 mt-2 mb-6">Recovery link sent to {formData.email}</p>
        <button 
          onClick={() => { setIsSuccess(false); setMode('signin'); }} 
          className="text-purple-400 font-bold underline underline-offset-4"
        >
          Return to Sign In
        </button>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <header className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          {mode === 'reset' ? 'Recovery' : mode === 'signup' ? 'Get Started' : 'Welcome Back'}
        </h1>
        <p className="text-gray-500 text-sm mt-1 font-medium tracking-wide">
          AI STUDY BUDDY NEURAL ENGINE
        </p>
      </header>

      {/* Google OAuth Section */}
      {mode !== 'reset' && (
        <>
          <button 
            type="button" 
            disabled={isGoogleLoading || isLoading}
            onClick={handleGoogleClick}
            className="group w-full flex items-center justify-center gap-3 bg-white text-black hover:bg-gray-100 py-3.5 rounded-xl transition-all mb-6 text-sm font-bold active:scale-[0.98] shadow-xl shadow-white/5 disabled:opacity-70"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-black" />
            ) : (
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
            )}
            {isGoogleLoading ? 'Connecting...' : 'Continue with Google'}
          </button>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] flex-1 bg-white/10" />
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">or email</span>
            <div className="h-[1px] flex-1 bg-white/10" />
          </div>
        </>
      )}

      {/* Error Feedback */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3 animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="text-red-400 font-medium leading-relaxed">{error.message}</p>
            {error.showReset && (
              <button 
                type="button" 
                onClick={() => setMode('reset')} 
                className="mt-2 text-white font-bold underline underline-offset-4"
              >
                Forgot password?
              </button>
            )}
          </div>
        </div>
      )}

      {/* Auth Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <div className="grid grid-cols-2 gap-4">
            <InputField 
              label="First Name" 
              placeholder="Jane" 
              required 
              onChange={(e) => handleInputChange(e, 'firstName')} 
            />
            <InputField 
              label="Last Name" 
              placeholder="Doe" 
              required 
              onChange={(e) => handleInputChange(e, 'lastName')} 
            />
          </div>
        )}

        <InputField 
          label="Email Address" 
          type="email" 
          placeholder="jane@example.com" 
          required
          onChange={(e) => handleInputChange(e, 'email')} 
        />

        {mode !== 'reset' && (
          <InputField 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            required
            onChange={(e) => handleInputChange(e, 'password')} 
          />
        )}

        <PrimaryButton 
          type="submit" 
          isLoading={isLoading} 
          disabled={isGoogleLoading}
          className="mt-2"
        >
          {mode === 'reset' ? 'Send Link' : mode === 'signup' ? 'Create Account' : 'Sign In'}
        </PrimaryButton>
      </form>

      {/* Mode Toggle */}
      <div className="mt-8 pt-6 border-t border-white/5 text-center">
        <button 
          type="button" 
          onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); }}
          className="text-gray-400 hover:text-white text-sm transition-colors font-bold"
        >
          {mode === 'signin' ? "New here? Create an account" : "Back to Sign In"}
        </button>
      </div>
    </AuthCard>
  );
}