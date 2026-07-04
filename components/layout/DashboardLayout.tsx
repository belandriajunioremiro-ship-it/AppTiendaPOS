'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import api from '@/lib/axios';
import { SidebarContent } from '@/components/sidebar';
import { NotificationDropdown } from '@/components/notification-dropdown';
import { AvatarDropdown } from '@/components/avatar-dropdown';
import { Menu, Loader2 } from 'lucide-react';

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

interface DashboardLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  pageSubtitle?: string;
}

export function DashboardLayout({ children, pageTitle, pageSubtitle }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user: authUser, token, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<'notif' | 'avatar' | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [storeName, setStoreName] = useState('');
  const [userRole, setUserRole] = useState('cajero');
  const [loading, setLoading] = useState(true);

  const closeAllDropdowns = () => setDropdownOpen(null);

  useEffect(() => {
    const effectiveToken = token || localStorage.getItem('tiendapos_token');
    if (!effectiveToken) { router.push('/login'); return; }
    loadProfile();
  }, [token]);

  const loadProfile = async () => {
    try {
      const [meRes, tiendaRes] = await Promise.all([
        api.get('/auth/me'),
        api.get('/tienda').catch(() => null),
      ]);
      const p = meRes.data.data;
      setProfile(p);
      setUserRole(p.roles?.[0] || 'cajero');
      if (tiendaRes?.data?.data) {
        setStoreName(tiendaRes.data.data.nombre_comercial || tiendaRes.data.data.razon_social || '');
      }
    } catch {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getInitials = (name: string) =>
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span>Cargando...</span>
        </div>
      </div>
    );
  }

  if (!token && !localStorage.getItem('tiendapos_token')) return null;

  const sidebarProps = {
    storeName,
    userName: profile?.name || 'Usuario',
    userEmail: profile?.email || '',
    userInitials: profile ? getInitials(profile.name) : 'U',
    userRole,
    currentPath: pathname,
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex lg:w-48 lg:flex-col lg:fixed lg:inset-y-0 bg-background border-r border-border">
        <SidebarContent {...sidebarProps} />
      </div>

      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ease-out lg:hidden ${
          sidebarOpen ? 'visible' : 'invisible'
        }`}
      >
        <div
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-out ${
            sidebarOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setSidebarOpen(false)}
        />
        <div
          className={`fixed inset-y-0 left-0 w-48 bg-background border-r border-border transition-transform duration-300 ease-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <SidebarContent {...sidebarProps} />
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-all duration-300 ${
          dropdownOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeAllDropdowns}
      />

      <div className="flex-1 lg:pl-48 flex flex-col">
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-foreground">{pageTitle}</h1>
                {pageSubtitle && (
                  <p className="text-xs text-muted-foreground">{pageSubtitle}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <NotificationDropdown
                isOpen={dropdownOpen === 'notif'}
                onToggle={() => setDropdownOpen(dropdownOpen === 'notif' ? null : 'notif')}
                onClose={closeAllDropdowns}
              />
              <AvatarDropdown
                userName={profile?.name || 'Usuario'}
                userEmail={profile?.email || ''}
                userInitials={profile ? getInitials(profile.name) : 'U'}
                onLogout={handleLogout}
                isOpen={dropdownOpen === 'avatar'}
                onToggle={() => setDropdownOpen(dropdownOpen === 'avatar' ? null : 'avatar')}
                onClose={closeAllDropdowns}
              />
            </div>
          </div>
        </header>

        <div className="relative flex-1 min-h-0">
          <main className="relative z-0 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
