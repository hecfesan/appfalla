import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function Home() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  if (!session.user.isApproved) {
    redirect("/waiting-approval")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  })

  // Get user pending orders for notification
  const pendingOrders = await prisma.order.count({
    where: { userId: session.user.id, status: "PENDING" }
  })

  // Get next upcoming event
  const nextEvent = await prisma.event.findFirst({
    where: { date: { gte: new Date() } },
    orderBy: { date: "asc" }
  })

  return (
    <main className="dashboard">
      <header className="dashboard-header" style={{ marginBottom: '1.5rem' }}>
        <div style={{ textAlign: "center", width: "100%" }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1rem' }}>
            <h2>Hola, {user.name} <span style={{ color: 'var(--primary)', fontSize: '0.9em', fontWeight: 'bold' }}>#{user.numericId}</span></h2>
            <p className="text-muted">@{user.username}</p>
          </div>
          <div className="balance-card">
            <h2 style={{ fontSize: "1rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Tus Tokens Disponibles</h2>
            <div className="balance-amount">{user.tokenBalance}</div>
          </div>
        </div>
      </header>

      {pendingOrders > 0 && (
        <div className="pending-orders-alert" style={{ marginBottom: '1.5rem' }}>
          Tienes {pendingOrders} pedido(s) pendientes de validación.
        </div>
      )}

      {nextEvent && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.8rem', color: 'var(--text)' }}>Próximo Evento Destacado</h3>
          <Link href="/eventos" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%)',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              borderRadius: '16px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '4rem', opacity: 0.1 }}>📅</div>
              <h4 style={{ margin: '0 0 0.25rem 0', color: '#8B5CF6', fontSize: '1.25rem', position: 'relative', zIndex: 1 }}>{nextEvent.title}</h4>
              <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)', fontSize: '0.9rem', position: 'relative', zIndex: 1 }}>
                {nextEvent.date.toLocaleDateString("es-ES", { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
              </p>
              {nextEvent.location && (
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', position: 'relative', zIndex: 1 }}>
                  📍 {nextEvent.location}
                </p>
              )}
              <div style={{ marginTop: '1rem', color: '#8B5CF6', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Ver Detalles &rarr;
              </div>
            </div>
          </Link>
        </div>
      )}

      <div className="hub-grid">
        <Link href="/comprar" className="hub-card">
          <div className="hub-icon">🛒</div>
          <h2>Comprar Tokens</h2>
          <p>Solicita más tokens. Pago en efectivo disponible.</p>
        </Link>
        <Link href="/usar" className="hub-card">
          <div className="hub-icon">🔥</div>
          <h2>Usar Tokens</h2>
          <p>Canjea tus tokens para realizar consumiciones.</p>
        </Link>
        <Link href="/historial" className="hub-card" style={{ borderColor: 'var(--primary)' }}>
          <div className="hub-icon" style={{ color: 'var(--primary)' }}>🕒</div>
          <h2>Mi Historial</h2>
          <p>Revisa tus compras de tokens y consumiciones pasadas.</p>
        </Link>
        <Link href="/comidas" className="hub-card" style={{ borderColor: '#10B981' }}>
          <div className="hub-icon" style={{ color: '#10B981' }}>🥘</div>
          <h2>Comidas</h2>
          <p>Apúntate a las próximas paellas y raciones de la falla.</p>
        </Link>
        <Link href="/eventos" className="hub-card" style={{ borderColor: '#8B5CF6' }}>
          <div className="hub-icon" style={{ color: '#8B5CF6' }}>📅</div>
          <h2>Eventos</h2>
          <p>Consulta la agenda y asiste a las actividades programadas.</p>
        </Link>
      </div>
    </main>
  )
}
