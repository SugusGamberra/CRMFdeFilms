'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ACTUALIZAR NOMBRE DE USUARIO
export async function actualizarPerfil(formData: FormData) {
    const supabase = await createClient()
    const nombre = formData.get('nombre') as string

    if (!nombre || nombre.trim() === '') {
        return { error: 'El nombre no puede estar vacío.' }
    }

    const { error } = await supabase.auth.updateUser({
        data: { full_name: nombre }
    })

    if (error) return { error: error.message }
    
    revalidatePath('/perfil')
    return { exito: 'Perfil actualizado con éxito.' }
}

// ACTUALIZAR CONTRASEÑA
export async function actualizarPassword(formData: FormData) {
    const supabase = await createClient()
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!password || password.length < 6) {
        return { error: 'La contraseña debe tener al menos 6 caracteres.' }
    }

    if (password !== confirmPassword) {
        return { error: 'Las contraseñas no coinciden.' }
    }
    
    const { error } = await supabase.auth.updateUser({
        password: password
    })

    if (error) return { error: error.message }
    
    return { exito: 'Contraseña actualizada con éxito.' }
}