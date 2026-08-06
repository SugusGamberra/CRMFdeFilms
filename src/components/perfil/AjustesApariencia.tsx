'use client'

import { useState, useEffect, useRef } from 'react'

const TIME_LABELS = [
    { t: 0.0, name: "Noche Mágica" },
    { t: 0.25, name: "Amanecer" },
    { t: 0.35, name: "Mañana" },
    { t: 0.5, name: "Mediodía" },
    { t: 0.75, name: "Golden Hour" },
    { t: 0.83, name: "Atardecer" },
    { t: 1.0, name: "Noche Mágica" }
]

export default function AjustesApariencia() {
    const [theme, setTheme] = useState('system')
    const [bgTime, setBgTime] = useState('auto')
    const [currentTime, setCurrentTime] = useState(0)
    
    const isMounted = useRef(false)

    useEffect(() => {
        const updateTime = () => {
            const now = new Date()
            setCurrentTime((now.getHours() + now.getMinutes() / 60) / 24)
        }

        updateTime()
        const interval = setInterval(updateTime, 60000)

        const timer = setTimeout(() => {
            setTheme(localStorage.getItem('neu-ui-theme') || 'system')
            setBgTime(localStorage.getItem('neu-ui-bg-time') || 'auto')
            isMounted.current = true
        }, 0)
        
        return () => {
            clearInterval(interval)
            clearTimeout(timer)
        }
    }, [])

    const handleThemeChange = (val: string) => {
        setTheme(val)
        if (val === 'system') {
            localStorage.removeItem('neu-ui-theme')
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.classList.add('dark')
            } else {
                document.documentElement.classList.remove('dark')
            }
        } else {
            localStorage.setItem('neu-ui-theme', val)
            if (val === 'dark') {
                document.documentElement.classList.add('dark')
            } else {
                document.documentElement.classList.remove('dark')
            }
        }
    }

    const handleBgChange = (val: string) => {
        setBgTime(val)
        if (val === 'auto') {
            localStorage.removeItem('neu-ui-bg-time')
        } else {
            localStorage.setItem('neu-ui-bg-time', val)
        }
        window.dispatchEvent(new Event('bg-time-change'))
    }

    const getBgLabel = (val: string) => {
        if (val === 'auto') return "Hora actual (Automático)"
        const num = parseFloat(val)
        let closest = TIME_LABELS[0]
        let minDiff = Infinity
        for (const label of TIME_LABELS) {
            const diff = Math.abs(label.t - num)
            if (diff < minDiff) {
                minDiff = diff
                closest = label
            }
        }
        return closest.name
    }

    return (
        <section className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-black/20 p-6 shadow-inner transition-colors duration-500 ease-in-out">
            <div className="border-b border-gray-200 dark:border-white/10 pb-2 mb-6 transition-colors duration-500 ease-in-out">
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-800 dark:text-white transition-colors duration-500 ease-in-out">Apariencia</h3>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                
                {/* TEMA DE LA INTERFAZ */}
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-end">
                        <label className="text-sm font-medium text-gray-600 dark:text-white/80 transition-colors duration-500 ease-in-out">
                            Tema de la Interfaz
                        </label>
                    </div>
                    
                    <div className="flex bg-gray-200/50 dark:bg-white/5 p-1 rounded-xl border border-gray-200 dark:border-white/10 transition-colors duration-500 ease-in-out">
                        <button
                            onClick={() => handleThemeChange('light')}
                            className={`flex flex-1 items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-bold transition-all duration-300 cursor-pointer ${theme === 'light' ? 'bg-white text-gray-900 shadow-md scale-105' : 'text-gray-500 hover:text-gray-700 dark:text-white/50 dark:hover:text-white/80'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
                            </svg>
                            Claro
                        </button>
                        <button
                            onClick={() => handleThemeChange('dark')}
                            className={`flex flex-1 items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-bold transition-all duration-300 cursor-pointer ${theme === 'dark' ? 'bg-gray-800 text-white shadow-md scale-105' : 'text-gray-500 hover:text-gray-700 dark:text-white/50 dark:hover:text-white/80'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                            </svg>
                            Oscuro
                        </button>
                    </div>

                    <div className="flex justify-end mt-1">
                        <button 
                            onClick={() => handleThemeChange('system')}
                            disabled={theme === 'system'}
                            className="text-xs font-bold text-gray-400 hover:text-gray-800 dark:text-white/30 dark:hover:text-white disabled:opacity-0 transition-all duration-300 cursor-pointer"
                        >
                            Restablecer a Sistema
                        </button>
                    </div>
                </div>
                
                {/* FONDO ANIMADO (SLIDER) */}
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-end">
                        <label className="text-sm font-medium text-gray-600 dark:text-white/80 transition-colors duration-500 ease-in-out">
                            Fondo Animado
                        </label>
                        <span 
                            className="text-xs font-bold px-2 py-1 rounded-md bg-gray-200 dark:bg-black/40 text-gray-800 dark:text-white transition-colors duration-500 ease-in-out" 
                            style={{ color: bgTime !== 'auto' ? 'var(--dynamic-accent)' : '' }}
                        >
                            {getBgLabel(bgTime)}
                        </span>
                    </div>
                    
                    <div className="py-2">
                        <input 
                            type="range" 
                            min="0" 
                            max="1" 
                            step="0.01" 
                            value={bgTime === 'auto' ? currentTime : parseFloat(bgTime)}
                            onChange={(e) => handleBgChange(e.target.value)}
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer transition-all duration-500 ease-in-out"
                            style={{ 
                                background: bgTime === 'auto' ? '#9ca3af' : 'var(--dynamic-accent)',
                                outline: 'none'
                            }}
                        />
                    </div>
                    
                    <div className="flex justify-end mt-1">
                        <button 
                            onClick={() => handleBgChange('auto')}
                            disabled={bgTime === 'auto'}
                            className="text-xs font-bold text-gray-400 hover:text-gray-800 dark:text-white/30 dark:hover:text-white disabled:opacity-0 transition-all duration-300 cursor-pointer"
                        >
                            Restablecer a Hora Actual
                        </button>
                    </div>
                </div>

            </div>
        </section>
    )
}