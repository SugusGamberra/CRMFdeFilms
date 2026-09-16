'use client'

import { useState, useEffect } from 'react'
import { obtenerDatosAdmin, obtenerClientesAdmin, borrarClienteAdmin, actualizarClienteAdmin } from '@/app/dashboard/adminActions'
import { Cliente } from '@/components/clientes/ClienteItem'
import toast from 'react-hot-toast'

interface AdminUser {
    id: string
    email?: string
    created_at: string
    user_metadata?: {
        full_name?: string
    }
}

interface ClienteAdminItemProps {
    cliente: Cliente
    idEmpresa: string
    onUpdated: () => void
    onDeleted: (id: string) => void
}

function ClienteAdminItem({ cliente, idEmpresa, onUpdated, onDeleted }: ClienteAdminItemProps) {
    const [mostrarEnvioEdit, setMostrarEnvioEdit] = useState(!!cliente.direccion_envio)
    const [tipoClienteEdit, setTipoClienteEdit] = useState(cliente.tipo_cliente || '')
    const [isExpanded, setIsExpanded] = useState(false)
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    return (
        <div className="rounded-2xl border border-gray-200 dark:border-white/10 p-5 neu-flat bg-gray-50/50 dark:bg-black/20 flex flex-col gap-4 transition-all">
            {isEditing ? (
                <div className="flex flex-col">
                    <form onSubmit={async (e) => {
                        e.preventDefault()
                        const formData = new FormData(e.currentTarget)
                        
                        setIsSaving(true)
                        const result = await actualizarClienteAdmin(formData, idEmpresa)
                        setIsSaving(false)
                        
                        if (result?.error) {
                            toast.error(result.error)
                        } else {
                            toast.success('Cliente actualizado desde administración')
                            setIsEditing(false)
                            setMostrarEnvioEdit(false)
                            setIsConfirmingDelete(false)
                            onUpdated()
                        }
                    }} className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
                        <input type="hidden" name="idCliente" value={cliente.id_cliente} />
                        
                        <div className="sm:col-span-2 border-b border-gray-200 dark:border-white/10 pb-2 mb-2">
                            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-800 dark:text-white">Datos Principales</h3>
                        </div>
                        
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Nombre Completo / Razón Social *</label>
                            <input type="text" name="nombreCompleto" defaultValue={cliente.nombre_completo || ''} required placeholder="Ej: EcoMagic" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">CIF / NIF</label>
                            <input type="text" name="cifNif" defaultValue={cliente.cif_nif || ''} placeholder="Ej: B12345678" maxLength={9} pattern="^[A-Z0-9]{9}$" title="El formato debe tener exactamente 9 caracteres (números y letra)." onInput={(e) => { e.currentTarget.value = e.currentTarget.value.toUpperCase().replace(/[^A-Z0-9]/g, '') }} className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                        </div>
                        
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Estado del Cliente</label>
                            <select
                                name="estado"
                                defaultValue={cliente.estado || 'Activo'}
                                className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5 cursor-pointer"
                            >
                                <option value="Activo" className="bg-white dark:bg-slate-800 text-gray-800 dark:text-white">Activo</option>
                                <option value="Inactivo" className="bg-white dark:bg-slate-800 text-gray-800 dark:text-white">Inactivo</option>
                            </select>
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

                        <div className="sm:col-span-2 border-b border-gray-200 dark:border-white/10 pb-2 mb-2 mt-4">
                            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-800 dark:text-white">Notas Adicionales</h3>
                        </div>
                        <div className="sm:col-span-2">
                            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Observaciones (Recargo de equivalencia, exento de IVA, etc.)</label>
                            <textarea name="notas" defaultValue={cliente.notas || ''} rows={3} placeholder="Añade aquí cualquier nota importante sobre este cliente..." className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5"></textarea>
                        </div>

                        {!isConfirmingDelete && (
                            <div className="sm:col-span-2 flex flex-col sm:flex-row gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-white/10 items-center justify-between">
                                <button type="button" onClick={() => setIsConfirmingDelete(true)} className="neu-btn neu-btn-danger neu-focus w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer border border-transparent">
                                    Eliminar
                                </button>
                                <div className="flex gap-4 w-full sm:w-auto flex-1 sm:justify-end">
                                    <button type="button" onClick={() => {
                                        setIsEditing(false)
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

                    {isConfirmingDelete && (
                        <form onSubmit={async (e) => {
                            e.preventDefault()
                            const formData = new FormData(e.currentTarget)
                            
                            setIsDeleting(true)
                            const result = await borrarClienteAdmin(cliente.id_cliente)
                            
                            if (result?.error) {
                                toast.error(result.error)
                                setIsDeleting(false)
                            } else {
                                toast.success('Cliente eliminado desde administración')
                                onDeleted(cliente.id_cliente)
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
                <div>
                    <div className={`flex justify-between items-start ${isExpanded ? 'border-b border-gray-200 dark:border-white/10 pb-4 mb-4' : ''} transition-all duration-300`}>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                                {cliente.nombre_completo}
                                <span className={`shrink-0 w-3.5 h-3.5 rounded-full shadow-lg ${cliente.estado === 'Inactivo' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse'}`} title={cliente.estado === 'Inactivo' ? 'Inactivo' : 'Activo'}></span>
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-white/60 mt-1">
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
                                setIsEditing(true)
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

export default function PanelAdmin() {
    const [busqueda, setBusqueda] = useState('')
    const [usuarios, setUsuarios] = useState<AdminUser[]>([])
    const [stats, setStats] = useState({ 
        totalUsuarios: 0, 
        totalClientes: 0, 
        chartData: [] as {mes: string, registros: number}[],
        apiStatus: 'Conectando...',
        systemInfo: { entorno: '...', region: '...' }
    })
    const [ssl, setSsl] = useState('Comprobando...')
    const [cargando, setCargando] = useState(true)
    
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<AdminUser | null>(null)
    const [clientesUsuario, setClientesUsuario] = useState<Cliente[]>([])
    const [cargandoClientes, setCargandoClientes] = useState(false)

    const cargarDatos = async (termino: string = '') => {
        setCargando(true)
        const res = await obtenerDatosAdmin(termino)
        
        if (res.error) {
            toast.error(res.error)
            setStats(prev => ({ ...prev, apiStatus: 'Desconectado' }))
        } else {
            if (res.usuarios) setUsuarios(res.usuarios)
            if (res.chartData) setStats({ 
                totalUsuarios: res.totalUsuarios, 
                totalClientes: res.totalClientes, 
                chartData: res.chartData,
                apiStatus: res.apiStatus,
                systemInfo: res.systemInfo
            })
        }
        setCargando(false)
    }

    useEffect(() => {
        setTimeout(() => {
            setSsl(window.location.protocol === 'https:' ? 'Conexión Segura' : 'No Segura')
            cargarDatos()
        }, 0)
    }, [])

    const manejarBusqueda = async (e: React.FormEvent) => {
        e.preventDefault()
        cargarDatos(busqueda)
    }

    const abrirUsuario = async (u: AdminUser) => {
        setUsuarioSeleccionado(u)
        setCargandoClientes(true)
        const res = await obtenerClientesAdmin(u.id)
        if (res.error) toast.error(res.error)
        else if (res.clientes) setClientesUsuario(res.clientes)
        setCargandoClientes(false)
    }

    const handleClientUpdated = async () => {
        if (usuarioSeleccionado) {
            const res = await obtenerClientesAdmin(usuarioSeleccionado.id)
            if (res.clientes) setClientesUsuario(res.clientes)
        }
    }

    const handleClientDeleted = (idCliente: string) => {
        setClientesUsuario(prev => prev.filter(c => c.id_cliente !== idCliente))
        setStats(prev => ({ ...prev, totalClientes: prev.totalClientes - 1 }))
    }

    const maxRegistros = Math.max(...stats.chartData.map(d => d.registros), 1)

    if (usuarioSeleccionado) {
        return (
            <section className="mb-10 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-black/20 p-8 shadow-inner animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-4 mb-8 border-b border-gray-200 dark:border-white/10 pb-6">
                    <button onClick={() => setUsuarioSeleccionado(null)} className="neu-btn neu-btn-default neu-focus cursor-pointer p-3 rounded-xl border border-transparent">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{usuarioSeleccionado.user_metadata?.full_name || 'Usuario'}</h2>
                        <p className="text-sm text-gray-500">{usuarioSeleccionado.email}</p>
                    </div>
                </div>

                {cargandoClientes ? (
                    <div className="flex justify-center py-10">
                        <svg className="animate-spin h-8 w-8 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    </div>
                ) : clientesUsuario.length === 0 ? (
                    <p className="text-center py-10 text-gray-500">Este usuario no tiene clientes registrados en su base de datos.</p>
                ) : (
                    <div className="space-y-4">
                        {clientesUsuario.map(c => (
                            <ClienteAdminItem 
                                key={c.id_cliente} 
                                cliente={c} 
                                idEmpresa={usuarioSeleccionado.id} 
                                onUpdated={handleClientUpdated} 
                                onDeleted={handleClientDeleted} 
                            />
                        ))}
                    </div>
                )}
            </section>
        )
    }

    return (
        <section className="mb-10 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-black/20 p-8 shadow-inner animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row items-center gap-6 mb-10 border-b border-gray-200 dark:border-white/10 pb-8">
                <div className="w-20 h-20 shrink-0 flex items-center justify-center rounded-2xl neu-inset border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/>
                    </svg>
                </div>
                <div className="text-center md:text-left">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Panel de Administración</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        Monitoriza el rendimiento del sistema en tiempo real. Gestiona usuarios y visualiza las estadísticas globales de la plataforma.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="neu-flat p-6 rounded-2xl border border-gray-200 dark:border-white/10 flex flex-col items-center justify-center text-center">
                    <span className="text-4xl font-black text-gray-800 dark:text-white mb-2">API</span>
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">{stats.apiStatus}</span>
                </div>
                <div className="neu-flat p-6 rounded-2xl border border-gray-200 dark:border-white/10 flex flex-col items-center justify-center text-center">
                    <span className="text-4xl font-black text-gray-800 dark:text-white mb-2">{stats.systemInfo.entorno}</span>
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Hosting Activo</span>
                </div>
                <div className="neu-flat p-6 rounded-2xl border border-gray-200 dark:border-white/10 flex flex-col items-center justify-center text-center">
                    <span className="text-4xl font-black text-gray-800 dark:text-white mb-2">SSL</span>
                    <span className={`text-sm font-bold uppercase tracking-widest ${ssl === 'Conexión Segura' ? 'text-green-500' : 'text-yellow-500'}`}>{ssl}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="neu-flat p-6 rounded-2xl border border-gray-200 dark:border-white/10 flex flex-col items-center justify-center text-center">
                    <span className="text-5xl font-black text-gray-800 dark:text-white mb-2">{stats.totalUsuarios}</span>
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Empresas Registradas</span>
                </div>
                <div className="neu-flat p-6 rounded-2xl border border-gray-200 dark:border-white/10 flex flex-col items-center justify-center text-center">
                    <span className="text-5xl font-black text-gray-800 dark:text-white mb-2">{stats.totalClientes}</span>
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Registros Totales en BBDD</span>
                </div>
            </div>

            <div className="neu-flat p-6 rounded-2xl border border-gray-200 dark:border-white/10 mb-10">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 text-center">Altas en {new Date().getFullYear()}</h3>
                <div className="flex items-end h-40 gap-2 px-2">
                    {stats.chartData.map(d => (
                        <div key={d.mes} className="flex-1 flex flex-col items-center justify-end gap-2 h-full">
                            <div className="w-full rounded-t-md transition-all duration-1000 ease-out" style={{ height: `${(d.registros / maxRegistros) * 100}%`, backgroundColor: 'var(--dynamic-accent)' }}></div>
                            <span className="text-[10px] sm:text-xs font-bold text-gray-500">{d.mes}</span>
                        </div>
                    ))}
                </div>
            </div>

            <form onSubmit={manejarBusqueda} className="flex flex-col sm:flex-row gap-4 mb-8">
                <input 
                    type="text" 
                    placeholder="Buscar empresa por correo o nombre..." 
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="flex-1 px-5 py-4 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5"
                />
                <button 
                    type="submit" 
                    disabled={cargando}
                    className="neu-btn neu-btn-dynamic neu-focus cursor-pointer px-8 py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border border-transparent"
                >
                    Buscar
                </button>
            </form>

            <div className="space-y-4">
                {usuarios.map((u) => (
                    <div key={u.id} className="p-6 rounded-2xl neu-flat border border-gray-200 dark:border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                                {u.user_metadata?.full_name || 'Sin nombre de usuario'}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">{u.email}</p>
                            <p className="text-xs text-gray-500 dark:text-white/40 mt-1">Suscrito el {new Date(u.created_at).toLocaleDateString('es-ES')}</p>
                        </div>
                        <button onClick={() => abrirUsuario(u)} className="neu-btn neu-btn-default neu-focus cursor-pointer px-6 py-2 rounded-xl text-sm font-bold w-full md:w-auto border border-transparent">
                            Ver Base de Datos
                        </button>
                    </div>
                ))}
            </div>
        </section>
    )
}