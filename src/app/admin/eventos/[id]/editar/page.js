import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import EditEventForm from "./EditEventForm"

export default async function EditEventPage({ params }) {
    const session = await auth()
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
        redirect("/")
    }

    const paramValues = await params
    const { id } = paramValues

    const event = await prisma.event.findUnique({
        where: { id }
    })

    if (!event) {
        return (
            <main className="dashboard">
                <div className="empty-state">Evento no encontrado</div>
            </main>
        )
    }

    return (
        <main className="dashboard">
            <Link href={`/admin/eventos/${id}`} className="nav-link" style={{ display: 'inline-block', marginBottom: '1rem', padding: '0.5rem 0', color: '#8B5CF6' }}>
                &larr; Volver a Detalle del Evento
            </Link>
            
            <header className="dashboard-header">
                <div>
                    <h1>Editar Evento</h1>
                    <p className="text-muted">Modifica los detalles del evento "{event.title}".</p>
                </div>
            </header>

            <section className="admin-section" style={{ marginTop: '2rem', maxWidth: '600px' }}>
                <EditEventForm event={JSON.parse(JSON.stringify(event))} />
            </section>
        </main>
    )
}
