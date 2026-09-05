import Link from 'next/link'
import OceanBackground from '@/components/OceanBackground'
import UserMenu from '@/components/UserMenu'

export default function AvisosPage() {
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
                    Aviso Legal
                </h1>
                
                <div className="space-y-6 text-sm md:text-base text-gray-700 dark:text-gray-300">
                    
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white border-b border-gray-200 dark:border-white/10 pb-2">
                        1. Datos Identificativos
                    </h2>
                    <p>
                        En cumplimiento con el deber de información recogido en el artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico, a continuación se reflejan los siguientes datos:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Titular de la plataforma:</strong> EcoMagic</li>
                        <li><strong>NIF:</strong> 26500682J</li>
                        <li><strong>Dirección:</strong> Calle Alcalde Ronquillo, 24, 29011 Málaga</li>
                        <li><strong>Correo electrónico de contacto:</strong> info@ecomagic.com</li>
                    </ul>

                    <h2 className="text-xl font-bold text-gray-800 dark:text-white border-b border-gray-200 dark:border-white/10 pb-2">
                        2. Uso de la Herramienta
                    </h2>
                    <p>
                        El acceso y uso de este entorno de software (CRM) atribuye la condición de USUARIO. La presente plataforma está orientada al uso profesional, administrativo y de gestión. El USUARIO se compromete a hacer un uso lícito y adecuado de la aplicación, sin emplearla para incurrir en actividades contrarias a la buena fe o al orden público.
                    </p>

                    <h2 className="text-xl font-bold text-gray-800 dark:text-white border-b border-gray-200 dark:border-white/10 pb-2">
                        3. Responsabilidad sobre la Información
                    </h2>
                    <p>
                        La plataforma actúa como intermediaria tecnológica facilitando un espacio de almacenamiento. El USUARIO es el único responsable legal sobre la información de terceros (datos de su cartera de clientes) que decida alojar, importar o exportar mediante la herramienta, garantizando que ha obtenido dichos datos de manera lícita.
                    </p>

                    <h2 className="text-xl font-bold text-gray-800 dark:text-white border-b border-gray-200 dark:border-white/10 pb-2">
                        4. Propiedad Intelectual, Autoría y Desarrollo
                    </h2>
                    <p>
                        El diseño original, la arquitectura y el desarrollo del código fuente de este entorno de software (CRM) son obra intelectual exclusiva de <a href="https://github.com/SugusGamberra" target="_blank" rel="noopener noreferrer" className="text-[var(--dynamic-accent,var(--neu-primary))] font-bold hover:opacity-80 hover:underline transition-all">SugusGamberra</a>. 
                    </p>
                    <p className="mt-2">
                        EcoMagic es titular de los derechos de uso y explotación de la plataforma para el desarrollo de su actividad. Quedan expresamente prohibidas la reproducción, copia, alteración o ingeniería inversa de la herramienta sin la autorización expresa y por escrito de la desarrolladora.
                    </p>

                    <h2 className="text-xl font-bold text-gray-800 dark:text-white border-b border-gray-200 dark:border-white/10 pb-2">
                        5. Exclusión de Garantías
                    </h2>
                    <p>
                        Se han implementado y mantenido medidas de seguridad óptimas para proteger la integridad de la plataforma. Sin embargo, no nos hacemos responsables de los daños o pérdidas de datos que pudieran ocasionar factores externos, fallos masivos en proveedores cloud, cortes de conectividad o ataques cibernéticos maliciosos.
                    </p>

                    <h2 className="text-xl font-bold text-gray-800 dark:text-white border-b border-gray-200 dark:border-white/10 pb-2">
                        6. Legislación y Jurisdicción
                    </h2>
                    <p>
                        La relación se regirá por la normativa española vigente y cualquier controversia se someterá a los Juzgados y tribunales de la ciudad de Málaga, salvo que la ley aplicable determine otra jurisdicción obligatoria.
                    </p>
                </div>
            </div>
        </div>
    )
}