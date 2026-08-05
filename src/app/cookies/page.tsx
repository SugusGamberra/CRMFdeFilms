import Link from 'next/link'
import OceanBackground from '@/components/OceanBackground'
import UserMenu from '@/components/UserMenu'

export default function CookiesPage() {
    return (
        <div className="relative min-h-screen w-full p-4 pt-20 md:p-8 md:pt-24 overflow-x-hidden">
            <OceanBackground blur={true} />
            
            <div className="relative z-10 mx-auto w-full max-w-4xl rounded-3xl p-6 md:p-10 neu-raised bg-white/80 dark:bg-slate-900/70 backdrop-blur-md border border-gray-200 dark:border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
                
                {/* NAVEGACIÓN Y MENÚ */}
                <div className="flex justify-between items-center mb-8">
                    <Link className="text-sm font-bold text-gray-500 hover:text-gray-800 dark:text-white/60 dark:hover:text-white transition-colors" href="/dashboard">
                        ← Volver al Dashboard
                    </Link>
                    <UserMenu />
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-8">
                    Uso de Cookies
                </h1>
                
                <div className="space-y-6 text-gray-700 dark:text-gray-300">
                    <p>
                        Al ser una herramienta de gestión interna y privada, esta aplicación utiliza <strong>exclusivamente</strong> cookies esenciales y técnicas para asegurar el correcto funcionamiento de la plataforma.
                    </p>
                    
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white border-b border-gray-200 dark:border-white/10 pb-2">
                        ¿Qué tipo de cookies usamos?
                    </h2>
                    
                    <ol className="list-decimal pl-5 space-y-2">
                        <li><strong>Cookies de Autenticación (Técnicas):</strong> Imprescindibles para mantener tu sesión activa de forma segura. Si las bloqueas, no podrás entrar al Dashboard.</li>
                        <li><strong>Cookies de Preferencias:</strong> Las utilizamos localmente en tu navegador para recordar la personalización visual de la interfaz (como el Modo Claro/Oscuro o la hora del fondo animado) para que tu espacio de trabajo se mantenga a tu gusto en cada visita.</li>
                    </ol>

                    <h2 className="text-xl font-bold text-gray-800 dark:text-white border-b border-gray-200 dark:border-white/10 pb-2">
                        Ausencia de Cookies Publicitarias
                    </h2>
                    <p>
                        En este CRM <strong>no integramos cookies de rastreo publicitario</strong>. Tu información y la de tu cartera de clientes permanece en un entorno de trabajo limpio y libre de análisis para terceros.
                    </p>
                    
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white border-b border-gray-200 dark:border-white/10 pb-2">
                        ¿Qué ocurre si las desactivas?
                    </h2>
                    <p>
                        Si configuras tu navegador para rechazar o eliminar todas las cookies, el sistema no podrá verificar tu identidad y serás expulsado continuamente a la pantalla de inicio de sesión.
                    </p>
                </div>
            </div>
        </div>
    )
}