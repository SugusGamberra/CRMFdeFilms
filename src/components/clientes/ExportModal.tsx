'use client'

import { useState } from 'react'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Cliente } from './ClienteItem'
import toast from 'react-hot-toast'

interface ExportModalProps {
    clientes: Cliente[]
    mode: 'full' | 'custom'
    onClose: () => void
}

export default function ExportModal({ clientes, mode, onClose }: ExportModalProps) {
    const [format, setFormat] = useState<'excel' | 'csv' | 'pdf' | 'json'>('excel')
    const [isExporting, setIsExporting] = useState(false)
    
    const [fields, setFields] = useState({
        // Datos Principales
        nombre: true, 
        cif: mode === 'full',
        tipo: mode === 'full',
        subtipo: mode === 'full',
        tipoOtro: mode === 'full',
        web: mode === 'full',
        emailEmpresa: mode === 'full',
        telEmpresa: mode === 'full',
        // Facturación
        dirFacturacion: mode === 'full',
        locFacturacion: mode === 'full',
        provFacturacion: mode === 'full',
        cpFacturacion: mode === 'full',
        paisFacturacion: mode === 'full',
        // Envío
        dirEnvio: mode === 'full',
        locEnvio: mode === 'full',
        provEnvio: mode === 'full',
        cpEnvio: mode === 'full',
        paisEnvio: mode === 'full',
        // Contacto Específico
        personaContacto: mode === 'full',
        tfnoContacto: mode === 'full',
        emailContacto: mode === 'full',
        // Notas
        notas: mode === 'full'
    })

    const handleExport = () => {
        setIsExporting(true)
        
        setTimeout(() => {
            if (format === 'pdf') {
                const doc = new jsPDF('landscape')
                
                const pdfData = clientes.map(c => {
                    const row: string[] = []
                    
                    if (fields.nombre || fields.cif || fields.tipo) {
                        const block = [
                            fields.nombre ? c.nombre_completo : '',
                            fields.cif && c.cif_nif ? `CIF: ${c.cif_nif}` : '',
                            fields.tipo && c.tipo_cliente ? `Tipo: ${c.tipo_cliente}${c.subtipo_empresa ? ` - ${c.subtipo_empresa}` : ''}${c.tipo_otro ? ` (${c.tipo_otro})` : ''}` : ''
                        ].filter(Boolean).join('\n')
                        row.push(block)
                    }
                    
                    if (fields.emailEmpresa || fields.telEmpresa || fields.web) {
                        const block = [
                            fields.emailEmpresa && c.email ? c.email : '',
                            fields.telEmpresa && c.telefono ? c.telefono : '',
                            fields.web && c.web ? c.web : ''
                        ].filter(Boolean).join('\n')
                        row.push(block)
                    }
                    
                    if (fields.dirFacturacion || fields.locFacturacion || fields.provFacturacion || fields.cpFacturacion || fields.paisFacturacion) {
                        const block = [
                            fields.dirFacturacion && c.direccion_facturacion ? c.direccion_facturacion : '',
                            `${fields.cpFacturacion && c.codigo_postal ? c.codigo_postal : ''} ${fields.locFacturacion && c.localidad ? c.localidad : ''}`.trim(),
                            `${fields.provFacturacion && c.provincia ? c.provincia : ''} ${fields.paisFacturacion && c.pais ? c.pais : ''}`.trim()
                        ].filter(Boolean).join('\n')
                        row.push(block)
                    }

                    if (fields.dirEnvio || fields.locEnvio || fields.provEnvio || fields.cpEnvio || fields.paisEnvio) {
                        const block = [
                            fields.dirEnvio && c.direccion_envio ? c.direccion_envio : '',
                            `${fields.cpEnvio && c.codigo_postal_envio ? c.codigo_postal_envio : ''} ${fields.locEnvio && c.localidad_envio ? c.localidad_envio : ''}`.trim(),
                            `${fields.provEnvio && c.provincia_envio ? c.provincia_envio : ''} ${fields.paisEnvio && c.pais_envio ? c.pais_envio : ''}`.trim()
                        ].filter(Boolean).join('\n')
                        if (block) row.push(block)
                    }

                    if (fields.personaContacto || fields.tfnoContacto || fields.emailContacto) {
                        const block = [
                            fields.personaContacto && c.persona_contacto ? c.persona_contacto : '',
                            fields.tfnoContacto && c.tfno_contacto ? c.tfno_contacto : '',
                            fields.emailContacto && c.email_contacto ? c.email_contacto : ''
                        ].filter(Boolean).join('\n')
                        if (block) row.push(block)
                    }

                    if (fields.notas) {
                        row.push(c.notas || '')
                    }

                    return row
                })

                const headers: string[] = []
                if (fields.nombre || fields.cif || fields.tipo) headers.push('Identificación')
                if (fields.emailEmpresa || fields.telEmpresa || fields.web) headers.push('Contacto Empresa')
                if (fields.dirFacturacion || fields.locFacturacion || fields.provFacturacion || fields.cpFacturacion || fields.paisFacturacion) headers.push('Facturación')
                if (fields.dirEnvio || fields.locEnvio || fields.provEnvio || fields.cpEnvio || fields.paisEnvio) headers.push('Envío')
                if (fields.personaContacto || fields.tfnoContacto || fields.emailContacto) headers.push('Persona Contacto')
                if (fields.notas) headers.push('Notas')

                const columnStyles: Record<number, { cellWidth: number }> = {}
                headers.forEach((h, i) => {
                    if (h === 'Notas') columnStyles[i] = { cellWidth: 50 } 
                    else if (h === 'Identificación') columnStyles[i] = { cellWidth: 40 }
                })

                autoTable(doc, { 
                    head: [headers], 
                    body: pdfData,
                    theme: 'grid',
                    styles: { fontSize: 8, cellPadding: 3, overflow: 'linebreak', valign: 'top' },
                    headStyles: { fillColor: [124, 58, 237], textColor: 255 },
                    columnStyles: columnStyles,
                    margin: { top: 15, right: 10, bottom: 15, left: 10 },
                    rowPageBreak: 'avoid'
                })
                
                doc.save(`Listado_Clientes.pdf`)
                setIsExporting(false)
                toast.success('Listado exportado correctamente')
                return
            }

            const dataToExport = clientes.map(c => {
                const row: Record<string, string> = {}
                if (fields.nombre) row['Nombre Completo'] = c.nombre_completo
                if (fields.cif) row['CIF / NIF'] = c.cif_nif || ''
                if (fields.tipo) row['Tipo Cliente'] = c.tipo_cliente || ''
                if (fields.subtipo) row['Subtipo Empresa'] = c.subtipo_empresa || ''
                if (fields.tipoOtro) row['Otro Tipo'] = c.tipo_otro || ''
                if (fields.web) row['Web'] = c.web || ''
                if (fields.emailEmpresa) row['Email Empresa'] = c.email || ''
                if (fields.telEmpresa) row['Teléfono Empresa'] = c.telefono || ''
                if (fields.dirFacturacion) row['Dirección Facturación'] = c.direccion_facturacion || ''
                if (fields.cpFacturacion) row['C.P. Facturación'] = c.codigo_postal || ''
                if (fields.locFacturacion) row['Localidad Facturación'] = c.localidad || ''
                if (fields.provFacturacion) row['Provincia Facturación'] = c.provincia || ''
                if (fields.paisFacturacion) row['País Facturación'] = c.pais || ''
                if (fields.dirEnvio) row['Dirección Envío'] = c.direccion_envio || ''
                if (fields.cpEnvio) row['C.P. Envío'] = c.codigo_postal_envio || ''
                if (fields.locEnvio) row['Localidad Envío'] = c.localidad_envio || ''
                if (fields.provEnvio) row['Provincia Envío'] = c.provincia_envio || ''
                if (fields.paisEnvio) row['País Envío'] = c.pais_envio || ''
                if (fields.personaContacto) row['Nombre Contacto'] = c.persona_contacto || ''
                if (fields.tfnoContacto) row['Teléfono Contacto'] = c.tfno_contacto || ''
                if (fields.emailContacto) row['Email Contacto'] = c.email_contacto || ''
                if (fields.notas) row['Notas'] = c.notas || ''
                return row
            })

            if (format === 'json') {
                const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `Listado_Clientes.${format}`
                a.click()
                setIsExporting(false)
                toast.success('Listado exportado correctamente')
                return
            }

            const ws = XLSX.utils.json_to_sheet(dataToExport)
            const colWidths = Object.keys(dataToExport[0] || {}).map(k => ({ wch: Math.max(k.length, 18) }))
            ws['!cols'] = colWidths

            const wb = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(wb, ws, "Clientes")
            XLSX.writeFile(wb, `Listado_Clientes.${format === 'csv' ? 'csv' : 'xlsx'}`)
            setIsExporting(false)
            toast.success('Listado exportado correctamente')
        }, 500)
    }

    const toggleSection = (sectionFields: Partial<typeof fields>, value: boolean) => {
        setFields(prev => {
            const next = { ...prev }
            let k: keyof typeof sectionFields
            for (k in sectionFields) {
                if (k !== 'nombre') { 
                    next[k] = value
                }
            }
            return next
        })
    }

    const isMainAllChecked = fields.cif && fields.tipo && fields.subtipo && fields.tipoOtro && fields.web && fields.emailEmpresa && fields.telEmpresa
    const isBillingAllChecked = fields.dirFacturacion && fields.locFacturacion && fields.provFacturacion && fields.cpFacturacion && fields.paisFacturacion
    const isShippingAllChecked = fields.dirEnvio && fields.locEnvio && fields.provEnvio && fields.cpEnvio && fields.paisEnvio
    const isContactAllChecked = fields.personaContacto && fields.tfnoContacto && fields.emailContacto && fields.notas

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl p-6 md:p-8 neu-raised bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 shadow-2xl relative">
                
                {/* CABECERA MODAL */}
                <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-white/10 pb-4 shrink-0">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                        {mode === 'full' ? 'Exportar Plantilla Completa' : 'Exportar Listado Personalizado'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition-colors cursor-pointer">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                    </button>
                </div>

                <div className="overflow-y-auto pr-2 custom-scrollbar flex-1 space-y-6">
                    {/* SELECCIÓN DE CAMPOS (solo en listado custom) */}
                    {mode === 'custom' && (
                        <div>
                            <p className="text-sm font-bold text-gray-600 dark:text-white/80 mb-4">¿Qué datos quieres incluir?</p>
                            
                            <div className="space-y-4">
                                {/* Datos principales */}
                                <div className="p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-black/20">
                                    <div className="flex justify-between items-center mb-3 border-b border-gray-200 dark:border-white/10 pb-2">
                                        <h3 className="text-xs font-bold uppercase tracking-wide text-gray-800 dark:text-white">Datos Principales</h3>
                                        <button 
                                            onClick={() => toggleSection({cif: true, tipo: true, subtipo: true, tipoOtro: true, web: true, emailEmpresa: true, telEmpresa: true}, !isMainAllChecked)} 
                                            className="text-xs font-bold transition-all hover:opacity-80 cursor-pointer"
                                            style={{ color: 'var(--dynamic-accent)' }}
                                        >
                                            {isMainAllChecked ? 'Desmarcar todo' : 'Marcar todo'}
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 dark:text-white/70">
                                        <label className="flex items-center gap-3 cursor-not-allowed opacity-50">
                                            <input type="checkbox" checked disabled className="sr-only" />
                                            <div className="w-6 h-6 rounded-lg flex items-center justify-center transition-all" style={{ backgroundColor: 'var(--dynamic-accent)' }}>
                                                <svg className="w-3.5 h-3.5 text-white opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <span>Nombre Completo</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input type="checkbox" checked={fields.cif} onChange={e => setFields({...fields, cif: e.target.checked})} className="sr-only peer" />
                                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 ${!fields.cif ? 'neu-inset' : ''}`} style={fields.cif ? { backgroundColor: 'var(--dynamic-accent)' } : {}}>
                                                <svg className={`w-3.5 h-3.5 text-white transition-opacity ${fields.cif ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <span>CIF / NIF</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input type="checkbox" checked={fields.tipo} onChange={e => setFields({...fields, tipo: e.target.checked})} className="sr-only peer" />
                                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 ${!fields.tipo ? 'neu-inset' : ''}`} style={fields.tipo ? { backgroundColor: 'var(--dynamic-accent)' } : {}}>
                                                <svg className={`w-3.5 h-3.5 text-white transition-opacity ${fields.tipo ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <span>Tipo de Cliente</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input type="checkbox" checked={fields.subtipo} onChange={e => setFields({...fields, subtipo: e.target.checked})} className="sr-only peer" />
                                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 ${!fields.subtipo ? 'neu-inset' : ''}`} style={fields.subtipo ? { backgroundColor: 'var(--dynamic-accent)' } : {}}>
                                                <svg className={`w-3.5 h-3.5 text-white transition-opacity ${fields.subtipo ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <span>Subtipo Empresa</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input type="checkbox" checked={fields.tipoOtro} onChange={e => setFields({...fields, tipoOtro: e.target.checked})} className="sr-only peer" />
                                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 ${!fields.tipoOtro ? 'neu-inset' : ''}`} style={fields.tipoOtro ? { backgroundColor: 'var(--dynamic-accent)' } : {}}>
                                                <svg className={`w-3.5 h-3.5 text-white transition-opacity ${fields.tipoOtro ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <span>Otro Tipo</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input type="checkbox" checked={fields.web} onChange={e => setFields({...fields, web: e.target.checked})} className="sr-only peer" />
                                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 ${!fields.web ? 'neu-inset' : ''}`} style={fields.web ? { backgroundColor: 'var(--dynamic-accent)' } : {}}>
                                                <svg className={`w-3.5 h-3.5 text-white transition-opacity ${fields.web ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <span>Página Web</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input type="checkbox" checked={fields.emailEmpresa} onChange={e => setFields({...fields, emailEmpresa: e.target.checked})} className="sr-only peer" />
                                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 ${!fields.emailEmpresa ? 'neu-inset' : ''}`} style={fields.emailEmpresa ? { backgroundColor: 'var(--dynamic-accent)' } : {}}>
                                                <svg className={`w-3.5 h-3.5 text-white transition-opacity ${fields.emailEmpresa ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <span>Email Empresa</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input type="checkbox" checked={fields.telEmpresa} onChange={e => setFields({...fields, telEmpresa: e.target.checked})} className="sr-only peer" />
                                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 ${!fields.telEmpresa ? 'neu-inset' : ''}`} style={fields.telEmpresa ? { backgroundColor: 'var(--dynamic-accent)' } : {}}>
                                                <svg className={`w-3.5 h-3.5 text-white transition-opacity ${fields.telEmpresa ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <span>Teléfono Empresa</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Facturación */}
                                <div className="p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-black/20">
                                    <div className="flex justify-between items-center mb-3 border-b border-gray-200 dark:border-white/10 pb-2">
                                        <h3 className="text-xs font-bold uppercase tracking-wide text-gray-800 dark:text-white">Facturación</h3>
                                        <button 
                                            onClick={() => toggleSection({dirFacturacion: true, locFacturacion: true, provFacturacion: true, cpFacturacion: true, paisFacturacion: true}, !isBillingAllChecked)} 
                                            className="text-xs font-bold transition-all hover:opacity-80 cursor-pointer"
                                            style={{ color: 'var(--dynamic-accent)' }}
                                        >
                                            {isBillingAllChecked ? 'Desmarcar todo' : 'Marcar todo'}
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 dark:text-white/70">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input type="checkbox" checked={fields.dirFacturacion} onChange={e => setFields({...fields, dirFacturacion: e.target.checked})} className="sr-only peer" />
                                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 ${!fields.dirFacturacion ? 'neu-inset' : ''}`} style={fields.dirFacturacion ? { backgroundColor: 'var(--dynamic-accent)' } : {}}>
                                                <svg className={`w-3.5 h-3.5 text-white transition-opacity ${fields.dirFacturacion ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <span>Dirección</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input type="checkbox" checked={fields.cpFacturacion} onChange={e => setFields({...fields, cpFacturacion: e.target.checked})} className="sr-only peer" />
                                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 ${!fields.cpFacturacion ? 'neu-inset' : ''}`} style={fields.cpFacturacion ? { backgroundColor: 'var(--dynamic-accent)' } : {}}>
                                                <svg className={`w-3.5 h-3.5 text-white transition-opacity ${fields.cpFacturacion ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <span>Código Postal</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input type="checkbox" checked={fields.locFacturacion} onChange={e => setFields({...fields, locFacturacion: e.target.checked})} className="sr-only peer" />
                                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 ${!fields.locFacturacion ? 'neu-inset' : ''}`} style={fields.locFacturacion ? { backgroundColor: 'var(--dynamic-accent)' } : {}}>
                                                <svg className={`w-3.5 h-3.5 text-white transition-opacity ${fields.locFacturacion ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <span>Localidad</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input type="checkbox" checked={fields.provFacturacion} onChange={e => setFields({...fields, provFacturacion: e.target.checked})} className="sr-only peer" />
                                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 ${!fields.provFacturacion ? 'neu-inset' : ''}`} style={fields.provFacturacion ? { backgroundColor: 'var(--dynamic-accent)' } : {}}>
                                                <svg className={`w-3.5 h-3.5 text-white transition-opacity ${fields.provFacturacion ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <span>Provincia</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input type="checkbox" checked={fields.paisFacturacion} onChange={e => setFields({...fields, paisFacturacion: e.target.checked})} className="sr-only peer" />
                                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 ${!fields.paisFacturacion ? 'neu-inset' : ''}`} style={fields.paisFacturacion ? { backgroundColor: 'var(--dynamic-accent)' } : {}}>
                                                <svg className={`w-3.5 h-3.5 text-white transition-opacity ${fields.paisFacturacion ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <span>País</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Envío */}
                                <div className="p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-black/20">
                                    <div className="flex justify-between items-center mb-3 border-b border-gray-200 dark:border-white/10 pb-2">
                                        <h3 className="text-xs font-bold uppercase tracking-wide text-gray-800 dark:text-white">Envío</h3>
                                        <button 
                                            onClick={() => toggleSection({dirEnvio: true, locEnvio: true, provEnvio: true, cpEnvio: true, paisEnvio: true}, !isShippingAllChecked)} 
                                            className="text-xs font-bold transition-all hover:opacity-80 cursor-pointer"
                                            style={{ color: 'var(--dynamic-accent)' }}
                                        >
                                            {isShippingAllChecked ? 'Desmarcar todo' : 'Marcar todo'}
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 dark:text-white/70">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input type="checkbox" checked={fields.dirEnvio} onChange={e => setFields({...fields, dirEnvio: e.target.checked})} className="sr-only peer" />
                                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 ${!fields.dirEnvio ? 'neu-inset' : ''}`} style={fields.dirEnvio ? { backgroundColor: 'var(--dynamic-accent)' } : {}}>
                                                <svg className={`w-3.5 h-3.5 text-white transition-opacity ${fields.dirEnvio ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <span>Dirección</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input type="checkbox" checked={fields.cpEnvio} onChange={e => setFields({...fields, cpEnvio: e.target.checked})} className="sr-only peer" />
                                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 ${!fields.cpEnvio ? 'neu-inset' : ''}`} style={fields.cpEnvio ? { backgroundColor: 'var(--dynamic-accent)' } : {}}>
                                                <svg className={`w-3.5 h-3.5 text-white transition-opacity ${fields.cpEnvio ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <span>Código Postal</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input type="checkbox" checked={fields.locEnvio} onChange={e => setFields({...fields, locEnvio: e.target.checked})} className="sr-only peer" />
                                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 ${!fields.locEnvio ? 'neu-inset' : ''}`} style={fields.locEnvio ? { backgroundColor: 'var(--dynamic-accent)' } : {}}>
                                                <svg className={`w-3.5 h-3.5 text-white transition-opacity ${fields.locEnvio ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <span>Localidad</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input type="checkbox" checked={fields.provEnvio} onChange={e => setFields({...fields, provEnvio: e.target.checked})} className="sr-only peer" />
                                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 ${!fields.provEnvio ? 'neu-inset' : ''}`} style={fields.provEnvio ? { backgroundColor: 'var(--dynamic-accent)' } : {}}>
                                                <svg className={`w-3.5 h-3.5 text-white transition-opacity ${fields.provEnvio ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <span>Provincia</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input type="checkbox" checked={fields.paisEnvio} onChange={e => setFields({...fields, paisEnvio: e.target.checked})} className="sr-only peer" />
                                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 ${!fields.paisEnvio ? 'neu-inset' : ''}`} style={fields.paisEnvio ? { backgroundColor: 'var(--dynamic-accent)' } : {}}>
                                                <svg className={`w-3.5 h-3.5 text-white transition-opacity ${fields.paisEnvio ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <span>País</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Persona contacto y notas */}
                                <div className="p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-black/20">
                                    <div className="flex justify-between items-center mb-3 border-b border-gray-200 dark:border-white/10 pb-2">
                                        <h3 className="text-xs font-bold uppercase tracking-wide text-gray-800 dark:text-white">Contacto y Otros</h3>
                                        <button 
                                            onClick={() => toggleSection({personaContacto: true, tfnoContacto: true, emailContacto: true, notas: true}, !isContactAllChecked)} 
                                            className="text-xs font-bold transition-all hover:opacity-80 cursor-pointer"
                                            style={{ color: 'var(--dynamic-accent)' }}
                                        >
                                            {isContactAllChecked ? 'Desmarcar todo' : 'Marcar todo'}
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 dark:text-white/70">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input type="checkbox" checked={fields.personaContacto} onChange={e => setFields({...fields, personaContacto: e.target.checked})} className="sr-only peer" />
                                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 ${!fields.personaContacto ? 'neu-inset' : ''}`} style={fields.personaContacto ? { backgroundColor: 'var(--dynamic-accent)' } : {}}>
                                                <svg className={`w-3.5 h-3.5 text-white transition-opacity ${fields.personaContacto ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <span>Nombre Contacto</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input type="checkbox" checked={fields.tfnoContacto} onChange={e => setFields({...fields, tfnoContacto: e.target.checked})} className="sr-only peer" />
                                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 ${!fields.tfnoContacto ? 'neu-inset' : ''}`} style={fields.tfnoContacto ? { backgroundColor: 'var(--dynamic-accent)' } : {}}>
                                                <svg className={`w-3.5 h-3.5 text-white transition-opacity ${fields.tfnoContacto ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <span>Teléfono Contacto</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input type="checkbox" checked={fields.emailContacto} onChange={e => setFields({...fields, emailContacto: e.target.checked})} className="sr-only peer" />
                                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 ${!fields.emailContacto ? 'neu-inset' : ''}`} style={fields.emailContacto ? { backgroundColor: 'var(--dynamic-accent)' } : {}}>
                                                <svg className={`w-3.5 h-3.5 text-white transition-opacity ${fields.emailContacto ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <span>Email Contacto</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input type="checkbox" checked={fields.notas} onChange={e => setFields({...fields, notas: e.target.checked})} className="sr-only peer" />
                                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 ${!fields.notas ? 'neu-inset' : ''}`} style={fields.notas ? { backgroundColor: 'var(--dynamic-accent)' } : {}}>
                                                <svg className={`w-3.5 h-3.5 text-white transition-opacity ${fields.notas ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <span>Notas de Cliente</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* FORMATO */}
                    <div className="mt-4">
                        <p className="text-sm font-bold text-gray-600 dark:text-white/80 mb-3">Formato de descarga</p>
                        <select 
                            value={format} 
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormat(e.target.value as 'excel' | 'csv' | 'pdf' | 'json')}
                            className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none neu-inset bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/5 cursor-pointer"
                        >
                            <option value="excel" className="bg-white dark:bg-slate-800 text-gray-800 dark:text-white">Excel (.xlsx)</option>
                            <option value="csv" className="bg-white dark:bg-slate-800 text-gray-800 dark:text-white">CSV (.csv)</option>
                            <option value="pdf" className="bg-white dark:bg-slate-800 text-gray-800 dark:text-white">PDF (.pdf) - Tabla Apaisada</option>
                            <option value="json" className="bg-white dark:bg-slate-800 text-gray-800 dark:text-white">JSON (.json)</option>
                        </select>
                    </div>
                </div>

                <div className="pt-6 mt-2 border-t border-gray-200 dark:border-white/10 flex gap-4 shrink-0">
                    <button onClick={onClose} className="neu-btn neu-btn-default neu-focus w-1/3 py-3 rounded-xl text-sm font-bold cursor-pointer">Cancelar</button>
                    <button onClick={handleExport} disabled={isExporting} className="neu-btn neu-btn-dynamic neu-focus w-2/3 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer border border-transparent dark:border-white/10">
                        {isExporting && (
                            <span aria-hidden="true">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </span>
                        )}
                        <span>{isExporting ? 'Exportando...' : 'Exportar Ahora'}</span>
                    </button>
                </div>
            </div>
        </div>
    )
}