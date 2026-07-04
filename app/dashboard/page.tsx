'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import api from '@/lib/axios';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  Bell, TrendingUp, AlertTriangle,
  CreditCard, ArrowUpRight,
  AlertCircle, CheckCircle2, Store,
  Package, DollarSign
} from 'lucide-react';

interface DashboardData {
  total_productos: number;
  ventas_hoy: Array<{ total_transacciones: number; monto_total: number; total_iva: number; total_igtf: number; moneda_factura: string }>;
  sesiones_abiertas: Array<{ id: number; caja: { nombre: string }; apertura_en: string; total_ventas_base: number }>;
  stock_bajo: Array<{ variante: { producto: { nombre: string; codigo_sku: string } }; almacen: { nombre: string }; cantidad_disponible: number; stock_minimo: number }>;
  sin_stock: Array<{ variante: { producto: { nombre: string; codigo_sku: string } }; almacen: { nombre: string } }>;
  top_productos: Array<{ id: number; nombre: string; codigo_sku: string; total_vendido: number; total_facturado: number }>;
  ultimos_productos: Array<{ id: number; nombre: string; codigo_sku: string; categoria: { id: number; nombre: string } | null; descripcion: string | null }>;
}

interface SubscriptionInfo {
  plan: { nombre: string; limite_productos?: number; limite_cajas?: number };
  estado: string;
  dias_restantes?: number;
}

