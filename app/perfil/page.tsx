'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import api from '@/lib/axios';
import { SidebarContent } from '@/components/sidebar';
import { showToast } from '@/lib/toast';
import {
  Menu, Store,
  User, Mail, Lock, Building2, Globe, CreditCard,
  Shield, Save, Eye, EyeOff, Calendar, MapPin, Phone, FileText, DollarSign, Package, Users
} from 'lucide-react';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  activo: boolean;
  roles: string[];
  tienda_id: number;
  created_at: string;
  ultimo_login: string;
  tienda: {
    id: number;
    rif: string;
    razon_social: string;
    nombre_comercial: string;
    direccion: string;
    telefono: string;
    email: string;
    pais: string;
    moneda_base: string;
    regimen_fiscal: string;
    zona_horaria: string;
    es_agente_igtf: boolean;
    logo_url: string | null;
  };
}

interface SubscriptionInfo {
  plan: { nombre: string; limite_productos?: number; limite_usuarios?: number; limite_cajas?: number };
  estado: string;
  dias_restantes?: number;
  inicio_trial: string;
  fin_trial: string;
}



const countryNames: Record<string, string> = {
  VE: 'Venezuela', CO: 'Colombia', MX: 'México', EC: 'Ecuador',
  AR: 'Argentina', PE: 'Perú', CL: 'Chile', BO: 'Bolivia', UY: 'Uruguay',
};

