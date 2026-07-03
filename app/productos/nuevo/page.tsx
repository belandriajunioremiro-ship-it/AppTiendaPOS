'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save } from 'lucide-react';
import api from '@/lib/axios';
import { showToast } from '@/lib/toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CategorySelector, type DefinicionAtributo } from '@/components/producto/CategorySelector';
import { DynamicAttributes } from '@/components/producto/DynamicAttributes';

const productoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  codigo_sku: z.string().min(1, 'El SKU es obligatorio'),
  unidad_id: z.string().min(1, 'Selecciona una unidad'),
  impuesto_id: z.string().optional(),
  moneda_precio: z.string().min(1, 'Selecciona una moneda'),
  costo_promedio: z.string().min(1, 'Ingresa el costo'),
  margen_pct: z.string().min(1, 'Ingresa el margen'),
  descripcion: z.string().optional(),
  codigo_barra: z.string().optional(),
  categoria_id: z.string().optional(),
});

type ProductoFormData = z.infer<typeof productoSchema>;

export default function NuevoProductoPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [selectedCategoriaId, setSelectedCategoriaId] = useState('');
  const [atributosDef, setAtributosDef] = useState<DefinicionAtributo[]>([]);
  const [atributosValores, setAtributosValores] = useState<Record<string, string | boolean>>({});

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductoFormData>({
    resolver: zodResolver(productoSchema),
  });

  const handleCategoryChange = (catId: string, attrs: DefinicionAtributo[]) => {
    setSelectedCategoriaId(catId);
    setAtributosDef(attrs);
    setAtributosValores({});
    setValue('categoria_id', catId || '');
  };

  const onSubmit = async (data: ProductoFormData) => {
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        nombre: data.nombre,
        codigo_sku: data.codigo_sku,
        unidad_id: data.unidad_id ? Number(data.unidad_id) : undefined,
        impuesto_id: data.impuesto_id ? Number(data.impuesto_id) : undefined,
        moneda_precio: data.moneda_precio,
        costo_promedio: data.costo_promedio ? Number(data.costo_promedio) : undefined,
        margen_pct: data.margen_pct ? Number(data.margen_pct) : undefined,
        descripcion: data.descripcion || undefined,
        variante_codigo_barra: data.codigo_barra || undefined,
        categoria_id: selectedCategoriaId ? Number(selectedCategoriaId) : undefined,
        atributos: atributosValores,
      };

      Object.keys(payload).forEach(k => { if (payload[k] === undefined) delete payload[k]; });

      await api.post('/productos', payload);
      showToast.success({ message: 'Producto creado correctamente' });
      router.push('/productos');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al crear producto';
      showToast.error({ message: msg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090909]">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Volver</span>
        </button>

        <h1 className="text-2xl font-bold text-zinc-100 mb-8">Nuevo Producto</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-dark-tertiary border border-white/[0.06] rounded-xl p-6 space-y-5">
            <h2 className="text-sm font-semibold text-zinc-100">Información general</h2>

            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del producto *</Label>
              <Input id="nombre" {...register('nombre')} className="border-white/20 hover:border-white/35 focus:border-amber transition-all duration-300 ease-out caret-amber" />
              {errors.nombre && <p className="text-xs text-red-400">{errors.nombre.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigo_sku">SKU *</Label>
                <Input id="codigo_sku" {...register('codigo_sku')} className="border-white/20 hover:border-white/35 focus:border-amber transition-all duration-300 ease-out caret-amber" />
                {errors.codigo_sku && <p className="text-xs text-red-400">{errors.codigo_sku.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="codigo_barra">Código de barra</Label>
                <Input id="codigo_barra" {...register('codigo_barra')} className="border-white/20 hover:border-white/35 focus:border-amber transition-all duration-300 ease-out caret-amber" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Input id="descripcion" {...register('descripcion')} className="border-white/20 hover:border-white/35 focus:border-amber transition-all duration-300 ease-out caret-amber" />
            </div>
          </div>

          <div className="bg-dark-tertiary border border-white/[0.06] rounded-xl p-6 space-y-5">
            <h2 className="text-sm font-semibold text-zinc-100">Categoría</h2>
            <CategorySelector
              value={selectedCategoriaId}
              onChange={handleCategoryChange}
            />
          </div>

          {atributosDef.length > 0 && (
            <div className="bg-dark-tertiary border border-white/[0.06] rounded-xl p-6 space-y-5">
              <DynamicAttributes
                atributos={atributosDef}
                value={atributosValores}
                onChange={setAtributosValores}
              />
            </div>
          )}

          <div className="bg-dark-tertiary border border-white/[0.06] rounded-xl p-6 space-y-5">
            <h2 className="text-sm font-semibold text-zinc-100">Precio y costo</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="costo_promedio">Costo promedio *</Label>
                <Input id="costo_promedio" type="number" step="0.01" {...register('costo_promedio')} className="border-white/20 hover:border-white/35 focus:border-amber transition-all duration-300 ease-out caret-amber" />
                {errors.costo_promedio && <p className="text-xs text-red-400">{errors.costo_promedio.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="margen_pct">Margen (%) *</Label>
                <Input id="margen_pct" type="number" {...register('margen_pct')} className="border-white/20 hover:border-white/35 focus:border-amber transition-all duration-300 ease-out caret-amber" />
                {errors.margen_pct && <p className="text-xs text-red-400">{errors.margen_pct.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="moneda_precio">Moneda *</Label>
                <Select onValueChange={v => setValue('moneda_precio', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Moneda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="COP">COP</SelectItem>
                    <SelectItem value="MXN">MXN</SelectItem>
                    <SelectItem value="ARS">ARS</SelectItem>
                    <SelectItem value="PEN">PEN</SelectItem>
                    <SelectItem value="CLP">CLP</SelectItem>
                    <SelectItem value="BOB">BOB</SelectItem>
                    <SelectItem value="UYU">UYU</SelectItem>
                  </SelectContent>
                </Select>
                {errors.moneda_precio && <p className="text-xs text-red-400">{errors.moneda_precio.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="unidad_id">Unidad *</Label>
                <Select onValueChange={v => setValue('unidad_id', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Unidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Unidad (Und)</SelectItem>
                    <SelectItem value="2">Kilogramo (Kg)</SelectItem>
                    <SelectItem value="3">Litro (Lt)</SelectItem>
                    <SelectItem value="4">Metro (m)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.unidad_id && <p className="text-xs text-red-400">{errors.unidad_id.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="impuesto_id">Impuesto</Label>
                <Select onValueChange={v => setValue('impuesto_id', v)}>
                  <SelectTrigger>
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
              onClick={() => router.back()}
              className="border-white/20 text-zinc-300 hover:bg-white/[0.04]"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-amber hover:bg-amber/90 text-black font-semibold"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Guardando...' : 'Guardar producto'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
