"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function adjustTokensAction(numericId, amountDifference) {
    const session = await auth()
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
        throw new Error("No autorizado")
    }

    const userToUpdate = await prisma.user.findUnique({
        where: { numericId }
    })

    if (!userToUpdate) {
        throw new Error(`No se ha encontrado a ningún usuario con el ID #${numericId}`)
    }

    const oldBalance = userToUpdate.tokenBalance
    const newBalance = oldBalance + amountDifference

    if (newBalance < 0) {
        throw new Error(`El usuario solo tiene ${oldBalance} tokens. No puedes restarle ${Math.abs(amountDifference)}.`)
    }

    await prisma.$transaction([
        prisma.user.update({
            where: { id: userToUpdate.id },
            data: { tokenBalance: newBalance }
        }),
        prisma.tokenAdjustment.create({
            data: {
                userId: userToUpdate.id,
                adminId: session.user.id,
                amount: amountDifference
            }
        })
    ])

    revalidatePath("/admin/directo")
    revalidatePath("/historial")
    return {
        success: true,
        message: `Actualizado: ${userToUpdate.name} (@${userToUpdate.username}) ahora tiene ${newBalance} tokens (Antes: ${oldBalance}).`
    }
}
