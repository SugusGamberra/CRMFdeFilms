'use client'

import { useState } from 'react'
import { crearCliente, actualizarCliente, borrarCliente, cerrarSesion } from './actions'

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
        <div className="mx-auto max-w-6xl p-8">
            {/* CABECERA */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Gestión de clientes</h1>
                <form action={cerrarSesion}>
                    <button type="submit" className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-300 transition-colors">
                        Cerrar Sesión
                    </button>
                </form>
            </div>

            {/* PESTAÑAS */}
            <div className="flex gap-6 border-b border-slate-200 mb-8">
                <button 
                    onClick={() => setActiveTab('lista')} 
                    className={`pb-3 px-2 text-sm font-medium transition-colors ${activeTab === 'lista' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Listado de Clientes
                </button>
                <button 
                    onClick={() => setActiveTab('nuevo')} 
                    className={`pb-3 px-2 text-sm font-medium transition-colors ${activeTab === 'nuevo' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    + Añadir Nuevo Cliente
                </button>
            </div>

            {/* PESTAÑA ALTA DE CLIENTE*/}
            {activeTab === 'nuevo' && (
                <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <form action={async (formData) => {
                        await crearCliente(formData)
                        setActiveTab('lista')
                    }} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/*DATOS PRINCIPALES */}
                        <div className="sm:col-span-2 md:col-span-3 border-b pb-2 mb-2">
                            <h3 className="text-sm font-bold text-indigo-600 uppercase">Datos Principales</h3>
                        </div>
                        
                        <div className="sm:col-span-2">
                            <label className="mb-1 block text-sm font-medium text-slate-600">Nombre Completo / Razón Social *</label>
                            <input type="text" name="nombreCompleto" required placeholder="Ej: EcoMagic" className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500" />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-600">CIF / NIF</label>
                            <input type="text" name="cifNif" placeholder="Ej: B12345678" className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500" />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-600">Tipo de Cliente</label>
                            <input type="text" name="tipoCliente" placeholder="Ej: Mayorista, Particular..." className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500" />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-600">Página Web</label>
                            <input type="text" name="web" placeholder="Ej: www.ecomagic.es" className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500" />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-600">Correo Electrónico (Empresa)</label>
                            <input type="email" name="email" placeholder="Ej: contacto@empresa.com" className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500" />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-600">Teléfono (Empresa)</label>
                            <input type="tel" name="telefono" placeholder="Ej: +34 612 345 678" className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500" />
                        </div>

                        {/*DATOS DE DIRECCIÓN */}
                        <div className="sm:col-span-2 md:col-span-3 border-b pb-2 mb-2 mt-4">
                            <h3 className="text-sm font-bold text-indigo-600 uppercase">Datos de Facturación y Envío</h3>
                        </div>

                        <div className="sm:col-span-2">
                            <label className="mb-1 block text-sm font-medium text-slate-600">Dirección de Facturación</label>
                            <input type="text" name="direccionFacturacion" placeholder="Ej: Calle Hécate, 1" className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500" />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="mb-1 block text-sm font-medium text-slate-600">Dirección de Envío</label>
                            <input type="text" name="direccionEnvio" placeholder="Si es distinta a la de facturación..." className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500" />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-600">Localidad</label>
                            <input type="text" name="localidad" placeholder="Ej: Puerto Real" className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500" />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-600">Provincia</label>
                            <input type="text" name="provincia" placeholder="Ej: Cádiz" className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500" />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-600">Código Postal</label>
                            <input type="text" name="codigoPostal" placeholder="Ej: 11111" className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500" />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-600">País</label>
                            <input type="text" name="pais" placeholder="Ej: España" className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500" />
                        </div>

                        {/*DATOS DE CONTACTO ESPECÍFICO */}
                        <div className="sm:col-span-2 md:col-span-3 border-b pb-2 mb-2 mt-4">
                            <h3 className="text-sm font-bold text-indigo-600 uppercase">Persona de Contacto</h3>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-600">Nombre de la persona</label>
                            <input type="text" name="personaContacto" placeholder="Ej: María García" className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500" />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-600">Teléfono directo</label>
                            <input type="tel" name="tfnoContacto" placeholder="Ej: +34 600 000 000" className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500" />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-600">Email directo</label>
                            <input type="email" name="emailContacto" placeholder="Ej: maria@empresa.com" className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500" />
                        </div>

                        {/*BOTÓN GUARDAR */}
                        <div className="sm:col-span-2 md:col-span-3 mt-4">
                            <button type="submit" className="w-full rounded-lg bg-indigo-600 py-3 font-medium text-white transition-colors hover:bg-indigo-700">
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
                        <div className="mb-4 text-xl font-semibold text-slate-700">Error de Supabase: {error}</div>
                    ) : (
                        <div className="space-y-4">
                            {clientes?.map((cliente) => (
                                <div key={cliente.id_cliente} className="rounded-lg border border-slate-300 p-4 bg-slate-50 flex flex-col gap-4">
                                    
                                    {editingId === cliente.id_cliente ? (
                                        /* MODO EDICIÓN */
                                        <form action={async (formData) => {
                                            await actualizarCliente(formData)
                                            setEditingId(null)
                                        }} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 w-full items-end">
                                            <input type="hidden" name="idCliente" value={cliente.id_cliente} />
                                            
                                            <input type="text" name="nombreCompleto" defaultValue={cliente.nombre_completo || ''} placeholder="Nombre *" required className="w-full rounded border border-slate-300 p-2 text-sm outline-none focus:border-indigo-500" />
                                            <input type="text" name="cifNif" defaultValue={cliente.cif_nif || ''} placeholder="CIF/NIF" className="w-full rounded border border-slate-300 p-2 text-sm outline-none focus:border-indigo-500" />
                                            <input type="text" name="tipoCliente" defaultValue={cliente.tipo_cliente || ''} placeholder="Tipo Cliente" className="w-full rounded border border-slate-300 p-2 text-sm outline-none focus:border-indigo-500" />
                                            <input type="text" name="telefono" defaultValue={cliente.telefono || ''} placeholder="Tlf Empresa" className="w-full rounded border border-slate-300 p-2 text-sm outline-none focus:border-indigo-500" />
                                            <input type="email" name="email" defaultValue={cliente.email || ''} placeholder="Email Empresa" className="w-full rounded border border-slate-300 p-2 text-sm outline-none focus:border-indigo-500" />
                                            <input type="text" name="web" defaultValue={cliente.web || ''} placeholder="Web" className="w-full rounded border border-slate-300 p-2 text-sm outline-none focus:border-indigo-500" />
                                            
                                            <input type="text" name="direccionFacturacion" defaultValue={cliente.direccion_facturacion || ''} placeholder="Dir. Facturación" className="w-full rounded border border-slate-300 p-2 text-sm outline-none focus:border-indigo-500" />
                                            <input type="text" name="direccionEnvio" defaultValue={cliente.direccion_envio || ''} placeholder="Dir. Envío" className="w-full rounded border border-slate-300 p-2 text-sm outline-none focus:border-indigo-500" />
                                            <input type="text" name="localidad" defaultValue={cliente.localidad || ''} placeholder="Localidad" className="w-full rounded border border-slate-300 p-2 text-sm outline-none focus:border-indigo-500" />
                                            <input type="text" name="provincia" defaultValue={cliente.provincia || ''} placeholder="Provincia" className="w-full rounded border border-slate-300 p-2 text-sm outline-none focus:border-indigo-500" />
                                            <input type="text" name="codigoPostal" defaultValue={cliente.codigo_postal || ''} placeholder="CP" className="w-full rounded border border-slate-300 p-2 text-sm outline-none focus:border-indigo-500" />
                                            <input type="text" name="pais" defaultValue={cliente.pais || ''} placeholder="País" className="w-full rounded border border-slate-300 p-2 text-sm outline-none focus:border-indigo-500" />

                                            <input type="text" name="personaContacto" defaultValue={cliente.persona_contacto || ''} placeholder="Contacto (Nombre)" className="w-full rounded border border-slate-300 p-2 text-sm outline-none focus:border-indigo-500" />
                                            <input type="tel" name="tfnoContacto" defaultValue={cliente.tfno_contacto || ''} placeholder="Tlf Contacto" className="w-full rounded border border-slate-300 p-2 text-sm outline-none focus:border-indigo-500" />
                                            <input type="email" name="emailContacto" defaultValue={cliente.email_contacto || ''} placeholder="Email Contacto" className="w-full rounded border border-slate-300 p-2 text-sm outline-none focus:border-indigo-500" />
                                            
                                            <div className="flex gap-2">
                                                <button type="button" onClick={() => setEditingId(null)} className="w-full rounded bg-slate-300 px-2 py-2 text-sm font-bold text-slate-700 hover:bg-slate-400 transition-colors">
                                                    Cancelar
                                                </button>
                                                <button type="submit" className="w-full rounded bg-indigo-600 px-2 py-2 text-sm font-bold text-white hover:bg-indigo-700 transition-colors">
                                                    Actualizar
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        /* MODO LECTURA */
                                        <div>
                                            <div className="flex justify-between items-start border-b border-slate-200 pb-3 mb-3">
                                                <div>
                                                    <h3 className="text-xl font-bold text-slate-800">{cliente.nombre_completo}</h3>
                                                    <p className="text-sm text-slate-500">{cliente.tipo_cliente || 'Sin tipo definido'} • {cliente.cif_nif || 'Sin CIF/NIF'}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => setEditingId(cliente.id_cliente)} className="rounded bg-indigo-100 px-3 py-1 text-sm font-bold text-indigo-700 hover:bg-indigo-200 transition-colors">
                                                        Editar
                                                    </button>
                                                    <form action={borrarCliente}>
                                                        <input type="hidden" name="idCliente" value={cliente.id_cliente} />
                                                        <button type="submit" className="rounded bg-red-100 px-3 py-1 text-sm font-bold text-red-700 hover:bg-red-200 transition-colors">
                                                            Eliminar
                                                        </button>
                                                    </form>
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <p className="font-semibold text-slate-700 mb-1">Contacto Empresa</p>
                                                    <p>Email: {cliente.email || '-'}</p>
                                                    <p>Tel: {cliente.telefono || '-'}</p>
                                                    <p>Web: {cliente.web || '-'}</p>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-700 mb-1">Dirección Principal</p>
                                                    <p>{cliente.direccion_facturacion || '-'}</p>
                                                    <p>{cliente.localidad || '-'}, {cliente.provincia || '-'}</p>
                                                    <p>{cliente.codigo_postal || '-'} {cliente.pais || '-'}</p>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-700 mb-1">Persona de Contacto</p>
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
    )
}