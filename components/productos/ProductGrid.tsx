'use client';

import { Package, Pencil, Trash2, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Producto } from '@/types/producto';

interface ProductGridProps {
  productos: Producto[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  formatMoney: (amount: number, currency: string) => string;
}

export function ProductGrid({ productos, onEdit, onDelete, formatMoney }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {productos.map((p) => {
        const stock = p.cantidad_disponible ?? 0;
        const minStock = p.stock_minimo ?? 0;
        const stockOk = stock > minStock;
        return (
          <div
            key={p.id}
            className="group bg-card border border-border rounded-lg overflow-hidden hover:border-ring/30 transition-all"
          >
            <div className="relative">
              {p.foto_url ? (
                <div className="w-full h-[120px] overflow-hidden">
                  <img
                    src={p.foto_url}
                    alt={p.nombre}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-[120px] bg-muted flex items-center justify-center">
                  <Package className="h-10 w-10 text-muted-foreground/50" />
                </div>
              )}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <button
                  onClick={() => onEdit(p.id)}
                  className="p-1.5 rounded-lg bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-primary hover:bg-background transition-colors"
                  title="Editar"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => onDelete(p.id)}
                  className="p-1.5 rounded-lg bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-destructive-foreground hover:bg-background transition-colors"
                  title="Desactivar"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <p className="text-sm font-bold text-foreground truncate">{p.nombre}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-muted-foreground font-mono">{p.codigo_sku}</span>
                  {p.categoria && (
                    <>
                      <span className="text-muted-foreground/40">·</span>
                      <span className="text-[11px] text-muted-foreground">{p.categoria.nombre}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-primary">{formatMoney(p.precio_base, p.moneda_precio)}</span>
                <Badge
                  variant={stockOk ? 'default' : 'destructive'}
                  className={stockOk ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : ''}
                >
                  {stock} en stock
                </Badge>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
