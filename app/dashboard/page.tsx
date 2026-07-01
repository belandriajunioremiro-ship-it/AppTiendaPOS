'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import api from '@/lib/axios';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, logout } = useAuthStore();

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    api.get('/onboarding/estado').then((res) => {
      if (!res.data.data.completado) {
        router.push('/onboarding');
      }
    }).catch(() => {});
  }, [token, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-dark-primary flex items-center justify-center">
        <div className="text-zinc-400">Redirigiendo...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-primary">
      <header className="border-b border-dark-border bg-dark-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="font-display text-xl font-bold text-amber">
              TiendaPOS
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-zinc-400 text-sm">
                {user?.name || 'Usuario'}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-zinc-100 hover:text-amber transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-dark-secondary border border-dark-border rounded-xl p-8">
          <h1 className="font-display text-2xl font-bold text-zinc-100 mb-4">
            Bienvenido, {user?.name || 'Usuario'}
          </h1>
          <p className="text-zinc-400">
            Has iniciado sesión correctamente. Este es tu panel de control.
          </p>
        </div>
      </main>
    </div>
  );
}
