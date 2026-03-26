import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import DirectAdjustForm from "./DirectAdjustForm"

export default async function AdminDirectAdjustment() {
    const session = await auth()

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
        redirect("/")
    }

    return (
        <main className="dashboard">
            <Link href="/admin" className="nav-link" style={{ display: 'inline-block', marginBottom: '1rem', padding: '0.5rem 0', color: '#F59E0B' }}>
                &larr; Volver a Administración
            </Link>
            <header className="dashboard-header">
                <h1>Ajuste Directo</h1>
                <p className="text-muted" style={{ marginTop: '0.5rem' }}>Añade o resta tokens a un usuario conociendo su ID numérico.</p>
            </header>

            <section className="admin-section">
                <div className="form-card" style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
                    <DirectAdjustForm />
                </div>
            </section>
        </main>
    )
}
