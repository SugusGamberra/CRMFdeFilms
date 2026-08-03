'use client'

import { useState, useRef, useEffect } from 'react'

interface BuscadorFiltrosProps {
    searchTerm: string
    setSearchTerm: (value: string) => void
    filterType: string
    setFilterType: (value: string) => void
    sortOrder: 'asc' | 'desc'
    setSortOrder: (value: 'asc' | 'desc') => void
}

export default function BuscadorFiltros({
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    sortOrder,
    setSortOrder
}: BuscadorFiltrosProps) {
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
        <div className="mb-6 flex gap-4 items-center relative z-40" ref={menuRef}>
            
            {/* BUSCADOR */}
            <div className="flex-1">
                <input
                    type="text"
                    placeholder="Buscar cliente, contacto, calle, email, teléfono..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-5 py-3 rounded-2xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-gray-50/50 dark:bg-white/5 border border-gray-200 dark:border-white/5 shadow-inner"
                />
            </div>
            
            {/* BOTÓN FILTROS */}
            <div>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`neu-btn neu-focus cursor-pointer w-12 h-12 flex items-center justify-center rounded-full transition-colors duration-500 shadow-lg border ${
                        isOpen 
                            ? 'border-transparent text-white' 
                            : 'bg-white/80 dark:bg-white/10 border-gray-200 dark:border-white/5 text-gray-700 dark:text-white hover:bg-white dark:hover:bg-white/20'
                    }`}
                    aria-label="Filtros"
                    style={{
                        backgroundColor: isOpen ? 'var(--dynamic-accent)' : '',
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                    </svg>
                </button>

                {/* MENÚ DESPLEGABLE */}
                {isOpen && (
                    <div className="absolute top-16 right-0 w-64 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-2xl p-3 animate-in fade-in zoom-in-95 duration-200">
                        
                        {/* TIPO DE CLIENTE */}
                        <div className="px-3 py-2 text-xs font-bold text-gray-500 dark:text-white/40 uppercase tracking-widest">
                            Tipo de cliente
                        </div>
                        <div className="space-y-1 mt-1">
                            {['', 'Particular', 'Empresa', 'Organismo público', 'Otro'].map((tipo) => (
                                <button
                                    key={tipo}
                                    onClick={() => setFilterType(tipo)}
                                    className={`w-full text-left px-3 py-2 text-sm font-medium rounded-xl transition-colors cursor-pointer ${
                                        filterType === tipo 
                                            ? 'bg-gray-200 dark:bg-white/20 text-gray-900 dark:text-white' 
                                            : 'text-gray-600 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10'
                                    }`}
                                >
                                    {tipo === '' ? 'Todos los tipos' : tipo}
                                </button>
                            ))}
                        </div>
                        
                        <div className="h-px bg-gray-200 dark:bg-white/10 my-3 mx-2"></div>
                        
                        {/* ORDEN DE VISUALIZACIÓN */}
                        <div className="px-3 py-2 text-xs font-bold text-gray-500 dark:text-white/40 uppercase tracking-widest">
                            Orden de visualización
                        </div>
                        <div className="space-y-1 mt-1">
                            <button
                                onClick={() => setSortOrder('desc')}
                                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-xl transition-colors cursor-pointer ${
                                    sortOrder === 'desc' 
                                        ? 'bg-gray-200 dark:bg-white/20 text-gray-900 dark:text-white' 
                                        : 'text-gray-600 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10'
                                }`}
                            >
                                Más recientes primero
                            </button>
                            <button
                                onClick={() => setSortOrder('asc')}
                                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-xl transition-colors cursor-pointer ${
                                    sortOrder === 'asc' 
                                        ? 'bg-gray-200 dark:bg-white/20 text-gray-900 dark:text-white' 
                                        : 'text-gray-600 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10'
                                }`}
                            >
                                Más antiguos primero
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}