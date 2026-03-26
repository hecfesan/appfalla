import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import RedemptionActionButtons from "@/components/RedemptionActionButtons"
import Link from "next/link"

export default async function AdminCanjesDashboard() {
    const session = await auth()

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
        redirect("/")
    }

    const pendingRedemptions = await prisma.redemption.findMany({
        where: { status: "PENDING" },
        include: { user: true },
        orderBy: { createdAt: "asc" }
    })

    return (
        <main className="dashboard">
            <Link href="/admin" className="nav-link" style={{ display: 'inline-block', marginBottom: '1rem', padding: '0.5rem 0', color: 'var(--primary)' }}>
                &larr; Volver a Administración
            </Link>
            <header className="dashboard-header">
                <h1>Validación de Canjes</h1>
                <div className="balance-card">
                    <h2>Tickets Pendientes</h2>
                    <div className="balance-amount">{pendingRedemptions.length}</div>
                </div>
            </header>

            <section className="admin-section">
                <h3>Lista de tokens por usar en la barra</h3>
                {pendingRedemptions.length === 0 ? (
                    <p className="empty-state">No hay tickets de canje pendientes.</p>
                ) : (
                    <div className="orders-list">
                        {pendingRedemptions.map(r => (
                            <div key={r.id} className="order-card">
                                <div className="order-info">
                                    <strong>{r.user.name}</strong> (@{r.user.username})
                                    <div className="order-details">
                                        Desea utilizar: <span className="highlight" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{r.tokensAmount} Tokens</span>
                                    </div>
                                </div>
                                <RedemptionActionButtons id={r.id} />
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    )
}
