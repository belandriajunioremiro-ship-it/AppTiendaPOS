'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Lock, Mail, ArrowLeft, ShieldCheck, KeyRound } from 'lucide-react';
import api from '@/lib/axios';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import Link from 'next/link';

const verifySchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  token: z.string().length(6, 'El código debe tener 6 dígitos'),
});

const resetSchema = z
  .object({
    email: z.string().email('Correo electrónico inválido'),
    token: z.string().length(6, 'El código debe tener 6 dígitos'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Las contraseñas no coinciden',
    path: ['password_confirmation'],
  });

type VerifyFormData = z.infer<typeof verifySchema>;
type ResetFormData = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  const visible = local.slice(0, 5);
  const stars = '*'.repeat(Math.max(4, local.length - 5));
  return `${visible}${stars}@${domain}`;
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get('token');
  const emailFromUrl = searchParams.get('email');

  const [view, setView] = useState<'verify' | 'reset'>(tokenFromUrl ? 'reset' : 'verify');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState(tokenFromUrl || '');

  const verifyForm = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      email: emailFromUrl || '',
      token: tokenFromUrl || '',
    },
  });

  const resetForm = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: emailFromUrl || '',
      token: tokenFromUrl || '',
      password: '',
      password_confirmation: '',
    },
  });

  useEffect(() => {
    if (tokenFromUrl) {
      setOtp(tokenFromUrl);
      setView('reset');
      resetForm.setValue('token', tokenFromUrl);
    }
    if (emailFromUrl) {
      verifyForm.setValue('email', emailFromUrl);
      resetForm.setValue('email', emailFromUrl);
    }
  }, [tokenFromUrl, emailFromUrl, resetForm, verifyForm]);

  const onVerify = async (data: VerifyFormData) => {
    setError(null);
    setLoading(true);
    try {
      await api.post('/auth/verify-token', {
        email: data.email,
        token: data.token,
      });
      const url = new URL(window.location.href);
      url.searchParams.set('token', data.token);
      url.searchParams.set('email', data.email);
      window.history.pushState({}, '', url.toString());
      setView('reset');
      resetForm.setValue('token', data.token);
      resetForm.setValue('email', data.email);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Código inválido o expirado';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const onReset = async (data: ResetFormData) => {
    setError(null);
    setLoading(true);
    try {
      await api.post('/auth/reset-password', {
        email: data.email,
        token: data.token,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });
      router.push('/login?reset=true');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error al restablecer la contraseña';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h2 className="font-display text-2xl font-bold text-zinc-100">
          {view === 'verify' ? 'Verificar Código' : 'Nueva Contraseña'}
        </h2>
        <p className="mt-2 text-zinc-400 text-sm">
          {view === 'verify'
            ? 'Ingresa el código de 6 dígitos que enviamos a tu correo'
            : 'Crea una nueva contraseña segura para tu cuenta'}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {view === 'verify' ? (
        <form onSubmit={verifyForm.handleSubmit(onVerify)} className="space-y-6">
          <div className="bg-dark-tertiary/30 rounded-lg p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber/10 flex items-center justify-center shrink-0">
              <Mail className="h-4 w-4 text-amber" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-zinc-500 mb-0.5">Correo electrónico</p>
              <p className="text-sm text-zinc-100 font-medium truncate">
                {emailFromUrl ? maskEmail(emailFromUrl) : 'tu@email.com'}
              </p>
            </div>
          </div>
          <input type="hidden" {...verifyForm.register('email')} />

          <div className="space-y-2">
            <Label>Código de verificación</Label>
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => {
                  setOtp(value);
                  verifyForm.setValue('token', value);
                }}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            {verifyForm.formState.errors.token && (
              <p className="text-red-400 text-xs text-center mt-1">
                {verifyForm.formState.errors.token.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-amber text-dark-primary font-semibold rounded-md hover:bg-amber-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              'Verificando...'
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                Verificar Código
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={resetForm.handleSubmit(onReset)} className="space-y-5">
          <input type="hidden" {...resetForm.register('token')} />
          <input type="hidden" {...resetForm.register('email')} />

          <div className="space-y-2">
            <Label>Código de verificación</Label>
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => {
                  setOtp(value);
                  resetForm.setValue('token', value);
                }}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="password">Nueva contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  icon={<Lock className="h-4 w-4" />}
                  {...resetForm.register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {resetForm.formState.errors.password && (
                <p className="text-red-400 text-xs mt-1">
                  {resetForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password_confirmation">Confirmar</Label>
              <div className="relative">
                <Input
                  id="password_confirmation"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  icon={<Lock className="h-4 w-4" />}
                  {...resetForm.register('password_confirmation')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {resetForm.formState.errors.password_confirmation && (
                <p className="text-red-400 text-xs mt-1">
                  {resetForm.formState.errors.password_confirmation.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-amber text-dark-primary font-semibold rounded-md hover:bg-amber-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              'Guardando...'
            ) : (
              <>
                <KeyRound className="h-4 w-4" />
                Restablecer Contraseña
              </>
            )}
          </button>
        </form>
      )}

      <div className="mt-6 pt-6 border-t border-dark-border text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-zinc-400 text-sm hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio de sesión
        </Link>
      </div>
    </>
  );
}

