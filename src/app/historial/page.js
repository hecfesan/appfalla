import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

function getStatusBadge(status) {
    switch (status) {
        case 'PENDING': return <span className="badge badge-warning">Pendiente</span>;
        case 'VALIDATED': return <span className="badge badge-success">Completado</span>;
        case 'REJECTED': return <span className="badge badge-error">Rechazado</span>;
        default: return <span className="badge">{status}</span>;
    }
}

export default async function HistorialPage() {
    const session = await auth()
    if (!session) redirect("/login")
    if (!session.user.isApproved) redirect("/waiting-approval")

    const userId = session.user.id

    // Fetch all 5 event types
    const [orders, redemptions, adjustments, mealSubs, eventSubs] = await Promise.all([
        prisma.order.findMany({ where: { userId } }),
        prisma.redemption.findMany({ where: { userId } }),
        prisma.tokenAdjustment.findMany({ where: { userId } }),
        prisma.mealSubscription.findMany({ 
            where: { userId }, 
            include: { 
                meal: {
                    include: { event: true }
                } 
            } 
        }),
        prisma.eventSubscription.findMany({ where: { userId }, include: { event: true } })
    ])

    // Combine and normalize to a unified interface
    const history = [
        ...orders.map(o => ({
            ...o,
            eventType: 'COMPRA',
            title: '🛒 Compra de Tokens',
            amountText: `+${o.tokensAmount}`,
            color: 'var(--text)',
            statusNode: getStatusBadge(o.status)
        })),
        ...redemptions.map(r => ({
            ...r,
            eventType: 'CANJE',
            title: '🔥 Uso en Barra',
            amountText: `-${r.tokensAmount}`,
            color: 'var(--primary)',
            statusNode: getStatusBadge(r.status)
        })),
        ...adjustments.map(a => ({
            ...a,
            eventType: 'AJUSTE',
            title: '⚡ Ajuste de Administrador',
            amountText: a.amount > 0 ? `+${a.amount}` : `${a.amount}`,
            color: '#F59E0B',
            statusNode: <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Hecho manualmente</span>
        })),
        ...mealSubs.map(m => ({
            ...m,
            eventType: 'COMIDA',
            title: `🥘 Comida: ${m.meal.dishName}`,
            amountText: `${m.adultCount} A / ${m.childCount} N`,
            color: '#10B981',
            statusNode: <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Evento: {m.meal.event.title}</span>
        })),
        ...eventSubs.map(e => ({
            ...e,
            eventType: 'EVENTO',
            title: '📅 Apuntado a Evento',
            amountText: e.event.title,
            color: '#8B5CF6',
            statusNode: <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Confirmada asistencia</span>
        }))
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    return (
        <main className="dashboard">
            <Link href="/" className="nav-link" style={{ display: 'inline-block', marginBottom: '1rem', padding: '0.5rem 0', color: 'var(--primary)' }}>
                &larr; Volver al Panel
            </Link>
            <header className="dashboard-header" style={{ marginBottom: "1.5rem" }}>
                <h1>Mi Historial de Actividad</h1>
                <p className="text-muted" style={{ marginTop: '0.5rem' }}>Registro unificado de todo tu paso por la Falla.</p>
            </header>

            <section className="admin-section">
                {history.length === 0 ? (
                    <p className="empty-state">No tienes registros en tu historial todavía.</p>
                ) : (
                    <div className="orders-list">
                        {history.map(item => (
                            <div key={item.id + item.eventType} className="order-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: `6px solid ${item.color}`, paddingLeft: '1rem' }}>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.05rem', color: item.color }}>
                                        {item.title}
                                    </div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.4rem' }}>
                                        {new Date(item.createdAt).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right', maxWidth: '150px' }}>
                                    <div style={{ fontSize: (item.eventType === 'COMIDA' || item.eventType === 'EVENTO') ? '1rem' : '1.35rem', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {item.amountText}
                                    </div>
                                    <div style={{ marginTop: '0.4rem' }}>
                                        {item.statusNode}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    )
}
