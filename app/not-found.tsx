import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-dark text-white p-5 text-center">
      <h2 className="font-display text-6xl text-neon mb-4">404</h2>
      <p className="text-xl text-gray-400 mb-8">Página não encontrada</p>
      <Link 
        href="/" 
        className="bg-neon text-dark font-bold px-8 py-3 rounded-full hover:neon-glow transition-all"
      >
        Voltar para o Início
      </Link>
    </div>
  );
}
