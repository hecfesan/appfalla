import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import MakeAdminButton from "@/components/MakeAdminButton"
import ChangeUserPasswordForm from "@/components/ChangeUserPasswordForm"

export default async function SuperAdminDashboard() {
    const session = await auth()

    if (!session || session.user.role !== "SUPER_ADMIN") {
        redirect("/")
    }

    const users = await prisma.user.findMany({
        where: { role: { not: "SUPER_ADMIN" } },
        orderBy: { createdAt: "desc" }
    })

    return (
        <main className="dashboard">
            <header className="dashboard-header">
                <h1>Panel de Super Admin</h1>
                <div className="balance-card">
                    <h2>Usuarios Registrados</h2>
                    <div className="balance-amount">{users.length}</div>
                </div>
            </header>

            <section className="admin-section">
                <h3>Gestión de Roles</h3>
                {users.length === 0 ? (
                    <p className="empty-state">No hay usuarios registrados.</p>
                ) : (
                    <div className="users-list">
                        {users.map(user => (
                            <div key={user.id} className="user-card">
                                <div className="user-info">
                                    <strong>{user.name}</strong> (@{user.username})
                                    <div className="user-role">
                                        Rol actual: <span className="highlight">{user.role}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-end' }}>
                                    {user.role === "CONSUMER" ? (
                                        <MakeAdminButton userId={user.id} />
                                    ) : (
                                        <button className="btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }} disabled>Ya es Administrador</button>
                                    )}
                                    <ChangeUserPasswordForm userId={user.id} userName={user.name} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    )
}
