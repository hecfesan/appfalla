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

    return (
        <main className="dashboard">
            <Link href="/admin" className="nav-link" style={{ display: 'inline-block', marginBottom: '1rem', padding: '0.5rem 0', color: 'var(--primary)' }}>
                &larr; Volver a Administración
            </Link>
            <header className="dashboard-header">
                <h1>Panel de Administración</h1>
                <div className="balance-card">
                    <h2>Pedidos Pendientes</h2>
                    <div className="balance-amount">{pendingOrders.length}</div>
                </div>
            </header>

            <section className="admin-section">
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
        </main>
    )
}
