'use client';

import { Button } from '@/components/ui/button';

interface ProductDeleteDialogProps {
  open: boolean;
  deleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ProductDeleteDialog({
  open,
  deleting,
  onConfirm,
  onCancel,
}: ProductDeleteDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-card border border-border rounded-xl p-6 max-w-sm mx-4 shadow-2xl animate-fade-in">
        <h3 className="text-lg font-semibold text-foreground mb-2">Desactivar producto</h3>
        <p className="text-sm text-muted-foreground mb-6">
          ¿Estás seguro? El producto se marcará como inactivo pero no se eliminará.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={deleting}
            variant="destructive"
          >
            {deleting ? 'Eliminando...' : 'Desactivar'}
          </Button>
        </div>
      </div>
    </div>
  );
}
