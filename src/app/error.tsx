'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import OceanBackground from '@/components/OceanBackground'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        //si se pone servicio d monitorizacion d errores ponerlo aqui
        console.error("Error capturado:", error)
    }, [error])

    return (
        <div className="relative min-h-screen w-full p-4 flex items-center justify-center overflow-hidden">
            <OceanBackground blur={true} />
            
            <div className="relative z-10 w-full max-w-lg rounded-3xl p-8 md:p-12 neu-raised bg-white/80 dark:bg-slate-900/70 backdrop-blur-md border border-gray-200 dark:border-white/10 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-500">
                
                <div className="mx-auto w-24 h-24 mb-6 rounded-2xl neu-inset flex items-center justify-center">
                    <svg className="w-12 h-12 text-red-500 dark:text-red-400 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-3">
                    ¡Algo ha salido mal!
                </h2>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm md:text-base">
                    El sistema ha detectado un error inesperado. No te preocupes, tus datos están a salvo. Puedes intentar recargar la página.
                </p>

                <div className="mb-8 p-4 rounded-xl bg-red-50/50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 text-left overflow-hidden">
                    <p className="text-xs font-mono text-red-600 dark:text-red-400 break-words line-clamp-3">
                        <span className="font-bold">Detalle:</span> {error.message || 'Error interno del servidor'}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                        onClick={() => reset()} 
                        className="neu-btn neu-btn-default neu-focus px-6 py-3 rounded-xl text-sm font-bold cursor-pointer w-full sm:w-auto"
                    >
                        Reintentar
                    </button>
                    <Link 
                        href="/dashboard" 
                        className="neu-btn neu-btn-dynamic neu-focus px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center w-full sm:w-auto"
                    >
                        Ir al inicio
                    </Link>
                </div>
            </div>
        </div>
    )
}