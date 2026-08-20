'use client'
import { useState, useEffect } from 'react'
import OceanBackground from '@/components/OceanBackground'
import UserMenu from '@/components/UserMenu'
import FormularioCrear from '@/components/clientes/FormularioCrear'
import ListadoClientes from '@/components/clientes/ListadoClientes'
import ImportModal from '@/components/clientes/ImportModal'
import ExportModal from '@/components/clientes/ExportModal'
import { Cliente } from '@/components/clientes/ClienteItem'
import toast from 'react-hot-toast'
import PanelAdmin from '@/components/admin/PanelAdmin'

export default function DashboardClient({ clientes, error, isAdmin }: { clientes: Cliente[], error?: string, isAdmin?: boolean }) {
    const [activeTab, setActiveTab] = useState('lista')
    const [isImportOpen, setIsImportOpen] = useState(false)
    const [exportMode, setExportMode] = useState<'full' | 'custom' | null>(null)

    useEffect(() => {
        if (error) {
            toast.error(`Error al cargar datos: ${error}`)
        }
    }, [error])

    return (
        <div className="relative min-h-screen w-full p-4 pt-20 md:p-8 md:pt-24">
            <OceanBackground blur={true} />
            
            <div className="relative z-10 mx-auto w-full max-w-6xl rounded-3xl p-6 md:p-10 neu-raised bg-white/80 dark:bg-slate-900/70 backdrop-blur-md border border-gray-200 dark:border-white/10 shadow-2xl">
                
                {/* CABECERA */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Gestión de clientes</h1>
                    <UserMenu 
                        onOpenImport={() => setIsImportOpen(true)}
                        onOpenExportTemplate={() => {
                            setExportMode('full')
                        }}
                        onOpenExportList={() => {
                            setExportMode('custom')
                        }}
                    />
                </div>

                {/* PESTAÑAS */}
                <div className="flex gap-6 border-b border-gray-200 dark:border-white/10 mb-8 overflow-x-auto custom-scrollbar">
                    <button 
                        onClick={() => setActiveTab('lista')} 
                        className={`pb-3 px-2 text-sm font-bold transition-colors cursor-pointer outline-none focus:outline-none whitespace-nowrap ${activeTab === 'lista' ? 'border-b-2 text-gray-800 dark:text-white' : 'text-gray-500 dark:text-white/60 hover:text-gray-800 dark:hover:text-white'}`}
                        style={activeTab === 'lista' ? { borderBottomColor: 'var(--dynamic-accent)' } : {}}
                    >
                        Listado de Clientes
                    </button>
                    <button 
                        onClick={() => setActiveTab('nuevo')} 
                        className={`pb-3 px-2 text-sm font-bold transition-colors cursor-pointer outline-none focus:outline-none whitespace-nowrap ${activeTab === 'nuevo' ? 'border-b-2 text-gray-800 dark:text-white' : 'text-gray-500 dark:text-white/60 hover:text-gray-800 dark:hover:text-white'}`}
                        style={activeTab === 'nuevo' ? { borderBottomColor: 'var(--dynamic-accent)' } : {}}
                    >
                        + Añadir Nuevo Cliente
                    </button>
                    {isAdmin && (
                        <button 
                            onClick={() => setActiveTab('admin')} 
                            className={`pb-3 px-2 text-sm font-bold transition-colors cursor-pointer outline-none focus:outline-none whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'admin' ? 'border-b-2 text-gray-800 dark:text-white' : 'text-gray-500 dark:text-white/60 hover:text-gray-800 dark:hover:text-white'}`}
                            style={activeTab === 'admin' ? { borderBottomColor: 'var(--dynamic-accent)' } : {}}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/>
                            </svg>
                            Panel de Administración
                        </button>
                    )}
                </div>

                {/* PESTAÑA ALTA DE CLIENTE */}
                {activeTab === 'nuevo' && (
                    <FormularioCrear onSuccess={() => {
                        setActiveTab('lista')
                        toast.success('Cliente guardado correctamente')
                    }} />
                )}

                {/* PESTAÑA LISTADO DE CLIENTES */}
                {activeTab === 'lista' && (
                    <ListadoClientes clientes={clientes} error={error} />
                )}

                {/* PESTAÑA ADMINS */}
                {activeTab === 'admin' && isAdmin && (
                    <PanelAdmin />
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