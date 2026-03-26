"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function validateRedemption(id) {
    const session = await auth()
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) throw new Error("No autorizado")

    const redemption = await prisma.redemption.findUnique({ where: { id } })
    if (!redemption || redemption.status !== "PENDING") throw new Error("Canje no válido")

    await prisma.redemption.update({
        where: { id },
        data: { status: "VALIDATED" }
    })

    revalidatePath("/admin/canjes")
    return { success: true }
}

export async function rejectRedemption(id) {
    const session = await auth()
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) throw new Error("No autorizado")

    await prisma.$transaction(async (tx) => {
        const redemption = await tx.redemption.findUnique({ where: { id } })
        if (!redemption || redemption.status !== "PENDING") throw new Error("Canje no válido")

        await tx.redemption.update({
            where: { id },
            data: { status: "REJECTED" }
        })

        // Refund tokens since it was rejected
        await tx.user.update({
            where: { id: redemption.userId },
            data: { tokenBalance: { increment: redemption.tokensAmount } }
        })
    })

    revalidatePath("/admin/canjes")
    return { success: true }
}
