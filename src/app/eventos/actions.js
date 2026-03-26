"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function toggleEventSubscription(eventId, isEnrolled) {
    const session = await auth()
    if (!session) throw new Error("No autorizado")

    const userId = session.user.id

    if (isEnrolled) {
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
