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
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-md rounded-3xl p-10 neu-raised">
                
                {/* TÍTULO DINÁMICO */}
                <h1 className="mb-8 text-center text-3xl font-semibold tracking-tight text-gray-800 dark:text-gray-100">
                    {isLogin ? 'Acceso CRM' : 'Crear nueva cuenta'}
                </h1>
                
                {/* MENSAJES DE ERROR O ÉXITO */}
                {mensajeError && (
                    <div className="mb-6 rounded-xl bg-red-100 dark:bg-red-900/30 p-4 text-sm font-medium text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800/50">
                        {mensajeError}
                    </div>
                )}
                {mensajeExito && (
                    <div className="mb-6 rounded-xl bg-green-100 dark:bg-green-900/30 p-4 text-sm font-medium text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800/50">
                        {mensajeExito}
                    </div>
                )}

                <form onSubmit={manejarLogin} className="space-y-5">

                    {/*CAMPO EMAIL */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-gray-300" htmlFor="email">
                            Correo electrónico
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 neu-inset bg-transparent"
                            placeholder="empresa@ejemplo.com"
                        />
                    </div>

                    {/*CAMPO CONTRASEÑA */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-gray-300" htmlFor="password">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 neu-inset bg-transparent"
                            placeholder="••••••••"
                        />
                    </div>

                    {/*BOTON ENTRAR */}
                    <button
                        type="submit"
                        className="neu-btn neu-focus mt-8 w-full py-3 px-6 rounded-xl text-sm font-medium text-white bg-gradient-to-br from-purple-600 to-purple-700 shadow-lg"
                    >
                        {isLogin ? 'Entrar' : 'Registrarse'}
                    </button>
                </form>

                {/*BOTÓN DE GOOGLE, descomentar cuando se configure google cloud */}
                {/*
                <div className="mt-6">
                    <div className="relative flex items-center py-5">
                        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                        <span className="flex-shrink-0 px-4 text-sm text-gray-500 dark:text-gray-400">O continúa con</span>
                        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                    </div>

                    <button
                        onClick={logingConGoogle}
                        type="button"
                        className="neu-raised neu-btn neu-focus w-full flex items-center justify-center gap-3 py-3 px-6 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300"
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
                <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                    {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin)
                            setMensajeError('') // Limpiamos errores al cambiar de pestaña
                            setMensajeExito('')
                        }}
                        className="font-semibold text-purple-600 dark:text-purple-400 transition-colors hover:text-purple-700 dark:hover:text-purple-300 outline-none focus:outline-none hover:underline focus:underline"
                    >
                        {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
                    </button>
                </div>
                
            </div>
        </div>
    )
}