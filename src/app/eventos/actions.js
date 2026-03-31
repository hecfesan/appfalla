"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function toggleEventSubscription(data) {
    const { eventId, isEnrolled, meals = [] } = data
    const session = await auth()
    if (!session) throw new Error("No autorizado")

    const userId = session.user.id

    if (isEnrolled && meals.length === 0) {
        // If they are enrolled and send 0 meals, it means they want to fully unsubscribe
        // but only if they are not just 'modifying' their event sub. 
        // Logic: if isEnrolled is true, and they call it, we check 3-day lock.
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            select: { date: true }
        })

        if (!event) throw new Error("Evento no encontrado")

        const now = new Date()
        const eventDate = new Date(event.date)
        const diffDays = (eventDate - now) / (1000 * 60 * 60 * 24)

        if (diffDays < 3) {
            throw new Error("No puedes desapuntarte si quedan menos de 3 días.")
        }

        // Delete sub and all related meal subs
        await prisma.eventSubscription.delete({
            where: { userId_eventId: { userId, eventId } }
        })
        
        // Find associated meals to delete subs
        const eventMeals = await prisma.meal.findMany({ where: { eventId } })
        const mealIds = eventMeals.map(m => m.id)
        
        await prisma.mealSubscription.deleteMany({
            where: { userId, mealId: { in: mealIds } }
        })
    } else {
        // Create or update subscription
        await prisma.eventSubscription.upsert({
            where: { userId_eventId: { userId, eventId } },
            update: {}, // No change to event sub itself
            create: { userId, eventId }
        })

        // Sync meals: delete old, create new
        const eventMeals = await prisma.meal.findMany({ where: { eventId } })
        const mealIds = eventMeals.map(m => m.id)
        
        await prisma.mealSubscription.deleteMany({
            where: { userId, mealId: { in: mealIds } }
        })

        if (meals.length > 0) {
            await prisma.mealSubscription.createMany({
                data: meals.map(m => ({
                    userId,
                    mealId: m.mealId,
                    adultCount: m.adultCount,
                    childCount: m.childCount
                }))
            })
        }
    }

    revalidatePath("/eventos")
    revalidatePath("/admin/eventos")
    revalidatePath("/admin/eventos/[id]", "page")
    revalidatePath("/historial")
    revalidatePath("/") // For Home Banner

    return { success: true }
}
