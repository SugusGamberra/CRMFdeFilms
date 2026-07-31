// Componente de servidor de next js para conectarse con server.ts

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

//PANEL PRINCIPAL (DASHBOARD) - MODO TEST
// vista temporal para comprobar la conexion con supabase y politicas RLS

export default async function DashboardPage() {
    // Inicializacion de conexion segura desde el servidor
    const supabase = await createClient()

    // Consulta directa a la tabla clientes
    const { data: clientes, error } = await supabase.from('clientes').select('*')

    // AÑADIR CLIENTE DE PRUEBA (server action)
    // funcion backend que se dispara al pulsar el boton para insertar un registro d prueba

    const agregarClientePrueba = async () => {
        'use server'
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            await supabase.from('clientes').insert([
                {
                    id_empresa: user.id,
                    nombre_completo: 'Cliente de prueba',
                    cif_nif: '19283723J',
                    email: 'cliente@deprueba.com'
                }
            ])

            revalidatePath('/dashboard')
        }
    }

    return (
        <div className="p-10">
            <h1 className="mb-4 text-2xl font-bold">Prueba de conexion a bbdd</h1>

            {/*FORMULARIO BOTON */}
            <form action={agregarClientePrueba} className="mb-8">
                <button type="submit" className="rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white transition-colors hover:bg-indigo-700 active:scale-95">
                    Añadir cliente
                </button>
            </form>

            {error ? (
                <div className="rounded-lg bg-red-100 p-4 text-red-700">
                    Error de Supabase: {error.message}
                </div>
                ) : (
                <pre className="rounded-lg bg-state800 p-4 text-green-400 overflow-auto">
                    {JSON.stringify(clientes, null, 2)}
                </pre>
                )
            }
        </div>
    )
}