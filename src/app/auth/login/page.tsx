'use client';
import React, { Suspense } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/Base';

export default function LoginPage() {
  const router = useRouter();
  
  return (
    <PageContainer>
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <LoginForm onLoginSuccess={() => router.push('/dashboard')} />
      </Suspense>
    </PageContainer>
  );
}