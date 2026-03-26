"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createEventAction(title, dateISO, description, location) {
    const session = await auth()
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
        throw new Error("No autorizado")
    }

    if (!title || !dateISO) {
        throw new Error("El título y la fecha son obligatorios.")
    }

    await prisma.event.create({
        data: {
            title,
            date: new Date(dateISO),
            description: description || null,
            location: location || null
        }
    })

    revalidatePath("/admin/eventos")
    revalidatePath("/eventos")
    revalidatePath("/") // revalidate Home for the banner

    return { success: true }
}

export async function deleteEventAction(id) {
    const session = await auth()
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
        throw new Error("No autorizado")
    }

    if (!id) {
        throw new Error("El ID del evento es obligatorio.")
    }

    // Delete subscriptions first (Prisma takes care if defined in schema, but good to be sure or check if needed)
    // Actually EventSubscription has @@unique([userId, eventId]) and depends on Event.
    
    await prisma.event.delete({
        where: { id }
    })

    revalidatePath("/admin/eventos")
    revalidatePath("/eventos")
    revalidatePath("/")

    return { success: true }
}
