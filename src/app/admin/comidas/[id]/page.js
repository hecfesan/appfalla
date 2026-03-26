import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import PrintButton from "@/components/PrintButton"

export default async function AdminMealDetails({ params }) {
    const session = await auth()
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
        redirect("/")
    }

    const resolvedParams = await params
    const { id } = resolvedParams
    const meal = await prisma.meal.findUnique({
        where: { id },
        include: {
            subscriptions: {
                include: { user: true },
                orderBy: { createdAt: "asc" }
            }
        }
    })

    if (!meal) {
        return (
            <main className="dashboard">
                <div className="empty-state">Comida no encontrada</div>
            </main>
        )
    }

    const attendeesCount = meal.subscriptions.length
    const totalMoney = attendeesCount * meal.price
    const dateStr = meal.date.toLocaleDateString("es-ES", { weekday: 'long', day: 'numeric', month: 'long' })
    const timeStr = meal.date.toLocaleTimeString("es-ES", { hour: '2-digit', minute: '2-digit' })

    return (
        <main className="dashboard">
            <style>{`
                @media print {
                    .print-hide { display: none !important; }
                    .dashboard { padding: 0 !important; max-width: 100% !important; }
                    .order-card { break-inside: avoid; border: 1px solid #ccc !important; box-shadow: none !important; }
                }
            `}</style>
            <div className="print-hide" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <Link href="/admin/comidas" className="nav-link" style={{ padding: '0.5rem 0', color: '#10B981' }}>
                    &larr; Volver a Gestión de Comidas
                </Link>
                <PrintButton />
            </div>
            <header className="dashboard-header">
                <h1>{meal.dishName}</h1>
                <p className="text-muted" style={{ marginTop: '0.5rem' }}>{dateStr} a las {timeStr} | Menú {meal.type === 'ADULT' ? 'Adulto' : 'Niño'}</p>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <div className="balance-card" style={{ flex: 1, borderColor: '#10B981' }}>
                        <h2 style={{ fontSize: "1rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Total Apuntados</h2>
                        <div className="balance-amount" style={{ color: '#10B981' }}>{attendeesCount}</div>
                    </div>
                    <div className="balance-card" style={{ flex: 1, borderColor: '#F59E0B' }}>
                        <h2 style={{ fontSize: "1rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Recaudación Prevista</h2>
                        <div className="balance-amount" style={{ color: '#F59E0B' }}>{totalMoney.toFixed(2)} €</div>
                    </div>
                </div>
            </header>

            <section className="admin-section" style={{ marginTop: '2rem' }}>
                <h3>Listado de Asistentes</h3>
                {attendeesCount === 0 ? (
                    <p className="empty-state">Todavía nadie se ha apuntado.</p>
                ) : (
                    <div className="orders-list">
                        {meal.subscriptions.map((sub, index) => (
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
