import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import MealToggleCard from "./MealToggleCard"

export default async function ConsumerMeals() {
    const session = await auth()
    if (!session) redirect("/login")

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const upcomingMeals = await prisma.meal.findMany({
        where: { date: { gte: today } },
        orderBy: { date: "asc" }
    })

    // Get user's current subscriptions finding their mealIds
    const userSubs = await prisma.mealSubscription.findMany({
        where: { userId: session.user.id },
        select: { mealId: true }
    })

    const subscribedMealIds = userSubs.map(s => s.mealId)

    return (
        <main className="dashboard">
            <Link href="/" className="nav-link" style={{ display: 'inline-block', marginBottom: '1rem', padding: '0.5rem 0', color: 'var(--primary)' }}>
                &larr; Volver al Panel
            </Link>
            <header className="dashboard-header">
                <h1>Apuntarse a Comidas</h1>
                <p className="text-muted" style={{ marginTop: '0.5rem' }}>Confirma tu asistencia a las próximas raciones y paellas.</p>
            </header>

            <section>
                {upcomingMeals.length === 0 ? (
                    <p className="empty-state">No hay comidas programadas próximos días.</p>
                ) : (
                    <div className="orders-list">
                        {upcomingMeals.map(meal => {
                            const isSubscribed = subscribedMealIds.includes(meal.id)
                            return (
                                <MealToggleCard key={meal.id} meal={meal} initialSubscribed={isSubscribed} />
                            )
                        })}
                    </div>
                )}
            </section>
        </main>
    )
}
