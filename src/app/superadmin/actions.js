"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"

export async function makeAdmin(userId) {
    const session = await auth()
    if (!session || session.user.role !== "SUPER_ADMIN") {
        throw new Error("No autorizado")
    }

    await prisma.user.update({
        where: { id: userId },
        data: { role: "ADMIN" }
    })

    revalidatePath("/superadmin")
    return { success: true }
}

export async function changeUserPassword(userId, newPassword) {
    const session = await auth()
    if (!session || session.user.role !== "SUPER_ADMIN") {
        throw new Error("No autorizado")
    }

    if (!newPassword || newPassword.length < 4) {
        throw new Error("La contraseña debe tener al menos 4 caracteres")
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
    })

    return { success: true }
}
