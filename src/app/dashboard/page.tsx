import { createClient } from '@/lib/supabase/server'
import DashboardClient from './DashboardClient'

// dashboard que comprueba si el user es admin y obtiene la lista de cls

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim().toLowerCase()) || []
    const isAdmin = user?.email ? adminEmails.includes(user.email.toLowerCase()) : false
    
    const { data: clientes, error } = await supabase
        .from('clientes')
        .select('*')
        .order('created_at', { ascending: false })
        
    return (
        <DashboardClient clientes={clientes || []} error={error?.message} isAdmin={isAdmin} />
    )
}