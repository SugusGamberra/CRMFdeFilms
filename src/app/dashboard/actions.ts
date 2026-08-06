'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// AÑADIR CLIENTE (server action)
export async function crearCliente(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Usuario no autenticado." }
    
    const nombreCompleto = formData.get('nombreCompleto') as string
    if (!nombreCompleto || nombreCompleto.trim() === '') {
        return { error: "El nombre completo es obligatorio." }
    }

    const { error } = await supabase.from('clientes').insert([{
        id_empresa: user.id,
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
    }])

    if (error) return { error: error.message }

    revalidatePath('/dashboard')
    return { success: true, message: 'Cliente creado con éxito' }
}

// ACTUALIZAR CLIENTE (server action)
export async function actualizarCliente(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Usuario no autenticado." }
    
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
    }).eq('id_cliente', idCliente).eq('id_empresa', user.id)

    if (error) return { error: error.message }
    
    revalidatePath('/dashboard')
    return { success: true, message: 'Cliente actualizado con éxito' }
}

// BORRAR CLIENTE (server action)
export async function borrarCliente(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Usuario no autenticado." }

    const idCliente = formData.get('idCliente') as string
    
    const { error } = await supabase.from('clientes').delete().eq('id_cliente', idCliente).eq('id_empresa', user.id)
    if (error) return { error: error.message }

    revalidatePath('/dashboard')
    return { success: true, message: 'Cliente eliminado con éxito' }
}

// CERRAR SESIÓN (server action)
export async function cerrarSesion() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
}

// IMPORTACIÓN MASIVA DE CLIENTES
export async function importarClientesLote(
    inserts: Record<string, string>[], 
    updates: { id: string, data: Record<string, string> }[]
) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "No autorizado" }

    try {
        if (inserts.length > 0) {
            const insertsWithUser = inserts.map(i => ({ ...i, id_empresa: user.id }))
            const { error: insertError } = await supabase.from('clientes').insert(insertsWithUser)
            if (insertError) throw insertError
        }

        for (const update of updates) {
            const { error: updateError } = await supabase.from('clientes').update(update.data).eq('id_cliente', update.id).eq('id_empresa', user.id)
            if (updateError) throw updateError
        }

        revalidatePath('/dashboard')
        return { success: true, message: 'Importación realizada con éxito' }
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { error: error.message }
        }
        return { error: "Error desconocido durante la importación" }
    }
}