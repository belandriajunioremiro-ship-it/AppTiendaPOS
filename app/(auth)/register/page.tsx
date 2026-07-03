'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Eye, EyeOff, Lock, Mail, User, Globe, Building2, Store,
  FileText, Phone, MapPin, Hash, Check, ArrowRight, ArrowLeft,
  ChevronRight, UserPlus, Shield, CreditCard,
} from 'lucide-react';
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

type Step1Data = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  pais: string;
};

type Step2Data = {
  nombre_comercio: string;
  tipo_negocio: string;
  moneda_base: string;
  identificacion_fiscal: string;
  razon_social: string;
  regimen_fiscal: string;
  direccion: string;
  telefono: string;
  codigo_postal: string;
};

const countries = [
  { value: 'VE', label: 'Venezuela', moneda: 'VES' },
  { value: 'CO', label: 'Colombia', moneda: 'COP' },
  { value: 'MX', label: 'México', moneda: 'MXN' },
  { value: 'EC', label: 'Ecuador', moneda: 'USD' },
  { value: 'AR', label: 'Argentina', moneda: 'ARS' },
  { value: 'PE', label: 'Perú', moneda: 'PEN' },
  { value: 'CL', label: 'Chile', moneda: 'CLP' },
  { value: 'BO', label: 'Bolivia', moneda: 'BOB' },
  { value: 'UY', label: 'Uruguay', moneda: 'UYU' },
];

const tiposNegocio = [
  { value: 'abarrotes', label: 'Abarrotes' },
  { value: 'farmacia', label: 'Farmacia' },
  { value: 'ferreteria', label: 'Ferretería' },
  { value: 'bodega', label: 'Bodega' },
  { value: 'supermercado', label: 'Supermercado' },
  { value: 'restaurante', label: 'Restaurante' },
  { value: 'licoreria', label: 'Licorería' },
  { value: 'ropa', label: 'Ropa' },
  { value: 'motos', label: 'Motos' },
  { value: 'general', label: 'General' },
];

const regimenesPorPais: Record<string, { value: string; label: string }[]> = {
  VE: [
    { value: 'Especial', label: 'Especial' },
    { value: 'Ordinario', label: 'Ordinario' },
  ],
  CO: [
    { value: 'Responsable IVA', label: 'Responsable de IVA (Común)' },
    { value: 'No Responsable IVA', label: 'No Responsable de IVA (Simplificado)' },
  ],
  MX: [
    { value: 'General de Ley', label: 'Régimen General de Ley (Personas Morales)' },
    { value: 'Actividades Empresariales', label: 'Actividades Empresariales y Profesionales' },
    { value: 'RESICO', label: 'RESICO (Simplificado de Confianza)' },
  ],
  EC: [
    { value: 'RIMPE Negocio Popular', label: 'RIMPE Negocio Popular (hasta $20k)' },
    { value: 'RIMPE Emprendedor', label: 'RIMPE Emprendedor (hasta $300k)' },
    { value: 'General', label: 'Régimen General' },
  ],
  AR: [
    { value: 'Responsable Inscripto', label: 'Responsable Inscripto' },
    { value: 'Monotributo', label: 'Monotributo' },
  ],
  PE: [
    { value: 'NRUS', label: 'Nuevo RUS (NRUS)' },
    { value: 'RER', label: 'Régimen Especial (RER)' },
    { value: 'RMT', label: 'Régimen MYPE Tributario (RMT)' },
    { value: 'Régimen General', label: 'Régimen General' },
  ],
  CL: [
    { value: 'Pro Pyme 14D', label: 'Pro Pyme General (Art. 14 D)' },
    { value: 'Simplificado 14 Ter', label: 'Simplificado (Art. 14 Ter)' },
  ],
  BO: [
    { value: 'Régimen General', label: 'Régimen General' },
    { value: 'RTS', label: 'RTS (Régimen Tributario Simplificado)' },
  ],
  UY: [
    { value: 'Monotributo', label: 'Monotributo' },
    { value: 'Literal E', label: 'Literal E (IVA Mínimo)' },
    { value: 'Régimen General', label: 'Régimen General' },
  ],
};

const regimenDefault = [
  { value: 'General', label: 'General' },
  { value: 'Simplificado', label: 'Simplificado' },
];

const steps = [
  { number: 1, label: 'Cuenta', icon: User, desc: 'Tus datos de acceso' },
  { number: 2, label: 'Tienda', icon: Store, desc: 'Configura tu negocio' },
  { number: 3, label: 'Confirmación', icon: Check, desc: 'Revisa y crea' },
];

