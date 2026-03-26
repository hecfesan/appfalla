"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function useTokensAction(amount) {
    const session = await auth()
    if (!session || !session.user) throw new Error("No autorizado")

    if (amount <= 0) throw new Error("Cantidad inválida")

    await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({ where: { id: session.user.id } })
        if (user.tokenBalance < amount) {
            throw new Error("Saldo insuficiente")
        }

        // Deduct tokens immediately to lock them
        await tx.user.update({
            where: { id: user.id },
            data: { tokenBalance: { decrement: amount } }
        })

        // Create pending redemption order
        await tx.redemption.create({
            data: {
                userId: user.id,
                tokensAmount: amount,
                status: "PENDING"
            }
        })
    })

    revalidatePath("/usar")
    revalidatePath("/")
    return { success: true }
}
