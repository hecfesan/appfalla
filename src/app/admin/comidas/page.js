import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function AdminMealsDashboard() {
    const session = await auth()
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
        redirect("/")
    }

    const meals = await prisma.meal.findMany({
        include: {
            _count: {
                select: { subscriptions: true }
            }
        },
        orderBy: { date: "asc" }
    })

    return (
        <main className="dashboard">
            <Link href="/admin" className="nav-link" style={{ display: 'inline-block', marginBottom: '1rem', padding: '0.5rem 0', color: '#10B981' }}>
                &larr; Volver a Administración
            </Link>
            <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Gestión de Comidas</h1>
                    <p className="text-muted" style={{ fontSize: '0.9rem' }}>Controla las asistencias y recaudación.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link href="/admin/comidas/resumen" className="btn-secondary" style={{ padding: '0.6rem 1rem', fontSize: '0.9rem' }}>
                        📋 Resumen Global
                    </Link>
                    <Link href="/admin/comidas/crear" className="btn-primary" style={{ backgroundColor: '#10B981', borderColor: '#10B981', padding: '0.6rem 1rem', fontSize: '0.9rem' }}>
                        + Alta
                    </Link>
                </div>
            </header>

            <section className="admin-section" style={{ marginTop: '2rem' }}>
                {meals.length === 0 ? (
                    <p className="empty-state">No hay comidas programadas.</p>
                ) : (
                    <div className="orders-list">
                        {meals.map(meal => {
                            const totalMoney = meal.price * meal._count.subscriptions
                            return (
                                <Link key={meal.id} href={`/admin/comidas/${meal.id}`} className="order-card" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div className="order-info">
                                            <strong style={{ fontSize: '1.1rem' }}>{meal.dishName}</strong> <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>({meal.type === 'ADULT' ? 'Adulto' : 'Niño'})</span>
                                            <div className="order-details" style={{ marginTop: '0.3rem' }}>
                                                📅 {meal.date.toLocaleDateString("es-ES", { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{meal._count.subscriptions} <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>apunt.</span></div>
                                            <div style={{ color: '#10B981', fontWeight: 'bold' }}>{totalMoney.toFixed(2)} €</div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </section>
        </main>
    )
}
