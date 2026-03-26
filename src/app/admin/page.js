import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function AdminMenu() {
    const session = await auth()

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
        redirect("/")
    }

    return (
        <main className="dashboard">
            <Link href="/" className="nav-link" style={{ display: 'inline-block', marginBottom: '1rem', padding: '0.5rem 0', color: 'var(--primary)' }}>
                &larr; Volver al Panel Principal
            </Link>
            <header className="dashboard-header" style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem' }}>Panel de Administración</h1>
                <p style={{ color: 'var(--text-muted)' }}>Elige qué listado deseas gestionar del sistema</p>
            </header>

            <div className="hub-grid">
                <Link href="/admin/compras" className="hub-card" style={{ borderColor: 'var(--success)' }}>
                    <div className="hub-icon" style={{ color: 'var(--success)' }}>🛒</div>
                    <h2>Validar Compras</h2>
                    <p>Revisa solicitudes de recarga de tokens.</p>
                </Link>
                <Link href="/admin/canjes" className="hub-card" style={{ borderColor: 'var(--primary)' }}>
                    <div className="hub-icon" style={{ color: 'var(--primary)' }}>🔥</div>
                    <h2>Validar Canjes</h2>
                    <p>Autoriza o rechaza los tickets de uso en la barra.</p>
                </Link>
                <Link href="/admin/directo" className="hub-card" style={{ borderColor: '#F59E0B' }}>
                    <div className="hub-icon" style={{ color: '#F59E0B' }}>⚡</div>
                    <h2>Ajuste Directo</h2>
                    <p>Edita los tokens de un usuario manualmente por ID.</p>
                </Link>
                <Link href="/admin/comidas" className="hub-card" style={{ borderColor: '#10B981' }}>
                    <div className="hub-icon" style={{ color: '#10B981' }}>🥘</div>
                    <h2>Gestión de Comidas</h2>
                    <p>Crea menús, listas de apuntados y estadísticas.</p>
                </Link>
                <Link href="/admin/eventos" className="hub-card" style={{ borderColor: '#8B5CF6' }}>
                    <div className="hub-icon" style={{ color: '#8B5CF6' }}>📅</div>
                    <h2>Gestión de Eventos</h2>
                    <p>Crea eventos y controla la lista de asistentes falleros.</p>
                </Link>
            </div>
        </main>
    )
}
