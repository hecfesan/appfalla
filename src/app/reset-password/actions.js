"use server"

import { prisma } from "@/lib/prisma"
import { getPasswordResetTokenByToken } from "@/lib/tokens"
import bcrypt from "bcryptjs"

export async function resetPasswordAction(values, token) {
    if (!token) {
        return { error: "Token de restablecimiento faltante." }
    }

    const { password } = values

    const existingToken = await getPasswordResetTokenByToken(token)

    if (!existingToken) {
        return { error: "El token no es válido o ha expirado." }
    }

    const hasExpired = new Date(existingToken.expires).getTime() < new Date().getTime()

    if (hasExpired) {
        return { error: "El token ha expirado." }
    }

    const existingUser = await prisma.user.findFirst({
        where: { email: existingToken.email }
    })

    if (!existingUser) {
        return { error: "El usuario no existe." }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.update({
        where: { id: existingUser.id },
        data: { password: hashedPassword }
    })

    await prisma.passwordResetToken.delete({
        where: { id: existingToken.id }
    })

    return { success: "¡Contraseña actualizada con éxito! Ya puedes iniciar sesión." }
}
