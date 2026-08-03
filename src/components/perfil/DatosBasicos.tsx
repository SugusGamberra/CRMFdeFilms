'use client'

import { useState } from 'react'
import { actualizarPerfil } from '@/app/perfil/actions'

export default function DatosBasicos({ nombreActual, email }: { nombreActual: string, email: string }) {
    const [msgNombre, setMsgNombre] = useState({ tipo: '', texto: '' })

    const handleActualizarNombre = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setMsgNombre({ tipo: '', texto: '' })
        const formData = new FormData(e.currentTarget)
        
        const res = await actualizarPerfil(formData)
        if (res.error) setMsgNombre({ tipo: 'error', texto: res.error })
        if (res.exito) setMsgNombre({ tipo: 'exito', texto: res.exito })
    }

    return (
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
    )
}