'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Loader2 } from 'lucide-react';
import api from '@/lib/axios';
import { showToast } from '@/lib/toast';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { ProductToolbar } from '@/components/productos/ProductToolbar';
import { ProductTable } from '@/components/productos/ProductTable';
import { ProductGrid } from '@/components/productos/ProductGrid';
import { ProductPagination } from '@/components/productos/ProductPagination';
import { ProductDeleteDialog } from '@/components/productos/ProductDeleteDialog';
import type { Producto, Categoria, ProductoMeta } from '@/types/producto';

type ViewMode = 'list' | 'grid';

const formatMoney = (amount: number, currency: string) =>
  new Intl.NumberFormat('es-VE', { style: 'currency', currency, minimumFractionDigits: 2 }).format(amount);

export default function ProductosPage() {
  const router = useRouter();

  // Data
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [meta, setMeta] = useState<ProductoMeta | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categoriaId, setCategoriaId] = useState('todas');
  const [estado, setEstado] = useState('todos');

  // View
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // Pagination
  const [page, setPage] = useState(1);

  // Delete
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, categoriaId, estado]);

  useEffect(() => {
    api.get('/categorias').then((res) => {
      setCategorias(res.data?.data || []);
    }).catch(() => {});
  }, []);

  const loadProductos = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, per_page: 20 };
      if (debouncedSearch) params.buscar = debouncedSearch;
      if (categoriaId !== 'todas') params.categoria_id = Number(categoriaId);
      if (estado === 'activos') params.activo = true;
      if (estado === 'inactivos') params.activo = false;
      const res = await api.get('/productos', { params });
      const raw = res.data;
      setProductos(raw.data || []);
      setMeta(raw.meta || null);
    } catch {
      showToast.error({ message: 'Error al cargar productos' });
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, categoriaId, estado]);

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

  const total = meta?.total ?? 0;

  return (
    <DashboardLayout pageTitle="Productos" pageSubtitle="Gestión de inventario">
      <div className="max-w-6xl mx-auto">
        <ProductToolbar
          search={search}
          onSearchChange={setSearch}
          categoriaId={categoriaId}
          onCategoriaChange={setCategoriaId}
          categorias={categorias}
          estado={estado}
          onEstadoChange={setEstado}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onNewProduct={() => router.push('/productos/nuevo')}
        />

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span>Cargando productos...</span>
            </div>
          </div>
        ) : productos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-card border border-border rounded-xl">
            <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-sm mb-1">
              {debouncedSearch || categoriaId !== 'todas' || estado !== 'todos'
                ? 'Sin resultados para los filtros seleccionados'
                : 'No hay productos creados'}
            </p>
            <p className="text-xs text-muted-foreground/60 mb-6">
              {debouncedSearch || categoriaId !== 'todas' || estado !== 'todos'
                ? 'Intenta con otros criterios de búsqueda'
                : 'Comienza agregando tu primer producto'}
            </p>
            {!debouncedSearch && categoriaId === 'todas' && estado === 'todos' && (
              <Button onClick={() => router.push('/productos/nuevo')} variant="outline">
                <Package className="h-4 w-4 mr-2" />
                Crear el primero
              </Button>
            )}
          </div>
        ) : (
          <>
            {viewMode === 'list' ? (
              <ProductTable
                productos={productos}
                onEdit={(id) => router.push(`/productos/${id}/editar`)}
                onDelete={setDeleteId}
                formatMoney={formatMoney}
              />
            ) : (
              <ProductGrid
                productos={productos}
                onEdit={(id) => router.push(`/productos/${id}/editar`)}
                onDelete={setDeleteId}
                formatMoney={formatMoney}
              />
            )}
            <ProductPagination
              page={meta?.current_page ?? 1}
              totalPages={meta?.last_page ?? 1}
              total={total}
              perPage={meta?.per_page ?? 20}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      <ProductDeleteDialog
        open={deleteId !== null}
        deleting={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </DashboardLayout>
  );
}
