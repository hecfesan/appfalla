"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function approveUserAction(userId) {
    const session = await auth()
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
        throw new Error("No autorizado")
    }

    await prisma.user.update({
        where: { id: userId },
        data: { isApproved: true }
    })

    revalidatePath("/admin/usuarios")
    revalidatePath("/superadmin")
    return { success: true }
}

export async function rejectUserAction(userId) {
    const session = await auth()
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
        throw new Error("No autorizado")
    }

    // We don't delete the user normally, just leave it as unapproved
    // or we could delete it if the admin wants. Let's delete for cleanliness.
    await prisma.user.delete({
        where: { id: userId }
    })

    revalidatePath("/admin/usuarios")
    revalidatePath("/superadmin")
    return { success: true }
}
