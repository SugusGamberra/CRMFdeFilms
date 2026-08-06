// Middleware para proteger las rutas privadas
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    console.log("middleware activo: ", request.nextUrl.pathname);
    let supabaseResponse = NextResponse.next({
        request,
    })

    // Creación del cliente de Supabase para el middleware
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Obtención de usuario actual (validado en el servidor de Supabase)
    const { data: { user } } = await supabase.auth.getUser()

    // PROTECCIÓN DE RUTAS
    
    // Si se crean más rutas AÑADELAS AQUI!! toda ruta nueva que sea privada debe ir aqui
    const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') || 
                            request.nextUrl.pathname.startsWith('/perfil');
                            
    const isAuthRoute = request.nextUrl.pathname.startsWith('/login');

    if (!user && isProtectedRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    if (user && isAuthRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}

// Config de rutas donde se ejecuta el middleware (ignoramos archivos estáticos e imágenes)
export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}