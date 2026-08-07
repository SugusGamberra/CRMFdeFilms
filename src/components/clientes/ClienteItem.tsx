'use client'

import { useState } from 'react'
import { actualizarCliente, borrarCliente } from '@/app/dashboard/actions'
import toast from 'react-hot-toast'

export interface Cliente {
    id_cliente: string
    nombre_completo: string
    cif_nif?: string
    tipo_cliente?: string
    subtipo_empresa?: string
    tipo_otro?: string
    web?: string
    email?: string
    telefono?: string
    direccion_facturacion?: string
    direccion_envio?: string
    codigo_postal_envio?: string
    localidad_envio?: string
    provincia_envio?: string
    pais_envio?: string
    localidad?: string
    provincia?: string
    codigo_postal?: string
    pais?: string
    persona_contacto?: string
    tfno_contacto?: string
    email_contacto?: string
    notas?: string
    created_at?: string
}

interface ClienteItemProps {
    cliente: Cliente
    isEditing: boolean
    setEditingId: (id: string | null) => void
}

export default function ClienteItem({ cliente, isEditing, setEditingId }: ClienteItemProps) {
    const [mostrarEnvioEdit, setMostrarEnvioEdit] = useState(!!cliente.direccion_envio)
    const [tipoClienteEdit, setTipoClienteEdit] = useState(cliente.tipo_cliente || '')
    const [isExpanded, setIsExpanded] = useState(false) // comentar - descomentar para versión Acordeón
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    return (
        <div className="rounded-2xl border border-gray-200 dark:border-white/10 p-5 neu-flat bg-gray-50/50 dark:bg-black/20 flex flex-col gap-4 transition-all">
            {isEditing ? (
                <div className="flex flex-col">
                    <form onSubmit={async (e) => {
                        e.preventDefault()
                        const formData = new FormData(e.currentTarget)
                        
                        setIsSaving(true)
                        const result = await actualizarCliente(formData)
                        setIsSaving(false)
                        
                        if (result?.error) {
                            toast.error(result.error)
                        } else {
                            toast.success('Cliente actualizado correctamente')
                            setEditingId(null)
                            setMostrarEnvioEdit(false)
                            setIsConfirmingDelete(false)
                        }
                    }} className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
                        <input type="hidden" name="idCliente" value={cliente.id_cliente} />
                        
                        {/* DATOS PRINCIPALES */}
                        <div className="sm:col-span-2 border-b border-gray-200 dark:border-white/10 pb-2 mb-2">
                            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-800 dark:text-white">Datos Principales</h3>
                        </div>
                        
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Nombre Completo / Razón Social *</label>
                            <input type="text" name="nombreCompleto" defaultValue={cliente.nombre_completo || ''} required placeholder="Ej: EcoMagic" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">CIF / NIF</label>
                            <input type="text" name="cifNif" defaultValue={cliente.cif_nif || ''} placeholder="Ej: B12345678" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                        </div>
                        
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Tipo de Cliente</label>
                            <select 
                                name="tipoCliente" 
                                value={tipoClienteEdit}
                                onChange={(e) => setTipoClienteEdit(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5 cursor-pointer"
                            >
                                <option value="" className="bg-white dark:bg-slate-800 text-gray-800 dark:text-white">Selecciona un tipo...</option>
                                <option value="Particular" className="bg-white dark:bg-slate-800 text-gray-800 dark:text-white">Particular</option>
                                <option value="Empresa" className="bg-white dark:bg-slate-800 text-gray-800 dark:text-white">Empresa</option>
                                <option value="Organismo público" className="bg-white dark:bg-slate-800 text-gray-800 dark:text-white">Organismo público</option>
                                <option value="Otro" className="bg-white dark:bg-slate-800 text-gray-800 dark:text-white">Otro</option>
                            </select>
                        </div>

                        <div>
                            {tipoClienteEdit === 'Empresa' && (
                                <>
                                    <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Subtipo de Empresa</label>
                                    <select 
                                        name="subtipoEmpresa" 
                                        defaultValue={cliente.subtipo_empresa || ''}
                                        className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5 cursor-pointer animate-in fade-in zoom-in-95"
                                    >
                                        <option value="" className="bg-white dark:bg-slate-800 text-gray-800 dark:text-white">Selecciona el subtipo...</option>
                                        <option value="Distribuidor" className="bg-white dark:bg-slate-800 text-gray-800 dark:text-white">Distribuidor</option>
                                        <option value="Proveedor" className="bg-white dark:bg-slate-800 text-gray-800 dark:text-white">Proveedor</option>
                                        <option value="Mayorista" className="bg-white dark:bg-slate-800 text-gray-800 dark:text-white">Mayorista</option>
                                        <option value="Minorista" className="bg-white dark:bg-slate-800 text-gray-800 dark:text-white">Minorista</option>
                                        <option value="Cliente final" className="bg-white dark:bg-slate-800 text-gray-800 dark:text-white">Cliente final</option>
                                    </select>
                                </>
                            )}
                            {tipoClienteEdit === 'Otro' && (
                                <>
                                    <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Especificar tipo</label>
                                    <input 
                                        type="text" 
                                        name="tipoOtro" 
                                        defaultValue={cliente.tipo_otro || ''}
                                        placeholder="Especifica el tipo..." 
                                        className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5 animate-in fade-in zoom-in-95" 
                                    />
                                </>
                            )}
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

                        {/* DATOS DE DIRECCIÓN (FACTURACIÓN) */}
                        <div className="sm:col-span-2 border-b border-gray-200 dark:border-white/10 pb-2 mb-2 mt-4">
                            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-800 dark:text-white">Datos de Facturación</h3>
                        </div>

                        <div className="sm:col-span-2">
                            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Dirección de Facturación</label>
                            <input type="text" name="direccionFacturacion" defaultValue={cliente.direccion_facturacion || ''} placeholder="Ej: Calle Hécate, 1" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Código Postal</label>
                            <input 
                                type="text" 
                                name="codigoPostal" 
                                defaultValue={cliente.codigo_postal || ''} 
                                placeholder="Ej: 11111" 
                                inputMode="numeric"
                                maxLength={5}
                                onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '') }}
                                className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" 
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Localidad (Ciudad)</label>
                            <input type="text" name="localidad" defaultValue={cliente.localidad || ''} placeholder="Ej: Puerto Real" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Provincia</label>
                            <input type="text" name="provincia" defaultValue={cliente.provincia || ''} placeholder="Ej: Cádiz" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">País</label>
                            <input type="text" name="pais" defaultValue={cliente.pais || ''} placeholder="Ej: España" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                        </div>

                        {/* TOGGLE: DIRECCIÓN DE ENVÍO */}
                        <div className="sm:col-span-2 mt-2">
                            <div 
                                onClick={() => setMostrarEnvioEdit(!mostrarEnvioEdit)}
                                className="flex items-center justify-between p-4 rounded-xl neu-inset bg-gray-100/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 cursor-pointer hover:bg-gray-200/50 dark:hover:bg-white/10 transition-colors"
                            >
                                <span className="text-sm font-bold text-gray-700 dark:text-white/90">Envío a una dirección diferente</span>
                                <svg 
                                    className={`w-5 h-5 text-gray-500 dark:text-white/60 transition-transform duration-300 ease-in-out ${mostrarEnvioEdit ? 'rotate-180' : 'rotate-0'}`} 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {/* CAMPOS DIRECCIÓN DE ENVÍO */}
                        {mostrarEnvioEdit && (
                            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 mt-2 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-black/20 animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="sm:col-span-2">
                                    <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Dirección de Envío</label>
                                    <input type="text" name="direccionEnvio" defaultValue={cliente.direccion_envio || ''} placeholder="Ej: Calle Artemisa, 2" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Código Postal (Envío)</label>
                                    <input 
                                        type="text" 
                                        name="codigoPostalEnvio" 
                                        defaultValue={cliente.codigo_postal_envio || ''} 
                                        placeholder="Ej: 11111" 
                                        inputMode="numeric"
                                        maxLength={5}
                                        onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '') }}
                                        className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" 
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Localidad (Envío)</label>
                                    <input type="text" name="localidadEnvio" defaultValue={cliente.localidad_envio || ''} placeholder="Ej: Puerto Real" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Provincia (Envío)</label>
                                    <input type="text" name="provinciaEnvio" defaultValue={cliente.provincia_envio || ''} placeholder="Ej: Cádiz" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">País (Envío)</label>
                                    <input type="text" name="paisEnvio" defaultValue={cliente.pais_envio || ''} placeholder="Ej: España" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                                </div>
                            </div>
                        )}

                        {/* DATOS DE CONTACTO ESPECÍFICO */}
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

                        {/* NOTAS ADICIONALES */}
                        <div className="sm:col-span-2 border-b border-gray-200 dark:border-white/10 pb-2 mb-2 mt-4">
                            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-800 dark:text-white">Notas Adicionales</h3>
                        </div>

                        <div className="sm:col-span-2">
                            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Observaciones (Recargo de equivalencia, exento de IVA, etc.)</label>
                            <textarea name="notas" defaultValue={cliente.notas || ''} rows={3} placeholder="Añade aquí cualquier nota importante sobre este cliente..." className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5"></textarea>
                        </div>

                        {/* BOTONES DE EDICIÓN Y ELIMINAR */}
                        {!isConfirmingDelete && (
                            <div className="sm:col-span-2 flex flex-col sm:flex-row gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-white/10 items-center justify-between">
                                <button type="button" onClick={() => setIsConfirmingDelete(true)} className="neu-btn neu-btn-danger neu-focus w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer border border-transparent">
                                    Eliminar
                                </button>
                                <div className="flex gap-4 w-full sm:w-auto flex-1 sm:justify-end">
                                    <button type="button" onClick={() => {
                                        setEditingId(null)
                                        setMostrarEnvioEdit(false)
                                        setTipoClienteEdit('')
                                        setIsConfirmingDelete(false)
                                    }} className="neu-btn neu-btn-default neu-focus w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer border border-transparent">
                                        Cancelar
                                    </button>
                                    <button type="submit" disabled={isSaving} className="neu-btn neu-btn-dynamic neu-focus w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer border border-transparent">
                                        {isSaving && (
                                            <span aria-hidden="true">
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            </span>
                                        )}
                                        <span>{isSaving ? 'Guardando...' : 'Guardar'}</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>

                    {/* CONFIRMACIÓN DE ELIMINACIÓN */}
                    {isConfirmingDelete && (
                        <form onSubmit={async (e) => {
                            e.preventDefault()
                            const formData = new FormData(e.currentTarget)
                            
                            setIsDeleting(true)
                            const result = await borrarCliente(formData)
                            
                            if (result?.error) {
                                toast.error(result.error)
                                setIsDeleting(false)
                            } else {
                                toast.success('Cliente eliminado correctamente')
                                
                            }
                        }} className="mt-4 p-5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 flex flex-col items-center justify-center gap-4 animate-in fade-in zoom-in-95">
                            
                            <input type="hidden" name="idCliente" value={cliente.id_cliente} />
                            <p className="text-sm font-bold text-red-800 dark:text-red-200 text-center">
                                ¿Estás seguro que deseas eliminar a {cliente.nombre_completo}?<br/>Esta acción es irreversible.
                            </p>
                            <div className="flex gap-3 w-full sm:w-auto">
                                <button type="button" onClick={() => setIsConfirmingDelete(false)} className="neu-btn neu-btn-default neu-focus px-6 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 cursor-pointer border border-transparent">
                                    No, cancelar
                                </button>
                                <button type="submit" disabled={isDeleting} className="neu-btn neu-btn-danger neu-focus px-6 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 cursor-pointer border border-transparent">
                                    {isDeleting && (
                                        <span aria-hidden="true">
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        </span>
                                    )}
                                    <span>{isDeleting ? 'Eliminando...' : 'Sí, eliminar'}</span>
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            ) : (
                /* VISTA NORMAL (SIN ACORDEÓN, TODO VISIBLE)
                comentar - descomentar para version antigua */
                
                /*
                <div>
                    <div className="flex justify-between items-start border-b border-gray-200 dark:border-white/10 pb-4 mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{cliente.nombre_completo}</h3>
                            <p className="text-sm text-gray-500 dark:text-white/60">
                                {cliente.tipo_cliente === 'Empresa' && cliente.subtipo_empresa ? `Empresa - ${cliente.subtipo_empresa}` :
                                cliente.tipo_cliente === 'Otro' && cliente.tipo_otro ? `Otro: ${cliente.tipo_otro}` :
                                cliente.tipo_cliente || 'Sin tipo definido'} | {cliente.cif_nif || 'Sin CIF/NIF'}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => {
                                setEditingId(cliente.id_cliente)
                            }} className="neu-btn neu-focus cursor-pointer rounded-lg px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors duration-1000 border border-transparent dark:border-white/10" style={{ backgroundColor: 'var(--dynamic-accent)' }}>
                                Editar
                            </button>
                        </div>
                    </div>
                    
                    <div className={`grid grid-cols-1 ${cliente.direccion_envio ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'} gap-4 text-sm text-gray-600 dark:text-white/80`}>
                        <div>
                            <p className="font-bold mb-1 uppercase tracking-wide text-xs text-gray-800 dark:text-white">Contacto Empresa</p>
                            <p>Email: {cliente.email || '-'}</p>
                            <p>Tel: {cliente.telefono || '-'}</p>
                            <p>Web: {cliente.web || '-'}</p>
                        </div>
                        
                        {cliente.direccion_envio && (
                            <div>
                                <p className="font-bold mb-1 uppercase tracking-wide text-xs text-gray-800 dark:text-white">Dirección de Envío</p>
                                <p>{cliente.direccion_envio}</p>
                                <p>{cliente.localidad_envio || '-'}, {cliente.provincia_envio || '-'}</p>
                                <p>{cliente.codigo_postal_envio || '-'} {cliente.pais_envio || '-'}</p>
                            </div>
                        )}

                        <div>
                            <p className="font-bold mb-1 uppercase tracking-wide text-xs text-gray-800 dark:text-white">Dirección de Facturación</p>
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

                    {cliente.notas && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
                            <p className="font-bold mb-1 uppercase tracking-wide text-xs text-gray-800 dark:text-white">Notas / Observaciones</p>
                            <p className="text-sm text-gray-600 dark:text-white/80 whitespace-pre-wrap">{cliente.notas}</p>
                        </div>
                    )}
                </div>
                */

                /* VISTA ACORDEÓN CON BOTÓN VER
                comentar descomentar segun la opcion que elija
                */
                <div>
                    <div className={`flex justify-between items-start ${isExpanded ? 'border-b border-gray-200 dark:border-white/10 pb-4 mb-4' : ''} transition-all duration-300`}>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{cliente.nombre_completo}</h3>
                            <p className="text-sm text-gray-500 dark:text-white/60">
                                {cliente.tipo_cliente === 'Empresa' && cliente.subtipo_empresa ? `Empresa - ${cliente.subtipo_empresa}` :
                                cliente.tipo_cliente === 'Otro' && cliente.tipo_otro ? `Otro: ${cliente.tipo_otro}` :
                                cliente.tipo_cliente || 'Sin tipo definido'} | {cliente.cif_nif || 'Sin CIF/NIF'}
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => setIsExpanded(!isExpanded)} className="neu-btn neu-btn-default neu-focus cursor-pointer rounded-lg px-4 py-2 text-sm font-bold flex items-center justify-center gap-2 border border-transparent">
                                {isExpanded ? 'Ocultar' : 'Ver'}
                            </button>
                            <button onClick={() => {
                                setEditingId(cliente.id_cliente)
                                setIsExpanded(true)
                            }} className="neu-btn neu-btn-dynamic neu-focus cursor-pointer rounded-lg px-4 py-2 text-sm font-bold flex items-center justify-center gap-2 border border-transparent">
                                Editar
                            </button>
                        </div>
                    </div>
                    
                    {isExpanded && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300 pt-2">
                            <div className={`grid grid-cols-1 ${cliente.direccion_envio ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'} gap-4 text-sm text-gray-600 dark:text-white/80`}>
                                <div>
                                    <p className="font-bold mb-1 uppercase tracking-wide text-xs text-gray-800 dark:text-white">Contacto Empresa</p>
                                    <p>Email: {cliente.email || '-'}</p>
                                    <p>Tel: {cliente.telefono || '-'}</p>
                                    <p>Web: {cliente.web || '-'}</p>
                                </div>
                                
                                {cliente.direccion_envio && (
                                    <div>
                                        <p className="font-bold mb-1 uppercase tracking-wide text-xs text-gray-800 dark:text-white">Dirección de Envío</p>
                                        <p>{cliente.direccion_envio}</p>
                                        <p>{cliente.localidad_envio || '-'}, {cliente.provincia_envio || '-'}</p>
                                        <p>{cliente.codigo_postal_envio || '-'} {cliente.pais_envio || '-'}</p>
                                    </div>
                                )}

                                <div>
                                    <p className="font-bold mb-1 uppercase tracking-wide text-xs text-gray-800 dark:text-white">Dirección de Facturación</p>
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

                            {cliente.notas && (
                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
                                    <p className="font-bold mb-1 uppercase tracking-wide text-xs text-gray-800 dark:text-white">Notas / Observaciones</p>
                                    <p className="text-sm text-gray-600 dark:text-white/80 whitespace-pre-wrap">{cliente.notas}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}