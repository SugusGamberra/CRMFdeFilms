'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { cerrarSesion } from '@/app/dashboard/actions'

export default function UserMenu() {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div ref={menuRef} className="relative z-50">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="neu-btn neu-focus cursor-pointer w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/10 border border-white/5 transition-colors duration-500 shadow-lg"
                aria-label="Menú de usuario"
                style={{ 
                    backgroundColor: isOpen ? 'var(--dynamic-accent)' : '',
                    color: 'white'
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
            </button>

            {/* PANEL DESPLEGABLE */}
            {isOpen && (
                <div className="absolute top-14 right-0 w-56 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/10 shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-200">
                    
                    {/* SECCIÓN PÁGINAS */}
                    <div className="px-3 py-2 text-xs font-bold text-white/40 uppercase tracking-widest">Navegación</div>
                    <Link href="/dashboard" onClick={() => setIsOpen(false)} className="block w-full text-left px-3 py-2 text-sm font-medium text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer">
                        Dashboard
                    </Link>
                    
                    <div className="h-px bg-white/10 my-2 mx-2"></div>
                    
                    {/* SECCIÓN PERFIL */}
                    <div className="px-3 py-2 text-xs font-bold text-white/40 uppercase tracking-widest">Ajustes</div>
                    <Link href="/perfil" onClick={() => setIsOpen(false)} className="block w-full text-left px-3 py-2 text-sm font-medium text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer">
                        Configurar Perfil
                    </Link>

                    <div className="h-px bg-white/10 my-2 mx-2"></div>
                    
                    {/* SECCIÓN LEGAL */}
                    <div className="px-3 py-2 text-xs font-bold text-white/40 uppercase tracking-widest">Legal</div>
                    <Link href="/privacidad" onClick={() => setIsOpen(false)} className="block w-full text-left px-3 py-2 text-sm font-medium text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer">
                        Política de Privacidad
                    </Link>
                    <Link href="/cookies" onClick={() => setIsOpen(false)} className="block w-full text-left px-3 py-2 text-sm font-medium text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer">
                        Uso de Cookies
                    </Link>
                    <Link href="/avisos" onClick={() => setIsOpen(false)} className="block w-full text-left px-3 py-2 text-sm font-medium text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer">
                        Avisos Legales
                    </Link>
                    
                    <div className="h-px bg-white/10 my-2 mx-2"></div>
                    
                    {/* CERRAR SESIÓN */}
                    <form action={cerrarSesion}>
                        <button type="submit" className="w-full text-left px-3 py-2 text-sm font-bold text-red-400 hover:bg-red-500/20 rounded-xl transition-colors cursor-pointer">
                            Cerrar Sesión
                        </button>
                    </form>
                </div>
            )}
        </div>
    )
}