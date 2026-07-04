'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Package, Plus, Search, Pencil, Trash2, Loader2,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import api from '@/lib/axios';
import { showToast } from '@/lib/toast';
import { useAuthStore } from '@/stores/auth-store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

interface Variant {
  id: number;
  codigo_barra: string | null;
  descripcion: string;
  atributos: Record<string, unknown>;
  activo: boolean;
}

interface Categoria {
  id: number;
  nombre: string;
}

interface Producto {
  id: number;
  nombre: string;
  codigo_sku: string;
  descripcion: string | null;
  moneda_precio: string;
  costo_promedio: number;
  margen_pct: number;
  precio_base: number;
  atributos: Record<string, unknown>;
  activo: boolean;
  categoria: Categoria | null;
  variantes: Variant[];
}

export default function ProductosPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const loadProductos = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, per_page: 20 };
      if (debouncedSearch) params.buscar = debouncedSearch;
      const res = await api.get('/productos', { params });
      const raw = res.data;
      setProductos(raw.data || []);
      setTotalPages(raw.meta?.last_page || 1);
      setTotal(raw.meta?.total || 0);
    } catch {
      showToast.error({ message: 'Error al cargar productos' });
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    loadProductos();
  }, [loadProductos]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/productos/${deleteId}`);
      showToast.success({ message: 'Producto desactivado' });
      setDeleteId(null);
      loadProductos();
    } catch {
      showToast.error({ message: 'Error al desactivar' });
    } finally {
      setDeleting(false);
    }
  };

  const formatMoney = (amount: number, currency: string) =>
    new Intl.NumberFormat('es-VE', { style: 'currency', currency, minimumFractionDigits: 2 }).format(amount);

  return (
    <DashboardLayout pageTitle="Productos" pageSubtitle="Gestión de inventario">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-3">
              <Package className="h-6 w-6 text-amber" />
              Productos
            </h1>
            <p className="text-sm text-zinc-400 mt-1">{total} productos registrados</p>
          </div>
          <Button
            onClick={() => router.push('/productos/nuevo')}
            className="bg-amber hover:bg-amber-dark text-dark-primary font-semibold shrink-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Producto
          </Button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Buscar por nombre o SKU..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 bg-dark-tertiary border-white/[0.06] focus:border-amber"
          />
        </div>

        <div className="bg-dark-tertiary border border-white/[0.06] rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex items-center gap-3 text-zinc-400">
                <Loader2 className="h-5 w-5 animate-spin text-amber" />
                <span>Cargando productos...</span>
              </div>
            </div>
          ) : productos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Package className="h-10 w-10 text-zinc-600 mb-3" />
              <p className="text-zinc-400 text-sm">
                {debouncedSearch ? 'Sin resultados para tu búsqueda' : 'No hay productos creados'}
              </p>
              {!debouncedSearch && (
                <Button
                  onClick={() => router.push('/productos/nuevo')}
                  variant="outline"
                  className="mt-4 border-amber/30 text-amber hover:bg-amber/10"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear el primero
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Producto</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">SKU</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Categoría</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Precio</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Costo</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Margen</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map(p => (
                    <tr key={p.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-amber/10 flex items-center justify-center shrink-0">
                            <Package className="h-4 w-4 text-amber" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm text-zinc-200 font-medium truncate max-w-[200px]">{p.nombre}</p>
                            {p.descripcion && (
                              <p className="text-[11px] text-zinc-500 truncate max-w-[200px]">{p.descripcion}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-400 font-mono">{p.codigo_sku}</td>
                      <td className="px-4 py-3 text-sm text-zinc-400">{p.categoria?.nombre || '—'}</td>
                      <td className="px-4 py-3 text-sm text-zinc-100 text-right font-medium">
                        {formatMoney(p.precio_base, p.moneda_precio)}
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-400 text-right">
                        {formatMoney(p.costo_promedio, p.moneda_precio)}
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-400 text-right">{p.margen_pct}%</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => router.push(`/productos/${p.id}/editar`)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-amber hover:bg-amber/10 transition-colors"
                            title="Editar"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteId(p.id)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Desactivar"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.06]">
              <p className="text-xs text-zinc-500">
                Página {page} de {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="border-white/20 text-zinc-300 hover:bg-white/[0.04] h-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="border-white/20 text-zinc-300 hover:bg-white/[0.04] h-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-dark-tertiary border border-white/[0.06] rounded-xl p-6 max-w-sm mx-4 shadow-2xl">
            <h3 className="text-lg font-semibold text-zinc-100 mb-2">Desactivar producto</h3>
            <p className="text-sm text-zinc-400 mb-6">
              ¿Estás seguro? El producto se marcará como inactivo pero no se eliminará.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteId(null)}
                className="border-white/20 text-zinc-300 hover:bg-white/[0.04]"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                {deleting ? 'Eliminando...' : 'Desactivar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
