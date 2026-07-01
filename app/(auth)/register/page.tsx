'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Lock, Mail, User, Globe, UserPlus } from 'lucide-react';
import api from '@/lib/axios';
import { useAuthStore } from '@/stores/auth-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';

const registerSchema = z
  .object({
    name: z.string().min(1, 'El nombre es requerido'),
    email: z.string().email('Correo electrónico inválido'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    password_confirmation: z.string(),
    pais: z.string().min(1, 'Selecciona un país'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Las contraseñas no coinciden',
    path: ['password_confirmation'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const countries = [
  { value: 'VE', label: 'Venezuela' },
  { value: 'CO', label: 'Colombia' },
  { value: 'MX', label: 'México' },
  { value: 'EC', label: 'Ecuador' },
  { value: 'AR', label: 'Argentina' },
  { value: 'PE', label: 'Perú' },
  { value: 'CL', label: 'Chile' },
  { value: 'BO', label: 'Bolivia' },
  { value: 'UY', label: 'Uruguay' },
];

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      pais: 'VE',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    setLoading(true);
    try {
      const response = await api.post('/onboarding/cuenta', data);
      const { token, user } = response.data.data;
      setAuth(token, user);
      router.push('/onboarding');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error al crear la cuenta';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h2 className="font-display text-2xl font-bold text-zinc-100">
          Crear Cuenta
        </h2>
        <p className="mt-2 text-zinc-400 text-sm">
          Completa el formulario para registrarte gratuitamente
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre completo</Label>
          <Input
            id="name"
            type="text"
            placeholder="Juan Pérez"
            icon={<User className="h-4 w-4" />}
            error={errors.name?.message}
            {...register('name')}
          />
          {errors.name && (
            <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

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
            <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                icon={<Lock className="h-4 w-4" />}
                error={errors.password?.message}
                {...register('password')}
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
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
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
                error={errors.password_confirmation?.message}
                {...register('password_confirmation')}
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
            {errors.password_confirmation && (
              <p className="text-red-400 text-xs mt-1">
                {errors.password_confirmation.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pais">País</Label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 z-10">
              <Globe className="h-4 w-4" />
            </div>
            <Select
              defaultValue="VE"
              onValueChange={(value) => setValue('pais', value)}
            >
              <SelectTrigger className="pl-10">
                <SelectValue placeholder="Selecciona tu país" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {errors.pais && (
            <p className="text-red-400 text-xs mt-1">{errors.pais.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-amber text-dark-primary font-semibold rounded-md hover:bg-amber-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            'Creando cuenta...'
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              Crear mi cuenta
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-dark-border text-center">
        <p className="text-zinc-400 text-sm">
          ¿Ya tienes cuenta?{' '}
          <Link
            href="/login"
            className="text-amber hover:text-amber-light transition-colors font-medium"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </>
  );
}
