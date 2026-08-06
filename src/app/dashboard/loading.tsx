import OceanBackground from '@/components/OceanBackground'

export default function LoadingDashboard() {
    return (
        <div className="relative min-h-screen w-full p-4 pt-20 md:p-8 md:pt-24">
            <OceanBackground blur={true} />
            
            <div className="relative z-10 mx-auto w-full max-w-6xl rounded-3xl p-6 md:p-10 neu-raised bg-white/80 dark:bg-slate-900/70 backdrop-blur-md border border-gray-200 dark:border-white/10 shadow-2xl">
                
                {/* CABECERA SKELETON */}
                <div className="flex justify-between items-center mb-8">
                    <div className="h-8 w-48 sm:w-64 rounded-xl skeleton"></div>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full skeleton shrink-0"></div>
                </div>

                {/* PESTAÑAS SKELETON */}
                <div className="flex gap-6 border-b border-gray-200 dark:border-white/10 mb-8 pb-3">
                    <div className="h-5 w-32 rounded-md skeleton"></div>
                    <div className="h-5 w-40 rounded-md skeleton"></div>
                </div>

                {/* BUSCADOR Y FILTROS SKELETON */}
                <div className="mb-6 flex gap-4 items-center">
                    <div className="flex-1 h-12 rounded-2xl skeleton"></div>
                    <div className="w-12 h-12 rounded-full skeleton shrink-0"></div>
                </div>

                {/* LISTADO DE CLIENTES SKELETON (3 tarjetas falsas) */}
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="rounded-2xl border border-gray-200 dark:border-white/10 p-5 neu-flat bg-gray-50/50 dark:bg-black/20 flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2 w-full">
                                    <div className="h-6 w-1/3 rounded-lg skeleton"></div>
                                    <div className="h-4 w-1/4 rounded-md skeleton"></div>
                                </div>
                                <div className="flex gap-4 shrink-0">
                                    <div className="h-9 w-20 rounded-lg skeleton hidden sm:block"></div>
                                    <div className="h-9 w-20 rounded-lg skeleton"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}