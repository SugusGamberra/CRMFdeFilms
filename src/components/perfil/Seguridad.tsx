'use client'

import { useState } from 'react'
import { actualizarPassword } from '@/app/perfil/actions'

export default function Seguridad() {
    const [msgPass, setMsgPass] = useState({ tipo: '', texto: '' })

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
    )
}