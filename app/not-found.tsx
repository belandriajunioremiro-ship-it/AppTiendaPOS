import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-primary flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-display text-6xl font-bold text-amber mb-4">404</h1>
        <p className="text-zinc-400 mb-8">Página no encontrada</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 py-3 px-6 bg-amber text-dark-primary font-semibold rounded-lg hover:bg-amber-dark transition-all"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
