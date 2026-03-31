"use server"

import { prisma } from "@/lib/prisma"
import { generatePasswordResetToken } from "@/lib/tokens"
import { sendPasswordResetEmail } from "@/lib/mail"

export async function forgotPasswordAction(formData) {
    const email = formData.get("email")

    if (!email) {
        return { error: "El correo electrónico es obligatorio" }
    }

    try {
        const user = await prisma.user.findFirst({
            where: { email }
        })

        if (!user) {
            // We return success anyway for security (don't reveal if email exists)
            return { success: "Si el correo está registrado, recibirás un enlace en unos minutos." }
        }

        const passwordResetToken = await generatePasswordResetToken(email)
        await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token)

        return { success: "Si el correo está registrado, recibirás un enlace en unos minutos." }
    } catch (error) {
        console.error(error)
        return { error: "Algo salió mal. Inténtalo de nuevo." }
    }
}
