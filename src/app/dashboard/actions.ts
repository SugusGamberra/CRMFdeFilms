'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// AÑADIR CLIENTE (server action)

export async function crearCliente(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    // Extracción de campos del formulario
    const nombreCompleto = formData.get('nombreCompleto') as string

    // validación de servidor: sin nombre se para la ejecución y evitamos errores
    if (!nombreCompleto || nombreCompleto.trim() === '') {
        console.error("Error: El nombre completo es obligatorio.")
        return
    }

    // Inserción de datos vinculado al ID de la empresa activa
    await supabase.from('clientes').insert([{
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
        web: formData.get('web') as string,
        tipo_cliente: formData.get('tipoCliente') as string,
    }])

    // Refrescar los datos del servidor para pintar el nuevo cliente
    revalidatePath('/dashboard')
}

//ACTUALIZAR CLIENTE (server action)

export async function actualizarCliente(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const idCliente = formData.get('idCliente') as string
    const nombreCompleto = formData.get('nombreCompleto') as string
    if (!nombreCompleto || nombreCompleto.trim() === '') return

    // Actualizar BBDD
    await supabase.from('clientes').update({
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
        web: formData.get('web') as string,
        tipo_cliente: formData.get('tipoCliente') as string,
    }).eq('id_cliente', idCliente).eq('id_empresa', user.id)
    
    // refrescar datos del server
    revalidatePath('/dashboard')
}

// BORRAR CLIENTE (server action)

export async function borrarCliente(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Extraccion del ID del cliente a borrar
    const idCliente = formData.get('idCliente') as string
    
    // borrar datos vinculados al id de la empresa activa
    await supabase.from('clientes').delete().eq('id_cliente', idCliente).eq('id_empresa', user.id)

    //refrescar datos del servidor
    revalidatePath('/dashboard')
}

// CERRAR SESIÓN (server action)
// Machaca la sesión en supabase y devuelve al login

export async function cerrarSesion() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
}