'use client';

import { useState } from 'react';
import { Settings, Plus, Trash2, X, Type, Hash, List, ToggleLeft, Palette, Calendar } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import api from '@/lib/axios';
import { showToast } from '@/lib/toast';
import type { Categoria, DefinicionAtributo } from './CategoryTreeItem';

const tipoIconos: Record<string, React.ReactNode> = {
  text: <Type className="h-3 w-3" />,
  number: <Hash className="h-3 w-3" />,
  select: <List className="h-3 w-3" />,
  boolean: <ToggleLeft className="h-3 w-3" />,
  color: <Palette className="h-3 w-3" />,
  date: <Calendar className="h-3 w-3" />,
};

const tipoLabels: Record<string, string> = {
  text: 'Texto',
  number: 'Número',
  select: 'Selección',
  boolean: 'Sí/No',
  color: 'Color',
  date: 'Fecha',
};

interface AttributesPanelProps {
  categoria: Categoria | null;
  open: boolean;
  onClose: () => void;
  onAttributeChange: () => void;
}

export function AttributesPanel({
  categoria,
  open,
  onClose,
  onAttributeChange,
}: AttributesPanelProps) {
  const [atributos, setAtributos] = useState<DefinicionAtributo[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [formEtiqueta, setFormEtiqueta] = useState('');
  const [formClave, setFormClave] = useState('');
  const [formTipoDato, setFormTipoDato] = useState('text');
  const [formOpciones, setFormOpciones] = useState('');
  const [formObligatorio, setFormObligatorio] = useState(false);

  const loadAtributos = async () => {
    if (!categoria) return;
    setLoading(true);
    try {
      const res = await api.get(`/categorias/${categoria.id}/atributos`);
      setAtributos(res.data.data || []);
    } catch {
      showToast.error({ message: 'Error al cargar atributos' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      loadAtributos();
      resetForm();
    } else {
      onClose();
    }
  };

  const resetForm = () => {
    setFormEtiqueta('');
    setFormClave('');
    setFormTipoDato('text');
    setFormOpciones('');
    setFormObligatorio(false);
  };

  const handleEtiquetaChange = (value: string) => {
    setFormEtiqueta(value);
    if (!formClave || formClave === formEtiqueta.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')) {
      setFormClave(value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''));
    }
  };

  const handleAddAtributo = async () => {
    if (!categoria || !formEtiqueta.trim() || !formClave.trim()) return;
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        etiqueta: formEtiqueta.trim(),
        clave: formClave.trim(),
        tipo_dato: formTipoDato,
        obligatorio: formObligatorio,
      };

      if (formTipoDato === 'select' && formOpciones.trim()) {
        payload.opciones = formOpciones.split(',').map(o => o.trim()).filter(Boolean);
      }

      await api.post(`/categorias/${categoria.id}/atributos`, payload);
      showToast.success({ message: 'Atributo creado' });
      resetForm();
      loadAtributos();
      onAttributeChange();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      showToast.error({ message: e?.response?.data?.message || 'Error al crear atributo' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAtributo = async (id: number) => {
    setDeletingId(id);
    try {
      await api.delete(`/atributos/${id}`);
      showToast.success({ message: 'Atributo eliminado' });
      loadAtributos();
      onAttributeChange();
    } catch {
      showToast.error({ message: 'Error al eliminar atributo' });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="bg-dark-tertiary border-white/[0.06] text-zinc-100 sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2 text-zinc-100">
            <Settings className="h-4 w-4 text-amber" />
            Atributos para &quot;{categoria?.nombre}&quot;
          </SheetTitle>
          <SheetDescription className="text-zinc-400 text-xs">
            Define los atributos dinámicos que tendrán los productos de esta categoría.
          </SheetDescription>
        </SheetHeader>

        {loading ? (
          <div className="flex items-center gap-2 text-zinc-400 py-8">
            <div className="w-4 h-4 border-2 border-amber/30 border-t-amber rounded-full animate-spin" />
            <span className="text-sm">Cargando atributos...</span>
          </div>
        ) : atributos.length === 0 ? (
          <div className="text-center py-8">
            <Settings className="h-8 w-8 text-zinc-600 mx-auto mb-2" />
            <p className="text-sm text-zinc-400">Sin atributos definidos</p>
            <p className="text-xs text-zinc-500 mt-1">Agrega el primero usando el formulario de abajo</p>
          </div>
        ) : (
          <div className="space-y-2 mb-8">
            {atributos.map(attr => (
              <div
                key={attr.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-dark-primary border border-white/[0.06] group"
              >
                <div className="shrink-0 text-zinc-400">
                  {tipoIconos[attr.tipo_dato] || <Type className="h-3 w-3" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-200 font-medium truncate">{attr.etiqueta}</p>
                  <p className="text-[11px] text-zinc-500">
                    {attr.clave} · {tipoLabels[attr.tipo_dato] || attr.tipo_dato}
                    {attr.opciones && attr.opciones.length > 0 && ` · ${attr.opciones.length} opciones`}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {attr.obligatorio && (
                    <Badge className="bg-amber/15 text-amber text-[10px] px-1.5 py-0 hover:bg-amber/20">
                      Req.
                    </Badge>
                  )}
                  <button
                    onClick={() => handleDeleteAtributo(attr.id)}
                    disabled={deletingId === attr.id}
                    className="p-1 rounded hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                  >
                    {deletingId === attr.id ? (
                      <div className="w-3.5 h-3.5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-white/[0.06] pt-6">
          <h3 className="text-sm font-semibold text-zinc-200 mb-4 flex items-center gap-2">
            <Plus className="h-4 w-4 text-amber" />
            Nuevo atributo
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-300">Etiqueta</Label>
                <Input
                  placeholder="Ej: Talla"
                  value={formEtiqueta}
                  onChange={e => handleEtiquetaChange(e.target.value)}
                  className="h-9 text-sm bg-dark-primary border-white/20 focus:border-amber"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-300">Clave</Label>
                <Input
                  placeholder="Ej: talla"
                  value={formClave}
                  onChange={e => setFormClave(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  className="h-9 text-sm bg-dark-primary border-white/20 focus:border-amber"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-300">Tipo de dato</Label>
              <Select value={formTipoDato} onValueChange={setFormTipoDato}>
                <SelectTrigger className="h-9 text-sm bg-dark-primary border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(tipoLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formTipoDato === 'select' && (
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-300">Opciones (separadas por coma)</Label>
                <Input
                  placeholder="Ej: S, M, L, XL"
                  value={formOpciones}
                  onChange={e => setFormOpciones(e.target.value)}
                  className="h-9 text-sm bg-dark-primary border-white/20 focus:border-amber"
                />
              </div>
            )}

            <label className="flex items-center gap-2.5 cursor-pointer">
              <Checkbox
                checked={formObligatorio}
                onCheckedChange={c => setFormObligatorio(Boolean(c))}
              />
              <span className="text-sm text-zinc-300">Obligatorio</span>
            </label>

            <Button
              onClick={handleAddAtributo}
              disabled={saving || !formEtiqueta.trim() || !formClave.trim()}
              className="w-full bg-amber hover:bg-amber-dark text-dark-primary font-semibold"
            >
              {saving ? (
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-dark-primary/30 border-t-dark-primary rounded-full animate-spin" />
                  Guardando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Agregar atributo
                </div>
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
