import React, { ReactNode, InputHTMLAttributes, ButtonHTMLAttributes } from 'react';

/**
 * COMMON INTERFACE
 * Allows components to accept children and custom Tailwind classes.
 */
interface BaseProps {
  children: ReactNode;
  className?: string;
}

// 1. Centered Container for Pages (Login, Hero, etc.)
export const PageContainer = ({ children, className = "" }: BaseProps) => (
  <div className={`flex flex-col items-center justify-center min-h-screen w-full bg-[#0a0a0a] px-4 sm:px-6 py-8 animate-in fade-in duration-700 ${className}`}>
    {children}
  </div>
);

// 2. Responsive Card
export const AuthCard = ({ children, className = "" }: BaseProps) => (
  <div className={`w-full sm:max-w-[440px] bg-[#111111] border border-white/10 rounded-[20px] sm:rounded-[24px] p-6 sm:p-10 shadow-2xl ${className}`}>
    {children}
  </div>
);

// 3. Mobile-Safe Input (typed to handle all standard input props)
interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const InputField = ({ label, className = "", ...props }: InputFieldProps) => (
  <div className="w-full">
    <label className="block text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
      {label}
    </label>
    <input 
      {...props}
      className={`w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-purple-500/50 outline-none transition-all placeholder:text-gray-700 text-base md:text-sm ${className}`}
    />
  </div>
);

// 4. Primary Button (With Loading State and Strict Types)
interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export const PrimaryButton = ({ 
  children, 
  isLoading, 
  className = "", 
  ...props 
}: PrimaryButtonProps) => (
  <button 
    {...props}
    disabled={isLoading || props.disabled}
    className={`w-full bg-[#7C3AED] hover:bg-[#6D28D9] active:scale-[0.98] text-white font-bold py-3.5 sm:py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {isLoading ? (
      <span className="animate-spin text-xl font-light" aria-hidden="true">◌</span>
    ) : (
      children
    )}
  </button>
);

// 5. Section Wrapper for Landing Page Sections
export const SectionWrapper = ({ children, className = "" }: BaseProps) => (
  <section className={`w-full px-4 sm:px-6 py-12 sm:py-24 max-w-7xl mx-auto ${className}`}>
    {children}
  </section>
);

// 6. Flexible Hero Heading

export const HeroHeading = ({ children, className = "" }: BaseProps) => {
  return (
    <h1 className={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.9] text-white ${className}`}>
      {children}
    </h1>
  );
};

// 7. Secondary Button (Ghost/Border Style)
export const SecondaryButton = ({
  children, 
  className = "", 
  ...props 
}: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button 
    {...props}
    className={`w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-white/5 border border-white/10 hover:bg-white/10 active:scale-[0.98] rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg text-white transition-all flex items-center justify-center gap-2 ${className}`}
  >
    {children}
  </button>
);