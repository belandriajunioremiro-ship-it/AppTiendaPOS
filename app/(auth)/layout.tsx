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
      { icon: TrendingUp, text: 'Configuración guiada en 3 pasos' },
      { icon: Shield, text: 'Todo en una transacción, sin datos fantasma' },
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

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-background min-h-screen">
        <div className="relative z-10 flex flex-col justify-center h-full px-12 lg:px-16 py-16">
          <div className="flex flex-col items-start max-w-md">
            <div className="flex flex-row items-center gap-3 mb-8">
              <Image src={logo} alt="TiendaPOS" className="h-14 w-auto lg:h-16" priority />
              <span className="font-display text-xl lg:text-2xl font-bold text-foreground leading-none">
                Tienda<span className="text-amber">POS</span>
              </span>
            </div>
            <div className="mb-10">
              <h2 className="font-display text-3xl xl:text-4xl font-bold text-foreground mb-3 leading-tight">
                {content.title}
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed max-w-md">
                {content.subtitle}
              </p>
            </div>

            <div className="space-y-4">
              {content.highlights.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-foreground text-sm leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 pt-8 border-t border-input">
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <Shield className="h-3.5 w-3.5 shrink-0" />
                <span>Tus datos están protegidos con encriptación SSL</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-8 lg:px-8 min-h-screen bg-card">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex flex-col items-center mb-8">
            <Image src={logo} alt="TiendaPOS" className="h-14 w-auto" priority />
            <span className="font-display text-lg font-bold text-foreground mt-1.5">
              Tienda<span className="text-amber">POS</span>
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
