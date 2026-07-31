// Componente de servidor de next js para conectarse con server.ts

import { createClient } from '@/lib/supabase/server'

//PANEL PRINCIPAL (DASHBOARD) - MODO TEST
// vista temporal para comprobar la conexion con supabase y politicas RLS

export default async function DashboardPage() {
    // Inicializacion de conexion segura desde el servidor
    const supabase = await createClient()

    // Consulta directa a la tabla clientes
    const { data: clientes, error } = await supabase.from('clientes').select('*')

    return (
        <div className="p-10">
            <h1 className="mb-4 text-2xl font-bold">Prueba de conexion a bbdd</h1>

            {error ? (
                <div className="rounded-lg bg-red-100 p-4 text-red-700">
                    Error de Supabase: {error.message}
                </div>
                ) : (
                <pre className="rounded-lg bg-state800 p-4 text-green-400 overflow-auto">
                    {JSON.stringify(clientes, null, 2)}
                </pre>
                )
            })
        </div>
    )
}