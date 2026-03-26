import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import CreateEventForm from "./CreateEventForm"

export default async function AdminCreateEvent() {
    const session = await auth()
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
        redirect("/")
    }

    return (
        <main className="dashboard">
            <Link href="/admin/eventos" className="nav-link" style={{ display: 'inline-block', marginBottom: '1rem', padding: '0.5rem 0', color: '#8B5CF6' }}>
                &larr; Volver a Gestión de Eventos
            </Link>
            <header className="dashboard-header">
                <h1>Dar de alta evento</h1>
                <p className="text-muted" style={{ marginTop: '0.5rem' }}>Añade un nuevo evento para que la Falla se apunte.</p>
            </header>

            <section className="admin-section">
                <div className="form-card" style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
                    <CreateEventForm />
                </div>
            </section>
        </main>
    )
}
