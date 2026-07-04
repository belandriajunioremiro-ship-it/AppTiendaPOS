import Image from 'next/image';
import logo from '@/assets/TiendaPoslogo1.png';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-background min-h-screen">
        <div className="relative z-10 flex flex-col justify-center h-full px-6 lg:px-10">
          <div className="flex flex-row items-center gap-3 mb-8">
            <Image src={logo} alt="TiendaPOS" className="h-14 w-auto lg:h-16" priority />
            <span className="font-display text-xl lg:text-2xl font-bold text-foreground leading-none">
              Tienda<span className="text-amber">POS</span>
            </span>
          </div>
          <h2 className="font-display text-3xl xl:text-4xl font-bold text-foreground mb-2 leading-tight">
            Tu negocio en 3 pasos
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed max-w-md mb-10">
            Registra tus datos fiscales, configura tu tienda y agrega tu primer producto para empezar a vender.
          </p>
          <div className="space-y-10">
            <div className="flex items-center gap-4 group">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <span className="text-primary text-sm font-bold">1</span>
              </div>
              <div>
                <p className="text-foreground text-sm font-medium">Datos Fiscales</p>
                <p className="text-muted-foreground text-xs mt-0.5">Registra tu identificación fiscal y dirección</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <span className="text-primary text-sm font-bold">2</span>
              </div>
              <div>
                <p className="text-foreground text-sm font-medium">Configurar Negocio</p>
                <p className="text-muted-foreground text-xs mt-0.5">Elige el tipo de negocio y personaliza tu caja</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <span className="text-primary text-sm font-bold">3</span>
              </div>
              <div>
                <p className="text-foreground text-sm font-medium">Primer Producto</p>
                <p className="text-muted-foreground text-xs mt-0.5">Agrega tu primer producto y empieza a vender</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-8 lg:px-12 min-h-screen bg-card">
        <div className="w-full max-w-2xl">
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
