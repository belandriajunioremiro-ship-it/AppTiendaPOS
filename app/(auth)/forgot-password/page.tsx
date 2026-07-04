'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft, SendHorizonal } from 'lucide-react';
import api from '@/lib/axios';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

const forgotPasswordSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError(null);
    setLoading(true);
    setSubmittedEmail(data.email);
    try {
      await api.post('/auth/forgot-password', { email: data.email });
      setSuccess(true);
    } catch (err: unknown) {
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h2 className="font-display text-2xl font-bold text-foreground">
          ¿Olvidaste tu contraseña?
        </h2>
        <p className="mt-2 text-muted-foreground text-sm">
          Te enviaremos un código de verificación a tu correo electrónico
        </p>
      </div>

      {success ? (
        <div className="space-y-6">
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div>
              <p className="text-emerald-400 text-sm font-medium mb-1">
                Correo enviado
              </p>
              <p className="text-muted-foreground text-sm">
                Si el correo está registrado, recibirás un código de verificación de 6 dígitos.
              </p>
            </div>
          </div>
          <Link
            href={`/reset-password?email=${encodeURIComponent(submittedEmail)}`}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-all text-center"
          >
            <SendHorizonal className="h-4 w-4" />
            Ya tengo el código
          </Link>
          <button
            type="button"
            onClick={() => { setSuccess(false); setError(null); }}
            className="w-full text-muted-foreground text-sm hover:text-foreground transition-colors"
          >
            Enviar código a otro correo
          </button>
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              <p className="text-destructive-foreground text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                icon={<Mail className="h-4 w-4" />}
                error={errors.email?.message}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-destructive-foreground text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                'Enviando...'
              ) : (
                <>
                  <SendHorizonal className="h-4 w-4" />
                  Enviar código de verificación
                </>
              )}
            </button>

            <p className="text-muted-foreground text-xs text-center">
              Si no te llega el código, revisa tu bandeja de spam. Tienes un límite de 3 intentos por minuto.
            </p>
          </form>
        </>
      )}

      <div className="mt-6 pt-6 border-t border-input text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio de sesión
        </Link>
      </div>
    </>
  );
}
