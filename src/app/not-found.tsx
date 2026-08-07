import Link from 'next/link'
import OceanBackground from '@/components/OceanBackground'

export default function NotFound() {
    return (
        <div className="relative min-h-screen w-full p-4 flex items-center justify-center overflow-hidden">
            <OceanBackground blur={true} />

            <div className="relative z-10 w-full max-w-lg rounded-3xl p-8 md:p-12 neu-raised bg-white/80 dark:bg-slate-900/70 backdrop-blur-md border border-gray-200 dark:border-white/10 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-500">
                <h1 className="text-8xl md:text-9xl font-black mb-2 transition-colors duration-500 drop-shadow-lg" style={{ color: 'var(--dynamic-accent)' }}>
                    404
                </h1>

                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">
                    ¡Ups! Te has perdido
                </h2>

                <p className="text-gray-600 dark:text-gray-300 mb-8 text-sm md:text-base leading-relaxed">
                    Parece que has navegado hacia aguas desconocidas. La página que estás buscando no existe, ha sido movida o el enlace está roto.
                </p>

                <Link href="/dashboard" className="neu-btn neu-btn-dynamic neu-focus inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-sm font-bold w-full sm:w-auto">
                    Volver a puerto seguro
                </Link>
            </div>
        </div>
    )
}