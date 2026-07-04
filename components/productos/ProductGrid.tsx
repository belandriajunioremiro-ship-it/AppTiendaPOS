'use client';

import { Package, Pencil, Trash2, TrendingUp } from 'lucide-react';
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
        const margenDisplay = Number.isInteger(p.margen_pct) ? p.margen_pct : Math.round(p.margen_pct);
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
                {p.categoria && (
                  <span className="text-[10px] text-muted-foreground/60">{p.categoria.nombre}</span>
                )}
              </div>
            </div>

            <div className="bg-background rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Costo</span>
                <span className="text-foreground font-medium">{formatMoney(p.costo_promedio, p.moneda_precio)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Margen</span>
                <span className="text-foreground font-medium">{margenDisplay}%</span>
              </div>
              <div className="h-px bg-border/60" />
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-primary" />
                  Precio venta
                </span>
                <span className="text-sm font-bold text-primary">{formatMoney(p.precio_base, p.moneda_precio)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium ${stockOk ? 'text-emerald-500' : 'text-destructive'}`}>
                {stock === 0 ? 'Sin stock' : `${stock} en stock`}
              </span>
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
