"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function validateOrder(orderId) {
    const session = await auth()
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
        throw new Error("No autorizado")
    }

    await prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({ where: { id: orderId } })
        if (!order || order.status === "VALIDATED") {
            throw new Error("Pedido no válido o ya validado")
        }

        await tx.order.update({
            where: { id: orderId },
            data: { status: "VALIDATED" }
        })

        await tx.user.update({
            where: { id: order.userId },
            data: { tokenBalance: { increment: order.tokensAmount } }
        })
    })

    revalidatePath("/admin")
    return { success: true }
}

export async function rejectOrder(orderId) {
    const session = await auth()
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
        throw new Error("No autorizado")
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order || order.status !== "PENDING") {
        throw new Error("Pedido no válido")
    }

    await prisma.order.update({
        where: { id: orderId },
        data: { status: "REJECTED" }
    })

    revalidatePath("/admin/compras")
    return { success: true }
}
