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

export function ProductTable({ productos, onEdit, onDelete, formatMoney }: ProductTableProps) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Producto</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Categoría</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Precio</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Stock</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Estado</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => {
              const stock = p.cantidad_disponible ?? 0;
              const minStock = p.stock_minimo ?? 0;
              const stockOk = stock > minStock;
              return (
                <tr
                  key={p.id}
                  className="border-b border-border/40 hover:bg-accent/50 transition-colors group"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden bg-primary/10 flex items-center justify-center">
                        {p.foto_url ? (
                          <img
                            src={p.foto_url}
                            alt={p.nombre}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-foreground font-medium truncate max-w-[200px]">{p.nombre}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">{p.codigo_sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted-foreground">{p.categoria?.nombre || '—'}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground text-right font-medium">
                    {formatMoney(p.precio_base, p.moneda_precio)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-sm font-medium ${stockOk ? 'text-emerald-500' : 'text-destructive'}`}>
                      {stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge
                      variant={p.activo ? 'default' : 'secondary'}
                      className={p.activo ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : ''}
                    >
                      {p.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(p.id)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        title="Editar"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(p.id)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive-foreground hover:bg-destructive/10 transition-colors"
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
