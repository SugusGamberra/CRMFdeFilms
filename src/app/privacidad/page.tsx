import Link from 'next/link'
import OceanBackground from '@/components/OceanBackground'
import UserMenu from '@/components/UserMenu'

export default function PrivacidadPage() {
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
                    Política de Privacidad
                </h1>
                
                <p className="mb-8 text-gray-700 dark:text-gray-300">
                    En esta plataforma (CRM) tratamos los datos personales conforme al Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD).
                </p>
                
                <div className="space-y-6 text-gray-700 dark:text-gray-300">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white border-b border-gray-200 dark:border-white/10 pb-2">
                        ¿Qué datos recopilamos y cómo?
                    </h2>
                    
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Datos de cuenta:</strong> Email y nombre de usuario proporcionados para el registro y acceso seguro a la plataforma.</li>
                        <li><strong>Datos de terceros (Cartera de Clientes):</strong> Información introducida de forma manual o mediante importación (nombres, direcciones, NIF/CIF, emails de contacto) estrictamente para la gestión de la cartera.</li>
                    </ul>

                    <h2 className="text-xl font-bold text-gray-800 dark:text-white border-b border-gray-200 dark:border-white/10 pb-2">
                        ¿Para qué usamos estos datos?
                    </h2>
                    
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Para permitir el acceso privado al dashboard de gestión.</li>
                        <li>Para el mantenimiento, organización y exportación de la base de datos interna.</li>
                        <li>Para garantizar la seguridad tecnológica de las sesiones y evitar accesos no autorizados.</li>
                    </ul>

                    <h2 className="text-xl font-bold text-gray-800 dark:text-white border-b border-gray-200 dark:border-white/10 pb-2">
                        ¿Quién accede a los datos?
                    </h2>
                    <p>
                        Tus datos se almacenan bajo estrictos estándares de seguridad mediante proveedores de infraestructura en la nube que cumplen con el RGPD (como Supabase). <strong>En ningún caso</strong> comercializamos, vendemos ni cedemos a terceros con fines publicitarios la información alojada en el CRM.
                    </p>

                    <h2 className="text-xl font-bold text-gray-800 dark:text-white border-b border-gray-200 dark:border-white/10 pb-2">
                        ¿Cuáles son tus derechos?
                    </h2>
                    <p>
                        Puedes acceder, rectificar, suprimir, limitar u oponerte al tratamiento de tus datos, o retirar tu consentimiento en cualquier momento. Si necesitas asistencia técnica para eliminar por completo tu base de datos y cuenta, escríbenos a: <strong>(poner correo)</strong>.
                    </p>
                </div>
            </div>
        </div>
    )
}