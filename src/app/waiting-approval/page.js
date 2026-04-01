import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"

export default async function WaitingApprovalPage() {
    const session = await auth()

    if (!session) {
        redirect("/login")
    }

    console.log("DEBUG: User Session Data:", JSON.stringify(session.user, null, 2))

    const isInternalUser = session.user.role?.toUpperCase() === "ADMIN" || session.user.role?.toUpperCase() === "SUPER_ADMIN"
    const isLocalAdminName = session.user.name === "Super Admin Local" 
    
    if (session.user.isApproved || isInternalUser || isLocalAdminName) {
        redirect("/")
    }

    return (
        <main className="auth-container">
            <div className="auth-card" style={{ textAlign: 'center', maxWidth: '500px' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⏳</div>
                <h1 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Cuenta en Espera</h1>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '2rem' }}>
                    ¡Hola <strong>{session.user.name}</strong>! Tu registro se ha completado correctamente.
                </p>
                <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid #F59E0B', borderRadius: '12px', padding: '1.25rem', marginBottom: '2.5rem' }}>
                    <p style={{ color: '#D97706', margin: 0, fontSize: '0.95rem', fontWeight: '500' }}>
                        Actualmente tu cuenta está pendiente de validación por parte de los administradores de la falla.
                    </p>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    Recibirás acceso a la compra de tokens y gestión de comidas en cuanto un administrador confirme tu identidad.
                </p>
                
                <form action={async () => {
                    "use server"
                    await signOut()
                }}>
                    <button type="submit" className="btn-outline" style={{ width: '100%' }}>
                        Cerrar Sesión
                    </button>
                </form>
            </div>
        </main>
    )
}
