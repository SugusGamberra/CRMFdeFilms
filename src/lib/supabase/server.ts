import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies} from 'next/headers'

// CREACIÓN DEL CLIENTE DE SERVIDOR
// Configura la conexión a Supabase y gestiona las cookies de sesión del usuario

export async function createClient() {
    const cookieStore = await cookies()

    return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
        cookies: {
            // OBTENER TODAS LAS COOKIES
            // Recupera la lista de cookies disponibles en la sesión actual
            getAll() {
                return cookieStore.getAll()
            },
            // ACTUALIZAR COOKIES
            // Establece, actualiza o elimina las cookies recorriendo la lista recibida
            setAll(cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options }) =>
                    cookieStore.set(name, value, options)
                    )
                } catch (error) {
                    // SILENCIAR ERROR EN SERVER COMPONENTS
                    // Evita bloqueos si Next.js intenta modificar cookies desde un entorno no permitido
                }
            },
        },
    })
}