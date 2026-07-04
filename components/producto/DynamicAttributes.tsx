'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import type { DefinicionAtributo } from './CategorySelector';

interface DynamicAttributesProps {
  atributos: DefinicionAtributo[];
  value: Record<string, string | boolean>;
  onChange: (values: Record<string, string | boolean>) => void;
}

export function DynamicAttributes({ atributos, value, onChange }: DynamicAttributesProps) {
  const [values, setValues] = useState<Record<string, string | boolean>>(value || {});

  useEffect(() => {
    setValues(value || {});
  }, [value]);

  const updateValue = (clave: string, val: string | boolean) => {
    const next = { ...values, [clave]: val };
    setValues(next);
    onChange(next);
  };

  if (!atributos || atributos.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Atributos del producto</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {atributos.map(attr => (
          <div key={attr.id} className="space-y-2">
            <Label>
              {attr.etiqueta}
              {attr.obligatorio && <span className="text-destructive-foreground ml-1">*</span>}
            </Label>

            {attr.tipo_dato === 'select' && attr.opciones && (
              <Select
                value={String(values[attr.clave] || '')}
                onValueChange={v => updateValue(attr.clave, v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Selecciona ${attr.etiqueta.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {attr.opciones.map(op => (
                    <SelectItem key={op} value={op}>{op}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {attr.tipo_dato === 'boolean' && (
              <div className="flex items-center gap-2 pt-1">
                <Checkbox
                  id={`attr-${attr.clave}`}
                  checked={Boolean(values[attr.clave])}
                  onCheckedChange={checked => updateValue(attr.clave, Boolean(checked))}
                />
                <label htmlFor={`attr-${attr.clave}`} className="text-xs text-muted-foreground cursor-pointer">
                  Sí / No
                </label>
              </div>
            )}

            {(attr.tipo_dato === 'text' || attr.tipo_dato === 'number') && (
              <Input
                type={attr.tipo_dato === 'number' ? 'number' : 'text'}
                placeholder={attr.etiqueta}
                value={String(values[attr.clave] || '')}
                onChange={e => updateValue(attr.clave, e.target.value)}
                className="border-input hover:border-ring/50 focus:border-ring transition-all duration-300 ease-out caret-amber"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
