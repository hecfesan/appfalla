import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function AdminEventDetails({ params }) {
    const session = await auth()
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
        redirect("/")
    }

    const paramValues = await params
    const { id } = paramValues

    const event = await prisma.event.findUnique({
        where: { id },
        include: {
            subscriptions: {
                include: { user: true },
                orderBy: { createdAt: "asc" }
            }
        }
    })

    if (!event) {
        return (
            <main className="dashboard">
                <div className="empty-state">Evento no encontrado</div>
            </main>
        )
    }

    const attendeesCount = event.subscriptions.length
    const dateStr = event.date.toLocaleDateString("es-ES", { weekday: 'long', day: 'numeric', month: 'long' })
    const timeStr = event.date.toLocaleTimeString("es-ES", { hour: '2-digit', minute: '2-digit' })

    return (
        <main className="dashboard">
            <Link href="/admin/eventos" className="nav-link" style={{ display: 'inline-block', marginBottom: '1rem', padding: '0.5rem 0', color: '#8B5CF6' }}>
                &larr; Volver a Gestión de Eventos
            </Link>
            <header className="dashboard-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1>{event.title}</h1>
                        <p className="text-muted" style={{ marginTop: '0.5rem' }}>
                            📅 {dateStr} a las {timeStr}
                        </p>
                        {event.location && (
                            <p className="text-muted" style={{ marginTop: '0.2rem' }}>
                                📍 {event.location}
                            </p>
                        )}
                    </div>
                    <Link href={`/admin/eventos/${id}/editar`} className="btn-secondary" style={{ padding: '0.6rem 1rem', fontSize: '0.9rem' }}>
                        ✏️ Editar
                    </Link>
                </div>

                {event.description && (
                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                        <p style={{ margin: 0, color: 'var(--text)' }}>{event.description}</p>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <div className="balance-card" style={{ flex: 1, borderColor: '#8B5CF6' }}>
                        <h2 style={{ fontSize: "1rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Total Apuntados</h2>
                        <div className="balance-amount" style={{ color: '#8B5CF6' }}>{attendeesCount}</div>
                    </div>
                </div>
            </header>

            <section className="admin-section" style={{ marginTop: '2rem' }}>
                <h3>Listado de Asistentes</h3>
                {attendeesCount === 0 ? (
                    <p className="empty-state">Todavía nadie se ha apuntado al evento.</p>
                ) : (
                    <div className="orders-list">
                        {event.subscriptions.map((sub, index) => (
                            <div key={sub.id} className="order-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '30px', height: '30px', borderRadius: '15px', backgroundColor: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--primary)' }}>
                                    {index + 1}
                                </div>
                                <div className="order-info">
                                    <strong>{sub.user.name}</strong> <span style={{ color: 'var(--primary)' }}>#{sub.user.numericId}</span>
                                    <div className="order-details text-muted">
                                        @{sub.user.username}
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
