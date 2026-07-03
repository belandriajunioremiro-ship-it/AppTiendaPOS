'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import logo from '@/assets/TiendaPoslogo1.png';
import {
  LayoutDashboard, ShoppingCart, Package, DollarSign,
  Users, BarChart3, Settings, LogOut, FolderTree,
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: ShoppingCart, label: 'Punto de Venta', href: '/pos' },
  { icon: Package, label: 'Productos', href: '/productos' },
  { icon: FolderTree, label: 'Categorías', href: '/catalogo/categorias' },
  { icon: DollarSign, label: 'Cajas', href: '/cajas' },
  { icon: Users, label: 'Clientes', href: '/clientes' },
  { icon: BarChart3, label: 'Reportes', href: '/reportes' },
  { icon: Settings, label: 'Configuración', href: '/configuracion' },
];

const roleColors: Record<string, string> = {
  admin: 'bg-amber/10 text-amber border-amber/20',
  supervisor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  cajero: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

interface SidebarProps {
  storeName?: string;
  userName: string;
  userEmail: string;
  userInitials: string;
  userRole?: string;
  currentPath: string;
}

export function SidebarContent({
  storeName,
  userName,
  userEmail,
  userInitials,
  userRole,
  currentPath,
}: SidebarProps) {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="h-full flex flex-col">
      <div className="px-5 pt-5 pb-3 border-b border-white/[0.06]">
        <div className="flex flex-col items-center gap-0.5">
          <Image src={logo} alt="TiendaPOS" className="h-10 w-auto" priority />
          <span className="font-display text-base font-bold text-zinc-100 leading-tight mt-1">
            Tienda<span className="text-amber">POS</span>
          </span>
          {storeName && (
            <p className="text-xs font-semibold text-zinc-100 leading-tight">{storeName}</p>
          )}
        </div>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentPath === item.href || (item.href !== '/dashboard' && currentPath.startsWith(item.href));
          return (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                if (isActive) return;
                router.push(item.href);
              }}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-amber/[0.08] text-amber font-medium'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]'
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>

      <div className="px-4 py-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-amber/20 flex items-center justify-center text-amber text-[10px] font-bold shrink-0">
            {userInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-zinc-100 truncate">{userName}</p>
            <p className="text-[11px] text-zinc-500 truncate">{userEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1 rounded-lg text-zinc-500 hover:text-amber hover:bg-amber/10 transition-all shrink-0"
            title="Cerrar Sesión"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
        {userRole && (
          <div className="mt-2 pl-[38px]">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${roleColors[userRole] || 'text-zinc-400 border-zinc-700 bg-zinc-800/50'}`}>
              {userRole}
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}
