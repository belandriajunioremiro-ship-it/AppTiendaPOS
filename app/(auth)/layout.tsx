'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Store, Shield, TrendingUp, HeadphonesIcon, Clock, BarChart3, PackageSearch, Users, CreditCard } from 'lucide-react';
import logo from '@/assets/TiendaPoslogo1.png';

const features = [
  { icon: Store, text: 'Punto de Venta intuitivo y rápido' },
  { icon: PackageSearch, text: 'Control de inventario en tiempo real' },
  { icon: BarChart3, text: 'Reportes y estadísticas de ventas' },
  { icon: Users, text: 'Gestión de clientes y créditos' },
  { icon: CreditCard, text: 'Múltiples métodos de pago' },
  { icon: Shield, text: 'Datos seguros en la nube' },
];

const leftContent: Record<string, { title: string; subtitle: string; highlights: { icon: any; text: string }[] }> = {
  '/login': {
    title: 'Bienvenido de vuelta',
    subtitle: 'El sistema POS más completo para tu negocio en Latinoamérica',
    highlights: features,
  },
  '/register': {
    title: 'Comienza tu prueba gratuita',
    subtitle: 'Regístrate y descubre por qué miles de negocios confían en TiendaPOS',
    highlights: [
      { icon: Store, text: '14 días de prueba gratuita sin tarjeta' },
      { icon: TrendingUp, text: 'Configuración guiada en 4 pasos' },
      { icon: Shield, text: 'Soporte técnico incluido desde el día 1' },
    ],
  },
  '/forgot-password': {
    title: 'Recupera tu acceso',
    subtitle: 'Te enviaremos un código de 6 dígitos a tu correo electrónico',
    highlights: [
      { icon: Clock, text: 'El código expira en 60 minutos' },
      { icon: Shield, text: 'Máximo 3 intentos por minuto por seguridad' },
      { icon: HeadphonesIcon, text: '¿Problemas? Contáctanos para ayudarte' },
    ],
  },
  '/reset-password': {
    title: 'Crea una nueva contraseña',
    subtitle: 'Ingresa el código que recibiste y elige una contraseña segura',
    highlights: [
      { icon: Shield, text: 'Mínimo 8 caracteres para mayor seguridad' },
      { icon: Clock, text: 'El código debe usarse antes de 60 minutos' },
      { icon: HeadphonesIcon, text: 'Si no recibiste el código, solicita uno nuevo' },
    ],
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const content = leftContent[pathname] || leftContent['/login'];

  const isLogin = pathname === '/login';

  return (
    <div className="min-h-screen bg-dark-primary flex flex-col lg:flex-row">
      <div className={`hidden lg:flex lg:w-1/2 relative overflow-hidden min-h-screen ${isLogin ? 'bg-amber' : 'bg-gradient-to-br from-dark-secondary via-dark-primary to-dark-tertiary'}`}>
        {!isLogin && (
          <div className="absolute inset-0">
            <div className="absolute -top-1/4 -left-1/4 w-3/4 h-3/4 rounded-full bg-amber-glow blur-[120px]" />
            <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-amber-glow blur-[100px]" />
          </div>
        )}
        {isLogin ? (
          <div className="relative z-10 flex flex-col h-full w-full px-12 lg:px-16 pt-6 pb-10">
            <div
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                backgroundSize: '256px 256px',
                imageRendering: 'pixelated',
              }}
            />
            <div className="flex flex-row items-center gap-3 mb-14">
              <Image src={logo} alt="TiendaPOS" className="h-12 w-auto lg:h-14" priority />
              <span className="font-display text-lg lg:text-xl font-bold text-dark-primary">
                Tienda<span className="text-dark-primary">POS</span>
              </span>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <h2 className="font-display text-4xl xl:text-5xl font-bold text-dark-primary mb-4 leading-[1.1] tracking-tight">
                {content.title}
              </h2>
              <p className="text-dark-primary/60 text-base leading-relaxed max-w-md mb-10">
                {content.subtitle}
              </p>
              <div className="space-y-3">
                {features.slice(0, 3).map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded bg-dark-primary/10 flex items-center justify-center">
                        <Icon className="h-3 w-3 text-dark-primary" />
                      </div>
                      <span className="text-dark-primary/60 text-sm">{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="pt-6 border-t border-dark-primary/20">
              <div className="flex items-center gap-2 text-dark-primary/50 text-xs">
                <Shield className="h-3.5 w-3.5 shrink-0" />
                <span>Tus datos están protegidos con encriptación SSL</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative z-10 flex flex-col justify-center h-full px-12 lg:px-16">
            <div className="flex flex-row items-center gap-3 mb-8">
              <Image src={logo} alt="TiendaPOS" className="h-14 w-auto lg:h-16" priority />
              <span className="font-display text-xl lg:text-2xl font-bold text-zinc-100">
                Tienda<span className="text-amber">POS</span>
              </span>
            </div>
            <div className="mb-10">
              <h2 className="font-display text-3xl xl:text-4xl font-bold text-zinc-100 mb-3 leading-tight">
                {content.title}
              </h2>
              <p className="text-zinc-400 text-base leading-relaxed max-w-md">
                {content.subtitle}
              </p>
            </div>
            <div className="space-y-4">
              {content.highlights.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-start gap-3 group">
                    <div className="mt-0.5 w-8 h-8 rounded-lg bg-amber/10 flex items-center justify-center shrink-0 group-hover:bg-amber/20 transition-colors">
                      <Icon className="h-4 w-4 text-amber" />
                    </div>
                    <div>
                      <p className="text-zinc-300 text-sm leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-10 pt-8 border-t border-dark-border">
              <div className="flex items-center gap-2 text-zinc-500 text-xs">
                <Shield className="h-3.5 w-3.5 shrink-0" />
                <span>Tus datos están protegidos con encriptación SSL</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={`w-full lg:w-1/2 flex items-center justify-center px-4 py-8 lg:px-8 min-h-screen relative ${isLogin ? '' : ''}`}>
        {isLogin && (
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgb(161 161 170) 1px, transparent 1px),
                linear-gradient(to bottom, rgb(161 161 170) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />
        )}
        <div className="w-full max-w-md relative z-10">
          <div className="lg:hidden flex flex-col items-center mb-8">
            <Image src={logo} alt="TiendaPOS" className="h-14 w-auto" priority />
            <span className="font-display text-lg font-bold text-zinc-100 mt-1.5">
              Tienda<span className="text-amber">POS</span>
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
