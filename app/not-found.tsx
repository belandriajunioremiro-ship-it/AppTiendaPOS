import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-display text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-muted-foreground mb-8">Página no encontrada</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 py-3 px-6 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
