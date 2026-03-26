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
