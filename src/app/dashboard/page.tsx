// Componente de servidor de next js para conectarse con server.ts

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

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
        const cifNif = formData.get('cifNif') as string
        const email = formData.get('email') as string
        const telefono = formData.get('telefono') as string
        const direccionFacturacion = formData.get('direccionFacturacion') as string

        // Inserción de datos vinculado al ID de la empresa activa
        await supabase.from('clientes').insert([
            {
                id_empresa: user.id,
                nombre_completo: nombreCompleto,
                cif_nif: cifNif,
                email: email,
                telefono: telefono,
                direccion_facturacion: direccionFacturacion,
            },
        ])

        // Refrescar los datos del servidor para pintar el nuevo cliente
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

    return (
        <div className="mx-auto max-w-4xl p-8">
            <h1 className="mb-8 text-3xl font-bold text-slate-800">Gestión de clientes</h1>

            {/*FORMULARIO ALTA */}

            <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-slate-700">
                    Añadir nuevo cliente
                </h2>
                
                <form action={crearCliente} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/*NOMBRE COMPLETO */}
                    <div className="sm:col-span-2">
                        <label className="mb-1 block text-sm font-medium text-slate-600">
                            Nombre Completo / Razón Social *
                        </label>

                        <input
                            type="text"
                            name="nombreCompleto"
                            required
                            placeholder="Ej: EcoMagic"
                            className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500"
                        />
                    </div>

                    {/*CIF NIF */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-600">
                            CIF / NIF
                        </label>
                        <input
                            type="text"
                            name="cifNif"
                            placeholder="Ej: B12345678"
                            className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500"
                        />
                    </div>

                    {/*EMAIL */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-600">
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Ej: contacto@empresa.com"
                            className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500"
                        />
                    </div>

                    {/*TELÉFONO */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-600">
                            Teléfono
                        </label>
                        <input
                            type="tel"
                            name="telefono"
                            placeholder="Ej: +34 612 345 678"
                            className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500"
                        />
                    </div>

                    {/*DIRECCIÓN DE FACTURACIÓN */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate600">
                            Dirección de Facturación
                        </label>
                        <input
                            type="text"
                            name="direccionFacturacion"
                            placeholder="Ej: Calle Hécate, 1, 11111, Sevilla"
                            className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500"
                        />
                    </div>

                    {/*BOTÓN GUARDAR */}
                    <div className="sm:col-span-2 mt-2">
                        <button type="submit" className="w-full rounded-lg bg-indigo-600 py-3 font-medium text-white transition-colors hover:bg-indigo-700">
                            Guardar Cliente
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
                            <div key={cliente.id_cliente} className="rounded-lg border border-slate-300 p-4 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                
                                <pre className="text-xs text-slate-600 overflow-auto w-full">
                                    {JSON.stringify(cliente, null, 2)}
                                </pre>

                                {/*BOTON ELIMINAR */}
                                <form action={borrarCliente} className="shrink-0">
                                    <input type="hidden" name="idCliente" value={cliente.id_cliente} />
                                    
                                    <button type="submit" className="rounded bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 transition-colors">
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