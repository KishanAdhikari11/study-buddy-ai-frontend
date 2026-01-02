'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { updatePassword } from '@/lib/api';

// Simple PageContainer component
function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      {children}
    </div>
  );
}

// Simple AuthCard component
function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-md bg-[#1a1a1a] border border-gray-800 rounded-2xl p-8 shadow-2xl">
      {children}
    </div>
  );
}

export default function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  useEffect(() => {
    // Extract access token from URL hash
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get('access_token');
    
    if (token) {
      setAccessToken(token);
    } else {
      setError('No valid reset token found. Please request a new password reset link.');
    }
  }, []);

  useEffect(() => {
    // Check password strength
    setPasswordStrength({
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [password]);

  const isPasswordValid = () => {
    return Object.values(passwordStrength).every(Boolean);
  };

  const handleUpdatePassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!accessToken) {
      setError('Invalid reset token. Please request a new password reset link.');
      return;
    }

    if (!isPasswordValid()) {
      setError('Please ensure your password meets all requirements.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      await updatePassword({
        access_token: accessToken,
        new_password: password,
      });

      setIsSuccess(true);
      
      // Clear the hash from URL
      window.history.replaceState(null, '', window.location.pathname);
      
      setTimeout(() => router.push('/auth/login'), 2500);
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <PageContainer>
        <AuthCard>
          <div className="text-center py-10">
            <div className="mb-4 relative">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Password Updated!</h1>
            <p className="text-gray-400 text-sm">
              Your password has been successfully updated.
              <br />
              Redirecting you to sign in...
            </p>
          </div>
        </AuthCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <AuthCard>
        <h1 className="text-2xl font-bold text-white mb-2">Create New Password</h1>
        <p className="text-gray-400 text-sm mb-6">
          Choose a strong password to secure your account.
        </p>

        {error && (
          <div className="mb-4 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-5">
          <div className="space-y-1">
            <label className="text-sm text-gray-300 font-medium">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {password && (
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4 space-y-2">
              <p className="text-xs text-gray-400 font-medium mb-2">Password Requirements:</p>
              <PasswordRequirement met={passwordStrength.hasMinLength} text="At least 8 characters" />
              <PasswordRequirement met={passwordStrength.hasUpperCase} text="One uppercase letter" />
              <PasswordRequirement met={passwordStrength.hasLowerCase} text="One lowercase letter" />
              <PasswordRequirement met={passwordStrength.hasNumber} text="One number" />
              <PasswordRequirement met={passwordStrength.hasSpecialChar} text="One special character" />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm text-gray-300 font-medium">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
            )}
          </div>

          <button
            onClick={handleUpdatePassword}
            disabled={!isPasswordValid() || password !== confirmPassword || !accessToken || isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {isLoading ? 'Updating...' : 'Update Password'}
          </button>

          <div className="text-center pt-2">
            <a 
              href="/auth/login" 
              className="text-sm text-gray-400 hover:text-purple-400 transition-colors"
            >
              Back to Login
            </a>
          </div>
        </div>
      </AuthCard>
    </PageContainer>
  );
}

function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
        met ? 'bg-green-500/20 text-green-500' : 'bg-gray-800 text-gray-600'
      }`}>
        {met ? '✓' : '○'}
      </div>
      <span className={met ? 'text-green-400' : 'text-gray-500'}>{text}</span>
    </div>
  );
}