'use client';

import { Package, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Producto } from '@/types/producto';

interface ProductTableProps {
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

export function ProductTable({ productos, onEdit, onDelete, formatMoney }: ProductTableProps) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-3 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Producto</th>
              <th className="text-left px-3 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Categoría</th>
              <th className="text-left px-3 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Unidad</th>
              <th className="text-right px-3 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Costo</th>
              <th className="text-right px-3 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Margen</th>
              <th className="text-right px-3 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">P. Venta</th>
              <th className="text-right px-3 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Stock</th>
              <th className="text-center px-3 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Estado</th>
              <th className="text-right px-3 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => {
              const stock = calcularStock(p);
              const stockOk = stock > 0;
              return (
                <tr key={p.id} className="border-b border-border/40 hover:bg-accent/50 transition-colors">
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden bg-primary/10 flex items-center justify-center">
                        {p.foto_url ? (
                          <img src={p.foto_url} alt={p.nombre} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-foreground font-medium truncate max-w-[180px]">{p.nombre}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">{p.codigo_sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-sm text-muted-foreground truncate max-w-[140px]">
                    {p.categoria?.nombre || '—'}
                  </td>
                  <td className="px-3 py-2.5 text-sm text-muted-foreground">
                    {p.unidad?.abreviatura || '—'}
                  </td>
                  <td className="px-3 py-2.5 text-sm text-muted-foreground text-right whitespace-nowrap">
                    {formatMoney(p.costo_promedio, p.moneda_precio)}
                  </td>
                  <td className="px-3 py-2.5 text-sm text-muted-foreground text-right">
                    {p.margen_pct}%
                  </td>
                  <td className="px-3 py-2.5 text-sm text-foreground font-semibold text-right whitespace-nowrap">
                    {formatMoney(p.precio_base, p.moneda_precio)}
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <span className={`text-sm font-medium ${stockOk ? 'text-emerald-500' : 'text-destructive'}`}>
                      {stock}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <Badge
                      variant={p.activo ? 'default' : 'secondary'}
                      className={`text-[10px] px-2 py-0 ${p.activo ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : ''}`}
                    >
                      {p.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center justify-end gap-0.5">
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
