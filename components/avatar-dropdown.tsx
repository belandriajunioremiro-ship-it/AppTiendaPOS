'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';

interface AvatarDropdownProps {
  userName: string;
  userEmail: string;
  userInitials: string;
  onLogout: () => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export function AvatarDropdown({ userName, userEmail, userInitials, onLogout, isOpen, onToggle, onClose }: AvatarDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, onClose]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-lg hover:bg-accent transition-all"
      >
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
          {userInitials}
        </div>
        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-[70]">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-medium text-foreground truncate">{userName}</p>
            <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
          </div>
          <div className="py-1">
            <button
              onClick={() => { onClose(); router.push('/perfil'); }}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-accent hover:text-foreground transition-colors w-full text-left"
            >
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Mi Perfil</span>
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-accent hover:text-foreground transition-colors w-full text-left"
            >
              <Settings className="h-4 w-4 text-muted-foreground" />
              <span>Configuración</span>
            </button>
          </div>
          <div className="border-t border-border py-1">
            <button
              onClick={() => { onLogout(); onClose(); }}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-destructive-foreground hover:bg-destructive/5 transition-colors w-full"
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
