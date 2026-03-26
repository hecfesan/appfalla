import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function AdminEventsDashboard() {
    const session = await auth()
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
        redirect("/")
    }

    const events = await prisma.event.findMany({
        include: {
            _count: {
                select: { subscriptions: true }
            }
        },
        orderBy: { date: "asc" }
    })

    return (
        <main className="dashboard">
            <Link href="/admin" className="nav-link" style={{ display: 'inline-block', marginBottom: '1rem', padding: '0.5rem 0', color: '#8B5CF6' }}>
                &larr; Volver a Administración
            </Link>
            <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Gestión de Eventos</h1>
                    <p className="text-muted" style={{ fontSize: '0.9rem' }}>Controla las asistencias a los actos de la Falla.</p>
                </div>
                <Link href="/admin/eventos/crear" className="btn-primary" style={{ backgroundColor: '#8B5CF6', borderColor: '#8B5CF6', padding: '0.6rem 1rem', fontSize: '0.9rem' }}>
                    + Nuevo
                </Link>
            </header>

            <section className="admin-section" style={{ marginTop: '2rem' }}>
                {events.length === 0 ? (
                    <p className="empty-state">No hay eventos programados.</p>
                ) : (
                    <div className="orders-list">
                        {events.map(event => (
                            <Link key={event.id} href={`/admin/eventos/${event.id}`} className="order-card" style={{ display: 'block', textDecoration: 'none', color: 'inherit', borderLeft: '4px solid #8B5CF6' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div className="order-info">
                                        <strong style={{ fontSize: '1.1rem' }}>{event.title}</strong>
                                        <div className="order-details" style={{ marginTop: '0.3rem' }}>
                                            📅 {event.date.toLocaleDateString("es-ES", { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#8B5CF6' }}>
                                            {event._count.subscriptions} <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>apunt.</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </main>
    )
}
