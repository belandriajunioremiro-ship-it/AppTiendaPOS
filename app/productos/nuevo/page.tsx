'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Package, Loader2 } from 'lucide-react';
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

interface Unidad {
  id: number;
  nombre: string;
  abreviatura: string;
}

export default function NuevoProductoPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [selectedCategoriaId, setSelectedCategoriaId] = useState('');
  const [atributosDef, setAtributosDef] = useState<DefinicionAtributo[]>([]);
  const [atributosValores, setAtributosValores] = useState<Record<string, string | boolean>>({});
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [impuestos, setImpuestos] = useState<{ id: number; nombre: string; porcentaje: number }[]>([]);

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
  const [apiErrors, setApiErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    api.get('/unidades').then(r => setUnidades(r.data?.data || [])).catch(() => {});
    api.get('/impuestos').then(r => setImpuestos(r.data?.data || [])).catch(() => {});
  }, []);

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

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!nombre.trim()) errs.nombre = 'El nombre es obligatorio';
    if (!codigoSku.trim()) errs.codigo_sku = 'El SKU es obligatorio';
    if (!costoPromedio || parseFloat(costoPromedio) <= 0) errs.costo_promedio = 'Debe ser mayor a 0';
    if (!margenPct) errs.margen_pct = 'El margen es obligatorio';
    if (!monedaPrecio) errs.moneda_precio = 'Selecciona una moneda';
    if (!unidadId) errs.unidad_id = 'Selecciona una unidad';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiErrors({});
    if (!validate()) return;

    setSaving(true);
    try {
      const costo = parseFloat(costoPromedio);
      const margen = parseFloat(margenPct);
      const payload: Record<string, unknown> = {
        nombre: nombre.trim(),
        codigo_sku: codigoSku.trim(),
        unidad_id: Number(unidadId),
        moneda_precio: monedaPrecio,
        costo_promedio: costo,
        margen_pct: margen,
        precio_base: costo * (1 + margen / 100),
        activo: true,
      };
      if (descripcion.trim()) payload.descripcion = descripcion.trim();
      if (codigoBarra.trim()) payload.codigo_barra = codigoBarra.trim();
      if (selectedCategoriaId) payload.categoria_id = Number(selectedCategoriaId);
      if (impuestoId) payload.impuesto_id = Number(impuestoId);
      if (Object.keys(atributosValores).length > 0) payload.atributos = atributosValores;

      await api.post('/productos', payload);
      showToast.success({ message: 'Producto creado correctamente' });
      router.push('/productos');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      if (e?.response?.data?.errors) {
        setApiErrors(e.response.data.errors);
        const first = Object.values(e.response.data.errors)[0]?.[0];
        if (first) showToast.error({ message: first });
      } else {
        showToast.error({ message: e?.response?.data?.message || 'Error al crear producto' });
      }
    } finally {
      setSaving(false);
    }
  };

  const fieldError = (field: string) => {
    const apiErr = apiErrors[field]?.[0];
    const localErr = errors[field];
    return apiErr || localErr;
  };

  return (
    <DashboardLayout pageTitle="Nuevo Producto" pageSubtitle="Agregar producto al inventario">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.push('/productos')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-sm">Volver a productos</span>
        </button>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">Información general</h2>
                <p className="text-xs text-muted-foreground">Datos básicos del producto</p>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="nombre">
                  Nombre del producto <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="nombre"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  error={fieldError('nombre')}
                />
                {fieldError('nombre') && (
                  <p className="text-xs text-destructive-foreground">{fieldError('nombre')}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="codigo_sku">
                    SKU <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="codigo_sku"
                    value={codigoSku}
                    onChange={e => setCodigoSku(e.target.value)}
                    error={fieldError('codigo_sku')}
                  />
                  {fieldError('codigo_sku') && (
                    <p className="text-xs text-destructive-foreground">{fieldError('codigo_sku')}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="codigo_barra">Código de barra</Label>
                  <Input
                    id="codigo_barra"
                    value={codigoBarra}
                    onChange={e => setCodigoBarra(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <textarea
                  id="descripcion"
                  value={descripcion}
                  onChange={e => setDescripcion(e.target.value)}
                  rows={3}
                  className="flex w-full rounded-lg border border-input bg-card/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground hover:border-ring/50 focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-300 ease-out resize-none font-body"
                  placeholder="Breve descripción del producto..."
                />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">Categoría y atributos</h2>
            </div>
            <div className="p-6 space-y-5">
              <CategorySelector value={selectedCategoriaId} onChange={handleCategoryChange} />
              {apiErrors.categoria_id && (
                <p className="text-xs text-destructive-foreground">{apiErrors.categoria_id[0]}</p>
              )}
            </div>
          </div>

          {atributosDef.length > 0 && (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="text-sm font-semibold text-foreground">Atributos dinámicos</h2>
              </div>
              <div className="p-6">
                <DynamicAttributes atributos={atributosDef} value={atributosValores} onChange={setAtributosValores} />
              </div>
            </div>
          )}

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber/10 flex items-center justify-center">
                <span className="text-sm font-bold text-amber">$</span>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">Precio y costo</h2>
                <p className="text-xs text-muted-foreground">Configuración financiera del producto</p>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="costo_promedio">
                    Costo promedio <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="costo_promedio"
                    type="number"
                    step="0.01"
                    min="0"
                    value={costoPromedio}
                    onChange={e => setCostoPromedio(e.target.value)}
                    placeholder="0.00"
                    error={fieldError('costo_promedio')}
                  />
                  {fieldError('costo_promedio') && (
                    <p className="text-xs text-destructive-foreground">{fieldError('costo_promedio')}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="margen_pct">
                    Margen (%) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="margen_pct"
                    type="number"
                    min="0"
                    value={margenPct}
                    onChange={e => setMargenPct(e.target.value)}
                    placeholder="20"
                    error={fieldError('margen_pct')}
                  />
                  {fieldError('margen_pct') && (
                    <p className="text-xs text-destructive-foreground">{fieldError('margen_pct')}</p>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber/5 to-transparent border border-amber/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-muted-foreground">Precio de venta</span>
                    <p className="text-[11px] text-muted-foreground/60">Costo × (1 + Margen / 100)</p>
                  </div>
                  <span className="text-2xl font-bold text-primary">{formatMoney(precioCalculado)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>
                    Moneda <span className="text-destructive">*</span>
                  </Label>
                  <Select value={monedaPrecio || undefined} onValueChange={setMonedaPrecio}>
                    <SelectTrigger className={fieldError('moneda_precio') ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Seleccionar moneda" />
                    </SelectTrigger>
                    <SelectContent>
                      {['USD', 'VES', 'COP', 'MXN', 'ARS', 'PEN', 'CLP', 'BOB', 'UYU'].map(m => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldError('moneda_precio') && (
                    <p className="text-xs text-destructive-foreground">{fieldError('moneda_precio')}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>
                    Unidad <span className="text-destructive">*</span>
                  </Label>
                  <Select value={unidadId || undefined} onValueChange={setUnidadId}>
                    <SelectTrigger className={fieldError('unidad_id') ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Seleccionar unidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {unidades.map(u => (
                        <SelectItem key={u.id} value={String(u.id)}>{u.nombre} ({u.abreviatura})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldError('unidad_id') && (
                    <p className="text-xs text-destructive-foreground">{fieldError('unidad_id')}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Impuesto</Label>
                  <Select value={impuestoId || undefined} onValueChange={setImpuestoId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sin impuesto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Sin impuesto</SelectItem>
                      {impuestos.map(i => (
                        <SelectItem key={i.id} value={String(i.id)}>{i.nombre} ({i.porcentaje}%)</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push('/productos')}
              className="text-muted-foreground hover:text-foreground"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={saving}
              size="lg"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar producto
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