export default function PerfilPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tienda, setTienda] = useState<UserProfile['tienda'] | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [editMode, setEditMode] = useState<'none' | 'profile' | 'password'>('none');

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const effectiveToken = token || localStorage.getItem('tiendapos_token');
    if (!effectiveToken) { router.push('/login'); return; }
    loadData();
  }, [token, router]);

  const loadData = async () => {
    try {
      const [meRes, subRes, tiendaRes] = await Promise.all([
        api.get('/auth/me'),
        api.get('/suscripcion/estado').catch(() => null),
        api.get('/tienda').catch(() => null),
      ]);
      const userData = meRes.data.data;
      setProfile(userData);
      setFormName(userData.name);
      setFormEmail(userData.email);
      setSubscription(subRes?.data?.data || null);
      if (tiendaRes?.data?.data) setTienda(tiendaRes.data.data);
    } catch {
      showToast.error({ message: 'Error al cargar los datos del perfil' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!formName.trim() || !formEmail.trim()) {
      showToast.error({ message: 'Nombre y email son obligatorios' });
      return;
    }
    setSaving(true);
    try {
      const res = await api.put('/auth/profile', { name: formName, email: formEmail });
      setProfile(res.data.data);
      setEditMode('none');
      showToast.success({ message: 'Perfil actualizado correctamente' });
    } catch {
      showToast.error({ message: 'Error al actualizar el perfil' });
    } finally {
      setSaving(false);
    }
  };

  const handleSavePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast.error({ message: 'Completa todos los campos' });
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast.error({ message: 'Las contraseñas no coinciden' });
      return;
    }
    if (newPassword.length < 8) {
      showToast.error({ message: 'La contraseña debe tener al menos 8 caracteres' });
      return;
    }
    setSavingPassword(true);
    try {
      await api.post('/auth/cambiar-password', {
        password_actual: currentPassword,
        password_nueva: newPassword,
        password_nueva_confirmation: confirmPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setEditMode('none');
      showToast.success({ message: 'Contraseña actualizada correctamente' });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      showToast.error({ message: axiosErr?.response?.data?.message || 'Error al cambiar la contraseña' });
    } finally {
      setSavingPassword(false);
    }
  };

  const getInitials = (name: string) =>
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-primary flex items-center justify-center">
        <div className="flex items-center gap-3 text-zinc-400">
          <div className="w-5 h-5 border-2 border-amber/30 border-t-amber rounded-full animate-spin" />
          <span>Cargando perfil...</span>
        </div>
      </div>
    );
  }

  const sidebarProps = {
    storeName: tienda?.nombre_comercial || undefined,
    userName: profile?.name || 'Usuario',
    userEmail: profile?.email || '',
    userInitials: profile ? getInitials(profile.name) : 'U',
    currentPath: '/perfil',
  };

  return (
    <div className="min-h-screen bg-dark-primary flex">
      <div className="hidden lg:flex lg:w-48 lg:flex-col lg:fixed lg:inset-y-0 bg-[#090909] border-r border-white/[0.06]">
        <SidebarContent {...sidebarProps} />
      </div>

      <div className={`fixed inset-0 z-50 transition-all duration-300 ease-out lg:hidden ${sidebarOpen ? 'visible' : 'invisible'}`}>
        <div className={`fixed inset-0 bg-black/60 transition-opacity duration-300 ease-out ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setSidebarOpen(false)} />
        <div className={`fixed inset-y-0 left-0 w-48 bg-[#090909] border-r border-white/[0.06] transition-transform duration-300 ease-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <SidebarContent {...sidebarProps} />
        </div>
      </div>

      <div className="flex-1 lg:pl-48">
        <header className="sticky top-0 z-30 bg-dark-primary/80 backdrop-blur-md border-b border-white/[0.06]">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04] transition-all">
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-zinc-100">Mi Perfil</h1>
                <p className="text-xs text-zinc-500">Información de tu cuenta y negocio</p>
              </div>
            </div>
          </div>
        </header>
        <main className="px-6 sm:px-8 lg:px-10 py-8">

          {/* Avatar + Nombre */}
          <div className="flex items-center gap-5 mb-8">
              <div className="w-20 h-20 rounded-2xl bg-amber/15 flex items-center justify-center text-amber text-2xl font-bold shrink-0 border-2 border-amber/20">
                {profile ? getInitials(profile.name) : 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-bold text-zinc-100 font-display">{profile?.name}</h2>
                <p className="text-sm text-zinc-400">{profile?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${
                    profile?.roles?.[0] === 'admin' ? 'bg-amber/10 text-amber border-amber/20' :
                    profile?.roles?.[0] === 'supervisor' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    profile?.roles?.[0] === 'cajero' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    'text-zinc-400 border-zinc-700 bg-zinc-800/50'
                  }`}>
                    <Shield className="h-2.5 w-2.5" />
                    {profile?.roles?.[0] || 'usuario'}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${profile?.activo ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    {profile?.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setEditMode(editMode === 'profile' ? 'none' : 'profile')}
                className="px-4 py-2 rounded-lg border border-white/[0.08] text-sm text-zinc-300 hover:bg-white/[0.04] hover:border-white/15 transition-all"
              >
                Editar perfil
              </button>
            </div>

          {/* Editar Perfil */}
          {editMode === 'profile' && (
            <div className="bg-dark-tertiary border border-amber/20 rounded-xl p-6 mb-6">
              <h3 className="text-sm font-semibold text-amber mb-4 flex items-center gap-2">
                <User className="h-4 w-4" />
                Editar Información Personal
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Nombre completo</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0a0b0e] border border-white/20 text-zinc-100 text-sm focus:border-amber focus:outline-none transition-all duration-300 caret-amber hover:border-white/35"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Correo electrónico</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0a0b0e] border border-white/20 text-zinc-100 text-sm focus:border-amber focus:outline-none transition-all duration-300 caret-amber hover:border-white/35"
                  />
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber text-black text-sm font-semibold hover:bg-amber/90 transition-all disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                  <button
                    onClick={() => { setEditMode('none'); setFormName(profile?.name || ''); setFormEmail(profile?.email || ''); }}
                    className="px-4 py-2.5 rounded-lg border border-white/[0.08] text-sm text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04] transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Cambiar Contraseña */}
          {editMode === 'password' && (
            <div className="bg-dark-tertiary border border-amber/20 rounded-xl p-6 mb-6">
              <h3 className="text-sm font-semibold text-amber mb-4 flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Cambiar Contraseña
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Contraseña actual</label>
                  <div className="relative">
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-[#0a0b0e] border border-white/20 text-zinc-100 text-sm focus:border-amber focus:outline-none transition-all duration-300 caret-amber hover:border-white/35 pr-10"
                    />
                    <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
                      {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Nueva contraseña</label>
                  <div className="relative">
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-[#0a0b0e] border border-white/20 text-zinc-100 text-sm focus:border-amber focus:outline-none transition-all duration-300 caret-amber hover:border-white/35 pr-10"
                    />
                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
                      {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Confirmar nueva contraseña</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-[#0a0b0e] border border-white/20 text-zinc-100 text-sm focus:border-amber focus:outline-none transition-all duration-300 caret-amber hover:border-white/35 pr-10"
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleSavePassword}
                    disabled={savingPassword}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber text-black text-sm font-semibold hover:bg-amber/90 transition-all disabled:opacity-50"
                  >
                    <Lock className="h-4 w-4" />
                    {savingPassword ? 'Actualizando...' : 'Actualizar contraseña'}
                  </button>
                  <button
                    onClick={() => { setEditMode('none'); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); }}
                    className="px-4 py-2.5 rounded-lg border border-white/[0.08] text-sm text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04] transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Información Personal */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <User className="h-4 w-4 text-amber" />
                Información Personal
              </h3>
              <button
                onClick={() => setEditMode(editMode === 'password' ? 'none' : 'password')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.08] text-xs text-zinc-400 hover:text-amber hover:border-amber/30 transition-all"
              >
                <Lock className="h-3 w-3" />
                Cambiar contraseña
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem icon={User} label="Nombre" value={profile?.name} />
              <InfoItem icon={Mail} label="Email" value={profile?.email} />
              <InfoItem icon={Shield} label="Rol" value={profile?.roles?.[0]} capitalize />
              <InfoItem icon={Calendar} label="Último acceso" value={profile?.ultimo_login ? new Date(profile.ultimo_login).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Sin acceso registrado'} />
            </div>
          </section>

          {/* Información del Negocio */}
          <section className="mb-8">
            <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2 mb-5">
              <Building2 className="h-4 w-4 text-amber" />
              Información del Negocio
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem icon={Building2} label="Razón Social" value={tienda?.razon_social} />
              <InfoItem icon={Store} label="Nombre Comercial" value={tienda?.nombre_comercial} />
              <InfoItem icon={FileText} label="RIF / NIT" value={tienda?.rif} />
              <InfoItem icon={Globe} label="País" value={tienda?.pais ? `${countryNames[tienda.pais] || tienda.pais} (${tienda.pais})` : '—'} />
              <InfoItem icon={MapPin} label="Dirección" value={tienda?.direccion} />
              <InfoItem icon={Phone} label="Teléfono" value={tienda?.telefono} />
              <InfoItem icon={Mail} label="Email del negocio" value={tienda?.email} customValue={!tienda?.email ? <span className="text-sm text-fallback">No posees correo empresarial</span> : undefined} />
              <InfoItem icon={Globe} label="Régimen Fiscal" value={tienda?.regimen_fiscal || '—'} capitalize />
              <InfoItem icon={DollarSign} label="Moneda Base" value={tienda?.moneda_base} />
              <InfoItem icon={Globe} label="Zona Horaria" value={tienda?.zona_horaria} />
            </div>
          </section>

          {/* Suscripción */}
          <section className="mb-8">
            <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2 mb-5">
              <CreditCard className="h-4 w-4 text-amber" />
              Suscripción
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem icon={CreditCard} label="Plan" value={subscription?.plan?.nombre || 'Gratuito'} />
              <InfoItem
                icon={Calendar}
                label="Estado"
                value={subscription?.estado || 'trial'}
                capitalize
                customValue={
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                    subscription?.estado === 'activa' ? 'bg-emerald-500/10 text-emerald-400' :
                    subscription?.estado === 'trial' ? 'bg-amber/10 text-amber' :
                    'bg-red-500/10 text-red-400'
                  }`}>
                    {subscription?.estado || 'trial'}
                  </span>
                }
              />
              <InfoItem
                icon={Calendar}
                label="Días restantes"
                value={subscription?.dias_restantes ? `${Math.round(subscription.dias_restantes)} días` : 'Ilimitado'}
              />
              <InfoItem
                icon={Calendar}
                label="Fin del trial"
                value={subscription?.fin_trial ? new Date(subscription.fin_trial).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
              />
            </div>
            {subscription?.plan && (
              <div className="mt-5 pt-4 border-t border-white/[0.06]">
                <p className="text-xs text-zinc-500 mb-3 font-medium">Límites del plan</p>
                <div className="flex flex-wrap gap-3">
                  {subscription.plan.limite_productos && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/5 border border-blue-500/10 text-xs text-blue-400">
                      <Package className="h-3 w-3" />
                      {subscription.plan.limite_productos} productos
                    </span>
                  )}
                  {subscription.plan.limite_usuarios && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-xs text-emerald-400">
                      <Users className="h-3 w-3" />
                      {subscription.plan.limite_usuarios} usuarios
                    </span>
                  )}
                  {subscription.plan.limite_cajas && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/5 border border-purple-500/10 text-xs text-purple-400">
                      <DollarSign className="h-3 w-3" />
                      {subscription.plan.limite_cajas} cajas
                    </span>
                  )}
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value, capitalize, customValue }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string | null;
  capitalize?: boolean;
  customValue?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="h-3.5 w-3.5 text-zinc-400" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-info-label font-medium">{label}</p>
        {customValue || (
          <p className={`text-sm truncate ${capitalize ? 'capitalize' : ''} ${!value ? 'text-fallback' : 'text-zinc-100'}`}>
            {value || '—'}
          </p>
        )}
      </div>
    </div>
  );
}
