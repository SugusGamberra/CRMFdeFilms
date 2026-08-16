'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import OceanBackground from '@/components/OceanBackground'
import toast from 'react-hot-toast'
import Image from 'next/image'

// PAGINA DE LOGIN Y REGISTRO
// Componente visual y logico para autenticacion y creacion de usuarios en el crm

export default function LoginPage() {
    // ESTADOS
    // control de interfaz y datos d usuario (true login false registro)
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const router = useRouter()
    const supabase = createClient()

    // MANEJO DE LOGIN Y REGISTRO POR CORREO
    // Ejecuto la llamada a supabase auth y redirige al dashboard si todo sale bien
    const manejarLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        if (isLogin) {
            // LOGICA INICIO DE SESIÓN
            const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
            })
            
            if (error) {
                toast.error('Credenciales incorrectas. Prueba de nuevo. Si no tienes cuenta regístrate.')
                setIsLoading(false)
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
                toast.error(error.message)
                setIsLoading(false)
            } else {
                toast.success('Registro exitoso! Comprueba tu correo electrónico y confirma tu dirección de email.')
                setIsLogin(true)
                setPassword('')
                setIsLoading(false)
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
        })
        
        if (error) toast.error(error.message)
    }
     */

    return (
        <main className="relative flex min-h-screen items-center justify-center p-4 overflow-hidden">
            <OceanBackground />
            
            <div className="relative z-10 w-full max-w-md rounded-3xl p-10 neu-raised bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                
                {/* TÍTULO DINÁMICO Y LOGO */}
                <div className="flex flex-col items-center mb-8">
                    <Image src="/logo-blanco.png" alt="EcoMagic Logo" width={200} height={64} priority className="h-14 md:h-16 w-auto object-contain transition-all duration-500 mb-4"/>
                    <h1 className="text-center text-3xl font-semibold tracking-tight text-gray-800 dark:text-gray-100">
                        {isLogin ? 'Acceso CRM' : 'Crear nueva cuenta'}
                    </h1>
                </div>
                
                <form onSubmit={manejarLogin} className="space-y-5">
                    {/*CAMPO EMAIL */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-gray-300" htmlFor="email">
                            Correo electrónico
                        </label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5"
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
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none neu-inset bg-transparent dark:bg-white/5 border border-gray-300 dark:border-white/5"
                            placeholder="••••••••"
                        />
                    </div>

                    {/*BOTON ENTRAR */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`neu-btn-dynamic neu-focus mt-8 w-full py-3 px-6 rounded-xl text-sm font-medium flex items-center justify-center gap-2 cursor-pointer ${isLoading ? 'opacity-80' : ''}`}
                    >
                        {isLoading && (
                            <span id="loading-spinner" aria-hidden="true">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </span>
                        )}
                        <span id="loading-text">
                            {isLoading ? (isLogin ? 'Iniciando sesión...' : 'Registrando...') : (isLogin ? 'Entrar' : 'Registrarse')}
                        </span>
                    </button>
                </form>

                {/*BOTÓN DE GOOGLE, descomentar cuando se configure google cloud */}
                { /* 
                <div className="mt-6">
                    <div className="relative flex items-center py-5">
                        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                        <span className="flex-shrink-0 px-4 text-sm text-gray-500 dark:text-gray-400">O continúa con</span>
                        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                    </div>
                    <button
                        onClick={logingConGoogle}
                        type="button"
                        className="neu-raised neu-btn neu-focus w-full flex items-center justify-center gap-3 py-3 px-6 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 cursor-pointer"
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
                        }}
                        className="font-semibold transition-colors outline-none focus:outline-none hover:underline focus:underline cursor-pointer duration-1000"
                        style={{ color: 'var(--dynamic-accent)' }}
                    >
                        {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
                    </button>
                </div>
                
            </div>
        </main>
    )
}