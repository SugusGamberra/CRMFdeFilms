// Componente de servidor de next js para conectarse con server.ts

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

//PANEL PRINCIPAL (DASHBOARD)
// Vista para la gestión y alta  de clientes

export default async function DashboardPage() {
    // Inicializacion de conexion segura desde el servidor
    const supabase = await createClient()

    // OBTENER LISTA DE CLIENTES
    const { data: clientes, error } = await supabase.from('clientes').select('*').order('created_at', { ascending: false })

    // AÑADIR CLIENTE (server action)
    // Proceso del form HTML para insertar datos en Supabase

    const crearCliente = async (formData: FormData) => {
        'use server'
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

        const cifNif = formData.get('cifNif') as string
        const email = formData.get('email') as string
        const telefono = formData.get('telefono') as string
        const direccionFacturacion = formData.get('direccionFacturacion') as string
        const localidad = formData.get('localidad') as string
        const provincia = formData.get('provincia') as string
        const codigoPostal = formData.get('codigoPostal') as string
        const pais = formData.get('pais') as string
        const personaContacto = formData.get('personaContacto') as string
        const tfnoContacto = formData.get('tfnoContacto') as string
        const emailContacto = formData.get('emailContacto') as string
        const direccionEnvio = formData.get('direccionEnvio') as string
        const web = formData.get('web') as string
        const tipoCliente = formData.get('tipoCliente') as string

        // Inserción de datos vinculado al ID de la empresa activa
        await supabase.from('clientes').insert([
            {
                id_empresa: user.id,
                nombre_completo: nombreCompleto,
                cif_nif: cifNif,
                email: email,
                telefono: telefono,
                direccion_facturacion: direccionFacturacion,
                localidad: localidad,
                provincia: provincia,
                codigo_postal: codigoPostal,
                pais: pais,
                persona_contacto: personaContacto,
                tfno_contacto: tfnoContacto,
                email_contacto: emailContacto,
                direccion_envio: direccionEnvio,
                web: web,
                tipo_cliente: tipoCliente,
            },
        ])

        // Refrescar los datos del servidor para pintar el nuevo cliente
        revalidatePath('/dashboard')
    }

    //ACTUALIZAR CLIENTE (server action)

    const actualizarCliente = async (formData: FormData) => {
        'use server'
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return

        // Se extraen datos del formulario
        const idCliente = formData.get('idCliente') as string
        const nombreCompleto = formData.get('nombreCompleto') as string
        const cifNif = formData.get('cifNif') as string
        const email = formData.get('email') as string
        const telefono = formData.get('telefono') as string
        const direccionFacturacion = formData.get('direccionFacturacion') as string
        const localidad = formData.get('localidad') as string
        const provincia = formData.get('provincia') as string
        const codigoPostal = formData.get('codigoPostal') as string
        const pais = formData.get('pais') as string
        const personaContacto = formData.get('personaContacto') as string
        const tfnoContacto = formData.get('tfnoContacto') as string
        const emailContacto = formData.get('emailContacto') as string
        const direccionEnvio = formData.get('direccionEnvio') as string
        const web = formData.get('web') as string
        const tipoCliente = formData.get('tipoCliente') as string

        // Actualizar BBDD
        await supabase.from('clientes').update({
            nombre_completo: nombreCompleto,
            cif_nif: cifNif,
            email: email,
            telefono: telefono,
            direccion_facturacion: direccionFacturacion,
            localidad: localidad,
            provincia: provincia,
            codigo_postal: codigoPostal,
            pais: pais,
            persona_contacto: personaContacto,
            tfno_contacto: tfnoContacto,
            email_contacto: emailContacto,
            direccion_envio: direccionEnvio,
            web: web,
            tipo_cliente: tipoCliente,
        }).eq('id_cliente', idCliente).eq('id_empresa', user.id)

        // refrescar datos del server
        revalidatePath('/dashboard')
    }

    // BORRAR CLIENTE (server action)
    
    const borrarCliente = async (formData: FormData) => {
        'use server'
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

    // CERRAR SESION (server action)
    // Machaca la sesión en supabase y devuelve al login

    const cerrarSesion = async() => {
        'use server'
        const supabase = await createClient()
        await supabase.auth.signOut()
        redirect('/login')
    }

    return (
        <div className="mx-auto max-w-4xl p-8">
            {/* BOTÓN DE SALIR */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="mb-8 text-3xl font-bold text-slate-800">Gestión de clientes</h1>

                <form action={cerrarSesion}>
                    <button type="submit" className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-300 transition-colors">
                        Cerrar Sesión
                    </button>
                </form>
            </div>
            

            {/*FORMULARIO ALTA */}

            <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-slate-700">
                    Añadir nuevo cliente
                </h2>
                
                <form action={crearCliente} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/*DATOS PRINCIPALES */}
                    <div className="sm:col-span-2 md:col-span-3 border-b pb-2 mb-2">
                        <h3 className="text-sm font-bold text-indigo-600 uppercase">Datos Principales</h3>
                    </div>
                    
                    <div className="sm:col-span-2">
                        <label className="mb-1 block text-sm font-medium text-slate-600">Nombre Completo / Razón Social *</label>
                        <input type="text" name="nombreCompleto" required placeholder="Ej: EcoMagic" className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500" />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-600">CIF / NIF</label>
                        <input type="text" name="cifNif" placeholder="Ej: B12345678" className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500" />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-600">Tipo de Cliente</label>
                        <input type="text" name="tipoCliente" placeholder="Ej: Mayorista, Particular..." className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500" />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-600">Página Web</label>
                        <input type="text" name="web" placeholder="Ej: www.ecomagic.es" className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500" />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-600">Correo Electrónico (Empresa)</label>
                        <input type="email" name="email" placeholder="Ej: contacto@empresa.com" className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500" />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-600">Teléfono (Empresa)</label>
                        <input type="tel" name="telefono" placeholder="Ej: +34 612 345 678" className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500" />
                    </div>

                    {/*DATOS DE DIRECCIÓN */}
                    <div className="sm:col-span-2 md:col-span-3 border-b pb-2 mb-2 mt-4">
                        <h3 className="text-sm font-bold text-indigo-600 uppercase">Datos de Facturación y Envío</h3>
                    </div>

                    <div className="sm:col-span-2">
                        <label className="mb-1 block text-sm font-medium text-slate-600">Dirección de Facturación</label>
                        <input type="text" name="direccionFacturacion" placeholder="Ej: Calle Hécate, 1" className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500" />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="mb-1 block text-sm font-medium text-slate-600">Dirección de Envío</label>
                        <input type="text" name="direccionEnvio" placeholder="Si es distinta a la de facturación..." className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500" />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-600">Localidad</label>
                        <input type="text" name="localidad" placeholder="Ej: Puerto Real" className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500" />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-600">Provincia</label>
                        <input type="text" name="provincia" placeholder="Ej: Cádiz" className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500" />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-600">Código Postal</label>
                        <input type="text" name="codigoPostal" placeholder="Ej: 11111" className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500" />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-600">País</label>
                        <input type="text" name="pais" placeholder="Ej: España" className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500" />
                    </div>

                    {/*DATOS DE CONTACTO ESPECÍFICO */}
                    <div className="sm:col-span-2 md:col-span-3 border-b pb-2 mb-2 mt-4">
                        <h3 className="text-sm font-bold text-indigo-600 uppercase">Persona de Contacto</h3>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-600">Nombre de la persona</label>
                        <input type="text" name="personaContacto" placeholder="Ej: María García" className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500" />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-600">Teléfono directo</label>
                        <input type="tel" name="tfnoContacto" placeholder="Ej: +34 600 000 000" className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500" />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-600">Email directo</label>
                        <input type="email" name="emailContacto" placeholder="Ej: maria@empresa.com" className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500" />
                    </div>

                    {/*BOTÓN GUARDAR */}
                    <div className="sm:col-span-2 md:col-span-3 mt-4">
                        <button type="submit" className="w-full rounded-lg bg-indigo-600 py-3 font-medium text-white transition-colors hover:bg-indigo-700">
                            Guardar
                        </button>
                    </div>
                </form>
            </section>

            {/*SECCION LISTADO */}
            <section>
                <h2 className="mb-4 text-xl font-semibold text-slate-700">
                    Clientes Registrados
                </h2>

                {error ? (
                    <div className="mb-4 text-xl font-semibold text-slate-700">Error de Supabase: {error.message}</div>
                ) : (
                    <div className="space-y-4">
                        {clientes?.map((cliente) => (
                            <div key={cliente.id_cliente} className="rounded-lg border border-slate-300 p-4 bg-slate-50 flex flex-col gap-4">
                                
                                {/*SOLO PARA PRUEBAS!! */}
                                {/*
                                <pre className="text-xs text-slate-600 overflow-auto w-full max-h-32 bg-slate-200 p-2 rounded">
                                    {JSON.stringify(cliente, null, 2)}
                                </pre>
                                */}

                                {/*FORMULARIO EDITAR con scroll horizontal*/}
                                <form action={actualizarCliente} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 w-full items-end">
                                    <input type="hidden" name="idCliente" value={cliente.id_cliente} />
                                    
                                    <input type="text" name="nombreCompleto" defaultValue={cliente.nombre_completo || ''} placeholder="Nombre *" required className="w-full rounded border border-slate-300 p-2 text-sm outline-none focus:border-indigo-500" />
                                    <input type="text" name="cifNif" defaultValue={cliente.cif_nif || ''} placeholder="CIF/NIF" className="w-full rounded border border-slate-300 p-2 text-sm outline-none focus:border-indigo-500" />
                                    <input type="text" name="tipoCliente" defaultValue={cliente.tipo_cliente || ''} placeholder="Tipo Cliente" className="w-full rounded border border-slate-300 p-2 text-sm outline-none focus:border-indigo-500" />
                                    <input type="text" name="telefono" defaultValue={cliente.telefono || ''} placeholder="Tlf Empresa" className="w-full rounded border border-slate-300 p-2 text-sm outline-none focus:border-indigo-500" />
                                    <input type="email" name="email" defaultValue={cliente.email || ''} placeholder="Email Empresa" className="w-full rounded border border-slate-300 p-2 text-sm outline-none focus:border-indigo-500" />
                                    <input type="text" name="web" defaultValue={cliente.web || ''} placeholder="Web" className="w-full rounded border border-slate-300 p-2 text-sm outline-none focus:border-indigo-500" />
                                    
                                    <input type="text" name="direccionFacturacion" defaultValue={cliente.direccion_facturacion || ''} placeholder="Dir. Facturación" className="w-full rounded border border-slate-300 p-2 text-sm outline-none focus:border-indigo-500" />
                                    <input type="text" name="direccionEnvio" defaultValue={cliente.direccion_envio || ''} placeholder="Dir. Envío" className="w-full rounded border border-slate-300 p-2 text-sm outline-none focus:border-indigo-500" />
                                    <input type="text" name="localidad" defaultValue={cliente.localidad || ''} placeholder="Localidad" className="w-full rounded border border-slate-300 p-2 text-sm outline-none focus:border-indigo-500" />
                                    <input type="text" name="provincia" defaultValue={cliente.provincia || ''} placeholder="Provincia" className="w-full rounded border border-slate-300 p-2 text-sm outline-none focus:border-indigo-500" />
                                    <input type="text" name="codigoPostal" defaultValue={cliente.codigo_postal || ''} placeholder="CP" className="w-full rounded border border-slate-300 p-2 text-sm outline-none focus:border-indigo-500" />
                                    <input type="text" name="pais" defaultValue={cliente.pais || ''} placeholder="País" className="w-full rounded border border-slate-300 p-2 text-sm outline-none focus:border-indigo-500" />

                                    <input type="text" name="personaContacto" defaultValue={cliente.persona_contacto || ''} placeholder="Contacto (Nombre)" className="w-full rounded border border-slate-300 p-2 text-sm outline-none focus:border-indigo-500" />
                                    <input type="tel" name="tfnoContacto" defaultValue={cliente.tfno_contacto || ''} placeholder="Tlf Contacto" className="w-full rounded border border-slate-300 p-2 text-sm outline-none focus:border-indigo-500" />
                                    <input type="email" name="emailContacto" defaultValue={cliente.email_contacto || ''} placeholder="Email Contacto" className="w-full rounded border border-slate-300 p-2 text-sm outline-none focus:border-indigo-500" />
                                    
                                    {/*BOTON ACTUALIZAR */}
                                    <button type="submit" className="w-full rounded bg-indigo-600 px-2 py-2 text-sm font-bold text-white hover:bg-indigo-700 transition-colors">
                                        Actualizar
                                    </button>
                                </form>

                                {/*BOTON ELIMINAR */}
                                <form action={borrarCliente} className="shrink-0 self-end">
                                    <input type="hidden" name="idCliente" value={cliente.id_cliente} />
                                    
                                    <button type="submit" className="rounded bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 transition-colors mt-2">
                                        Eliminar
                                    </button>
                                </form>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}