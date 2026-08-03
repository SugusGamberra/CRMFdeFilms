'use client'

import { useState, useEffect, useRef } from 'react'
import BuscadorFiltros from './BuscadorFiltros'
import ClienteItem, { Cliente } from './ClienteItem'

export default function ListadoClientes({ clientes, error }: { clientes: Cliente[], error?: string }) {
    const [editingId, setEditingId] = useState<string | null>(null)

    const [searchTerm, setSearchTerm] = useState('')
    const [filterType, setFilterType] = useState('')
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc')
    
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

    if (error) {
        return <div className="mb-4 text-xl font-semibold text-red-500 dark:text-red-400">Error de Supabase: {error}</div>
    }

    return (
        <section>
            <div className="space-y-4">
                <BuscadorFiltros 
                    searchTerm={searchTerm} 
                    setSearchTerm={setSearchTerm} 
                    filterType={filterType} 
                    setFilterType={setFilterType} 
                    sortOrder={sortOrder} 
                    setSortOrder={setSortOrder} 
                />

                {filteredAndSortedClientes?.map((cliente) => (
                    <ClienteItem 
                        key={cliente.id_cliente} 
                        cliente={cliente} 
                        isEditing={editingId === cliente.id_cliente} 
                        setEditingId={setEditingId} 
                    />
                ))}
            </div>
        </section>
    )
}