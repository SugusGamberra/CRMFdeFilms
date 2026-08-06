'use client'

import { useState } from 'react'
import { actualizarPerfil } from '@/app/perfil/actions'
import toast from 'react-hot-toast'

export default function DatosBasicos({ nombreActual, email }: { nombreActual: string, email: string }) {
    const [isSaving, setIsSaving] = useState(false)
    const [isSaved, setIsSaved] = useState(false)

    const handleActualizarNombre = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSaving(true)
        const formData = new FormData(e.currentTarget)
        
        const res = await actualizarPerfil(formData)
        setIsSaving(false)
        
        if (res.error) {
            toast.error(res.error)
        }
        if (res.exito) {
            toast.success(res.exito)
            setIsSaved(true)
            setTimeout(() => setIsSaved(false), 2500)
        }
    }

    return (
        <section className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-black/20 p-6 shadow-inner">
            <div className="border-b border-gray-200 dark:border-white/10 pb-2 mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-800 dark:text-white">Información Básica</h3>
            </div>

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
                    <button type="submit" disabled={isSaving} className="neu-btn neu-btn-dynamic neu-focus w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer border border-transparent dark:border-white/10">
                        {isSaving && (
                            <span aria-hidden="true">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </span>
                        )}
                        {!isSaving && isSaved && (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                        )}
                        <span>{isSaving ? 'Guardando...' : isSaved ? 'Guardado' : 'Guardar Nombre'}</span>
                    </button>
                </div>
            </form>
        </section>
    )
}