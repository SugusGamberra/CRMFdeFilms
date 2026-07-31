import { redirect } from 'next/navigation'

// PÁGINA DE INICIO (RAÍZ)
// Sin  landing page, crm interno, redireccion al login
export default function HomePage() {
    redirect('/login')
}