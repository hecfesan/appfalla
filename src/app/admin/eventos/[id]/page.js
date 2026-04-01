export const dynamic = 'force-dynamic'

import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function AdminEventDetails({ params }) {
    const session = await auth()
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
        redirect("/")
    }

    const paramValues = await params
    const { id } = paramValues

    const event = await prisma.event.findUnique({
        where: { id },
        include: {
            subscriptions: {
                include: { user: true },
                orderBy: { createdAt: "asc" }
            },
            meals: {
                include: {
                    subscriptions: {
                        include: { user: true }
                    }
                }
            }
        }
    })

    if (!event) {
        return (
            <main className="dashboard">
                <div className="empty-state">Evento no encontrado</div>
            </main>
        )
    }

    // Build a map: userId → [{ dishName, adultCount, childCount, adultPrice, childPrice }]
    const userMealMap = {}
    for (const meal of event.meals) {
        for (const sub of meal.subscriptions) {
            if (!userMealMap[sub.userId]) userMealMap[sub.userId] = []
            userMealMap[sub.userId].push({
                dishName: meal.dishName,
                adultCount: sub.adultCount,
                childCount: sub.childCount,
                adultPrice: meal.adultPrice,
                childPrice: meal.childPrice,
            })
        }
    }

    const attendeesCount = event.subscriptions.length
    const dateStr = event.date.toLocaleDateString("es-ES", { weekday: 'long', day: 'numeric', month: 'long' })
    const timeStr = event.date.toLocaleTimeString("es-ES", { hour: '2-digit', minute: '2-digit' })

    const totalRevenue = event.meals.reduce((acc, meal) => {
        const adultTotal = meal.subscriptions.reduce((a, s) => a + s.adultCount, 0)
        const childTotal = meal.subscriptions.reduce((a, s) => a + s.childCount, 0)
        return acc + (adultTotal * meal.adultPrice) + (childTotal * meal.childPrice)
    }, 0)

    return (
        <main className="dashboard">
            <Link href="/admin/eventos" className="nav-link" style={{ display: 'inline-block', marginBottom: '1rem', padding: '0.5rem 0', color: '#8B5CF6' }}>
                &larr; Volver a Gestión de Eventos
            </Link>
            <header className="dashboard-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1>{event.title}</h1>
                        <p className="text-muted" style={{ marginTop: '0.5rem' }}>
                            📅 {dateStr} a las {timeStr}
                        </p>
                        {event.location && (
                            <p className="text-muted" style={{ marginTop: '0.2rem' }}>
                                📍 {event.location}
                            </p>
                        )}
                    </div>
                    <Link href={`/admin/eventos/${id}/editar`} className="btn-secondary" style={{ padding: '0.6rem 1rem', fontSize: '0.9rem' }}>
                        ✏️ Editar
                    </Link>
                </div>

                {event.description && (
                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                        <p style={{ margin: 0, color: 'var(--text)' }}>{event.description}</p>
                    </div>
                )}

                {/* Stats grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
                    <div className="balance-card" style={{ backgroundColor: 'var(--surface)', borderColor: '#8B5CF6' }}>
                        <h2 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>👥 Total Inscritos</h2>
                        <div className="balance-amount" style={{ color: '#8B5CF6', fontSize: '1.8rem' }}>{attendeesCount}</div>
                    </div>
                    <div className="balance-card" style={{ backgroundColor: 'rgba(245, 158, 11, 0.07)', borderColor: '#F59E0B' }}>
                        <h2 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>💰 Total Recaudado</h2>
                        <div className="balance-amount" style={{ color: '#D97706', fontSize: '1.8rem' }}>
                            {totalRevenue.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                        </div>
                    </div>
                    {event.meals.map(meal => {
                        const adultTotal = meal.subscriptions.reduce((acc, s) => acc + s.adultCount, 0)
                        const childTotal = meal.subscriptions.reduce((acc, s) => acc + s.childCount, 0)
                        const mealRevenue = (adultTotal * meal.adultPrice) + (childTotal * meal.childPrice)
                        return (
                            <div key={meal.id} className="balance-card" style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', borderColor: '#10B981' }}>
                                <h2 style={{ fontSize: '0.85rem', color: '#065F46', marginBottom: '0.5rem' }}>🍴 {meal.dishName}</h2>
                                <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#047857' }}>
                                    {adultTotal + childTotal} <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: '#065F46' }}>comensales</span>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#065F46', marginTop: '0.2rem' }}>
                                    {adultTotal} adultos · {childTotal} niños
                                </div>
                                <div style={{ marginTop: '0.5rem', fontSize: '1rem', fontWeight: 'bold', color: '#047857', borderTop: '1px solid rgba(16,185,129,0.2)', paddingTop: '0.4rem' }}>
                                    {mealRevenue.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </header>

            <section className="admin-section" style={{ marginTop: '2rem' }}>
                <h3>Listado de Asistentes</h3>
                {attendeesCount === 0 ? (
                    <p className="empty-state">Todavía nadie se ha apuntado al evento.</p>
                ) : (
                    <div className="orders-list">
                        {event.subscriptions.map((sub, index) => {
                            const userMeals = userMealMap[sub.userId] || []
                            const userTotal = userMeals.reduce((acc, m) =>
                                acc + (m.adultCount * m.adultPrice) + (m.childCount * m.childPrice), 0)

                            return (
                                <div key={sub.id} className="order-card" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                    {/* Número */}
                                    <div style={{ width: '30px', height: '30px', borderRadius: '15px', flexShrink: 0, backgroundColor: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--primary)', marginTop: '0.2rem' }}>
                                        {index + 1}
                                    </div>

                                    {/* Info principal */}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            <div>
                                                <strong>{sub.user.name}</strong>{' '}
                                                <span style={{ color: 'var(--primary)' }}>#{sub.user.numericId}</span>
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '0.5rem' }}>@{sub.user.username}</span>
                                            </div>
                                            {userTotal > 0 && (
                                                <span style={{
                                                    backgroundColor: 'rgba(245, 158, 11, 0.12)',
                                                    color: '#D97706',
                                                    padding: '0.2rem 0.7rem',
                                                    borderRadius: '20px',
                                                    fontWeight: 'bold',
                                                    fontSize: '0.9rem',
                                                    border: '1px solid rgba(245,158,11,0.25)'
                                                }}>
                                                    💶 {userTotal.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                                                </span>
                                            )}
                                        </div>

                                        {/* Comidas elegidas */}
                                        {userMeals.length > 0 && (
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                                                {userMeals.map((m, i) => (
                                                    <span key={i} style={{
                                                        backgroundColor: 'rgba(139, 92, 246, 0.08)',
                                                        border: '1px solid rgba(139, 92, 246, 0.2)',
                                                        borderRadius: '8px',
                                                        padding: '0.2rem 0.6rem',
                                                        fontSize: '0.8rem',
                                                        color: 'var(--text)',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.35rem'
                                                    }}>
                                                        🍴 <strong>{m.dishName}</strong>
                                                        {m.adultCount > 0 && <span>{m.adultCount}A</span>}
                                                        {m.childCount > 0 && <span>{m.childCount}N</span>}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        {userMeals.length === 0 && (
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                                                Sin comida
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </section>
        </main>
    )
}
