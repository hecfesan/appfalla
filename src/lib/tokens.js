import { v4 as uuidv4 } from "uuid"
import { prisma } from "@/lib/prisma"

export const getPasswordResetTokenByToken = async (token) => {
    try {
        const passwordResetToken = await prisma.passwordResetToken.findUnique({
            where: { token }
        })

        return passwordResetToken
    } catch {
        return null
    }
}

export const getPasswordResetTokenByEmail = async (email) => {
    try {
        const passwordResetToken = await prisma.passwordResetToken.findFirst({
            where: { email }
        })

        return passwordResetToken
    } catch {
        return null
    }
}

export const generatePasswordResetToken = async (email) => {
    const token = uuidv4()
    const expires = new Date(new Date().getTime() + 3600 * 1000) // 1 hour expirancy

    const existingToken = await getPasswordResetTokenByEmail(email)

    if (existingToken) {
        await prisma.passwordResetToken.delete({
            where: { id: existingToken.id }
        })
    }

    const passwordResetToken = await prisma.passwordResetToken.create({
        data: {
            email,
            token,
            expires
        }
    })

    return passwordResetToken
}
