'use client';

import { Search, Plus, LayoutGrid, List, FolderTree, CircleDot } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Categoria } from '@/types/producto';

type ViewMode = 'list' | 'grid';

interface ProductToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  categoriaId: string;
  onCategoriaChange: (value: string) => void;
  categorias: Categoria[];
  estado: string;
  onEstadoChange: (value: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onNewProduct: () => void;
}

export function ProductToolbar({
  search,
  onSearchChange,
  categoriaId,
  onCategoriaChange,
  categorias,
  estado,
  onEstadoChange,
  viewMode,
  onViewModeChange,
  onNewProduct,
}: ProductToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <div className="w-full sm:w-64 lg:w-80">
        <Input
          icon={<Search className="h-4 w-4" />}
          placeholder="Buscar por nombre o SKU..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="w-full sm:w-56">
        <Select value={categoriaId} onValueChange={onCategoriaChange}>
          <SelectTrigger>
            <FolderTree className="h-4 w-4 text-muted-foreground shrink-0" />
            <SelectValue placeholder="Todas las categorías" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas las categorías</SelectItem>
            {categorias.map((cat) => (
              <SelectItem key={cat.id} value={String(cat.id)}>
                {cat.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-40">
        <Select value={estado} onValueChange={onEstadoChange}>
          <SelectTrigger>
            <CircleDot className="h-4 w-4 text-muted-foreground shrink-0" />
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="activos">Activos</SelectItem>
            <SelectItem value="inactivos">Inactivos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-1">
        <button
          onClick={() => onViewModeChange('list')}
          className={`p-1.5 rounded-md transition-all ${
            viewMode === 'list'
              ? 'bg-secondary text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          title="Vista tabla"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          onClick={() => onViewModeChange('grid')}
          className={`p-1.5 rounded-md transition-all ${
            viewMode === 'grid'
              ? 'bg-secondary text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          title="Vista tarjetas"
        >
          <LayoutGrid className="h-4 w-4" />
        </button>
      </div>

      <Button onClick={onNewProduct} className="shrink-0 ml-auto">
        <Plus className="h-4 w-4 mr-2" />
        Nuevo Producto
      </Button>
    </div>
  );
}
