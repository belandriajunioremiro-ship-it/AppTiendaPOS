'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import api from '@/lib/axios';
import { showToast } from '@/lib/toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { CategorySelector, type DefinicionAtributo } from '@/components/producto/CategorySelector';
import { DynamicAttributes } from '@/components/producto/DynamicAttributes';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function NuevoProductoPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [selectedCategoriaId, setSelectedCategoriaId] = useState('');
  const [atributosDef, setAtributosDef] = useState<DefinicionAtributo[]>([]);
  const [atributosValores, setAtributosValores] = useState<Record<string, string | boolean>>({});

  const [nombre, setNombre] = useState('');
  const [codigoSku, setCodigoSku] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [codigoBarra, setCodigoBarra] = useState('');
  const [costoPromedio, setCostoPromedio] = useState('');
  const [margenPct, setMargenPct] = useState('20');
  const [monedaPrecio, setMonedaPrecio] = useState('');
  const [unidadId, setUnidadId] = useState('');
  const [impuestoId, setImpuestoId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const precioCalculado = useMemo(() => {
    const costo = parseFloat(costoPromedio) || 0;
    const margen = parseFloat(margenPct) || 0;
    return costo * (1 + margen / 100);
  }, [costoPromedio, margenPct]);

  const formatMoney = (amount: number) =>
    new Intl.NumberFormat('es-VE', { style: 'currency', currency: monedaPrecio || 'USD', minimumFractionDigits: 2 }).format(amount);

  const handleCategoryChange = (catId: string, attrs: DefinicionAtributo[]) => {
    setSelectedCategoriaId(catId);
    setAtributosDef(attrs);
    setAtributosValores({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const errs: Record<string, string> = {};
    if (!nombre.trim()) errs.nombre = 'Requerido';
    if (!codigoSku.trim()) errs.codigo_sku = 'Requerido';
    if (!costoPromedio) errs.costo_promedio = 'Requerido';
    if (!margenPct) errs.margen_pct = 'Requerido';
    if (!monedaPrecio) errs.moneda_precio = 'Requerido';
    if (!unidadId) errs.unidad_id = 'Requerido';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        nombre: nombre.trim(),
        codigo_sku: codigoSku.trim(),
        unidad_id: Number(unidadId),
        moneda_precio: monedaPrecio,
        costo_promedio: Number(costoPromedio),
        margen_pct: Number(margenPct),
        descripcion: descripcion.trim() || undefined,
        variante_codigo_barra: codigoBarra.trim() || undefined,
        categoria_id: selectedCategoriaId ? Number(selectedCategoriaId) : undefined,
        impuesto_id: impuestoId ? Number(impuestoId) : undefined,
        atributos: Object.keys(atributosValores).length > 0 ? atributosValores : undefined,
      };

      await api.post('/productos', payload);
      showToast.success({ message: 'Producto creado correctamente' });
      router.push('/productos');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      if (e?.response?.data?.errors) {
        const fieldErrors = Object.entries(e.response.data.errors)[0];
        if (fieldErrors) showToast.error({ message: fieldErrors[1][0] });
      } else {
        showToast.error({ message: e?.response?.data?.message || 'Error al crear producto' });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout pageTitle="Nuevo Producto" pageSubtitle="Agregar producto al inventario">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.push('/productos')}
          className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Volver a productos</span>
        </button>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-dark-tertiary border border-white/[0.06] rounded-xl p-6 space-y-5">
            <h2 className="text-sm font-semibold text-zinc-100">Información general</h2>

            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del producto *</Label>
              <Input id="nombre" value={nombre} onChange={e => setNombre(e.target.value)} className="bg-dark-primary border-white/20 focus:border-amber" />
              {errors.nombre && <p className="text-xs text-red-400">{errors.nombre}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigo_sku">SKU *</Label>
                <Input id="codigo_sku" value={codigoSku} onChange={e => setCodigoSku(e.target.value)} className="bg-dark-primary border-white/20 focus:border-amber" />
                {errors.codigo_sku && <p className="text-xs text-red-400">{errors.codigo_sku}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="codigo_barra">Código de barra</Label>
                <Input id="codigo_barra" value={codigoBarra} onChange={e => setCodigoBarra(e.target.value)} className="bg-dark-primary border-white/20 focus:border-amber" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Input id="descripcion" value={descripcion} onChange={e => setDescripcion(e.target.value)} className="bg-dark-primary border-white/20 focus:border-amber" />
            </div>
          </div>

          <div className="bg-dark-tertiary border border-white/[0.06] rounded-xl p-6 space-y-5">
            <h2 className="text-sm font-semibold text-zinc-100">Categoría</h2>
            <CategorySelector value={selectedCategoriaId} onChange={handleCategoryChange} />
          </div>

          {atributosDef.length > 0 && (
            <div className="bg-dark-tertiary border border-white/[0.06] rounded-xl p-6 space-y-5">
              <DynamicAttributes atributos={atributosDef} value={atributosValores} onChange={setAtributosValores} />
            </div>
          )}

          <div className="bg-dark-tertiary border border-white/[0.06] rounded-xl p-6 space-y-5">
            <h2 className="text-sm font-semibold text-zinc-100">Precio y costo</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="costo_promedio">Costo promedio *</Label>
                <Input id="costo_promedio" type="number" step="0.01" value={costoPromedio} onChange={e => setCostoPromedio(e.target.value)} className="bg-dark-primary border-white/20 focus:border-amber" />
                {errors.costo_promedio && <p className="text-xs text-red-400">{errors.costo_promedio}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="margen_pct">Margen (%) *</Label>
                <Input id="margen_pct" type="number" value={margenPct} onChange={e => setMargenPct(e.target.value)} className="bg-dark-primary border-white/20 focus:border-amber" />
                {errors.margen_pct && <p className="text-xs text-red-400">{errors.margen_pct}</p>}
              </div>
            </div>

            <div className="bg-dark-primary border border-amber/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Precio de venta calculado</span>
                <span className="text-lg font-bold text-amber">{formatMoney(precioCalculado)}</span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">Costo × (1 + Margen/100) — se calcula automáticamente</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Moneda *</Label>
                <Select onValueChange={setMonedaPrecio}>
                  <SelectTrigger className="bg-dark-primary border-white/20">
                    <SelectValue placeholder="Moneda" />
                  </SelectTrigger>
                  <SelectContent>
                    {['USD', 'VES', 'COP', 'MXN', 'ARS', 'PEN', 'CLP', 'BOB', 'UYU'].map(m => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.moneda_precio && <p className="text-xs text-red-400">{errors.moneda_precio}</p>}
              </div>

              <div className="space-y-2">
                <Label>Unidad *</Label>
                <Select onValueChange={setUnidadId}>
                  <SelectTrigger className="bg-dark-primary border-white/20">
                    <SelectValue placeholder="Unidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Unidad (Und)</SelectItem>
                    <SelectItem value="2">Kilogramo (Kg)</SelectItem>
                    <SelectItem value="3">Litro (Lt)</SelectItem>
                    <SelectItem value="4">Metro (m)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.unidad_id && <p className="text-xs text-red-400">{errors.unidad_id}</p>}
              </div>

              <div className="space-y-2">
                <Label>Impuesto</Label>
                <Select onValueChange={setImpuestoId}>
                  <SelectTrigger className="bg-dark-primary border-white/20">
                    <SelectValue placeholder="Sin impuesto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Sin impuesto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/productos')}
              className="border-white/20 text-zinc-300 hover:bg-white/[0.04]"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-amber hover:bg-amber-dark text-dark-primary font-semibold"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Guardando...' : 'Guardar producto'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
