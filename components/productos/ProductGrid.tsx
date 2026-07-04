'use client';

import { Package, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Producto } from '@/types/producto';

interface ProductGridProps {
  productos: Producto[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  formatMoney: (amount: number, currency: string) => string;
}

function calcularStock(p: Producto): number {
  return p.variantes?.reduce((acc, v) => {
    const disponible = v.inventarios?.[0]?.cantidad_disponible ?? 0;
    return acc + disponible;
  }, 0) ?? 0;
}

export function ProductGrid({ productos, onEdit, onDelete, formatMoney }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {productos.map((p) => {
        const stock = calcularStock(p);
        const stockOk = stock > 0;
        return (
          <div key={p.id} className="bg-card border border-border rounded-lg p-4 flex flex-col gap-3 relative">
            <div className="absolute top-3 right-3">
              <Badge
                variant={p.activo ? 'default' : 'secondary'}
                className={`text-[10px] px-2 py-0 ${p.activo ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : ''}`}
              >
                {p.activo ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>

            <div className="flex items-start gap-3 pr-20">
              <div className="w-16 h-16 rounded-md shrink-0 overflow-hidden bg-primary/10 flex items-center justify-center">
                {p.foto_url ? (
                  <img src={p.foto_url} alt={p.nombre} className="w-full h-full object-cover" />
                ) : (
                  <Package className="h-6 w-6 text-primary" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-foreground text-sm truncate">{p.nombre}</p>
                <p className="text-xs text-muted-foreground font-mono truncate">{p.codigo_sku}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Costo</span>
                <span className="text-muted-foreground">{formatMoney(p.costo_promedio, p.moneda_precio)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Margen</span>
                <span className="text-muted-foreground">{p.margen_pct}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Categoría</span>
                <span className="text-muted-foreground truncate max-w-[80px]">{p.categoria?.nombre || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stock</span>
                <span className={`font-medium ${stockOk ? 'text-emerald-500' : 'text-destructive'}`}>{stock}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-1 border-t border-border/40">
              <span className="text-xl font-bold text-primary">{formatMoney(p.precio_base, p.moneda_precio)}</span>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => onEdit(p.id)}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  title="Editar"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => onDelete(p.id)}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-destructive-foreground hover:bg-destructive/10 transition-colors"
                  title="Desactivar"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
