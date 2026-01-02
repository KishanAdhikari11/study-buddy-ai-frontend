'use client';

import { useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { handleGoogleOAuthCallback } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore'; // Import the store
import { Loader2 } from 'lucide-react';

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((state) => state.login); // Get the login action
  const hasCalledApi = useRef(false);

  useEffect(() => {
    const code = searchParams.get('code');

    if (code && !hasCalledApi.current) {
      hasCalledApi.current = true;
      
      handleGoogleOAuthCallback(code)
        .then((data) => {
          /**
           * FIX: Use the Zustand login action. 
           * This handles BOTH localStorage and the global React state.
           */
          login(data.token.access_token, data.user);
          
          // Use replace so they can't go "back" into the callback loop
          router.replace('/dashboard'); 
        })
        .catch((err) => {
          console.error("OAuth Exchange Failed:", err);
          router.replace('/auth/login?error=oauth_failed');
        });
    }
  }, [searchParams, router, login]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full animate-pulse" />
        <Loader2 className="relative w-12 h-12 text-purple-500 animate-spin mb-4" />
      </div>
      <h2 className="text-white text-xl font-bold tracking-tight">Syncing Neural Profile</h2>
      <p className="text-gray-500 text-sm mt-2 font-medium">Finalizing secure handshake...</p>
    </div>
  );
}

// Next.js requires Suspense for useSearchParams()
export default function AuthCallback() {
  return (
    <Suspense fallback={null}>
      <CallbackHandler />
    </Suspense>
  );
}