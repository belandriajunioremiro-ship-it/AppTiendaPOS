export interface Categoria {
  id: number;
  nombre: string;
  slug?: string;
  nivel?: number;
  padre_id?: number | null;
  icono?: string | null;
  activo?: boolean;
}

export interface UnidadInfo {
  id: number;
  nombre: string;
  abreviatura: string;
  tipo?: string;
  factor_conversion?: number;
  unidad_base_id?: number | null;
}

export interface ImpuestoInfo {
  id: number;
  nombre: string;
  porcentaje: number;
  tipo?: string;
  is_defecto?: boolean;
  activo?: boolean;
}

export interface InventarioItem {
  id: number;
  variante_id: number;
  almacen_id: number;
  cantidad_disponible: number;
  cantidad_reservada: number;
  costo_promedio: number;
}

export interface Variant {
  id: number;
  producto_id: number;
  codigo_barra: string | null;
  descripcion: string;
  atributos: Record<string, unknown>;
  activo: boolean;
  inventarios: InventarioItem[];
}

export interface Producto {
  id: number;
  nombre: string;
  codigo_sku: string;
  descripcion: string | null;
  moneda_precio: string;
  costo_promedio: number;
  margen_pct: number;
  precio_base: number;
  foto_url: string | null;
  atributos: Record<string, unknown>;
  activo: boolean;
  categoria: Categoria | null;
  unidad: UnidadInfo | null;
  variantes: Variant[];
  impuesto: ImpuestoInfo | null;
  creado_en?: string;
}

export interface ProductoMeta {
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
  from?: number;
  to?: number;
}

export interface ProductoResponse {
  data: Producto[];
  meta: ProductoMeta;
}

export function calcularStockTotal(producto: Producto): number {
  return producto.variantes?.reduce((acc, v) => {
    const disponible = v.inventarios?.[0]?.cantidad_disponible ?? 0;
    return acc + disponible;
  }, 0) ?? 0;
}
