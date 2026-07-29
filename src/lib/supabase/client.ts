// Este lo usamos de componentes que lleven "use client" arriba para que se ejecute en el cliente y no en el server

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    return createBrowserClient (
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}