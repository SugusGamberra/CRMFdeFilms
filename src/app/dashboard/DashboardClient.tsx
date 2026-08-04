'use client'

import { useState } from 'react'
import OceanBackground from '@/components/OceanBackground'
import UserMenu from '@/components/UserMenu'
import FormularioCrear from '@/components/clientes/FormularioCrear'
import ListadoClientes from '@/components/clientes/ListadoClientes'
import ImportModal from '@/components/clientes/ImportModal'
import ExportModal from '@/components/clientes/ExportModal'
import { Cliente } from '@/components/clientes/ClienteItem'

export default function DashboardClient({ clientes, error }: { clientes: Cliente[], error?: string }) {
    const [activeTab, setActiveTab] = useState('lista')
    const [isImportOpen, setIsImportOpen] = useState(false)
    
    // modalMode controla si exportamos todo (plantilla) o el listado a medida
    const [exportMode, setExportMode] = useState<'full' | 'custom' | null>(null)

    return (
        <div className="relative min-h-screen w-full p-4 pt-20 md:p-8 md:pt-24">
            <OceanBackground blur={true} />
            
            <div className="relative z-10 mx-auto w-full max-w-6xl rounded-3xl p-6 md:p-10 neu-raised bg-white/80 dark:bg-slate-900/70 backdrop-blur-md border border-gray-200 dark:border-white/10 shadow-2xl">
                
                {/* CABECERA */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Gestión de clientes</h1>
                    <UserMenu 
                        onOpenImport={() => setIsImportOpen(true)}
                        onOpenExportTemplate={() => setExportMode('full')}
                        onOpenExportList={() => setExportMode('custom')}
                    />
                </div>

                {/* PESTAÑAS */}
                <div className="flex gap-6 border-b border-gray-200 dark:border-white/10 mb-8">
                    <button 
                        onClick={() => setActiveTab('lista')} 
                        className={`pb-3 px-2 text-sm font-bold transition-colors cursor-pointer outline-none focus:outline-none ${activeTab === 'lista' ? 'border-b-2 text-gray-800 dark:text-white' : 'text-gray-500 dark:text-white/60 hover:text-gray-800 dark:hover:text-white'}`}
                        style={activeTab === 'lista' ? { borderBottomColor: 'var(--dynamic-accent)' } : {}}
                    >
                        Listado de Clientes
                    </button>
                    <button 
                        onClick={() => setActiveTab('nuevo')} 
                        className={`pb-3 px-2 text-sm font-bold transition-colors cursor-pointer outline-none focus:outline-none ${activeTab === 'nuevo' ? 'border-b-2 text-gray-800 dark:text-white' : 'text-gray-500 dark:text-white/60 hover:text-gray-800 dark:hover:text-white'}`}
                        style={activeTab === 'nuevo' ? { borderBottomColor: 'var(--dynamic-accent)' } : {}}
                    >
                        + Añadir Nuevo Cliente
                    </button>
                </div>

                {/* PESTAÑA ALTA DE CLIENTE */}
                {activeTab === 'nuevo' && (
                    <FormularioCrear onSuccess={() => setActiveTab('lista')} />
                )}

                {/* PESTAÑA LISTADO DE CLIENTES */}
                {activeTab === 'lista' && (
                    <ListadoClientes clientes={clientes} error={error} />
                )}
            </div>

            {/* MODALES SUPERPUESTOS */}
            {isImportOpen && (
                <ImportModal clientes={clientes} onClose={() => setIsImportOpen(false)} />
            )}
            
            {exportMode && (
                <ExportModal clientes={clientes} mode={exportMode} onClose={() => setExportMode(null)} />
            )}
        </div>
    )
}