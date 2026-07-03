'use client';

import { useEffect, useRef } from 'react';
import { Bell, CheckCircle2, TrendingUp, Package } from 'lucide-react';

interface NotificationDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const notifications = [
  { icon: CheckCircle2, color: 'bg-amber/10 text-amber', border: 'border-amber', title: 'Onboarding completado', desc: 'Tu tienda está lista para operar', time: 'Hace 2 min' },
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
        className="relative p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04] transition-all"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber ring-2 ring-dark-primary" />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-[#0f1014] border border-white/[0.08] rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
            <h3 className="text-sm font-semibold text-zinc-100">Notificaciones</h3>
            <span className="text-[11px] text-amber font-medium">{notifications.length} nuevas</span>
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
                      <p className="text-xs text-zinc-200 font-medium">{n.title}</p>
                      <p className="text-[11px] text-zinc-500 mt-0.5">{n.desc}</p>
                      <p className="text-[10px] text-zinc-600 mt-1">{n.time}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="border-t border-white/[0.06] px-4 py-2.5">
            <button className="text-[11px] text-amber hover:text-amber/80 transition-colors font-medium">Ver todas las notificaciones</button>
          </div>
        </div>
      )}
    </div>
  );
}
