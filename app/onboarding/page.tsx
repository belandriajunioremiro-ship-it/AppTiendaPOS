'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

export default function OnboardingRedirectPage() {
  const router = useRouter();
  const { token } = useAuthStore();

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    router.push('/register?continue=true');
  }, [token, router]);

  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex items-center gap-3 text-zinc-400">
        <div className="w-5 h-5 border-2 border-amber/30 border-t-amber rounded-full animate-spin" />
        <span>Redirigiendo...</span>
      </div>
    </div>
  );
}
