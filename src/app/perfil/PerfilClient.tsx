'use client'

import { useState } from 'react'
import OceanBackground from '@/components/OceanBackground'
import UserMenu from '@/components/UserMenu'
import { actualizarPerfil, actualizarPassword } from './actions'

interface PerfilClientProps {
    nombreActual: string
    email: string
}

export default function PerfilClient({ nombreActual, email }: PerfilClientProps) {
    // Estados para mensajes de feedback
    const [msgNombre, setMsgNombre] = useState({ tipo: '', texto: '' })
    const [msgPass, setMsgPass] = useState({ tipo: '', texto: '' })

    // Manejadores de los formularios para interceptarlos y mostrar los mensajes
    const handleActualizarNombre = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setMsgNombre({ tipo: '', texto: '' })
        const formData = new FormData(e.currentTarget)
        
        const res = await actualizarPerfil(formData)
        if (res.error) setMsgNombre({ tipo: 'error', texto: res.error })
        if (res.exito) setMsgNombre({ tipo: 'exito', texto: res.exito })
    }

    const handleActualizarPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setMsgPass({ tipo: '', texto: '' })
        const formData = new FormData(e.currentTarget)
        
        const res = await actualizarPassword(formData)
        if (res.error) setMsgPass({ tipo: 'error', texto: res.error })
        if (res.exito) {
            setMsgPass({ tipo: 'exito', texto: res.exito })
            e.currentTarget.reset()
        }
    }

    return (
        <div className="relative min-h-screen w-full p-4 pt-20 md:p-8 md:pt-24 overflow-x-hidden">
            <OceanBackground blur={true} />
            
            <div className="relative z-10 mx-auto w-full max-w-3xl rounded-3xl p-6 md:p-10 neu-raised bg-white/80 dark:bg-slate-900/70 backdrop-blur-md border border-gray-200 dark:border-white/10 shadow-2xl">
                
                {/* CABECERA */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Mi Perfil</h1>
                    <UserMenu />
                </div>

                <div className="space-y-8">
                    {/* DATOS DE USUARIO */}
                    <section className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-black/20 p-6 shadow-inner">
                        <div className="border-b border-gray-200 dark:border-white/10 pb-2 mb-4">
                            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-800 dark:text-white">Información Básica</h3>
                        </div>

                        {msgNombre.texto && (
                            <div className={`mb-4 rounded-xl p-3 text-sm font-bold ${msgNombre.tipo === 'error' ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-500/30' : 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-300 border border-green-200 dark:border-green-500/30'}`}>
                                {msgNombre.texto}
                            </div>
                        )}

                        <form onSubmit={handleActualizarNombre} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Correo Electrónico (No editable)</label>
                                <input type="email" disabled value={email} className="w-full px-4 py-3 rounded-xl text-sm text-gray-500 dark:text-white/50 bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/5 cursor-not-allowed" />
                            </div>
                            
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Nombre de Usuario</label>
                                <input type="text" name="nombre" defaultValue={nombreActual} required placeholder="Ej: Patricia" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                            </div>

                            <div className="sm:col-span-2 flex justify-end mt-2">
                                <button type="submit" className="neu-btn neu-focus cursor-pointer rounded-xl px-8 py-3 text-sm font-bold text-white shadow-md transition-colors duration-1000 border border-transparent dark:border-white/10" style={{ backgroundColor: 'var(--dynamic-accent)' }}>
                                    Guardar Nombre
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* SEGURIDAD Y CONTRASEÑA */}
                    <section className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-black/20 p-6 shadow-inner">
                        <div className="border-b border-gray-200 dark:border-white/10 pb-2 mb-4">
                            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-800 dark:text-white">Seguridad</h3>
                        </div>

                        {msgPass.texto && (
                            <div className={`mb-4 rounded-xl p-3 text-sm font-bold ${msgPass.tipo === 'error' ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-500/30' : 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-300 border border-green-200 dark:border-green-500/30'}`}>
                                {msgPass.texto}
                            </div>
                        )}

                        <form onSubmit={handleActualizarPassword} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Nueva Contraseña</label>
                                <input type="password" name="password" required placeholder="Mínimo 6 caracteres" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                            </div>
                            
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-white/80">Confirmar Contraseña</label>
                                <input type="password" name="confirmPassword" required placeholder="Repite la contraseña" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5" />
                            </div>

                            <div className="sm:col-span-2 flex justify-end mt-2">
                                <button type="submit" className="neu-btn neu-focus cursor-pointer rounded-xl px-8 py-3 text-sm font-bold text-white shadow-md transition-colors duration-1000 border border-transparent dark:border-white/10" style={{ backgroundColor: 'var(--dynamic-accent)' }}>
                                    Actualizar Contraseña
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    )
}