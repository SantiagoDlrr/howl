'use client'

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import SignUpCard from "@/app/_components/auth/signupCard";
import LoginCard from "@/app/_components/auth/loginCard";

function AuthContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || '';
  const login = mode === "login";

  return (
    <div className="h-screen bg-bg-dark flex flex-row justify-center items-center gap-20">
      {login ? <LoginCard /> : <SignUpCard />}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-bg-dark flex justify-center items-center">Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}