"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function toggleMealSubscription(mealId, subscribe) {
    const session = await auth()
    if (!session) throw new Error("No autenticado")

    const userId = session.user.id

    if (subscribe) {
        // Apuntarse
        await prisma.mealSubscription.upsert({
            where: { userId_mealId: { userId, mealId } },
            create: { userId, mealId },
            update: {}
        })
    } else {
        // Desapuntarse
        await prisma.mealSubscription.deleteMany({
            where: { userId, mealId }
        })
    }

    revalidatePath("/comidas")
    revalidatePath("/admin/comidas")
    revalidatePath(`/admin/comidas/${mealId}`)

    return { success: true }
}
