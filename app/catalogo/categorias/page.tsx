'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus, FolderTree, Search, Loader2,
} from 'lucide-react';
import api from '@/lib/axios';
import { showToast } from '@/lib/toast';
import { useAuthStore } from '@/stores/auth-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CategoryTreeItem, type Categoria } from '@/components/catalogo/CategoryTreeItem';
import { AttributesPanel } from '@/components/catalogo/AttributesPanel';

export default function CategoriasPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [showNewCat, setShowNewCat] = useState(false);
  const [newCatNombre, setNewCatNombre] = useState('');
  const [newCatPadreId, setNewCatPadreId] = useState<number | null>(null);
  const [newCatPadreNombre, setNewCatPadreNombre] = useState('');
  const [saving, setSaving] = useState(false);

  const [attrCategoria, setAttrCategoria] = useState<Categoria | null>(null);
  const [attrPanelOpen, setAttrPanelOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Categoria | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    loadCategorias();
  }, [token]);

  const loadCategorias = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categorias');
      setCategorias(res.data.data || []);
    } catch {
      showToast.error({ message: 'Error al cargar categorías' });
    } finally {
      setLoading(false);
    }
  };

  const openNewCategoria = (padre?: Categoria) => {
    setNewCatNombre('');
    if (padre) {
      setNewCatPadreId(padre.id);
      setNewCatPadreNombre(padre.nombre);
    } else {
      setNewCatPadreId(null);
      setNewCatPadreNombre('');
    }
    setShowNewCat(true);
  };

  const handleCreateCategoria = async () => {
    if (!newCatNombre.trim()) return;
    setSaving(true);
    try {
      const payload: Record<string, unknown> = { nombre: newCatNombre.trim() };
      if (newCatPadreId) payload.padre_id = newCatPadreId;

      await api.post('/categorias', payload);
      showToast.success({ message: newCatPadreId ? 'Subcategoría creada' : 'Categoría creada' });
      setShowNewCat(false);
      loadCategorias();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      showToast.error({ message: e?.response?.data?.message || 'Error al crear categoría' });
    } finally {
      setSaving(false);
    }
  };

  const handleOpenAttributes = (cat: Categoria) => {
    setAttrCategoria(cat);
    setAttrPanelOpen(true);
  };

  const handleDeleteCategoria = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/categorias/${deleteTarget.id}`);
      showToast.success({ message: 'Categoría desactivada' });
      setDeleteTarget(null);
      loadCategorias();
    } catch {
      showToast.error({ message: 'Error al desactivar categoría' });
    } finally {
      setDeleting(false);
    }
  };

  const filterCategorias = (cats: Categoria[], term: string): Categoria[] => {
    if (!term) return cats;
    return cats
      .map(cat => {
        const matchNombre = cat.nombre.toLowerCase().includes(term);
        const hijosFiltrados = cat.hijos ? filterCategorias(cat.hijos, term) : [];
        if (matchNombre || hijosFiltrados.length > 0) {
          return { ...cat, hijos: hijosFiltrados.length > 0 ? hijosFiltrados : cat.hijos };
        }
        return null;
      })
      .filter(Boolean) as Categoria[];
  };

  const filtered = filterCategorias(categorias, search.toLowerCase());
  const totalCategorias = categorias.reduce((acc, c) => acc + 1 + (c.hijos?.length || 0), 0);

  return (
    <DashboardLayout pageTitle="Categorías" pageSubtitle="Catálogo e inventario">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-sm text-muted-foreground">{totalCategorias} categorías en total</p>
          </div>
          <Button
            onClick={() => openNewCategoria()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shrink-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Categoría
          </Button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar categoría..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 bg-card border-border focus:border-ring"
          />
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span>Cargando categorías...</span>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FolderTree className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm">
                {search ? 'Sin resultados para tu búsqueda' : 'No hay categorías creadas'}
              </p>
              {!search && (
                <Button
                  onClick={() => openNewCategoria()}
                  variant="outline"
                  className="mt-4 border-primary/30 text-primary hover:bg-primary/10"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear la primera
                </Button>
              )}
            </div>
          ) : (
            <div className="p-3 space-y-0.5">
              {filtered.map(cat => (
                <CategoryTreeItem
                  key={cat.id}
                  categoria={cat}
                  onAddSubcategoria={openNewCategoria}
                  onOpenAttributes={handleOpenAttributes}
                  onDelete={setDeleteTarget}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={showNewCat} onOpenChange={setShowNewCat}>
        <DialogContent className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle>{newCatPadreId ? 'Nueva Subcategoría' : 'Nueva Categoría'}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {newCatPadreId ? `Se creará dentro de "${newCatPadreNombre}"` : 'Se creará como categoría principal'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="cat-nombre">Nombre</Label>
              <Input
                id="cat-nombre"
                placeholder={newCatPadreId ? 'Ej: Antibióticos' : 'Ej: Farmacia'}
                value={newCatNombre}
                onChange={e => setNewCatNombre(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleCreateCategoria(); }}
                autoFocus
                className="bg-background border-input focus:border-ring"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowNewCat(false)} className="border-input text-foreground hover:bg-accent">Cancelar</Button>
            <Button onClick={handleCreateCategoria} disabled={saving || !newCatNombre.trim()} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
              {saving ? 'Creando...' : 'Crear'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle>Desactivar categoría</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              ¿Estás seguro de desactivar &quot;{deleteTarget?.nombre}&quot;? Los productos asociados no se eliminarán.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)} className="border-input text-foreground hover:bg-accent">Cancelar</Button>
            <Button onClick={handleDeleteCategoria} disabled={deleting} className="bg-destructive hover:bg-destructive/90 text-white font-semibold">
              {deleting ? 'Eliminando...' : 'Desactivar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AttributesPanel
        categoria={attrCategoria}
        open={attrPanelOpen}
        onClose={() => { setAttrPanelOpen(false); setAttrCategoria(null); }}
        onAttributeChange={loadCategorias}
      />
    </DashboardLayout>
  );
}
