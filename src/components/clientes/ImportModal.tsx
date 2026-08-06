'use client'

import { useState } from 'react'
import * as XLSX from 'xlsx'
import { importarClientesLote } from '@/app/dashboard/actions'
import { Cliente } from './ClienteItem'
import toast from 'react-hot-toast'

interface ImportModalProps {
    clientes: Cliente[]
    onClose: () => void
}

type ActionType = 'crear' | 'sobrescribir' | 'complementar' | 'duplicar' | 'ignorar'

interface PreviewRow {
    id: number
    data: Partial<Cliente>
    isDuplicate: boolean
    existingCliente?: Cliente
    action: ActionType
}

export default function ImportModal({ clientes, onClose }: ImportModalProps) {
    const [previewRows, setPreviewRows] = useState<PreviewRow[]>([])
    const [isDragging, setIsDragging] = useState(false)
    const [loading, setLoading] = useState(false)
    
    // Estados nuevos para la descarga y validación
    const [isDownloading, setIsDownloading] = useState(false)
    const [downloadSuccess, setDownloadSuccess] = useState(false)

    // DESCARGAR PLANTILLA
    const descargarPlantilla = () => {
        const wsData = [{
            "Nombre Completo": "Ejemplo: Borrar esta fila", "CIF / NIF": "12345678A", "Tipo de Cliente": "Empresa", 
            "Subtipo Empresa": "Distribuidor", "Otro Tipo": "", "Email": "correo@ejemplo.com", "Teléfono": "600123456", 
            "Web": "www.ejemplo.com", "Dirección Facturación": "Calle Principal 1", "Localidad": "Madrid", "Provincia": "Madrid", 
            "Código Postal": "28001", "País": "España", "Nombre Contacto": "María", "Teléfono Contacto": "600654321", 
            "Email Contacto": "maria@ejemplo.com", "Dirección Envío": "", "Localidad Envío": "", 
            "Provincia Envío": "", "Código Postal Envío": "", "País Envío": "", "Notas": "Nota de prueba para ver el espacio"
        }, {
            "Nombre Completo": "", "CIF / NIF": "", "Tipo de Cliente": "", 
            "Subtipo Empresa": "", "Otro Tipo": "", "Email": "", "Teléfono": "", 
            "Web": "", "Dirección Facturación": "", "Localidad": "", "Provincia": "", 
            "Código Postal": "", "País": "", "Nombre Contacto": "", "Teléfono Contacto": "", 
            "Email Contacto": "", "Dirección Envío": "", "Localidad Envío": "", 
            "Provincia Envío": "", "Código Postal Envío": "", "País Envío": "", "Notas": ""
        }]

        const ws = XLSX.utils.json_to_sheet(wsData)
        const colWidths = Object.keys(wsData[0]).map(k => ({ wch: Math.max(k.length + 5, 20) }))
        ws['!cols'] = colWidths

        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Datos_Clientes")

        // instrucciones para guiar al usuario
        const wsInstrucciones = XLSX.utils.aoa_to_sheet([
            ["INSTRUCCIONES IMPORTANTES PARA IMPORTAR CLIENTES"],
            [""],
            ["1. NO modifiques la fila 1 (las cabeceras) de la pestaña 'Datos_Clientes'."],
            ["2. Rellena los datos a partir de la fila 3 (por favor, borra la fila 2 de Ejemplo)."],
            ["3. Para la columna 'Tipo de Cliente', debes escribir exactamente uno de estos valores:"],
            ["   - Particular"],
            ["   - Empresa"],
            ["   - Organismo público"],
            ["   - Otro"],
            ["4. Si escribiste 'Empresa', en la columna 'Subtipo Empresa' te sugerimos usar:"],
            ["   - Distribuidor, Proveedor, Mayorista, Minorista, Cliente final"],
            ["5. Si escribiste 'Otro' en la columna 'Otro Tipo' puedes especificar el tipo de cliente que sea."],
            ["6. Puedes dejar en blanco las celdas que no necesites. El ÚNICO obligatorio es el Nombre Completo."]
        ])
        wsInstrucciones['!cols'] = [{wch: 100}]
        XLSX.utils.book_append_sheet(wb, wsInstrucciones, "LEER_INSTRUCCIONES")

        XLSX.writeFile(wb, "Plantilla_Clientes.xlsx")
    }

    const iniciarDescarga = () => {
        setIsDownloading(true)
        setTimeout(() => {
            descargarPlantilla()
            setIsDownloading(false)
            setDownloadSuccess(true)
            toast.success('Plantilla descargada correctamente')
            setTimeout(() => setDownloadSuccess(false), 2500)
        }, 400)
    }

    const procesarArchivo = (file: File) => {
        // Validación de formato
        const validExtensions = ['.xlsx', '.xls', '.csv']
        const isValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
        const isValidMime = file.type.includes('excel') || file.type.includes('spreadsheetml') || file.type.includes('csv')
        
        if (!isValidExtension && !isValidMime) {
            toast.error('Tipo de formato de archivo inválido. Por favor, asegúrate de subir un Excel o CSV.')
            return
        }

        const reader = new FileReader()
        reader.onload = (evt) => {
            const arrayBuffer = evt.target?.result as ArrayBuffer
            if (!arrayBuffer) return
            
            const wb = XLSX.read(arrayBuffer, { type: 'array' })
            const wsname = wb.SheetNames[0]
            const ws = wb.Sheets[wsname]
            
            const data = XLSX.utils.sheet_to_json<Record<string, string | number>>(ws)

            // Validación de plantilla vacía
            if (!data || data.length === 0) {
                toast.error('La plantilla está vacía. Recuerda bajar la plantilla base e introducir tus datos.')
                return
            }

            // Validación de plantilla incorrecta
            if (!data[0].hasOwnProperty('Nombre Completo') && !data[0].hasOwnProperty('Nombre')) {
                toast.error('Formato incorrecto. Por favor, recuerda que debes bajar la plantilla base y hacerlo ahí.')
                return
            }

            const cleanRows: PreviewRow[] = []

            data.forEach((row, index) => {
                const mappedData: Partial<Cliente> = {
                    nombre_completo: String(row['Nombre Completo'] || row['Nombre'] || ''),
                    cif_nif: String(row['CIF / NIF'] || row['CIF'] || row['NIF'] || ''),
                    tipo_cliente: String(row['Tipo de Cliente'] || ''),
                    subtipo_empresa: String(row['Subtipo Empresa'] || ''),
                    tipo_otro: String(row['Otro Tipo'] || ''),
                    email: String(row['Email'] || ''),
                    telefono: String(row['Teléfono'] || row['Telefono'] || ''),
                    web: String(row['Web'] || ''),
                    direccion_facturacion: String(row['Dirección Facturación'] || row['Direccion'] || ''),
                    localidad: String(row['Localidad'] || ''),
                    provincia: String(row['Provincia'] || ''),
                    codigo_postal: String(row['Código Postal'] || row['CP'] || ''),
                    pais: String(row['País'] || row['Pais'] || ''),
                    persona_contacto: String(row['Nombre Contacto'] || row['Contacto'] || ''),
                    tfno_contacto: String(row['Teléfono Contacto'] || ''),
                    email_contacto: String(row['Email Contacto'] || ''),
                    direccion_envio: String(row['Dirección Envío'] || ''),
                    localidad_envio: String(row['Localidad Envío'] || ''),
                    provincia_envio: String(row['Provincia Envío'] || ''),
                    codigo_postal_envio: String(row['Código Postal Envío'] || ''),
                    pais_envio: String(row['País Envío'] || ''),
                    notas: String(row['Notas'] || '')
                }

                if (mappedData.nombre_completo === 'Ejemplo: Borrar esta fila' || mappedData.nombre_completo === '') {
                    return
                }

                const existing = clientes.find(c => 
                    (mappedData.cif_nif && c.cif_nif === mappedData.cif_nif) || 
                    (mappedData.nombre_completo && c.nombre_completo.toLowerCase() === mappedData.nombre_completo.toLowerCase())
                )

                cleanRows.push({
                    id: index,
                    data: mappedData,
                    isDuplicate: !!existing,
                    existingCliente: existing,
                    action: existing ? 'ignorar' : 'crear'
                })
            })
            
            setPreviewRows(cleanRows)
        }
        
        reader.readAsArrayBuffer(file)
    }

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) procesarArchivo(e.dataTransfer.files[0])
    }
    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) procesarArchivo(e.target.files[0])
    }

    const updateAction = (id: number, action: ActionType) => {
        setPreviewRows(prev => prev.map(r => r.id === id ? { ...r, action } : r))
    }

    const applyToAllDuplicates = (action: ActionType) => {
        setPreviewRows(prev => prev.map(r => r.isDuplicate ? { ...r, action } : r))
    }

    const handleImport = async () => {
        setLoading(true)
        const inserts: Partial<Cliente>[] = []
        const updates: {id: string, data: Partial<Cliente>}[] = []

        for (const row of previewRows) {
            if (row.action === 'ignorar') continue
            if (row.action === 'crear' || row.action === 'duplicar') {
                inserts.push(row.data)
            }
            if (row.action === 'sobrescribir' && row.existingCliente) {
                updates.push({ id: row.existingCliente.id_cliente, data: row.data })
            }
            if (row.action === 'complementar' && row.existingCliente) {
                const merged: Partial<Cliente> = { ...row.existingCliente }
                
                const rowDataKeys = Object.keys(row.data) as (keyof Cliente)[]
                for (const key of rowDataKeys) {
                    if ((!merged[key] || merged[key] === '') && row.data[key]) {
                        (merged as Record<string, string>)[key] = row.data[key] as string
                    }
                }
                updates.push({ id: row.existingCliente.id_cliente, data: merged })
            }
        }

        const result = await importarClientesLote(inserts, updates)
        setLoading(false)
        
        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success('Listado importado correctamente')
            onClose()
        }
    }

    const hasDuplicates = previewRows.some(r => r.isDuplicate)

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl p-6 md:p-8 neu-raised bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 shadow-2xl relative">
                
                {/* CABECERA MODAL */}
                <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-white/10 pb-4 shrink-0">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Importar Clientes</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition-colors cursor-pointer">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                    </button>
                </div>

                <div className="overflow-y-auto pr-2 custom-scrollbar flex-1">
                    
                    {/* ZONA DE SUBIDA */}
                    {previewRows.length === 0 ? (
                        <div className="space-y-6">
                            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-sm text-gray-800 dark:text-white/80">
                                <p className="mb-2"><strong>Instrucciones:</strong> Para que la web reconozca tus datos perfectamente, descarga primero nuestra plantilla base. Hemos dejado las celdas con el ancho perfecto y unas instrucciones claras en una segunda pestaña para guiarte.</p>
                                <div className="mt-4 flex justify-center">
                                    <button onClick={iniciarDescarga} disabled={isDownloading} className="neu-btn neu-btn-dynamic neu-focus px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer border border-transparent">
                                        {isDownloading ? (
                                            <>
                                                <span aria-hidden="true">
                                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                </span>
                                                <span>Descargando...</span>
                                            </>
                                        ) : downloadSuccess ? (
                                            <>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                                                <span>Descarga finalizada</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>
                                                </svg>
                                                <span>Descargar Plantilla Base</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div 
                                onClick={() => document.getElementById('file-upload-input')?.click()}
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={onDrop}
                                className={`w-full p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer focus:outline-none ${!isDragging ? 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500' : ''}`}
                                style={isDragging ? { borderColor: 'var(--dynamic-accent)', backgroundColor: 'color-mix(in srgb, var(--dynamic-accent) 15%, transparent)' } : {}}
                                role="button"
                                tabIndex={0}
                            >
                                <input type="file" id="file-upload-input" accept=".xlsx, .xls, .csv" className="hidden" onChange={handleFileInput} />
                                <div className="flex flex-col items-center pointer-events-none">
                                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 neu-raised">
                                        <svg className="w-8 h-8 transition-colors duration-300" style={{ color: 'var(--dynamic-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Arrastra tu archivo Excel aquí solamente</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* ZONA DE PREVISUALIZACIÓN */
                        <div className="space-y-6">
                            {hasDuplicates && (
                                <div className="p-4 rounded-2xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50">
                                    <p className="text-sm font-bold text-yellow-800 dark:text-yellow-200 mb-2">⚠️ Tienes clientes duplicados en este archivo.</p>
                                    <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-3">Puedes decidir qué hacer uno por uno, o aplicar una regla rápida a todos:</p>
                                    <div className="flex flex-wrap gap-2">
                                        <button onClick={() => applyToAllDuplicates('ignorar')} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white dark:bg-black/40 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 cursor-pointer">Ignorar Todos</button>
                                        <button onClick={() => applyToAllDuplicates('sobrescribir')} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800 hover:bg-red-200 cursor-pointer">Sobrescribir Todos</button>
                                        <button onClick={() => applyToAllDuplicates('complementar')} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-800 hover:bg-green-200 cursor-pointer">Complementar vacíos</button>
                                        <button onClick={() => applyToAllDuplicates('duplicar')} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800 hover:bg-purple-200 cursor-pointer">Mantener dobles</button>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3">
                                {previewRows.map((row) => (
                                    <div key={row.id} className={`p-4 rounded-xl border ${row.isDuplicate ? 'border-yellow-400 bg-yellow-50/50 dark:bg-yellow-900/10' : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5'}`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-bold text-gray-800 dark:text-white">{row.data.nombre_completo}</h4>
                                                <p className="text-xs text-gray-500 dark:text-white/60">{row.data.email || 'Sin email'} • {row.data.cif_nif || 'Sin CIF'}</p>
                                            </div>
                                            {!row.isDuplicate && (
                                                <span className="text-xs font-bold px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">Nuevo</span>
                                            )}
                                        </div>

                                        {row.isDuplicate && (
                                            <div className="mt-3 pt-3 border-t border-yellow-200 dark:border-yellow-800/30">
                                                <p className="text-xs font-bold text-yellow-800 dark:text-yellow-200 mb-2">Cliente existente. ¿Qué hacemos?</p>
                                                <div className="flex flex-wrap gap-4">
                                                    <label className="flex items-center gap-1.5 text-xs cursor-pointer text-gray-700 dark:text-white/80"><input type="radio" checked={row.action === 'ignorar'} onChange={() => updateAction(row.id, 'ignorar')} className="accent-gray-600" /> Ignorar</label>
                                                    <label className="flex items-center gap-1.5 text-xs cursor-pointer text-gray-700 dark:text-white/80"><input type="radio" checked={row.action === 'sobrescribir'} onChange={() => updateAction(row.id, 'sobrescribir')} className="accent-red-600" /> Sobrescribir</label>
                                                    <label className="flex items-center gap-1.5 text-xs cursor-pointer text-gray-700 dark:text-white/80"><input type="radio" checked={row.action === 'complementar'} onChange={() => updateAction(row.id, 'complementar')} className="accent-green-600" /> Completar datos</label>
                                                    <label className="flex items-center gap-1.5 text-xs cursor-pointer text-gray-700 dark:text-white/80"><input type="radio" checked={row.action === 'duplicar'} onChange={() => updateAction(row.id, 'duplicar')} className="accent-purple-600" /> Crear doble</label>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* PIE Y BOTÓN */}
                {previewRows.length > 0 && (
                    <div className="pt-6 mt-2 border-t border-gray-200 dark:border-white/10 flex gap-4 shrink-0">
                        <button onClick={() => setPreviewRows([])} className="neu-btn neu-btn-default neu-focus w-1/3 py-3 rounded-xl font-bold cursor-pointer">Atrás</button>
                        <button onClick={handleImport} disabled={loading} className="neu-btn neu-btn-dynamic neu-focus w-2/3 py-3 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer border border-transparent dark:border-white/10">
                            {loading && (
                                <span aria-hidden="true">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </span>
                            )}
                            <span>{loading ? 'Importando...' : 'Importar Ahora'}</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}