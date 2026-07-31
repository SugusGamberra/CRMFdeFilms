import { createClient } from '@/lib/supabase/server'
import DashboardClient from './DashboardClient'

// PANEL PRINCIPAL (DASHBOARD)

export default async function DashboardPage() {
    // Inicialización de conexion segura desde el servidor
    const supabase = await createClient()

    // OBTENER LISTA DE CLIENTES
    const { data: clientes, error } = await supabase
        .from('clientes')
        .select('*')
        .order('created_at', { ascending: false })

    // El componente de cliente maneja las pestañas, se le pasan los datos a el
    return (
        <DashboardClient clientes={clientes || []} error={error?.message} />
    )
}