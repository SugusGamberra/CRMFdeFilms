'use client'

import { useState } from 'react'
import { crearCliente, actualizarCliente, borrarCliente } from './actions'
import OceanBackground from '@/components/OceanBackground'
import UserMenu from '@/components/UserMenu'

// MOLDE DE TS
interface Cliente {
    id_cliente: string
    nombre_completo: string
    cif_nif?: string
    tipo_cliente?: string
    web?: string
    email?: string
    telefono?: string
    direccion_facturacion?: string
    direccion_envio?: string
    localidad?: string
    provincia?: string
    codigo_postal?: string
    pais?: string
    persona_contacto?: string
    tfno_contacto?: string
    email_contacto?: string
}

export default function DashboardClient({ clientes, error }: { clientes: Cliente[], error?: string }) {
    const [activeTab, setActiveTab] = useState('lista')
    const [editingId, setEditingId] = useState<string | null>(null)

    return (
        <div className="relative min-h-screen w-full p-4 pt-20 md:p-8 md:pt-24">
            <OceanBackground blur={true} />
            
            <div className="relative z-10 mx-auto w-full max-w-6xl rounded-3xl p-6 md:p-10 neu-raised bg-white/80 dark:bg-slate-900/70 backdrop-blur-md border border-gray-200 dark:border-white/10 shadow-2xl">
                
                {/* CABECERA */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Gestión de clientes</h1>
                    {/* MENU MODULAR */}
                    <UserMenu />
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

                {/* PESTAÑA ALTA DE CLIENTE*/}
                {activeTab === 'nuevo' && (
                    <section className="mb-10 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-black/20 p-6 shadow-inner">
                        <form action={async (formData) => {
                            await crearCliente(formData)
                            setActiveTab('lista')
                        }} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            
                            {/*DATOS PRINCIPALES */}
                            <div className="sm:col-span-2 border-b border-gray-200 dark:border-white/10 pb-2 mb-2">
                                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-800 dark:text-white">Datos Principales</h3>
                            </div>
                            
                            <div className="sm:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Nombre Completo / Razón Social *</label>
                                <input type="text" name="nombreCompleto" required placeholder="Ej: EcoMagic" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">CIF / NIF</label>
                                <input type="text" name="cifNif" placeholder="Ej: B12345678" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Tipo de Cliente</label>
                                <input type="text" name="tipoCliente" placeholder="Ej: Mayorista, Particular..." className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Página Web</label>
                                <input type="text" name="web" placeholder="Ej: www.ecomagic.es" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Correo Electrónico (Empresa)</label>
                                <input type="email" name="email" placeholder="Ej: contacto@empresa.com" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Teléfono (Empresa)</label>
                                <input type="tel" name="telefono" placeholder="Ej: +34 612 345 678" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                            </div>

                            {/*DATOS DE DIRECCIÓN */}
                            <div className="sm:col-span-2 border-b border-gray-200 dark:border-white/10 pb-2 mb-2 mt-4">
                                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-800 dark:text-white">Datos de Facturación y Envío</h3>
                            </div>

                            <div className="sm:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Dirección de Facturación</label>
                                <input type="text" name="direccionFacturacion" placeholder="Ej: Calle Hécate, 1" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Dirección de Envío</label>
                                <input type="text" name="direccionEnvio" placeholder="Si es distinta a la de facturación..." className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Localidad</label>
                                <input type="text" name="localidad" placeholder="Ej: Puerto Real" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Provincia</label>
                                <input type="text" name="provincia" placeholder="Ej: Cádiz" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Código Postal</label>
                                <input type="text" name="codigoPostal" placeholder="Ej: 11111" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">País</label>
                                <input type="text" name="pais" placeholder="Ej: España" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                            </div>

                            {/*DATOS DE CONTACTO ESPECÍFICO */}
                            <div className="sm:col-span-2 border-b border-gray-200 dark:border-white/10 pb-2 mb-2 mt-4">
                                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-800 dark:text-white">Persona de Contacto</h3>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Nombre de la persona</label>
                                <input type="text" name="personaContacto" placeholder="Ej: María García" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Teléfono directo</label>
                                <input type="tel" name="tfnoContacto" placeholder="Ej: +34 600 000 000" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Email directo</label>
                                <input type="email" name="emailContacto" placeholder="Ej: maria@empresa.com" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                            </div>

                            {/*BOTÓN GUARDAR */}
                            <div className="sm:col-span-2 mt-4">
                                <button type="submit" className="neu-btn neu-focus cursor-pointer w-full rounded-xl py-3 font-medium text-white shadow-lg transition-colors duration-1000 border border-transparent dark:border-white/10" style={{ backgroundColor: 'var(--dynamic-accent)' }}>
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </section>
                )}

                {/* PESTAÑA LISTADO DE CLIENTES */}
                {activeTab === 'lista' && (
                    <section>
                        {error ? (
                            <div className="mb-4 text-xl font-semibold text-red-500 dark:text-red-400">Error de Supabase: {error}</div>
                        ) : (
                            <div className="space-y-4">
                                {clientes?.map((cliente) => (
                                    <div key={cliente.id_cliente} className="rounded-2xl border border-gray-200 dark:border-white/10 p-5 neu-flat bg-gray-50/50 dark:bg-black/20 flex flex-col gap-4 transition-all">
                                        
                                        {editingId === cliente.id_cliente ? (
                                            /* MODO EDICIÓN */
                                            <form action={async (formData) => {
                                                await actualizarCliente(formData)
                                                setEditingId(null)
                                            }} className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
                                                <input type="hidden" name="idCliente" value={cliente.id_cliente} />
                                                
                                                {/*DATOS PRINCIPALES */}
                                                <div className="sm:col-span-2 border-b border-gray-200 dark:border-white/10 pb-2 mb-2">
                                                    <h3 className="text-sm font-bold uppercase tracking-wide text-gray-800 dark:text-white">Datos Principales</h3>
                                                </div>
                                                
                                                <div className="sm:col-span-2">
                                                    <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Nombre Completo / Razón Social *</label>
                                                    <input type="text" name="nombreCompleto" defaultValue={cliente.nombre_completo || ''} required placeholder="Ej: EcoMagic" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                                                </div>
                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">CIF / NIF</label>
                                                    <input type="text" name="cifNif" defaultValue={cliente.cif_nif || ''} placeholder="Ej: B12345678" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                                                </div>
                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Tipo de Cliente</label>
                                                    <input type="text" name="tipoCliente" defaultValue={cliente.tipo_cliente || ''} placeholder="Ej: Mayorista, Particular..." className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                                                </div>
                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Página Web</label>
                                                    <input type="text" name="web" defaultValue={cliente.web || ''} placeholder="Ej: www.ecomagic.es" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                                                </div>
                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Correo Electrónico (Empresa)</label>
                                                    <input type="email" name="email" defaultValue={cliente.email || ''} placeholder="Ej: contacto@empresa.com" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                                                </div>
                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Teléfono (Empresa)</label>
                                                    <input type="tel" name="telefono" defaultValue={cliente.telefono || ''} placeholder="Ej: +34 612 345 678" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                                                </div>

                                                {/*DATOS DE DIRECCIÓN */}
                                                <div className="sm:col-span-2 border-b border-gray-200 dark:border-white/10 pb-2 mb-2 mt-4">
                                                    <h3 className="text-sm font-bold uppercase tracking-wide text-gray-800 dark:text-white">Datos de Facturación y Envío</h3>
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Dirección de Facturación</label>
                                                    <input type="text" name="direccionFacturacion" defaultValue={cliente.direccion_facturacion || ''} placeholder="Ej: Calle Hécate, 1" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Dirección de Envío</label>
                                                    <input type="text" name="direccionEnvio" defaultValue={cliente.direccion_envio || ''} placeholder="Si es distinta a la de facturación..." className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                                                </div>
                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Localidad</label>
                                                    <input type="text" name="localidad" defaultValue={cliente.localidad || ''} placeholder="Ej: Puerto Real" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                                                </div>
                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Provincia</label>
                                                    <input type="text" name="provincia" defaultValue={cliente.provincia || ''} placeholder="Ej: Cádiz" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                                                </div>
                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Código Postal</label>
                                                    <input type="text" name="codigoPostal" defaultValue={cliente.codigo_postal || ''} placeholder="Ej: 11111" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                                                </div>
                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">País</label>
                                                    <input type="text" name="pais" defaultValue={cliente.pais || ''} placeholder="Ej: España" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                                                </div>

                                                {/*DATOS DE CONTACTO ESPECÍFICO */}
                                                <div className="sm:col-span-2 border-b border-gray-200 dark:border-white/10 pb-2 mb-2 mt-4">
                                                    <h3 className="text-sm font-bold uppercase tracking-wide text-gray-800 dark:text-white">Persona de Contacto</h3>
                                                </div>
                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Nombre de la persona</label>
                                                    <input type="text" name="personaContacto" defaultValue={cliente.persona_contacto || ''} placeholder="Ej: María García" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                                                </div>
                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Teléfono directo</label>
                                                    <input type="tel" name="tfnoContacto" defaultValue={cliente.tfno_contacto || ''} placeholder="Ej: +34 600 000 000" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                                                </div>
                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Email directo</label>
                                                    <input type="email" name="emailContacto" defaultValue={cliente.email_contacto || ''} placeholder="Ej: maria@empresa.com" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                                                </div>
                                                
                                                {/* BOTONES DE EDICIÓN */}
                                                <div className="sm:col-span-2 flex gap-4 mt-4">
                                                    <button type="button" onClick={() => setEditingId(null)} className="neu-btn neu-focus cursor-pointer w-full rounded-xl bg-gray-200 dark:bg-white/10 py-3 font-medium text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-white/20 transition-colors border border-gray-300 dark:border-white/5">
                                                        Cancelar
                                                    </button>
                                                    <button type="submit" className="neu-btn neu-focus cursor-pointer w-full rounded-xl py-3 font-medium text-white shadow-lg transition-colors duration-1000 border border-transparent dark:border-white/10" style={{ backgroundColor: 'var(--dynamic-accent)' }}>
                                                        Actualizar
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            /* MODO LECTURA */
                                            <div>
                                                <div className="flex justify-between items-start border-b border-gray-200 dark:border-white/10 pb-4 mb-4">
                                                    <div>
                                                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">{cliente.nombre_completo}</h3>
                                                        <p className="text-sm text-gray-500 dark:text-white/60">{cliente.tipo_cliente || 'Sin tipo definido'} • {cliente.cif_nif || 'Sin CIF/NIF'}</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => setEditingId(cliente.id_cliente)} className="neu-btn neu-focus cursor-pointer rounded-lg px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors duration-1000 border border-transparent dark:border-white/10" style={{ backgroundColor: 'var(--dynamic-accent)' }}>
                                                            Editar
                                                        </button>
                                                        <form action={borrarCliente}>
                                                            <input type="hidden" name="idCliente" value={cliente.id_cliente} />
                                                            <button type="submit" className="neu-btn neu-focus cursor-pointer rounded-lg bg-red-100 dark:bg-red-500/20 px-4 py-2 text-sm font-bold text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-500/40 transition-colors border border-red-200 dark:border-red-500/30">
                                                                Eliminar
                                                            </button>
                                                        </form>
                                                    </div>
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-white/80">
                                                    <div>
                                                        <p className="font-bold mb-1 uppercase tracking-wide text-xs text-gray-800 dark:text-white">Contacto Empresa</p>
                                                        <p>Email: {cliente.email || '-'}</p>
                                                        <p>Tel: {cliente.telefono || '-'}</p>
                                                        <p>Web: {cliente.web || '-'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-bold mb-1 uppercase tracking-wide text-xs text-gray-800 dark:text-white">Dirección Principal</p>
                                                        <p>{cliente.direccion_facturacion || '-'}</p>
                                                        <p>{cliente.localidad || '-'}, {cliente.provincia || '-'}</p>
                                                        <p>{cliente.codigo_postal || '-'} {cliente.pais || '-'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-bold mb-1 uppercase tracking-wide text-xs text-gray-800 dark:text-white">Persona de Contacto</p>
                                                        <p>Nombre: {cliente.persona_contacto || '-'}</p>
                                                        <p>Tel: {cliente.tfno_contacto || '-'}</p>
                                                        <p>Email: {cliente.email_contacto || '-'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}
            </div>
        </div>
    )
}