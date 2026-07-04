'use client';

import { Package, Pencil, Trash2, TrendingUp } from 'lucide-react';
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
          <div key={p.id} className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-20 h-20 ${p.activo ? 'bg-emerald-500/10' : 'bg-muted'} -translate-y-1/2 translate-x-1/2 rotate-45`} />
            <div className={`absolute top-2.5 right-3 z-10 text-[10px] font-semibold tracking-wide uppercase ${p.activo ? 'text-emerald-400' : 'text-muted-foreground'}`}>
              {p.activo ? 'Activo' : 'Inactivo'}
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl shrink-0 overflow-hidden bg-gradient-to-br from-amber/20 to-amber/5 flex items-center justify-center ring-1 ring-amber/10">
                {p.foto_url ? (
                  <img src={p.foto_url} alt={p.nombre} className="w-full h-full object-cover" />
                ) : (
                  <Package className="h-5 w-5 text-amber" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-foreground truncate leading-tight">{p.nombre}</p>
                <p className="text-[11px] text-muted-foreground font-mono truncate mt-0.5">{p.codigo_sku}</p>
              </div>
            </div>

            {p.categoria && (
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-primary/50" />
                <span className="text-[11px] text-muted-foreground/70">{p.categoria.nombre}</span>
              </div>
            )}

            <div className="bg-background/60 rounded-xl p-3.5 space-y-2.5 mt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground/70">Costo</span>
                <span className="text-foreground font-semibold">{formatMoney(p.costo_promedio, p.moneda_precio)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground/70">Margen</span>
                <span className="text-foreground font-semibold">{margenDisplay}%</span>
              </div>
              <div className="h-px bg-border/40" />
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground/70 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-amber" />
                  Precio venta
                </span>
                <span className="text-sm font-bold text-amber drop-shadow-sm">{formatMoney(p.precio_base, p.moneda_precio)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-0.5">
              <span className={`text-[11px] font-medium ${stockOk ? 'text-emerald-500' : 'text-destructive'}`}>
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
