'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

// PAGINA DE LOGIN
// Componente visual y logico para autenticacion de usuarios en el crm

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [mensajeError, setMensajeError] = useState('')
    const router = useRouter()
    const supabase = createClient()

    // MANEJO DE LOGIN
    // Ejecuto la llamada a supabase auth y redirige al dashboard si todo sale bien
    const manejarLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setMensajeError('')

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setMensajeError('Credenciales incorrectas. Por favor, vuelva a intentarlo.')
        } else {
            router.push('/dashboard')
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-sm">
                <h1 className="mb-8 text-center text-3xl font-semibold tracking-tight text-slate-800">
                    Acceso CRM
                </h1>

                {mensajeError && (
                    <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-500">
                        {mensajeError}
                    </div>
                )}

                <form onSubmit={manejarLogin} className="space-y-5">
                    {/*CAMPO EMAIL */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-600" htmlFor="email">
                            Correo electrónico
                        </label>

                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="800 outline-none transition-all focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                            placeholder="empresa@ejemplo.com"
                        />
                    </div>

                    {/*CAMPO CONTRASEÑA */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-600" htmlFor="password">
                            Contraseña
                        </label>
                        
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 p-3.5 text-slate-800 outline-none transition-all focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                            placeholder="••••••••"
                        />
                    </div>

                    {/*BOTON ENTRAR */}
                    <button
                        type="submit"
                        className="mt-8 w-full rounded-xl bg-slate-900 p-4 font-medium text-white transition-colors hover:bg-slate-800 active:scale-[0.98]"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    )
}