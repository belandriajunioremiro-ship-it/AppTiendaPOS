'use client';

import { useState } from 'react';
import {
  Folder, FolderOpen, ChevronRight, ChevronDown,
  Plus, Settings, Trash2,
} from 'lucide-react';

interface DefinicionAtributo {
  id: number;
  clave: string;
  etiqueta: string;
  tipo_dato: string;
  opciones: string[] | null;
  obligatorio: boolean;
  activo: boolean;
}

interface Categoria {
  id: number;
  nombre: string;
  slug: string;
  nivel: number;
  padre_id: number | null;
  icono: string | null;
  activo: boolean;
  hijos?: Categoria[];
  definicion_atributos?: DefinicionAtributo[];
}

interface CategoryTreeItemProps {
  categoria: Categoria;
  onAddSubcategoria: (padre: Categoria) => void;
  onOpenAttributes: (cat: Categoria) => void;
  onDelete: (cat: Categoria) => void;
}

export function CategoryTreeItem({
  categoria,
  onAddSubcategoria,
  onOpenAttributes,
  onDelete,
}: CategoryTreeItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const hasChildren = categoria.hijos && categoria.hijos.length > 0;

  return (
    <div>
      <div
        className="group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/[0.04] transition-colors cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <button
          onClick={() => setExpanded(!expanded)}
          className="shrink-0 w-5 h-5 flex items-center justify-center"
        >
          {hasChildren ? (
            expanded ? (
              <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
            )
          ) : (
            <span className="w-3.5" />
          )}
        </button>

        <div className="shrink-0 text-amber">
          {expanded && hasChildren ? (
            <FolderOpen className="h-4 w-4" />
          ) : (
            <Folder className="h-4 w-4" />
          )}
        </div>

        <span className="text-sm text-zinc-200 font-medium truncate flex-1">
          {categoria.nombre}
        </span>

        {categoria.nivel === 1 && (
          <span className="text-[10px] text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">
            {categoria.hijos?.length || 0}
          </span>
        )}

        <div
          className={`flex items-center gap-0.5 transition-opacity ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {categoria.nivel === 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); onAddSubcategoria(categoria); }}
              className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-amber transition-colors"
              title="Agregar subcategoría"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onOpenAttributes(categoria); }}
            className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-amber transition-colors"
            title="Atributos dinámicos"
          >
            <Settings className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(categoria); }}
            className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-red-400 transition-colors"
            title="Desactivar"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {expanded && hasChildren && (
        <div className="ml-7 border-l border-white/[0.06]">
          {categoria.hijos!.map(hijo => (
            <CategoryTreeItem
              key={hijo.id}
              categoria={hijo}
              onAddSubcategoria={onAddSubcategoria}
              onOpenAttributes={onOpenAttributes}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export type { Categoria, DefinicionAtributo };
