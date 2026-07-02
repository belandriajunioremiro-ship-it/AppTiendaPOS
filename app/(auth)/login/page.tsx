'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
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

  const anim = (delay: number) =>
    mounted
      ? { opacity: 1, transform: 'translateY(0)', transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms` }
      : { opacity: 0, transform: 'translateY(16px)' };

  const alertAnim = (delay: number) =>
    mounted
      ? { opacity: 1, transform: 'translateY(0)', transition: `all 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}ms` }
      : { opacity: 0, transform: 'translateY(8px)' };

  const inputCls =
    'h-12 bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-amber focus:ring-[3px] focus:ring-amber/[0.12] rounded-xl text-[14px]';

  return (
    <div style={anim(0)}>
      <h1 className="font-display text-[26px] font-bold text-[#09090b] tracking-[-0.015em] leading-tight">
        Inicia sesión
      </h1>
      <p className="mt-1.5 text-zinc-500 text-[14px] leading-relaxed">
        Usa el mismo correo con el que te registraste
      </p>

      {resetSuccess && (
        <div style={alertAnim(60)} className="mt-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/70 flex items-center gap-3" role="alert">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
          <p className="text-emerald-700 text-[13px] leading-relaxed">Contraseña cambiada correctamente. Ya puedes iniciar sesión.</p>
        </div>
      )}
      {registered && (
        <div style={alertAnim(60)} className="mt-6 p-3.5 rounded-xl bg-amber-50 border border-amber-200/70 flex items-center gap-3" role="alert">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
          <p className="text-amber-800 text-[13px] leading-relaxed">Cuenta creada exitosamente. Continúa con la configuración de tu negocio.</p>
        </div>
      )}
      {error && (
        <div style={alertAnim(60)} className="mt-6 p-3.5 rounded-xl bg-red-50 border border-red-200/70 flex items-center gap-3" role="alert">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
          <p className="text-red-700 text-[13px] leading-relaxed">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
        <div style={anim(80)}>
          <Label htmlFor="email" className="text-[11px] font-semibold text-zinc-600 tracking-[0.08em] uppercase mb-2 block">
            Correo electrónico
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@empresa.com"
            icon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            autoComplete="email"
            className={inputCls}
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...register('email')}
          />
          {errors.email && (
            <p id="email-error" className="text-red-500 text-[12px] mt-1.5 flex items-center gap-1.5" role="alert">
              <span className="w-1 h-1 rounded-full bg-red-500 shrink-0" />
              {errors.email.message}
            </p>
          )}
        </div>

        <div style={anim(160)}>
          <Label htmlFor="password" className="text-[11px] font-semibold text-zinc-600 tracking-[0.08em] uppercase mb-2 block">
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
              className={`${inputCls} pr-11`}
              aria-describedby={errors.password ? 'password-error' : undefined}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors focus-visible:outline-none focus-visible:text-amber"
              tabIndex={-1}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className="text-red-500 text-[12px] mt-1.5 flex items-center gap-1.5" role="alert">
              <span className="w-1 h-1 rounded-full bg-red-500 shrink-0" />
              {errors.password.message}
            </p>
          )}
        </div>

        <div style={anim(240)} className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-[13px] text-zinc-500 hover:text-amber transition-colors font-medium focus-visible:text-amber focus-visible:outline-none"
          >
            ¿No recuerdas tu contraseña?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading || !isValid}
          style={anim(320)}
          className="group relative w-full flex items-center justify-center gap-2.5 h-12 bg-amber text-[#09090b] font-semibold text-[14px] rounded-xl transition-all duration-200 hover:bg-amber-dark hover:shadow-[0_8px_28px_-6px_rgba(245,158,11,0.4)] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fafaf9]"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Ingresando...</span>
            </>
          ) : (
            <span>Entrar</span>
          )}
        </button>
      </form>

      <div style={anim(400)} className="mt-10 pt-6 border-t border-zinc-100 text-center">
        <p className="text-zinc-500 text-[13px]">
          ¿Aún no tienes cuenta?{' '}
          <Link
            href="/register"
            className="text-amber hover:text-amber-dark transition-colors font-semibold focus-visible:text-amber-dark focus-visible:outline-none"
          >
            Crea una aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
