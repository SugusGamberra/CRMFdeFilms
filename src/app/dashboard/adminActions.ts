'use server'

import { createClient } from '@supabase/supabase-js'

const getAdminSupabase = () => {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    )
}

export async function obtenerDatosAdmin(busqueda: string = '') {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return { error: "Faltan credenciales" }
    }

    const supabase = getAdminSupabase()

    try {
        const { data: authData, error: authError } = await supabase.auth.admin.listUsers()
        if (authError) return { error: authError.message }

        const { count: totalClientes } = await supabase.from('clientes').select('*', { count: 'exact', head: true })

        let usuarios = authData.users
        const termino = busqueda.toLowerCase().trim()
        
        if (termino) {
            usuarios = usuarios.filter(u => 
                u.email?.toLowerCase().includes(termino) || 
                u.user_metadata?.full_name?.toLowerCase().includes(termino)
            )
        }

        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
        const registrosPorMes = Array(12).fill(0)
        
        authData.users.forEach(u => {
            const d = new Date(u.created_at)
            if (d.getFullYear() === new Date().getFullYear()) registrosPorMes[d.getMonth()]++
        })

        const chartData = meses.map((mes, i) => ({ mes, registros: registrosPorMes[i] }))

        const systemInfo = {
            entorno: process.env.VERCEL ? 'Vercel' : process.env.NODE_ENV === 'development' ? 'Local' : 'Servidor',
            region: process.env.VERCEL_REGION || 'local'
        }

        return { 
            usuarios, 
            totalUsuarios: authData.users.length, 
            totalClientes: totalClientes || 0, 
            chartData,
            apiStatus: 'Online',
            systemInfo
        }

    } catch (e: unknown) {
        if (e instanceof Error) {
            return { error: e.message }
        }
        return { error: String(e) }
    }
}

export async function obtenerClientesAdmin(userId: string) {
    const supabase = getAdminSupabase()
    const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('id_empresa', userId)
        .order('created_at', { ascending: false })
        
    if (error) return { error: error.message }
    return { clientes: data }
}

export async function borrarClienteAdmin(idCliente: string) {
    const supabase = getAdminSupabase()
    const { error } = await supabase.from('clientes').delete().eq('id_cliente', idCliente)
    if (error) return { error: error.message }
    return { success: true }
}

export async function actualizarClienteAdmin(formData: FormData, idEmpresa: string) {
    const supabase = getAdminSupabase()
    
    const idCliente = formData.get('idCliente') as string
    const nombreCompleto = formData.get('nombreCompleto') as string

    if (!nombreCompleto || nombreCompleto.trim() === '') {
        return { error: "El nombre completo es obligatorio." }
    }

    const { error } = await supabase.from('clientes').update({
        nombre_completo: nombreCompleto,
        cif_nif: formData.get('cifNif') as string,
        direccion_facturacion: formData.get('direccionFacturacion') as string,
        localidad: formData.get('localidad') as string,
        provincia: formData.get('provincia') as string,
        codigo_postal: formData.get('codigoPostal') as string,
        pais: formData.get('pais') as string,
        telefono: formData.get('telefono') as string,
        email: formData.get('email') as string,
        persona_contacto: formData.get('personaContacto') as string,
        tfno_contacto: formData.get('tfnoContacto') as string,
        email_contacto: formData.get('emailContacto') as string,
        direccion_envio: formData.get('direccionEnvio') as string,
        codigo_postal_envio: formData.get('codigoPostalEnvio') as string,
        localidad_envio: formData.get('localidadEnvio') as string,
        provincia_envio: formData.get('provinciaEnvio') as string,
        pais_envio: formData.get('paisEnvio') as string,
        notas: formData.get('notas') as string,
        web: formData.get('web') as string,
        tipo_cliente: formData.get('tipoCliente') as string,
        subtipo_empresa: formData.get('subtipoEmpresa') as string,
        tipo_otro: formData.get('tipoOtro') as string,
        estado: formData.get('estado') as string,
    }).eq('id_cliente', idCliente).eq('id_empresa', idEmpresa)

    if (error) return { error: error.message }
    return { success: true }
}