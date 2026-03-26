"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function toggleEventSubscription(eventId, isEnrolled) {
    const session = await auth()
    if (!session) throw new Error("No autorizado")

    const userId = session.user.id

    if (isEnrolled) {
        // Check 3-day rule
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            select: { date: true }
        })

        if (!event) throw new Error("Evento no encontrado")

        const now = new Date()
        const eventDate = new Date(event.date)
        const diffTime = eventDate - now
        const diffDays = diffTime / (1000 * 60 * 60 * 24)

        if (diffDays < 3) {
            throw new Error("No puedes desapuntarte si quedan menos de 3 días para el evento.")
        }

        await prisma.eventSubscription.delete({
            where: {
                userId_eventId: { userId, eventId }
            }
        })
    } else {
        await prisma.eventSubscription.create({
            data: { userId, eventId }
        })
    }

    revalidatePath("/eventos")
    revalidatePath("/admin/eventos")
    revalidatePath("/admin/eventos/[id]", "page")
    revalidatePath("/historial")
    revalidatePath("/") // For Home Banner

    return { success: true }
}
