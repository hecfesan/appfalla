export const dynamic = 'force-dynamic'

import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import EventToggleCard from "./EventToggleCard"

export default async function ConsumerEvents() {
    const session = await auth()
    if (!session) redirect("/login")
    if (!session.user.isApproved) redirect("/waiting-approval")

    const userId = session.user.id

    const futureEvents = await prisma.event.findMany({
        where: {
            date: { gte: new Date() }
        },
        include: {
            meals: true
        },
        orderBy: { date: "asc" }
    })

    const mySubscriptions = await prisma.eventSubscription.findMany({
        where: { userId }
    })
    const mySubscribedEventIds = new Set(mySubscriptions.map(s => s.eventId))

    const myMealSubscriptions = await prisma.mealSubscription.findMany({
        where: { userId },
        include: { meal: true }
    })

    return (
        <main className="dashboard">
            <Link href="/" className="nav-link" style={{ display: 'inline-block', marginBottom: '1rem', padding: '0.5rem 0', color: '#8B5CF6' }}>
                &larr; Volver al Panel
            </Link>
            <header className="dashboard-header">
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.8rem' }}>📅</span> Próximos Eventos
                </h1>
                <p className="text-muted" style={{ marginTop: '0.5rem' }}>Confirma tu asistencia a las próximas actividades de la Falla.</p>
            </header>

            <section className="consumer-section" style={{ marginTop: '2rem' }}>
                {futureEvents.length === 0 ? (
                    <div className="empty-state" style={{ padding: '2rem', textAlign: 'center', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>😴</div>
                        <h3 style={{ margin: '0 0 0.5rem 0' }}>No hay eventos a la vista</h3>
                        <p className="text-muted" style={{ margin: 0 }}>Vuelve a comprobar más adelante cuando la programación avance.</p>
                    </div>
                ) : (
                    <div>
                        {futureEvents.map(event => (
                            <EventToggleCard
                                key={event.id}
                                event={event}
                                initiallyEnrolled={mySubscribedEventIds.has(event.id)}
                                initialMealSubs={myMealSubscriptions.filter(ms => ms.meal.eventId === event.id)}
                            />
                        ))}
                    </div>
                )}
            </section>
        </main>
    )
}
