'use client'
import { useState, useEffect } from 'react'

export default function CookieBlocker() {
    const [status, setStatus] = useState<'checking' | 'accepted' | 'rejected' | 'pending'>('checking')

    useEffect(() => {
        setTimeout(() => {
            const saved = localStorage.getItem('crm_cookies_accepted')
            if (saved === 'true') {
                setStatus('accepted')
            } else {
                setStatus('pending')
            }
        }, 0)
    }, [])

    if (status === 'checking' || status === 'accepted') return null

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <div className="w-full max-w-lg rounded-3xl p-8 neu-raised bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 shadow-2xl text-center animate-in fade-in zoom-in-95">
                
                {/* VISTA PREGUNTA */}
                {status === 'pending' && (
                    <>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Uso de Cookies Técnicas</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
                            Para garantizar la seguridad y el correcto funcionamiento de esta plataforma privada, utilizamos cookies técnicas esenciales. ¿Aceptas su uso?
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => setStatus('rejected')}
                                className="neu-btn neu-btn-default px-6 py-3 rounded-xl text-sm font-bold w-full cursor-pointer"
                            >
                                Rechazar
                            </button>
                            <button
                                onClick={() => {
                                    localStorage.setItem('crm_cookies_accepted', 'true')
                                    setStatus('accepted')
                                }}
                                className="neu-btn neu-btn-dynamic px-6 py-3 rounded-xl text-sm font-bold w-full cursor-pointer"
                            >
                                Aceptar
                            </button>
                        </div>
                    </>
                )}
            
                {/* VISTA RECHAZADO */}
                {status === 'rejected' && (
                    <div className="animate-in fade-in zoom-in duration-300">
                        <div className="text-red-500 mb-4 flex justify-center">
                            <svg className="w-16 h-16 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Acceso Bloqueado</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-8 text-sm">
                            Has rechazado el uso de cookies. Como esta es una herramienta privada orientada a la gestión, es técnicamente imposible que accedas sin las cookies que mantienen tu sesión segura.
                        </p>
                        <button
                            onClick={() => setStatus('pending')}
                            className="neu-btn neu-btn-dynamic px-6 py-3 rounded-xl text-sm font-bold w-full cursor-pointer"
                        >
                            Cambiar de opinión y Aceptar
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}