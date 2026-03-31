import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import UserApprovalControls from "./UserApprovalControls"

export default async function AdminUsersPage() {
    const session = await auth()

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
        redirect("/")
    }

    // Get all unapproved users
    const unapprovedUsers = await prisma.user.findMany({
        where: { isApproved: false },
        orderBy: { createdAt: "desc" }
    })

    // Get all approved but non-admin users (optional, to see who is already active)
    const activeUsers = await prisma.user.findMany({
        where: { isApproved: true, role: "CONSUMER" },
        orderBy: { numericId: "asc" }
    })

    return (
        <main className="dashboard">
            <Link href="/admin" className="nav-link" style={{ display: 'inline-block', marginBottom: '1rem', color: 'var(--primary)' }}>
                &larr; Volver al Panel Admin
            </Link>
            
            <header className="dashboard-header" style={{ marginBottom: '2rem' }}>
                <h1>Gestión de Usuarios</h1>
                <p style={{ color: 'var(--text-muted)' }}>Admite o rechaza nuevas solicitudes de registro</p>
            </header>

            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                    Pendientes de Aprobación 
                    <span style={{ marginLeft: '0.5rem', backgroundColor: 'var(--primary)', color: 'white', padding: '0.1rem 0.6rem', borderRadius: '12px', fontSize: '0.9rem' }}>
                        {unapprovedUsers.length}
                    </span>
                </h2>
                
                {unapprovedUsers.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem', backgroundColor: 'var(--card-bg)', borderRadius: '12px' }}>
                        No hay usuarios esperando aprobación.
                    </p>
                ) : (
                    <div className="users-list">
                        {unapprovedUsers.map(user => (
                            <div key={user.id} className="user-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', border: '1px solid #F59E0B', backgroundColor: 'rgba(245, 158, 11, 0.03)' }}>
                                <div className="user-info">
                                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{user.name}</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>@{user.username} • {user.email}</div>
                                    <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Registrado el: {new Date(user.createdAt).toLocaleDateString()}</div>
                                </div>
                                <UserApprovalControls userId={user.id} />
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Usuarios Activos (Consumidores)</h2>
                <div className="users-list">
                    {activeUsers.map(user => (
                        <div key={user.id} className="user-card" style={{ opacity: 0.8 }}>
                            <div className="user-info">
                                <strong>{user.name}</strong> (@{user.username})
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: {user.numericId} • {user.email}</div>
                            </div>
                            <div style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '0.9rem' }}>ACTIVO</div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    )
}
