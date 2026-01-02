'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isHydrated, checkAuth } = useAuthStore();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    // 1. Initialize the store from localStorage
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // 2. Once the store is hydrated, check if user belongs here
    if (isHydrated) {
      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        router.replace('/auth/login');
      } else {
        // Authentication confirmed
        setIsVerifying(false);
      }
    }
  }, [isHydrated, isAuthenticated, router]);

  // 3. Show a professional loading state while checking storage
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
        {/* Modern Minimal Spinner */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-t-purple-500 rounded-full animate-spin" />
        </div>
        <p className="text-gray-500 font-bold text-[10px] tracking-[0.3em] uppercase animate-pulse">
          Verifying Session
        </p>
      </div>
    );
  }

  // 4. Render children with a smooth transition
  return (
    <div className="animate-in fade-in duration-700">
      {children}
    </div>
  );
}