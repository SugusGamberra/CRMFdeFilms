'use client'

import { useState, useEffect } from 'react'
import OceanBackground from '@/components/OceanBackground'
import Link from 'next/link'

export default function SecretaPage() {
    const [time, setTime] = useState<Date | null>(null)
    const [bgTime, setBgTime] = useState('auto')
    const [currentTime, setCurrentTime] = useState(0)

    useEffect(() => {
        // EL TRUCO: Metemos la primera carga en un setTimeout pequeñito.
        // Así React termina de renderizar primero y evitamos el "cascading render".
        const initTimer = setTimeout(() => {
            setTime(new Date())
            const now = new Date()
            setCurrentTime((now.getHours() + now.getMinutes() / 60) / 24)
            setBgTime(localStorage.getItem('neu-ui-bg-time') || 'auto')
        }, 0)

        const interval = setInterval(() => setTime(new Date()), 1000)
        
        const updateCurrentTime = () => {
            const now = new Date()
            setCurrentTime((now.getHours() + now.getMinutes() / 60) / 24)
        }
        const bgInterval = setInterval(updateCurrentTime, 60000)

        return () => {
            clearTimeout(initTimer) // Limpiamos también el timer inicial por si acaso
            clearInterval(interval)
            clearInterval(bgInterval)
        }
    }, [])

    const handleBgChange = (val: string) => {
        setBgTime(val)
        if (val === 'auto') {
            localStorage.removeItem('neu-ui-bg-time')
        } else {
            localStorage.setItem('neu-ui-bg-time', val)
        }
        window.dispatchEvent(new Event('bg-time-change'))
    }

    const formatTime = (d: Date) => {
        return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }

    return (
        <main className="relative min-h-screen w-full overflow-hidden text-white/90 font-sans">
            <OceanBackground blur={false} />

            {/* HORA ACTUAL */}
            <div className="absolute top-8 left-8 md:top-12 md:left-12 z-10 animate-in fade-in slide-in-from-left-8 duration-1000">
                <p className="text-4xl md:text-6xl font-light tracking-widest drop-shadow-md">
                    {time ? formatTime(time) : '--:--:--'}
                </p>
            </div>

            {/* CONTROL DEL CIELO */}
            <div className="absolute top-8 right-8 md:top-12 md:right-12 z-10 w-48 md:w-64 animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
                <div className="p-5 rounded-3xl bg-black/20 backdrop-blur-md border border-white/10 shadow-2xl">
                    <p className="text-[10px] uppercase tracking-widest mb-4 font-bold text-center text-white/80">
                        Control del Universo
                    </p>
                    <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.01" 
                        value={bgTime === 'auto' ? currentTime : parseFloat(bgTime)}
                        onChange={(e) => handleBgChange(e.target.value)}
                        className="w-full h-1.5 rounded-lg appearance-none cursor-pointer transition-all duration-500 ease-in-out bg-white/20"
                        style={{ outline: 'none' }}
                    />
                    <div className="mt-4 flex justify-center">
                        <button 
                            onClick={() => handleBgChange('auto')}
                            disabled={bgTime === 'auto'}
                            className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl border border-white/20 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
                        >
                            Hora Real
                        </button>
                    </div>
                </div>
            </div>

            {/* MENSAJE */}
            <div className="absolute bottom-12 left-0 right-0 z-10 px-6 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                <div className="max-w-3xl text-center">
                    <p className="text-xl md:text-2xl font-light tracking-wide leading-relaxed drop-shadow-lg mb-2 text-white">
                        Te damos la bienvenida a la página secreta.
                    </p>
                    <p className="text-sm md:text-base font-light tracking-wider text-white/70 drop-shadow-md">
                        Encuentra tu momento de paz y relajación. Prueba el fondo que más te relaje y conecta con tu certeza.
                    </p>
                </div>
                
                <Link 
                    href="/dashboard" 
                    className="mt-10 text-xs uppercase tracking-widest text-white/40 hover:text-white transition-colors duration-500"
                >
                    Volver al inicio
                </Link>
            </div>
        </main>
    )
}