import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PerfilClient from './PerfilClient'

export default async function PerfilPage() {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const nombreActual = user.user_metadata?.full_name || ''
    const email = user.email || ''

    return <PerfilClient nombreActual={nombreActual} email={email} />
}