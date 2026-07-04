export interface Categoria {
  id: number;
  nombre: string;
  slug?: string;
}

export interface UnidadInfo {
  id: number;
  nombre: string;
  abreviatura: string;
}

export interface Variant {
  id: number;
  codigo_barra: string | null;
  descripcion: string;
  atributos: Record<string, unknown>;
  activo: boolean;
}

export interface Producto {
  id: number;
  nombre: string;
  codigo_sku: string;
  descripcion: string | null;
  foto_url: string | null;
  moneda_precio: string;
  costo_promedio: number;
  margen_pct: number;
  precio_base: number;
  atributos: Record<string, unknown>;
  activo: boolean;
  categoria: Categoria | null;
  variantes: Variant[];
  cantidad_disponible?: number;
  stock_minimo?: number;
  unidad?: UnidadInfo | null;
  unidad_id?: number | null;
}

export interface ProductoMeta {
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
}

export interface ProductoResponse {
  data: Producto[];
  meta: ProductoMeta;
}
