'use client'

import { useState, useEffect, useRef } from 'react'
import BuscadorFiltros from './BuscadorFiltros'
import ClienteItem, { Cliente } from './ClienteItem'

const ITEMS_PER_PAGE = 10 

export default function ListadoClientes({ clientes, error }: { clientes: Cliente[], error?: string }) {
    const [editingId, setEditingId] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterType, setFilterType] = useState('')
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc')
    
    // ESTADO PARA LA PAGINACIÓN
    const [currentPage, setCurrentPage] = useState(1)

    const isMounted = useRef(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            const savedFilter = localStorage.getItem('crm_filterType')
            const savedSort = localStorage.getItem('crm_sortOrder') as 'desc' | 'asc'
            if (savedFilter) setFilterType(savedFilter)
            if (savedSort) setSortOrder(savedSort)
            
            isMounted.current = true
        }, 0)
        
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (isMounted.current) {
            localStorage.setItem('crm_filterType', filterType)
            localStorage.setItem('crm_sortOrder', sortOrder)
        }
    }, [filterType, sortOrder])

    const handleSearchChange = (value: string) => {
        setSearchTerm(value)
        setCurrentPage(1)
    }

    const handleFilterChange = (value: string) => {
        setFilterType(value)
        setCurrentPage(1)
    }

    const handleSortChange = (value: 'asc' | 'desc') => {
        setSortOrder(value)
        setCurrentPage(1)
    }

    const filteredAndSortedClientes = clientes?.filter(cliente => {
        const term = searchTerm.toLowerCase()
        
        const fullText = `
            ${cliente.nombre_completo || ''}
            ${cliente.cif_nif || ''}
            ${cliente.email || ''}
            ${cliente.telefono || ''}
            ${cliente.direccion_facturacion || ''}
            ${cliente.localidad || ''}
            ${cliente.provincia || ''}
            ${cliente.codigo_postal || ''}
            ${cliente.pais || ''}
            ${cliente.persona_contacto || ''}
            ${cliente.tfno_contacto || ''}
            ${cliente.email_contacto || ''}
            ${cliente.notas || ''}
            ${cliente.direccion_envio || ''}
            ${cliente.localidad_envio || ''}
            ${cliente.provincia_envio || ''}
            ${cliente.codigo_postal_envio || ''}
            ${cliente.pais_envio || ''}
        `.toLowerCase()

        const matchesSearch = term === '' || fullText.includes(term)
        const matchesFilter = filterType === '' || cliente.tipo_cliente === filterType
        
        return matchesSearch && matchesFilter
    }).sort((a, b) => {
        const dateA = a.created_at || ''
        const dateB = b.created_at || ''

        if (sortOrder === 'asc') return dateA.localeCompare(dateB)
        return dateB.localeCompare(dateA)
    })

    // LÓGICA DE PAGINACIÓN
    const totalItems = filteredAndSortedClientes?.length || 0
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
    
    const paginatedClientes = filteredAndSortedClientes?.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    if (error) {
        return <div className="mb-4 text-xl font-semibold text-red-500 dark:text-red-400">Error de Supabase: {error}</div>
    }

    return (
        <section>
            <div className="space-y-4">
                <BuscadorFiltros 
                    searchTerm={searchTerm} 
                    setSearchTerm={handleSearchChange} 
                    filterType={filterType} 
                    setFilterType={handleFilterChange} 
                    sortOrder={sortOrder} 
                    setSortOrder={handleSortChange} 
                />

                {/* MENSAJE SI NO HAY RESULTADOS */}
                {totalItems === 0 && (
                    <div className="py-12 text-center">
                        <p className="text-gray-500 dark:text-white/60 font-medium">No se han encontrado clientes con estos filtros.</p>
                    </div>
                )}

                {/* LISTADO PAGINADO */}
                {paginatedClientes?.map((cliente) => (
                    <ClienteItem 
                        key={cliente.id_cliente} 
                        cliente={cliente} 
                        isEditing={editingId === cliente.id_cliente} 
                        setEditingId={setEditingId} 
                    />
                ))}

                {/* CONTROLES DE PAGINACIÓN */}
                {totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-between border-t border-gray-200 dark:border-white/10 pt-6">
                        <button 
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="neu-btn neu-focus cursor-pointer rounded-xl px-5 py-2.5 text-sm font-bold text-gray-700 dark:text-white bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 transition-colors border border-gray-300 dark:border-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            ← Anterior
                        </button>
                        
                        <span className="text-sm font-medium text-gray-500 dark:text-white/60 hidden sm:inline-block">
                            Página <span className="font-bold text-gray-900 dark:text-white transition-colors duration-500" style={{ color: 'var(--dynamic-accent)' }}>{currentPage}</span> de {totalPages}
                        </span>
                        
                        <button 
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="neu-btn neu-focus cursor-pointer rounded-xl px-5 py-2.5 text-sm font-bold text-gray-700 dark:text-white bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 transition-colors border border-gray-300 dark:border-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            Siguiente →
                        </button>
                    </div>
                )}
            </div>
        </section>
    )
}