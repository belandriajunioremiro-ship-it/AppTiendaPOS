'use client';

import { useEffect, useRef } from 'react';
import { Bell, CheckCircle2, TrendingUp, Package } from 'lucide-react';

interface NotificationDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const notifications = [
  { icon: CheckCircle2, color: 'bg-primary/10 text-primary', border: 'border-amber', title: 'Onboarding completado', desc: 'Tu tienda está lista para operar', time: 'Hace 2 min' },
  { icon: TrendingUp, color: 'bg-emerald-500/10 text-emerald-400', border: 'border-emerald-500', title: 'Primera venta registrada', desc: '¡Felicidades por tu primera venta!', time: 'Hace 15 min' },
  { icon: Package, color: 'bg-blue-500/10 text-blue-400', border: 'border-blue-500', title: 'Producto agregado', desc: 'Se agregó un nuevo producto al inventario', time: 'Hace 30 min' },
];

export function NotificationDropdown({ isOpen, onToggle, onClose }: NotificationDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);

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
        className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber ring-2 ring-background" />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-[70]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Notificaciones</h3>
            <span className="text-[11px] text-primary font-medium">{notifications.length} nuevas</span>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {notifications.map((n, i) => {
              const Icon = n.icon;
              return (
                <div key={i} className={`px-4 py-3 hover:bg-white/[0.03] transition-colors border-l-2 ${n.border}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg ${n.color} flex items-center justify-center shrink-0 mt-0.5`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-foreground font-medium">{n.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{n.desc}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="border-t border-border px-4 py-2.5">
            <button className="text-[11px] text-primary hover:text-primary/80 transition-colors font-medium">Ver todas las notificaciones</button>
          </div>
        </div>
      )}
    </div>
  );
}
