'use client';

import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import api from '@/lib/axios';

interface Categoria {
  id: number;
  nombre: string;
  slug: string;
  nivel: number;
  padre_id: number | null;
  hijos?: Categoria[];
  definicion_atributos?: DefinicionAtributo[];
}

interface DefinicionAtributo {
  id: number;
  categoria_id: number;
  clave: string;
  etiqueta: string;
  tipo_dato: string;
  opciones: string[] | null;
  obligatorio: boolean;
  filtrable: boolean;
  en_listado: boolean;
  orden: number;
  activo: boolean;
}

interface CategorySelectorProps {
  value: string;
  onChange: (value: string, atributos: DefinicionAtributo[]) => void;
  error?: string;
}

export function CategorySelector({ value, onChange, error }: CategorySelectorProps) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [selectedPadre, setSelectedPadre] = useState<string>('');
  const [hijos, setHijos] = useState<Categoria[]>([]);
  const [atributos, setAtributos] = useState<DefinicionAtributo[]>([]);

  useEffect(() => {
    api.get('/categorias').then(res => {
      const data = res.data.data || res.data;
      setCategorias(Array.isArray(data) ? data : []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!value) {
      setSelectedPadre('');
      setHijos([]);
      setAtributos([]);
      return;
    }
    const cat = categorias
      .flatMap(c => [c, ...(c.hijos || [])])
      .find(c => String(c.id) === value);
    if (cat) {
      if (cat.padre_id) {
        setSelectedPadre(String(cat.padre_id));
        const padre = categorias.find(c => c.id === cat.padre_id);
        setHijos(padre?.hijos || []);
        setAtributos(padre?.definicion_atributos || []);
      } else {
        setSelectedPadre(value);
        setHijos(cat.hijos || []);
        setAtributos(cat.definicion_atributos || []);
      }
    }
  }, [value, categorias]);

  const handlePadreChange = (padreId: string) => {
    setSelectedPadre(padreId);
    const padre = categorias.find(c => String(c.id) === padreId);
    const hijos = padre?.hijos || [];
    setHijos(hijos);

    if (hijos.length === 0) {
      const attrs = padre?.definicion_atributos || [];
      setAtributos(attrs);
      onChange(padreId, attrs);
    } else {
      setAtributos([]);
      onChange('', []);
    }
  };

  const handleHijoChange = (hijoId: string) => {
    const padre = categorias.find(c => String(c.id) === selectedPadre);
    const attrs = padre?.definicion_atributos || [];
    setAtributos(attrs);
    onChange(hijoId, attrs);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Categoría principal</Label>
        <Select value={selectedPadre} onValueChange={handlePadreChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent>
            {categorias.map(cat => (
              <SelectItem key={cat.id} value={String(cat.id)}>{cat.nombre}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hijos.length > 0 && (
        <div className="space-y-2">
          <Label>Subcategoría</Label>
          <Select value={value} onValueChange={handleHijoChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una subcategoría" />
            </SelectTrigger>
            <SelectContent>
              {hijos.map(h => (
                <SelectItem key={h.id} value={String(h.id)}>{h.nombre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

export type { Categoria, DefinicionAtributo };
