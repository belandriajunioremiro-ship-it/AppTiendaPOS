'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, Store, Package, ArrowRight, ArrowLeft, Check, ChevronRight, Save, Plus, SkipForward, FileText, Tag, Phone, Mail, MapPin, Hash, Barcode, DollarSign, CreditCard } from 'lucide-react';
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

const datosFiscalesSchema = z.object({
  identificacion_fiscal: z.string().min(1, 'Requerido'),
  razon_social: z.string().min(1, 'Requerido'),
  nombre_comercial: z.string().optional(),
  direccion: z.string().min(1, 'Requerido'),
  telefono: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
});

const configurarNegocioSchema = z.object({
  tipo_negocio: z.string().min(1, 'Selecciona un tipo'),
  nombre_almacen: z.string().optional(),
  nombre_caja: z.string().optional(),
  tipo_impresora: z.string().optional(),
});

const primerProductoSchema = z.object({
  nombre: z.string().min(1, 'Requerido'),
  sku: z.string().optional(),
  codigo_barra: z.string().optional(),
  costo: z.string().optional(),
  aplica_iva: z.boolean().optional(),
  stock_inicial: z.string().optional(),
});

type DatosFiscalesData = z.infer<typeof datosFiscalesSchema>;
type ConfigurarNegocioData = z.infer<typeof configurarNegocioSchema>;
type PrimerProductoData = z.infer<typeof primerProductoSchema>;

const tiposNegocio = [
  { value: 'general', label: 'General' },
  { value: 'abarrotes', label: 'Abarrotes' },
  { value: 'farmacia', label: 'Farmacia' },
  { value: 'ferreteria', label: 'Ferretería' },
  { value: 'bodega', label: 'Bodega' },
  { value: 'restaurante', label: 'Restaurante' },
  { value: 'licoreria', label: 'Licorería' },
  { value: 'ropa', label: 'Ropa' },
  { value: 'motos', label: 'Motos' },
];

const tiposImpresora = [
  { value: 'termica_80mm', label: 'Térmica 80mm' },
  { value: 'termica_58mm', label: 'Térmica 58mm' },
  { value: 'a4', label: 'Carta A4' },
  { value: 'pdf', label: 'PDF' },
  { value: 'ninguno', label: 'Ninguna' },
];

