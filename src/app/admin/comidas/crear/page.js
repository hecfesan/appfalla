import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import CreateMealForm from "./CreateMealForm"

export default async function AdminCreateMeal() {
    const session = await auth()
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
        redirect("/")
    }

    return (
        <main className="dashboard">
            <Link href="/admin/comidas" className="nav-link" style={{ display: 'inline-block', marginBottom: '1rem', padding: '0.5rem 0', color: '#10B981' }}>
                &larr; Volver a Gestión de Comidas
            </Link>
            <header className="dashboard-header">
                <h1>Dar de alta comida</h1>
                <p className="text-muted" style={{ marginTop: '0.5rem' }}>Añade una nueva comida para que los usuarios puedan apuntarse.</p>
            </header>

            <section className="admin-section">
                <div className="form-card" style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
                    <CreateMealForm />
                </div>
            </section>
        </main>
    )
}
