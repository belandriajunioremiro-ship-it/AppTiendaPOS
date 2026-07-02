'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Store, Shield, TrendingUp, HeadphonesIcon, Clock, BarChart3, PackageSearch, Users, CreditCard, Zap, RefreshCw, BarChart2 } from 'lucide-react';
import logo from '@/assets/TiendaPoslogo1.png';

const loginFeatures = [
  { icon: Zap, text: 'Vende más rápido en tu caja' },
  { icon: RefreshCw, text: 'Inventario sincronizado al instante' },
  { icon: BarChart2, text: 'Métricas que te ayudan a decidir' },
];

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
    subtitle: 'Tu negocio conectado desde cualquier lugar',
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

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const content = leftContent[pathname] || leftContent['/login'];
  const isLogin = pathname === '/login';

  if (isLogin) {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* ── LEFT: 60% dark branding ── */}
        <div className="hidden lg:flex lg:w-[60%] relative overflow-hidden flex-col bg-[#09090b]">
          {/* Dot pattern */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, rgba(245,158,11,0.05) 1px, transparent 0)',
              backgroundSize: '32px 32px',
            }}
          />
          {/* Subtle grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(245,158,11,0.015) 1px, transparent 0), linear-gradient(90deg, rgba(245,158,11,0.015) 1px, transparent 0)',
              backgroundSize: '64px 64px',
            }}
          />
          {/* Amber glow behind title */}
          <div
            className="absolute top-[40%] left-[35%] -translate-x-1/2 -translate-y-1/2 w-[440px] h-[440px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 65%)' }}
          />
          {/* Edge vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#09090b] via-transparent to-[#09090b] pointer-events-none opacity-60" />

          {/* Content */}
          <div className="relative z-10 flex flex-col flex-1 px-16 xl:px-20 pt-10 pb-10">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <Image src={logo} alt="TiendaPOS" className="h-7 w-auto" priority />
              <span className="font-display text-[14px] font-bold tracking-tight text-zinc-200">
                Tienda<span className="text-amber">POS</span>
              </span>
            </div>

            {/* Center */}
            <div className="flex-1 flex flex-col justify-center max-w-md -mt-4">
              <h1 className="font-display text-[44px] xl:text-[52px] font-bold text-zinc-50 leading-[1.05] tracking-[-0.02em] mb-3">
                {content.title}
              </h1>
              <p className="text-zinc-500 text-[15px] leading-relaxed max-w-[26rem] mb-14">
                {content.subtitle}
              </p>

              <div className="space-y-4">
                {loginFeatures.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-center gap-3.5 group">
                      <div className="w-8 h-8 rounded-lg bg-amber/[0.08] flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-amber/[0.15] group-hover:scale-105">
                        <Icon className="h-[15px] w-[15px] text-amber" />
                      </div>
                      <span className="text-zinc-400 text-[14px] transition-colors duration-200 group-hover:text-zinc-300">
                        {item.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Security badge */}
            <div className="pt-5 border-t border-zinc-900">
              <div className="flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 text-amber/50 shrink-0" />
                <span className="text-zinc-600 text-[12px]">Conexión cifrada de extremo a extremo</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: 40% light form ── */}
        <div className="w-full lg:w-[40%] flex items-center justify-center px-6 py-10 lg:px-14 min-h-screen bg-[#fafaf9]">
          <div className="w-full max-w-[340px]">
            {/* Mobile logo */}
            <div className="lg:hidden flex flex-col items-center mb-10">
              <Image src={logo} alt="TiendaPOS" className="h-10 w-auto mb-1.5" priority />
              <span className="font-display text-lg font-bold text-[#09090b]">
                Tienda<span className="text-amber">POS</span>
              </span>
            </div>
            {children}
          </div>
        </div>
      </div>
    );
  }

  /* ── Other auth pages — dark theme ── */
  return (
    <div className="min-h-screen bg-dark-primary flex flex-col lg:flex-row">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-dark-secondary via-dark-primary to-dark-tertiary min-h-screen">
        <div className="absolute inset-0">
          <div className="absolute -top-1/4 -left-1/4 w-3/4 h-3/4 rounded-full bg-amber-glow blur-[120px]" />
          <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-amber-glow blur-[100px]" />
        </div>
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
                    <p className="text-zinc-300 text-sm leading-relaxed">{item.text}</p>
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
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-8 lg:px-8 min-h-screen">
        <div className="w-full max-w-md">
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
