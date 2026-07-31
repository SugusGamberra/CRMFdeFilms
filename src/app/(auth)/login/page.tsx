<<<<<<< Updated upstream
=======
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

// PAGINA DE LOGIN Y REGISTRO
// Componente visual y logico para autenticacion y creacion de usuarios en el crm

export default function LoginPage() {
    // ESTADOS
    // control de interfaz y datos d usuario (true login false registro)
    const [isLogin, setIsLogin] = useState(true)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [mensajeError, setMensajeError] = useState('')
    const [mensajeExito, setMensajeExito] = useState('')

    const router = useRouter()
    const supabase = createClient()

    // MANEJO DE LOGIN Y REGISTRO POR CORREO
    // Ejecuto la llamada a supabase auth y redirige al dashboard si todo sale bien
    const manejarLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setMensajeError('')
        setMensajeExito('')

        if (isLogin) {
            // LOGICA INICIO DE SESIÓN
            const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
            })
            
            if (error) {
                setMensajeError('Credenciales incorrectas. Prueba de nuevo. Si no tienes cuenta regístrate.')
            } else {
                router.push('/dashboard')
            } 
        } else {
            // LOGICA DE REGISTRO
            const { error } = await supabase.auth.signUp({
                email,
                password,
            })

            if (error) {
                setMensajeError(error.message)
            } else {
                setMensajeExito('¡Registro exitoso! Comprueba tu correo electrónico y confirma tu dirección de email.')
                setIsLogin(true)
                setPassword('')
            }
        }
    }
    
    // LOGICA DE GOOGLE AUTH
    // De cara al futuro, esto necesita las claves de Google Cloud, sencillamente descomenta esto y el boton que he puesto más abajo

    /*
    const logingConGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            }
        })}
        
        if (error) setMensajeError(error.message)
    }
    */

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-sm">
                
                {/* TÍTULO DINÁMICO */}
                <h1 className="mb-8 text-center text-3xl font-semibold tracking-tight text-slate-800">
                    {isLogin ? 'Acceso CRM' : 'Crear nueva cuenta'}
                </h1>
                
                {/* MENSAJES DE ERROR O ÉXITO */}
                {mensajeError && (
                    <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-500">
                        {mensajeError}
                    </div>
                )}
                {mensajeExito && (
                    <div className="mb-6 rounded-lg bg-green-50 p-4 text-sm font-medium text-green-600">
                        {mensajeExito}
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
                            className="w-full rounded-xl border border-slate-200 p-3.5 text-slate-800 outline-none transition-all focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
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
                        {isLogin ? 'Entrar' : 'Registrarse'}
                    </button>
                </form>

                {/*BOTÓN DE GOOGLE, descomentar cuando se configure google cloud */}
                {/*
                <div className="mt-4">
                    <div className="relative flex items-center py-5">
                        <div className="flex-grow border-t border-slate-200"></div>
                        <span className="flex-shrink-0 px-4 text-sm text-slate-400">O continúa con</span>
                        <div className="flex-grow border-t border-slate-200"></div>
                    </div>

                    <button
                        onClick={loginConGoogle}
                        type="button"
                        className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-200 p-4 font-medium text-slate-700 transition-colors hover:bg-slate-50 active:scale-[0.98]"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google
                    </button>
                </div>
                */}

                {/* INTERRUPTOR PARA CAMBIAR ENTRE LOGIN Y REGISTRO */}
                <div className="mt-8 text-center text-sm text-slate-600">
                    {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin)
                            setMensajeError('') // Limpiamos errores al cambiar de pestaña
                            setMensajeExito('')
                        }}
                        className="font-semibold text-indigo-600 outline-none hover:underline"
                    >
                        {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
                    </button>
                </div>

            </div>
        </div>
    )
}
>>>>>>> Stashed changes
