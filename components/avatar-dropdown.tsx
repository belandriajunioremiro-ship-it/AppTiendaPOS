'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';

interface AvatarDropdownProps {
  userName: string;
  userEmail: string;
  userInitials: string;
  onLogout: () => void;
}

export function AvatarDropdown({ userName, userEmail, userInitials, onLogout }: AvatarDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-lg hover:bg-white/[0.04] transition-all"
      >
        <div className="w-8 h-8 rounded-full bg-amber/20 flex items-center justify-center text-amber text-xs font-bold">
          {userInitials}
        </div>
        <ChevronDown className={`h-3.5 w-3.5 text-zinc-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-[#0f1014] border border-white/[0.08] rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-white/[0.06]">
            <p className="text-sm font-medium text-zinc-100 truncate">{userName}</p>
            <p className="text-xs text-zinc-500 truncate">{userEmail}</p>
          </div>
          <div className="py-1">
            <button
              onClick={() => { setOpen(false); router.push('/perfil'); }}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/[0.04] hover:text-zinc-100 transition-colors w-full text-left"
            >
              <User className="h-4 w-4 text-zinc-500" />
              <span>Mi Perfil</span>
            </button>
            <button
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/[0.04] hover:text-zinc-100 transition-colors w-full text-left"
            >
              <Settings className="h-4 w-4 text-zinc-500" />
              <span>Configuración</span>
            </button>
          </div>
          <div className="border-t border-white/[0.06] py-1">
            <button
              onClick={() => { onLogout(); setOpen(false); }}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/5 transition-colors w-full"
            >
              <LogOut className="h-4 w-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
