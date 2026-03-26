"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"

export async function updateProfileAction(data) {
    const session = await auth()
    if (!session || !session.user) throw new Error("No autorizado")

    const { name, password } = data
    const updateData = {}

    if (name && name.trim().length > 0) updateData.name = name
    if (password && password.length >= 6) {
        updateData.password = await bcrypt.hash(password, 10)
    }

    if (Object.keys(updateData).length > 0) {
        await prisma.user.update({
            where: { id: session.user.id },
            data: updateData
        })
    }

    revalidatePath("/perfil")
    revalidatePath("/")
    return { success: true }
}