function validateStep1(data: Step1Data): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.name.trim()) errors.name = 'El nombre es obligatorio';
  if (!data.email.trim()) errors.email = 'El email es obligatorio';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Email inválido';
  if (!data.password) errors.password = 'La contraseña es obligatoria';
  else if (data.password.length < 8) errors.password = 'Mínimo 8 caracteres';
  if (data.password !== data.password_confirmation) errors.password_confirmation = 'Las contraseñas no coinciden';
  if (!data.pais) errors.pais = 'Selecciona un país';
  return errors;
}

function validateStep2(data: Step2Data): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.nombre_comercio.trim()) errors.nombre_comercio = 'El nombre del comercio es obligatorio';
  if (!data.tipo_negocio) errors.tipo_negocio = 'Selecciona un tipo de negocio';
  return errors;
}

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [s1, setS1] = useState<Step1Data>({
    name: '', email: '', password: '', password_confirmation: '', pais: 'VE',
  });
  const [s1Errors, setS1Errors] = useState<Record<string, string>>({});

  const [s2, setS2] = useState<Step2Data>({
    nombre_comercio: '', tipo_negocio: '', moneda_base: '',
    identificacion_fiscal: '', razon_social: '', regimen_fiscal: '',
    direccion: '', telefono: '', codigo_postal: '',
  });
  const [s2Errors, setS2Errors] = useState<Record<string, string>>({});

  const selectedCountry = s1.pais;
  const countryData = countries.find(c => c.value === selectedCountry);

  const goStep1 = () => {
    const errs = validateStep1(s1);
    setS1Errors(errs);
    if (Object.keys(errs).length === 0) {
      setS2(prev => ({ ...prev, moneda_base: countryData?.moneda || '' }));
      setStep(2);
    }
  };

  const goStep2 = () => {
    const errs = validateStep2(s2);
    setS2Errors(errs);
    if (Object.keys(errs).length === 0) setStep(3);
  };

  const s1Fields: { key: keyof Step1Data; label: string; type: string; icon: React.ReactNode; placeholder: string }[] = [
    { key: 'name', label: 'Nombre completo', type: 'text', icon: <User className="h-4 w-4" />, placeholder: 'Juan Pérez' },
    { key: 'email', label: 'Correo electrónico', type: 'email', icon: <Mail className="h-4 w-4" />, placeholder: 'tu@email.com' },
    { key: 'password', label: 'Contraseña', type: 'password', icon: <Lock className="h-4 w-4" />, placeholder: '••••••••' },
    { key: 'password_confirmation', label: 'Confirmar contraseña', type: 'password', icon: <Lock className="h-4 w-4" />, placeholder: '••••••••' },
  ];

  const s2Fields: { key: keyof Step2Data; label: string; icon: React.ReactNode; placeholder: string; colSpan?: boolean }[] = [
    { key: 'nombre_comercio', label: 'Nombre del comercio', icon: <Store className="h-4 w-4" />, placeholder: 'Mi Tienda' },
    { key: 'identificacion_fiscal', label: 'Identificación fiscal (RIF/NIT/RFC)', icon: <FileText className="h-4 w-4" />, placeholder: 'J-12345678-9' },
    { key: 'razon_social', label: 'Razón social', icon: <Building2 className="h-4 w-4" />, placeholder: 'Mi Tienda C.A.' },
    { key: 'telefono', label: 'Teléfono', icon: <Phone className="h-4 w-4" />, placeholder: '+58-000-0000000' },
    { key: 'direccion', label: 'Dirección', icon: <MapPin className="h-4 w-4" />, placeholder: 'Av. Principal, Edif. 123', colSpan: true },
    { key: 'codigo_postal', label: 'Código postal', icon: <Hash className="h-4 w-4" />, placeholder: '1010' },
  ];

  const handleSubmit = async () => {
    setServerError(null);
    setLoading(true);
    try {
      const response = await api.post('/auth/register-complete', {
        ...s1,
        ...s2,
      });
      const { token, user } = response.data.data;
      setAuth(token, user);
      router.push('/dashboard');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      const message = e?.response?.data?.errors
        ? Object.values(e.response.data.errors)[0]?.[0]
        : e?.response?.data?.message || 'Error al crear la cuenta';
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-6">
        <h2 className="font-display text-2xl font-bold text-zinc-100">
          {step === 1 ? 'Crear cuenta' : step === 2 ? 'Configurar tienda' : 'Revisa tus datos'}
        </h2>
        <p className="mt-1 text-zinc-400 text-sm">
          {step === 1 ? 'Paso 1 de 3 — Tus datos de acceso' :
           step === 2 ? 'Paso 2 de 3 — Información de tu negocio' :
           'Paso 3 de 3 — Confirma antes de crear'}
        </p>
      </div>

      <div className="flex items-center gap-2 mb-6">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isActive = step === s.number;
          const isPast = step > s.number;
          return (
            <div key={s.number} className="flex items-center gap-2 flex-1 min-w-0">
              <div className={`flex items-center gap-1.5 px-2 py-1.5 text-xs transition-all w-full rounded-md ${
                isActive ? 'bg-amber/10' : ''
              }`}>
                <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${
                  isActive ? 'bg-amber text-dark-primary' :
                  isPast ? 'bg-amber/20 text-amber' : 'bg-zinc-800 text-zinc-500'
                }`}>
                  {isPast ? <Check className="h-3 w-3" /> : <Icon className="h-3 w-3" />}
                </div>
                <span className={`hidden sm:inline font-medium truncate ${
                  isActive ? 'text-amber' : isPast ? 'text-amber/60' : 'text-zinc-500'
                }`}>
                  {s.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <ChevronRight className="h-3 w-3 text-zinc-700 shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      {serverError && (
        <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
          <p className="text-red-400 text-sm">{serverError}</p>
        </div>
      )}

      {/* STEP 1 — Cuenta */}
      {step === 1 && (
        <div className="space-y-4">
          {s1Fields.map(f => {
            const showToggle = f.type === 'password';
            const isPass = f.key === 'password';
            const isConfirm = f.key === 'password_confirmation';
            return (
              <div key={f.key} className="space-y-1.5">
                <Label htmlFor={f.key}>{f.label}</Label>
                <div className="relative">
                  <Input
                    id={f.key}
                    type={
                      f.type === 'password'
                        ? (isPass ? (showPassword ? 'text' : 'password') : (showConfirmPassword ? 'text' : 'password'))
                        : f.type
                    }
                    placeholder={f.placeholder}
                    icon={f.icon}
                    value={s1[f.key]}
                    onChange={e => { setS1(p => ({ ...p, [f.key]: e.target.value })); setS1Errors(p => { const n = { ...p }; delete n[f.key]; return n; }); }}
                    error={s1Errors[f.key]}
                  />
                  {showToggle && (
                    <button
                      type="button"
                      onClick={() => isPass ? setShowPassword(!showPassword) : setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {(isPass ? showPassword : showConfirmPassword) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  )}
                </div>
                {s1Errors[f.key] && <p className="text-red-400 text-xs">{s1Errors[f.key]}</p>}
              </div>
            );
          })}

          <div className="space-y-1.5">
            <Label htmlFor="pais">País</Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 z-10">
                <Globe className="h-4 w-4" />
              </div>
              <Select
                value={s1.pais}
                onValueChange={v => { setS1(p => ({ ...p, pais: v })); setS1Errors(p => { const n = { ...p }; delete n.pais; return n; }); }}
              >
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Selecciona tu país" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(c => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {s1Errors.pais && <p className="text-red-400 text-xs">{s1Errors.pais}</p>}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={goStep1}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-5 bg-amber text-dark-primary font-semibold rounded-lg hover:bg-amber-dark transition-all"
            >
              Siguiente <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 — Tienda */}
      {step === 2 && (
        <div className="space-y-4">
          {s2Fields.map(f => (
            <div key={f.key} className={f.colSpan ? 'md:col-span-2' : ''}>
              <div className="space-y-1.5">
                <Label htmlFor={f.key}>{f.label}</Label>
                {f.key === 'direccion' ? (
                  <textarea
                    id={f.key}
                    className="w-full px-3 py-2 bg-dark-tertiary/50 border border-white/20 rounded-lg text-zinc-100 placeholder:text-zinc-500 hover:border-white/35 focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 text-sm min-h-[60px] resize-none transition-all font-body"
                    placeholder={f.placeholder}
                    value={s2[f.key] as string}
                    onChange={e => { setS2(p => ({ ...p, [f.key]: e.target.value })); setS2Errors(p => { const n = { ...p }; delete n[f.key]; return n; }); }}
                  />
                ) : (
                  <Input
                    id={f.key}
                    type="text"
                    placeholder={f.placeholder}
                    icon={f.icon}
                    value={s2[f.key] as string}
                    onChange={e => { setS2(p => ({ ...p, [f.key]: e.target.value })); setS2Errors(p => { const n = { ...p }; delete n[f.key]; return n; }); }}
                    error={s2Errors[f.key]}
                  />
                )}
                {s2Errors[f.key] && <p className="text-red-400 text-xs">{s2Errors[f.key]}</p>}
              </div>
            </div>
          ))}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="tipo_negocio">Tipo de negocio</Label>
              <Select
                value={s2.tipo_negocio}
                onValueChange={v => { setS2(p => ({ ...p, tipo_negocio: v })); setS2Errors(p => { const n = { ...p }; delete n.tipo_negocio; return n; }); }}
              >
                <SelectTrigger id="tipo_negocio">
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposNegocio.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {s2Errors.tipo_negocio && <p className="text-red-400 text-xs">{s2Errors.tipo_negocio}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="moneda_base">Moneda base</Label>
              <Input
                id="moneda_base"
                type="text"
                value={s2.moneda_base || countryData?.moneda || ''}
                readOnly
                icon={<CreditCard className="h-4 w-4" />}
                className="text-zinc-400"
              />
              <p className="text-[11px] text-zinc-500">Según el país seleccionado: {countryData?.label}</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="regimen_fiscal">Régimen fiscal <span className="text-zinc-500">(opcional)</span></Label>
              <Select
                value={s2.regimen_fiscal}
                onValueChange={v => setS2(p => ({ ...p, regimen_fiscal: v }))}
              >
                <SelectTrigger id="regimen_fiscal">
                  <SelectValue placeholder="Selecciona un régimen" />
                </SelectTrigger>
                <SelectContent>
                  {(selectedCountry ? (regimenesPorPais[selectedCountry] || regimenDefault) : regimenDefault).map(r => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-100 transition-colors shrink-0"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Atrás
            </button>
            <button
              type="button"
              onClick={goStep2}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-5 bg-amber text-dark-primary font-semibold rounded-lg hover:bg-amber-dark transition-all"
            >
              Siguiente <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 — Confirmación */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="bg-dark-tertiary border border-white/[0.06] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-amber/15 flex items-center justify-center">
                <User className="h-3 w-3 text-amber" />
              </div>
              <h4 className="text-sm font-semibold text-zinc-100">Cuenta</h4>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between"><span className="text-zinc-500">Nombre</span><span className="text-zinc-100 font-medium">{s1.name}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Email</span><span className="text-zinc-100 font-medium">{s1.email}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">País</span><span className="text-zinc-100 font-medium">{countries.find(c => c.value === s1.pais)?.label}</span></div>
            </div>
          </div>

          <div className="bg-dark-tertiary border border-white/[0.06] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-amber/15 flex items-center justify-center">
                <Store className="h-3 w-3 text-amber" />
              </div>
              <h4 className="text-sm font-semibold text-zinc-100">Tienda</h4>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between"><span className="text-zinc-500">Nombre</span><span className="text-zinc-100 font-medium">{s2.nombre_comercio}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Tipo</span><span className="text-zinc-100 font-medium capitalize">{tiposNegocio.find(t => t.value === s2.tipo_negocio)?.label || s2.tipo_negocio}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Moneda</span><span className="text-zinc-100 font-medium">{s2.moneda_base || countryData?.moneda}</span></div>
              {s2.identificacion_fiscal && <div className="flex justify-between"><span className="text-zinc-500">Identificación fiscal</span><span className="text-zinc-100 font-medium">{s2.identificacion_fiscal}</span></div>}
              {s2.razon_social && <div className="flex justify-between"><span className="text-zinc-500">Razón social</span><span className="text-zinc-100 font-medium">{s2.razon_social}</span></div>}
              {s2.regimen_fiscal && <div className="flex justify-between"><span className="text-zinc-500">Régimen fiscal</span><span className="text-zinc-100 font-medium">{s2.regimen_fiscal}</span></div>}
              {s2.direccion && <div className="flex justify-between"><span className="text-zinc-500">Dirección</span><span className="text-zinc-100 font-medium text-right max-w-[200px] truncate">{s2.direccion}</span></div>}
              {s2.telefono && <div className="flex justify-between"><span className="text-zinc-500">Teléfono</span><span className="text-zinc-100 font-medium">{s2.telefono}</span></div>}
            </div>
          </div>

          <div className="bg-dark-tertiary border border-white/[0.06] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-emerald-500/15 flex items-center justify-center">
                <Shield className="h-3 w-3 text-emerald-400" />
              </div>
              <h4 className="text-sm font-semibold text-zinc-100">Plan incluido</h4>
            </div>
            <p className="text-xs text-zinc-400">14 días de prueba gratuita — sin tarjeta de crédito. Impuestos, monedas, categorías y un almacén se configurarán automáticamente.</p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-100 transition-colors shrink-0"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Atrás
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-5 bg-amber text-dark-primary font-semibold rounded-lg hover:bg-amber-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                'Creando tu negocio...'
              ) : (
                <><UserPlus className="h-4 w-4" /> Crear mi negocio</>
              )}
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-white/20 text-center">
        <p className="text-zinc-400 text-sm">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-amber hover:text-amber-light transition-colors font-medium">
            Inicia sesión
          </Link>
        </p>
      </div>
    </>
  );
}
