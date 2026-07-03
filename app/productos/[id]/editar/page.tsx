'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import api from '@/lib/axios';
import { showToast } from '@/lib/toast';
import { useAuthStore } from '@/stores/auth-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { CategorySelector, type DefinicionAtributo } from '@/components/producto/CategorySelector';
import { DynamicAttributes } from '@/components/producto/DynamicAttributes';

interface ProductoData {
  id: number;
  nombre: string;
  codigo_sku: string;
  descripcion: string | null;
  moneda_precio: string;
  costo_promedio: number;
  margen_pct: number;
  atributos: Record<string, string | boolean>;
  categoria_id: number | null;
  unidad_id: number | null;
  impuesto_id: number | null;
  activo: boolean;
  categoria: { id: number; nombre: string } | null;
  variantes: Array<{ id: number; codigo_barra: string | null; descripcion: string }>;
}

export default function EditarProductoPage() {
  const router = useRouter();
  const params = useParams();
  const { token } = useAuthStore();
  const productoId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [nombre, setNombre] = useState('');
  const [codigoSku, setCodigoSku] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [costoPromedio, setCostoPromedio] = useState('');
  const [margenPct, setMargenPct] = useState('');
  const [monedaPrecio, setMonedaPrecio] = useState('');
  const [unidadId, setUnidadId] = useState('');
  const [impuestoId, setImpuestoId] = useState('');
  const [selectedCategoriaId, setSelectedCategoriaId] = useState('');
  const [atributosDef, setAtributosDef] = useState<DefinicionAtributo[]>([]);
  const [atributosValores, setAtributosValores] = useState<Record<string, string | boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    if (!productoId) return;
    loadProducto();
  }, [token, productoId]);

  const loadProducto = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/productos/${productoId}`);
      const p: ProductoData = res.data.data;

      setNombre(p.nombre);
      setCodigoSku(p.codigo_sku);
      setDescripcion(p.descripcion || '');
      setCostoPromedio(String(p.costo_promedio));
      setMargenPct(String(p.margen_pct));
      setMonedaPrecio(p.moneda_precio);
      setUnidadId(p.unidad_id ? String(p.unidad_id) : '');
      setImpuestoId(p.impuesto_id ? String(p.impuesto_id) : '');
      setSelectedCategoriaId(p.categoria_id ? String(p.categoria_id) : '');
      setAtributosValores(p.atributos || {});
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 404) {
        setNotFound(true);
      } else {
        showToast.error({ message: 'Error al cargar producto' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (catId: string, attrs: DefinicionAtributo[]) => {
    setSelectedCategoriaId(catId);
    setAtributosDef(attrs);
  };

  const handleSubmit = async () => {
    setErrors({});
    const errs: Record<string, string> = {};
    if (!nombre.trim()) errs.nombre = 'Requerido';
    if (!codigoSku.trim()) errs.codigo_sku = 'Requerido';
    if (!costoPromedio) errs.costo_promedio = 'Requerido';
    if (!margenPct) errs.margen_pct = 'Requerido';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        nombre: nombre.trim(),
        codigo_sku: codigoSku.trim(),
        descripcion: descripcion.trim() || null,
        costo_promedio: Number(costoPromedio),
        margen_pct: Number(margenPct),
        moneda_precio: monedaPrecio,
        atributos: atributosValores,
      };

      if (selectedCategoriaId) payload.categoria_id = Number(selectedCategoriaId);
      if (unidadId) payload.unidad_id = Number(unidadId);
      if (impuestoId) payload.impuesto_id = Number(impuestoId);

      await api.put(`/productos/${productoId}`, payload);
      showToast.success({ message: 'Producto actualizado' });
      router.push('/productos');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      if (e?.response?.data?.errors) {
        const fieldErrors = Object.entries(e.response.data.errors)[0];
        if (fieldErrors) showToast.error({ message: fieldErrors[1][0] });
      } else {
        showToast.error({ message: e?.response?.data?.message || 'Error al actualizar' });
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-primary flex items-center justify-center">
        <div className="flex items-center gap-3 text-zinc-400">
          <Loader2 className="h-5 w-5 animate-spin text-amber" />
          <span>Cargando producto...</span>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-dark-primary flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">Producto no encontrado</p>
          <Button onClick={() => router.push('/productos')} variant="outline" className="border-white/20 text-zinc-300">
            Volver a productos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-primary">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={() => router.push('/productos')}
          className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Volver a productos</span>
        </button>

        <h1 className="text-2xl font-bold text-zinc-100 mb-8">Editar Producto</h1>

        <div className="space-y-6">
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
                <Label htmlFor="descripcion">Descripción</Label>
                <Input id="descripcion" value={descripcion} onChange={e => setDescripcion(e.target.value)} className="bg-dark-primary border-white/20 focus:border-amber" />
              </div>
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Moneda</Label>
                <Select value={monedaPrecio} onValueChange={setMonedaPrecio}>
                  <SelectTrigger className="bg-dark-primary border-white/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['USD', 'VES', 'COP', 'MXN', 'ARS', 'PEN', 'CLP', 'BOB', 'UYU'].map(m => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Unidad</Label>
                <Select value={unidadId} onValueChange={setUnidadId}>
                  <SelectTrigger className="bg-dark-primary border-white/20">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Unidad (Und)</SelectItem>
                    <SelectItem value="2">Kilogramo (Kg)</SelectItem>
                    <SelectItem value="3">Litro (Lt)</SelectItem>
                    <SelectItem value="4">Metro (m)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Impuesto</Label>
                <Select value={impuestoId} onValueChange={setImpuestoId}>
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
              onClick={handleSubmit}
              disabled={saving}
              className="bg-amber hover:bg-amber-dark text-dark-primary font-semibold"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
