import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import OrderActionButtons from "@/components/OrderActionButtons"
import Link from "next/link"

export default async function AdminDashboard() {
    const session = await auth()

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
        redirect("/")
    }

    const pendingOrders = await prisma.order.findMany({
        where: { status: "PENDING" },
        include: { user: true },
        orderBy: { createdAt: "asc" }
    })

    const completedOrders = await prisma.order.findMany({
        where: { status: "VALIDATED" },
        include: { user: true },
        orderBy: { createdAt: "desc" }
    })

    const totalTokensSold = completedOrders.reduce((acc, order) => acc + order.tokensAmount, 0)

    return (
        <main className="dashboard">
            <Link href="/admin" className="nav-link" style={{ display: 'inline-block', marginBottom: '1rem', padding: '0.5rem 0', color: 'var(--primary)' }}>
                &larr; Volver a Administración
            </Link>
            <header className="dashboard-header">
                <h1>Panel de Administración</h1>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <div className="balance-card" style={{ flex: 1 }}>
                        <h2>Pedidos Pendientes</h2>
                        <div className="balance-amount">{pendingOrders.length}</div>
                    </div>
                    <div className="balance-card" style={{ flex: 1, borderColor: '#10B981' }}>
                        <h2 style={{ color: "var(--text-muted)" }}>Total Tokens Vendidos</h2>
                        <div className="balance-amount" style={{ color: '#10B981' }}>{totalTokensSold}</div>
                    </div>
                </div>
            </header>

            <section className="admin-section" style={{ marginBottom: '2rem' }}>
                <h3>Validación de compras de tokens</h3>
                {pendingOrders.length === 0 ? (
                    <p className="empty-state">No hay pedidos pendientes de validación.</p>
                ) : (
                    <div className="orders-list">
                        {pendingOrders.map(order => (
                            <div key={order.id} className="order-card">
                                <div className="order-info">
                                    <strong>{order.user.name}</strong> (@{order.user.username})
                                    <div className="order-details">
                                        Solicita: <span className="highlight">{order.tokensAmount} Tokens</span> |
                                        Pago: {order.paymentMethod === "CASH" ? "Efectivo" : "Online"}
                                    </div>
                                </div>
                                <OrderActionButtons orderId={order.id} />
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="admin-section">
                <h3>Historial de Compras (Validadas)</h3>
                {completedOrders.length === 0 ? (
                    <p className="empty-state">Todavía no hay compras validadas en el historial.</p>
                ) : (
                    <div className="orders-list">
                        {completedOrders.map(order => (
                            <div key={order.id} className="order-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div className="order-info">
                                    <strong>{order.user.name}</strong> (@{order.user.username})
                                    <div className="order-details text-muted">
                                        Comprados: <span style={{ color: '#10B981', fontWeight: 'bold' }}>{order.tokensAmount} Tokens</span> | Pago: {order.paymentMethod === "CASH" ? "Efectivo" : "Online"}
                                    </div>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    {order.createdAt.toLocaleDateString("es-ES", { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    )
}