const steps = [
  { number: 2, label: 'Datos Fiscales', icon: Building2, desc: 'Registra tu información fiscal' },
  { number: 3, label: 'Configurar Negocio', icon: Store, desc: 'Personaliza tu tienda' },
  { number: 4, label: 'Primer Producto', icon: Package, desc: 'Agrega tu primer artículo' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    loadStep();
  }, [token]);

  const loadStep = async () => {
    try {
      const response = await api.get('/onboarding/estado');
      const { paso_actual, completado: isCompleted } = response.data.data;

      if (isCompleted) {
        setCompleted(true);
        router.push('/dashboard');
        return;
      }

      setCurrentStep(paso_actual === 1 ? 2 : paso_actual + 1);
    } catch {
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fiscalForm = useForm<DatosFiscalesData>({
    resolver: zodResolver(datosFiscalesSchema),
  });

  const businessForm = useForm<ConfigurarNegocioData>({
    resolver: zodResolver(configurarNegocioSchema),
  });

  const productForm = useForm<PrimerProductoData>({
    resolver: zodResolver(primerProductoSchema),
  });

  const onSubmitFiscal = async (data: DatosFiscalesData) => {
    setSaving(true);
    setError(null);
    try {
      await api.post('/onboarding/datos-fiscales', data);
      setCurrentStep(3);
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const onSubmitBusiness = async (data: ConfigurarNegocioData) => {
    setSaving(true);
    setError(null);
    try {
      await api.post('/onboarding/configurar-negocio', {
        tipo_negocio: data.tipo_negocio,
        nombre_almacen: data.nombre_almacen || undefined,
        nombre_caja: data.nombre_caja || undefined,
        tipo_impresora: data.tipo_impresora || undefined,
      });
      setCurrentStep(4);
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const onSubmitProduct = async (data: PrimerProductoData) => {
    setSaving(true);
    setError(null);
    try {
      await api.post('/onboarding/primer-producto', {
        nombre: data.nombre,
        sku: data.sku || undefined,
        codigo_barra: data.codigo_barra || undefined,
        costo: data.costo ? Number(data.costo) : undefined,
        aplica_iva: data.aplica_iva ?? true,
        stock_inicial: data.stock_inicial ? Number(data.stock_inicial) : undefined,
      });
      setCompleted(true);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const skipProduct = async () => {
    setSaving(true);
    try {
      await api.post('/onboarding/saltar-primer-producto');
      setCompleted(true);
      router.push('/dashboard');
    } catch {
      setError('Error al saltar este paso');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-zinc-400">
          <div className="w-5 h-5 border-2 border-amber/30 border-t-amber rounded-full animate-spin" />
          <span>Cargando configuración...</span>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-zinc-400">Redirigiendo al panel...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="lg:hidden mb-6">
        <h2 className="font-display text-xl font-bold text-zinc-100 mb-1">
          Configura tu negocio
        </h2>
        <p className="text-zinc-400 text-sm">
          Completa los siguientes pasos para empezar a usar TiendaPOS
        </p>
      </div>

      <div className="flex items-center gap-3 mb-8">
        {steps.map((step, idx) => {
          const StepIcon = step.icon;
          const isActive = currentStep === step.number;
          const isPast = currentStep !== null && currentStep > step.number;
          return (
            <div key={step.number} className="flex items-center gap-2 flex-1 min-w-0">
              <div
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all w-full ${
                  isActive
                    ? 'text-amber ring-1 ring-amber/25'
                    : isPast
                    ? 'text-amber/60 ring-1 ring-amber/10'
                    : 'text-zinc-500'
                }`}
              >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-all shrink-0 ${
                  isActive ? 'bg-amber text-dark-primary' :
                  isPast ? 'bg-amber/20 text-amber' : 'bg-zinc-800 text-zinc-500'
                }`}>
                  {isPast ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <StepIcon className="h-3.5 w-3.5" />
                  )}
                </div>
                <div className="hidden sm:block min-w-0 flex-1">
                  <p className={`text-xs font-semibold truncate ${isActive ? 'text-amber' : isPast ? 'text-amber/70' : 'text-zinc-400'}`}>
                    {step.label}
                  </p>
                  <p className="text-[11px] opacity-60 truncate">{step.desc}</p>
                </div>
              </div>
              {idx < steps.length - 1 && (
                <ChevronRight className="h-4 w-4 text-zinc-600 shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {currentStep === 2 && (
        <form onSubmit={fiscalForm.handleSubmit(onSubmitFiscal)} className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-white/20">
            <div className="w-9 h-9 rounded-lg bg-amber/15 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-amber" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-zinc-100">Datos Fiscales</h3>
              <p className="text-zinc-400 text-xs">Registra la información fiscal de tu negocio</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="identificacion_fiscal">Identificación Fiscal (RIF/NIT/RFC)</Label>
              <Input
                id="identificacion_fiscal"
                placeholder="J-12345678-9"
                icon={<FileText className="h-4 w-4" />}
                {...fiscalForm.register('identificacion_fiscal')}
              />
              {fiscalForm.formState.errors.identificacion_fiscal && (
                <p className="text-red-400 text-xs">{fiscalForm.formState.errors.identificacion_fiscal.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="razon_social">Razón Social</Label>
              <Input
                id="razon_social"
                placeholder="Mi Tienda C.A."
                icon={<Building2 className="h-4 w-4" />}
                {...fiscalForm.register('razon_social')}
              />
              {fiscalForm.formState.errors.razon_social && (
                <p className="text-red-400 text-xs">{fiscalForm.formState.errors.razon_social.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombre_comercial">Nombre Comercial <span className="text-zinc-500">(opcional)</span></Label>
              <Input
                id="nombre_comercial"
                placeholder="Mi Tienda"
                icon={<Tag className="h-4 w-4" />}
                {...fiscalForm.register('nombre_comercial')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono <span className="text-zinc-500">(opcional)</span></Label>
              <Input
                id="telefono"
                placeholder="+58-000-0000000"
                icon={<Phone className="h-4 w-4" />}
                {...fiscalForm.register('telefono')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo <span className="text-zinc-500">(opcional)</span></Label>
              <Input
                id="email"
                type="email"
                placeholder="tienda@email.com"
                icon={<Mail className="h-4 w-4" />}
                {...fiscalForm.register('email')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="direccion">Dirección</Label>
            <textarea
              id="direccion"
              className="w-full px-3 py-2 bg-dark-tertiary/50 border border-white/20 rounded-lg text-zinc-100 placeholder:text-zinc-500 hover:border-white/35 focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 text-sm min-h-[80px] resize-none transition-all duration-300 ease-out caret-amber font-body"
              placeholder="Av. Principal, Edif. 123"
              {...fiscalForm.register('direccion')}
            />
            {fiscalForm.formState.errors.direccion && (
              <p className="text-red-400 text-xs">{fiscalForm.formState.errors.direccion.message}</p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-5 bg-amber text-dark-primary font-semibold rounded-lg hover:bg-amber-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Guardando...' : 'Guardar y Continuar'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      )}

      {currentStep === 3 && (
        <form onSubmit={businessForm.handleSubmit(onSubmitBusiness)} className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-white/20">
            <div className="w-9 h-9 rounded-lg bg-amber/15 flex items-center justify-center">
              <Store className="h-4 w-4 text-amber" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-zinc-100">Configurar Negocio</h3>
              <p className="text-zinc-400 text-xs">Personaliza tu tienda según tu tipo de negocio</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo_negocio">Tipo de Negocio</Label>
              <Select
                onValueChange={(value) => businessForm.setValue('tipo_negocio', value)}
              >
                <SelectTrigger id="tipo_negocio">
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposNegocio.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {businessForm.formState.errors.tipo_negocio && (
                <p className="text-red-400 text-xs">{businessForm.formState.errors.tipo_negocio.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombre_almacen">Nombre del Almacén <span className="text-zinc-500">(opcional)</span></Label>
              <Input
                id="nombre_almacen"
                placeholder="Depósito Principal"
                icon={<Store className="h-4 w-4" />}
                {...businessForm.register('nombre_almacen')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombre_caja">Nombre de la Caja <span className="text-zinc-500">(opcional)</span></Label>
              <Input
                id="nombre_caja"
                placeholder="Caja 1"
                icon={<CreditCard className="h-4 w-4" />}
                {...businessForm.register('nombre_caja')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo_impresora">Tipo de Impresora <span className="text-zinc-500">(opcional)</span></Label>
              <Select
                onValueChange={(value) => businessForm.setValue('tipo_impresora', value)}
              >
                <SelectTrigger id="tipo_impresora">
                  <SelectValue placeholder="Selecciona una impresora" />
                </SelectTrigger>
                <SelectContent>
                  {tiposImpresora.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-100 transition-colors shrink-0"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Atrás
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-5 bg-amber text-dark-primary font-semibold rounded-lg hover:bg-amber-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Guardando...' : 'Guardar y Continuar'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      )}

      {currentStep === 4 && (
        <form onSubmit={productForm.handleSubmit(onSubmitProduct)} className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-white/20">
            <div className="w-9 h-9 rounded-lg bg-amber/15 flex items-center justify-center">
              <Package className="h-4 w-4 text-amber" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-zinc-100">Primer Producto</h3>
              <p className="text-zinc-400 text-xs">Crea tu primer producto o salta este paso y hazlo después</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del Producto</Label>
              <Input
                id="nombre"
                placeholder="Producto de prueba"
                icon={<Package className="h-4 w-4" />}
                {...productForm.register('nombre')}
              />
              {productForm.formState.errors.nombre && (
                <p className="text-red-400 text-xs">{productForm.formState.errors.nombre.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU <span className="text-zinc-500">(opcional)</span></Label>
              <Input
                id="sku"
                placeholder="SKU-001"
                icon={<Hash className="h-4 w-4" />}
                {...productForm.register('sku')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="codigo_barra">Código de Barra <span className="text-zinc-500">(opcional)</span></Label>
              <Input
                id="codigo_barra"
                placeholder="1234567890123"
                icon={<Barcode className="h-4 w-4" />}
                {...productForm.register('codigo_barra')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="costo">Costo <span className="text-zinc-500">(opcional)</span></Label>
              <Input
                id="costo"
                type="number"
                step="0.01"
                placeholder="10.50"
                icon={<DollarSign className="h-4 w-4" />}
                {...productForm.register('costo')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock_inicial">Stock Inicial <span className="text-zinc-500">(opcional)</span></Label>
              <Input
                id="stock_inicial"
                type="number"
                placeholder="100"
                icon={<Package className="h-4 w-4" />}
                {...productForm.register('stock_inicial')}
              />
            </div>

            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                    {...productForm.register('aplica_iva')}
                  />
                  <div className="w-9 h-5 rounded-full bg-dark-border peer-checked:bg-amber transition-colors" />
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-zinc-400 peer-checked:bg-dark-primary peer-checked:translate-x-4 transition-all" />
                </div>
                <span className="text-sm text-zinc-300 group-hover:text-zinc-100 transition-colors">Aplica IVA</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="flex items-center justify-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-100 transition-colors shrink-0 py-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Atrás
            </button>
            <button
              type="button"
              onClick={skipProduct}
              disabled={saving}
              className="flex items-center justify-center gap-2 py-2.5 px-5 text-zinc-400 hover:text-zinc-100 border border-white/20 rounded-lg hover:border-white/35 transition-all duration-300 ease-out disabled:opacity-50 text-sm"
            >
              <SkipForward className="h-4 w-4" />
              Saltar paso
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-5 bg-amber text-dark-primary font-semibold rounded-lg hover:bg-amber-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Guardando...' : 'Crear Producto'}
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
