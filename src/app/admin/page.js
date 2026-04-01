import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function AdminMenu() {
    const session = await auth()

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
        redirect("/")
    }

    // Total recaudado de comidas en todos los eventos
    const allMealSubs = await prisma.mealSubscription.findMany({
        include: { meal: true }
    })
    const totalMealRevenue = allMealSubs.reduce((acc, sub) => {
        return acc + (sub.adultCount * sub.meal.adultPrice) + (sub.childCount * sub.meal.childPrice)
    }, 0)

    // Total de tokens comprados (pedidos validados)
    const validatedOrders = await prisma.order.findMany({
        where: { status: "VALIDATED" }
    })
    const totalTokensSold = validatedOrders.reduce((acc, o) => acc + o.tokensAmount, 0)

    // Pendientes
    const pendingOrders = await prisma.order.count({ where: { status: "PENDING" } })
    const pendingRedemptions = await prisma.redemption.count({ where: { status: "PENDING" } })

    return (
        <main className="dashboard">
            <Link href="/" className="nav-link" style={{ display: 'inline-block', marginBottom: '1rem', padding: '0.5rem 0', color: 'var(--primary)' }}>
                &larr; Volver al Panel Principal
            </Link>
            <header className="dashboard-header" style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem' }}>Panel de Administración</h1>
                <p style={{ color: 'var(--text-muted)' }}>Elige qué listado deseas gestionar del sistema</p>
            </header>

            {/* Resumen financiero */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {totalMealRevenue > 0 && (
                    <div className="balance-card" style={{ borderColor: '#F59E0B', backgroundColor: 'rgba(245, 158, 11, 0.05)' }}>
                        <h2 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>💰 Comidas Recaudado</h2>
                        <div className="balance-amount" style={{ color: '#D97706', fontSize: '1.6rem' }}>
                            {totalMealRevenue.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                        </div>
                    </div>
                )}
                <div className="balance-card" style={{ borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.05)' }}>
                    <h2 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>🎟️ Tokens Vendidos</h2>
                    <div className="balance-amount" style={{ color: '#10B981', fontSize: '1.6rem' }}>
                        {totalTokensSold}
                    </div>
                </div>
                {pendingOrders > 0 && (
                    <div className="balance-card" style={{ borderColor: 'var(--primary)', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
                        <h2 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>⏳ Compras Pendientes</h2>
                        <div className="balance-amount" style={{ color: 'var(--primary)', fontSize: '1.6rem' }}>
                            {pendingOrders}
                        </div>
                    </div>
                )}
                {pendingRedemptions > 0 && (
                    <div className="balance-card" style={{ borderColor: '#8B5CF6', backgroundColor: 'rgba(139, 92, 246, 0.05)' }}>
                        <h2 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>⏳ Canjes Pendientes</h2>
                        <div className="balance-amount" style={{ color: '#8B5CF6', fontSize: '1.6rem' }}>
                            {pendingRedemptions}
                        </div>
                    </div>
                )}
            </div>

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
                <Link href="/admin/eventos" className="hub-card" style={{ borderColor: '#8B5CF6' }}>
                    <div className="hub-icon" style={{ color: '#8B5CF6' }}>📅</div>
                    <h2>Gestión de Eventos</h2>
                    <p>Crea eventos y controla la lista de asistentes falleros.</p>
                </Link>
                <Link href="/admin/usuarios" className="hub-card" style={{ borderColor: '#6B7280' }}>
                    <div className="hub-icon" style={{ color: '#6B7280' }}>👤</div>
                    <h2>Admisión de Usuarios</h2>
                    <p>Acepta o rechaza solicitudes de nuevos registros.</p>
                </Link>
            </div>
        </main>
    )
}
