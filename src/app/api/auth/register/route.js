import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import { sendWelcomeEmail } from "@/lib/mail"

export async function POST(req) {
    try {
        const { username, name, email, password } = await req.json()

        if (!username || !name || !email || !password) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 })
        }

        const existingUser = await prisma.user.findUnique({ where: { username } })
        if (existingUser) {
            return NextResponse.json({ error: "Username already exists" }, { status: 400 })
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        const maxUser = await prisma.user.findFirst({
            orderBy: { numericId: 'desc' },
            select: { numericId: true }
        })
        const nextNumericId = maxUser?.numericId ? maxUser.numericId + 1 : 1

        const user = await prisma.user.create({
            data: {
                name,
                username,
                email,
                password: hashedPassword,
                numericId: nextNumericId
            }
        })

        // Send welcome email (non-blocking)
        sendWelcomeEmail(email, name, username).catch(console.error)

        return NextResponse.json({ message: "Usuario registrado con éxito", user }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
