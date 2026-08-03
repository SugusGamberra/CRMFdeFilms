'use client'

import OceanBackground from '@/components/OceanBackground'
import UserMenu from '@/components/UserMenu'
import DatosBasicos from '@/components/perfil/DatosBasicos'
import Seguridad from '@/components/perfil/Seguridad'
import AjustesApariencia from '@/components/perfil/AjustesApariencia'

interface PerfilClientProps {
    nombreActual: string
    email: string
}

export default function PerfilClient({ nombreActual, email }: PerfilClientProps) {
    return (
        <div className="relative min-h-screen w-full p-4 pt-20 md:p-8 md:pt-24 overflow-x-hidden">
            <OceanBackground blur={true} />
            
            <div className="relative z-10 mx-auto w-full max-w-3xl rounded-3xl p-6 md:p-10 neu-raised bg-white/80 dark:bg-slate-900/70 backdrop-blur-md border border-gray-200 dark:border-white/10 shadow-2xl">
                
                {/* CABECERA */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Mi Perfil</h1>
                    <UserMenu />
                </div>

                <div className="space-y-8">
                    <DatosBasicos nombreActual={nombreActual} email={email} />
                    <AjustesApariencia />
                    <Seguridad />
                </div>
            </div>
        </div>
    )
}