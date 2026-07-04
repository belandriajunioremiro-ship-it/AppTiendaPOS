'use client';

import { TrendingUp, Pencil, Trash2 } from 'lucide-react';
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
          <div key={p.id} className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 z-10">
              <div className={`relative ${p.activo ? 'bg-emerald-500' : 'bg-muted-foreground/30'} text-[9px] font-bold uppercase tracking-[0.15em] py-1 pl-8 pr-3 -mr-2 -mt-2 rotate-45 shadow-sm`}>
                <span className={p.activo ? 'text-white' : 'text-muted-foreground'}>{p.activo ? 'Activo' : 'Inactivo'}</span>
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <p className="font-display font-bold text-base text-foreground leading-tight">{p.nombre}</p>
              <p className="font-mono text-[11px] text-muted-foreground">{p.codigo_sku}</p>
            </div>

            {p.categoria && (
              <div className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-primary/60" />
                <span className="font-body text-xs text-muted-foreground/70">{p.categoria.nombre}</span>
              </div>
            )}

            <div className="bg-background/60 rounded-xl p-3.5 space-y-2.5 mt-1">
              <div className="flex items-center justify-between font-body text-xs">
                <span className="text-muted-foreground/70">Costo</span>
                <span className="text-foreground font-semibold">{formatMoney(p.costo_promedio, p.moneda_precio)}</span>
              </div>
              <div className="flex items-center justify-between font-body text-xs">
                <span className="text-muted-foreground/70">Margen</span>
                <span className="text-foreground font-semibold">{margenDisplay}%</span>
              </div>
              <div className="h-px bg-border/40" />
              <div className="flex items-center justify-between">
                <span className="font-body text-[11px] text-muted-foreground/70 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-amber" />
                  Precio venta
                </span>
                <span className="font-display text-sm font-bold text-amber drop-shadow-sm">{formatMoney(p.precio_base, p.moneda_precio)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-auto">
              <span className={`font-body text-xs font-medium ${stockOk ? 'text-emerald-500' : 'text-destructive'}`}>
                {stock === 0 ? 'Sin stock' : `${stock} en stock`}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(p.id)}
                  className="w-8 h-8 rounded-full bg-amber flex items-center justify-center hover:bg-amber/90 transition-colors shadow-sm"
                  title="Editar"
                >
                  <Pencil className="h-3.5 w-3.5 text-black" />
                </button>
                <button
                  onClick={() => onDelete(p.id)}
                  className="w-8 h-8 rounded-full bg-amber flex items-center justify-center hover:bg-amber/90 transition-colors shadow-sm"
                  title="Desactivar"
                >
                  <Trash2 className="h-3.5 w-3.5 text-black" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
