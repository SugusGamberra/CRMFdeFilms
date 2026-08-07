'use client'

import { useState } from 'react'
import { crearCliente } from '@/app/dashboard/actions'
import toast from 'react-hot-toast'

export default function FormularioCrear({ onSuccess }: { onSuccess: () => void }) {
    const [mostrarEnvio, setMostrarEnvio] = useState(false)
    const [tipoClienteNuevo, setTipoClienteNuevo] = useState('')
    const [isSaving, setIsSaving] = useState(false)

    return (
        <section className="mb-10 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-black/20 p-6 shadow-inner">
            <form onSubmit={async (e) => {
                e.preventDefault()
                const form = e.currentTarget
                const formData = new FormData(form)
                
                setIsSaving(true)
                const result = await crearCliente(formData)
                setIsSaving(false)
                
                if (result?.error) {
                    toast.error(result.error)
                } else {
                    toast.success('Cliente guardado correctamente')
                    setMostrarEnvio(false)
                    setTipoClienteNuevo('')
                    form.reset()
                    onSuccess()
                }
            }} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                
                {/* DATOS PRINCIPALES */}
                <div className="sm:col-span-2 border-b border-gray-200 dark:border-white/10 pb-2 mb-2">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-gray-800 dark:text-white">Datos Principales</h3>
                </div>
                
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Nombre Completo / Razón Social *</label>
                    <input type="text" name="nombreCompleto" required placeholder="Ej: EcoMagic" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">CIF / NIF</label>
                    <input type="text" name="cifNif" placeholder="Ej: B12345678" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                </div>
                
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Tipo de Cliente</label>
                    <select 
                        name="tipoCliente" 
                        value={tipoClienteNuevo}
                        onChange={(e) => setTipoClienteNuevo(e.target.value)}
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
                    {tipoClienteNuevo === 'Empresa' && (
                        <>
                            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Subtipo de Empresa</label>
                            <select 
                                name="subtipoEmpresa" 
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
                    {tipoClienteNuevo === 'Otro' && (
                        <>
                            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Especificar tipo</label>
                            <input 
                                type="text" 
                                name="tipoOtro" 
                                placeholder="Especifica el tipo..." 
                                className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5 animate-in fade-in zoom-in-95" 
                            />
                        </>
                    )}
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

                {/* DATOS DE DIRECCIÓN (FACTURACIÓN) */}
                <div className="sm:col-span-2 border-b border-gray-200 dark:border-white/10 pb-2 mb-2 mt-4">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-gray-800 dark:text-white">Datos de Facturación</h3>
                </div>

                <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Dirección de Facturación</label>
                    <input type="text" name="direccionFacturacion" placeholder="Ej: Calle Hécate, 1" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Código Postal</label>
                    <input 
                        type="text" 
                        name="codigoPostal" 
                        placeholder="Ej: 11111" 
                        inputMode="numeric"
                        maxLength={5}
                        onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '') }}
                        className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" 
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Localidad (Ciudad)</label>
                    <input type="text" name="localidad" placeholder="Ej: Puerto Real" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Provincia</label>
                    <input type="text" name="provincia" placeholder="Ej: Cádiz" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">País</label>
                    <input type="text" name="pais" placeholder="Ej: España" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                </div>

                {/* TOGGLE: DIRECCIÓN DE ENVÍO */}
                <div className="sm:col-span-2 mt-2">
                    <div 
                        onClick={() => setMostrarEnvio(!mostrarEnvio)}
                        className="flex items-center justify-between p-4 rounded-xl neu-inset bg-gray-100/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 cursor-pointer hover:bg-gray-200/50 dark:hover:bg-white/10 transition-colors"
                    >
                        <span className="text-sm font-bold text-gray-700 dark:text-white/90">Envío a una dirección diferente</span>
                        <svg 
                            className={`w-5 h-5 text-gray-500 dark:text-white/60 transition-transform duration-300 ease-in-out ${mostrarEnvio ? 'rotate-180' : 'rotate-0'}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                {/* CAMPOS DIRECCIÓN DE ENVÍO */}
                {mostrarEnvio && (
                    <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 mt-2 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-black/20 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="sm:col-span-2">
                            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Dirección de Envío</label>
                            <input type="text" name="direccionEnvio" placeholder="Ej: Calle Artemisa, 2" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Código Postal (Envío)</label>
                            <input 
                                type="text" 
                                name="codigoPostalEnvio" 
                                placeholder="Ej: 11111" 
                                inputMode="numeric"
                                maxLength={5}
                                onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '') }}
                                className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" 
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Localidad (Envío)</label>
                            <input type="text" name="localidadEnvio" placeholder="Ej: Puerto Real" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Provincia (Envío)</label>
                            <input type="text" name="provinciaEnvio" placeholder="Ej: Cádiz" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">País (Envío)</label>
                            <input type="text" name="paisEnvio" placeholder="Ej: España" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                        </div>
                    </div>
                )}

                {/* DATOS DE CONTACTO ESPECÍFICO */}
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

                {/* NOTAS ADICIONALES */}
                <div className="sm:col-span-2 border-b border-gray-200 dark:border-white/10 pb-2 mb-2 mt-4">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-gray-800 dark:text-white">Notas Adicionales</h3>
                </div>

                <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Observaciones (Recargo de equivalencia, exento de IVA, etc.)</label>
                    <textarea name="notas" rows={3} placeholder="Añade aquí cualquier nota importante sobre este cliente..." className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5"></textarea>
                </div>

                {/* BOTÓN GUARDAR */}
                <div className="sm:col-span-2 mt-4">
                    <button type="submit" disabled={isSaving} className="neu-btn neu-btn-dynamic neu-focus w-full py-3 px-6 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border border-transparent dark:border-white/10 cursor-pointer">
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
            </form>
        </section>
    )
}