'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  const { login, loading, error, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const resetSuccess = searchParams.get('reset');
  const registered = searchParams.get('registered');
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => { setMounted(true); }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    const success = await login(data.email, data.password);
    if (success) {
      try {
        const { data: onboardingData } = await (await import('@/lib/axios')).default.get('/onboarding/estado');
        if (!onboardingData.data.completado) {
          router.push('/onboarding');
          return;
        }
      } catch {}
      router.push('/dashboard');
    }
  };

  const stagger = (i: number) => ({
    animation: `fade-up 0.5s ease-out ${0.08 * i}s both`,
  });

  return (
    <>
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="text-left mb-8" style={mounted ? stagger(0) : {}}>
        <h1 className="font-display text-2xl font-bold text-[#09090b] tracking-tight">
          Inicia sesión
        </h1>
        <p className="mt-1.5 text-zinc-500 text-sm">
          Usa el mismo correo con el que te registraste
        </p>
      </div>

      {resetSuccess && (
        <div className="mb-5 p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2" style={mounted ? stagger(1) : {}}>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
          <p className="text-emerald-700 text-xs">Contraseña cambiada correctamente. Ya puedes iniciar sesión.</p>
        </div>
      )}

      {registered && (
        <div className="mb-5 p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-center gap-2" style={mounted ? stagger(1) : {}}>
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
          <p className="text-amber-800 text-xs">Cuenta creada exitosamente. Continúa con la configuración de tu negocio.</p>
        </div>
      )}

      {error && (
        <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2" style={mounted ? stagger(1) : {}}>
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
          <p className="text-red-700 text-xs">{error}</p>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="space-y-1.5" style={mounted ? stagger(1) : {}}>
          <Label htmlFor="email" className="text-xs font-medium text-zinc-700 tracking-wide uppercase">
            Correo electrónico
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@empresa.com"
            icon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            autoComplete="email"
            className="bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-amber focus:ring-amber/15"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1" role="alert">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5" style={mounted ? stagger(2) : {}}>
          <Label htmlFor="password" className="text-xs font-medium text-zinc-700 tracking-wide uppercase">
            Contraseña
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              icon={<Lock className="h-4 w-4" />}
              error={errors.password?.message}
              autoComplete="current-password"
              className="bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-amber focus:ring-amber/15 pr-10"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors focus:outline-none focus-visible:text-zinc-600"
              tabIndex={-1}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1" role="alert">{errors.password.message}</p>
          )}
        </div>

        <div className="flex justify-end" style={mounted ? stagger(3) : {}}>
          <Link
            href="/forgot-password"
            className="text-xs text-zinc-500 hover:text-amber transition-colors font-medium"
          >
            ¿No recuerdas tu contraseña?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading || !isValid}
          style={mounted ? stagger(4) : {}}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-amber text-[#09090b] font-semibold rounded-lg hover:bg-amber-dark hover:shadow-[0_0_20px_-5px_rgba(245,158,11,0.4)] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/40"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Ingresando...</span>
            </>
          ) : (
            <>
              <span>Entrar</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-zinc-200 text-center" style={mounted ? stagger(5) : {}}>
        <p className="text-zinc-500 text-xs">
          ¿Aún no tienes cuenta?{' '}
          <Link
            href="/register"
            className="text-amber hover:text-amber-dark transition-colors font-semibold"
          >
            Crea una aquí
          </Link>
        </p>
      </div>
    </>
  );
}
