'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showToast } from '@/lib/toast';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(6, 'Debe tener al menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, loading, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const resetSuccess = searchParams.get('reset');
  const registered = searchParams.get('registered');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    const success = await login(data.email, data.password);
    if (success) {
      showToast.loginSuccess();
      try {
        const { data: onboardingData } = await (await import('@/lib/axios')).default.get('/onboarding/estado');
        if (!onboardingData.data.completado) {
          router.push('/onboarding');
          return;
        }
      } catch {}
      router.push('/dashboard');
    } else {
      showToast.credentials();
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h2 className="font-display text-2xl font-bold text-zinc-100">
          Inicia sesión
        </h2>
        <p className="mt-2 text-zinc-400 text-sm">
          Usa el mismo correo con el que te registraste
        </p>
      </div>

      {resetSuccess && (
        <div className="mb-6 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
          <p className="text-emerald-400 text-sm">Contraseña cambiada correctamente. Ya puedes iniciar sesión.</p>
        </div>
      )}
      {registered && (
        <div className="mb-6 p-3 rounded-lg bg-amber/10 border border-amber/20 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-amber shrink-0" />
          <p className="text-amber text-sm">Cuenta creada exitosamente. Continúa con la configuración de tu negocio.</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@empresa.com"
            icon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            autoComplete="email"
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...register('email')}
          />
          {errors.email && (
            <p id="email-error" className="text-red-400 text-xs mt-1" role="alert">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              icon={<Lock className="h-4 w-4" />}
              error={errors.password?.message}
              autoComplete="current-password"
              aria-describedby={errors.password ? 'password-error' : undefined}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className="text-red-400 text-xs mt-1" role="alert">{errors.password.message}</p>
          )}
        </div>

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-zinc-400 text-sm hover:text-amber transition-colors"
          >
            ¿No recuerdas tu contraseña?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-amber text-dark-primary font-semibold rounded-md hover:bg-amber-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            'Ingresando...'
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              Acceder a tu negocio
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-dark-border text-center">
        <p className="text-zinc-400 text-sm">
          ¿Aún no tienes cuenta?{' '}
          <Link
            href="/register"
            className="text-amber hover:text-amber-light transition-colors font-medium"
          >
            Crea una aquí
          </Link>
        </p>
      </div>
    </>
  );
}