interface UserProfile {
  id: number;
  name: string;
  email: string;
  activo: boolean;
  roles: string[];
  tienda_id: number;
  tienda: {
    nombre_comercial: string;
    moneda_base: string;
    regimen_fiscal: string;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const { user: authUser, token, logout } = useAuthStore();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [storeName, setStoreName] = useState('');
  const [storeCurrency, setStoreCurrency] = useState('USD');
  const [storeFiscalRegime, setStoreFiscalRegime] = useState('General');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState('cajero');

  useEffect(() => {
    const effectiveToken = token || localStorage.getItem('tiendapos_token');
    if (!effectiveToken) {
      router.push('/login');
      return;
    }
    loadData();
  }, [token, router]);

  const loadData = async () => {
    try {
      const [meRes, dashRes, subRes, tiendaRes] = await Promise.all([
        api.get('/auth/me'),
        api.get('/dashboard'),
        api.get('/suscripcion/estado').catch(() => null),
        api.get('/tienda').catch(() => null),
      ]);

      const profileData = meRes.data.data;
      setProfile(profileData);
      setUserRole(profileData.roles?.[0] || 'cajero');
      setDashboard(dashRes.data.data || dashRes.data);
      setSubscription(subRes?.data?.data || null);
      if (tiendaRes?.data?.data) {
        const t = tiendaRes.data.data;
        setStoreName(t.nombre_comercial || t.razon_social || '');
        setStoreCurrency(t.moneda_base || 'USD');
        setStoreFiscalRegime(t.regimen_fiscal || 'General');
      }
    } catch (err) {
      setError('Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (amount: number, currency = 'USD') =>
    new Intl.NumberFormat('es-VE', { style: 'currency', currency, minimumFractionDigits: 2 }).format(amount);

  const salesToday = dashboard?.ventas_hoy?.[0];
  const openSessions = dashboard?.sesiones_abiertas || [];
  const lowStock = dashboard?.stock_bajo || [];
  const outOfStock = dashboard?.sin_stock || [];
  const topProducts = dashboard?.top_productos || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-primary flex items-center justify-center">
        <div className="flex items-center gap-3 text-zinc-400">
          <div className="w-5 h-5 border-2 border-amber/30 border-t-amber rounded-full animate-spin" />
          <span>Cargando panel...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-primary flex items-center justify-center">
        <div className="text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-6 max-w-md text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-3" />
          <p>{error}</p>
          <button onClick={loadData} className="mt-4 text-sm text-amber hover:underline">Reintentar</button>
        </div>
      </div>
    );
  }

  if (!token && !localStorage.getItem('tiendapos_token')) return null;

  return (
    <DashboardLayout pageTitle="Dashboard" pageSubtitle={new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-dark-tertiary border border-white/[0.06] rounded-xl p-5 hover:border-white/10 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                </div>
                <span className="text-xs text-zinc-500 flex items-center gap-1">
                  Hoy <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
              <p className="text-2xl font-bold text-zinc-100 mb-0.5 font-display">
                {salesToday ? formatMoney(salesToday.monto_total, salesToday.moneda_factura) : '$0.00'}
              </p>
              <p className="text-xs text-zinc-500">
                {salesToday?.total_transacciones || 0} transacciones
              </p>
            </div>

            <div className="bg-dark-tertiary border border-white/[0.06] rounded-xl p-5 hover:border-white/10 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Package className="h-5 w-5 text-blue-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-zinc-100 mb-0.5 font-display">
                {dashboard?.total_productos ?? 0}
              </p>
              <p className="text-xs text-zinc-500">Productos registrados</p>
            </div>

            <div className="bg-dark-tertiary border border-white/[0.06] rounded-xl p-5 hover:border-white/10 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-amber/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-amber" />
                </div>
              </div>
              <p className="text-2xl font-bold text-zinc-100 mb-0.5 font-display">
                {openSessions.length}
              </p>
              <p className="text-xs text-zinc-500">Cajas abiertas</p>
            </div>

            <div className="bg-dark-tertiary border border-white/[0.06] rounded-xl p-5 hover:border-white/10 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-purple-400" />
                </div>
              </div>
              <p className="text-lg font-bold text-zinc-100 mb-0.5 font-display truncate">
                {subscription?.plan?.nombre || 'Gratuito'}
              </p>
              <p className="text-xs text-zinc-500">
                {subscription?.dias_restantes ? `${Math.round(subscription.dias_restantes)} días restantes` : 'Plan activo'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-1">
              <div className="bg-dark-tertiary border border-white/[0.06] rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Bell className="h-4 w-4 text-amber" />
                  <h2 className="text-sm font-semibold text-zinc-100">Alertas de Inventario</h2>
                </div>

                {lowStock.length === 0 && outOfStock.length === 0 ? (
                  <div className="flex flex-col items-center py-8 text-center">
                    <CheckCircle2 className="h-8 w-8 text-emerald-400 mb-2" />
                    <p className="text-sm text-zinc-400">Inventario al día</p>
                    <p className="text-xs text-zinc-500 mt-0.5">No hay productos con stock bajo</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {outOfStock.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <AlertCircle className="h-3.5 w-3.5 text-red-400" />
                          <span className="text-xs font-medium text-red-400">Sin Stock</span>
                        </div>
                        <div className="space-y-1.5">
                          {outOfStock.slice(0, 5).map((item, i) => (
                            <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-red-500/5 border border-red-500/10">
                              <div className="min-w-0 flex-1">
                                <p className="text-xs text-zinc-300 truncate">{item.variante.producto.nombre}</p>
                                <p className="text-[10px] text-zinc-500">{item.variante.producto.codigo_sku} · {item.almacen.nombre}</p>
                              </div>
                              <span className="text-xs font-medium text-red-400 shrink-0 ml-2">0</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {lowStock.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber" />
                          <span className="text-xs font-medium text-amber">Stock Bajo</span>
                        </div>
                        <div className="space-y-1.5">
                          {lowStock.slice(0, 6).map((item, i) => (
                            <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-amber/5 border border-amber/10">
                              <div className="min-w-0 flex-1">
                                <p className="text-xs text-zinc-300 truncate">{item.variante.producto.nombre}</p>
                                <p className="text-[10px] text-zinc-500">{item.variante.producto.codigo_sku} · {item.almacen.nombre}</p>
                              </div>
                              <span className="text-xs font-medium text-amber shrink-0 ml-2">{item.cantidad_disponible}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-dark-tertiary border border-white/[0.06] rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                    <h2 className="text-sm font-semibold text-zinc-100">Productos Más Vendidos Hoy</h2>
                  </div>
                  {topProducts.length > 0 && (
                    <span className="text-[11px] text-zinc-500">{topProducts.length} productos</span>
                  )}
                </div>

                {topProducts.length === 0 ? (
                  <div className="flex flex-col items-center py-8 text-center">
                    <Package className="h-8 w-8 text-zinc-600 mb-2" />
                    <p className="text-sm text-zinc-400">Sin ventas hoy</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Los productos más vendidos aparecerán aquí</p>
                  </div>
                ) : (
                  <div className="overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="text-[11px] text-zinc-500 uppercase tracking-wider border-b border-white/[0.06]">
                          <th className="text-left py-2.5 pr-4 font-medium">Producto</th>
                          <th className="text-right py-2.5 px-4 font-medium">SKU</th>
                          <th className="text-right py-2.5 px-4 font-medium">Vendidos</th>
                          <th className="text-right py-2.5 pl-4 font-medium">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topProducts.map((product, i) => (
                          <tr key={product.id} className="border-b border-white/[0.04] last:border-0">
                            <td className="py-3 pr-4">
                              <div className="flex items-center gap-3">
                                <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                                  i === 0 ? 'bg-amber/15 text-amber' :
                                  i === 1 ? 'bg-zinc-600/30 text-zinc-300' :
                                  i === 2 ? 'bg-amber/5 text-amber/60' :
                                  'bg-zinc-800 text-zinc-500'
                                }`}>
                                  {i + 1}
                                </span>
                                <span className="text-sm text-zinc-200 truncate max-w-[200px]">{product.nombre}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right text-xs text-zinc-500">{product.codigo_sku}</td>
                            <td className="py-3 px-4 text-right text-sm text-zinc-100">{product.total_vendido}</td>
                            <td className="py-3 pl-4 text-right text-sm text-zinc-100 font-medium">
                              {formatMoney(product.total_facturado)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-dark-tertiary border border-white/[0.06] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Sesiones Activas</p>
                  <p className="text-lg font-semibold text-zinc-100 font-display">{openSessions.length}</p>
                </div>
              </div>
              {openSessions.length > 0 && (
                <div className="space-y-2">
                  {openSessions.slice(0, 3).map((sesion) => (
                    <div key={sesion.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                      <div>
                        <p className="text-xs text-zinc-300">{sesion.caja.nombre}</p>
                        <p className="text-[10px] text-zinc-500">
                          Desde {new Date(sesion.apertura_en).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <span className="text-xs font-medium text-emerald-400">
                        {formatMoney(sesion.total_ventas_base)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-dark-tertiary border border-white/[0.06] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-amber/10 flex items-center justify-center">
                  <Store className="h-3.5 w-3.5 text-amber" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Mi Tienda</p>
                  <p className="text-lg font-semibold text-zinc-100 font-display truncate">
                    {storeName || 'Tienda'}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Moneda base</span>
                  <span className="text-zinc-300">{storeCurrency}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Régimen fiscal</span>
                  <span className="text-zinc-300">{storeFiscalRegime}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Plan</span>
                  <span className="text-zinc-300 capitalize">{subscription?.estado || 'trial'}</span>
                </div>
              </div>
            </div>

            <div className="bg-dark-tertiary border border-white/[0.06] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Package className="h-3.5 w-3.5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Últimos Productos</p>
                  <p className="text-lg font-semibold text-zinc-100 font-display">
                    {dashboard?.ultimos_productos?.length || 0} ingresados
                  </p>
                </div>
              </div>
              {dashboard?.ultimos_productos && dashboard.ultimos_productos.length > 0 ? (
                <div className="space-y-1.5">
                  {dashboard.ultimos_productos.map((prod) => (
                    <div key={prod.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-blue-500/5 border border-blue-500/10">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-zinc-300 truncate">{prod.nombre}</p>
                        <p className="text-[10px] text-zinc-500">
                          {prod.codigo_sku}
                          {prod.categoria && <span> · {prod.categoria.nombre}</span>}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-500 text-center py-4">Sin productos registrados</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
