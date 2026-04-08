import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

export async function POST(req) {
    try {
        const { username, name, password } = await req.json()

        if (!username || !name || !password) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 })
        }

        const existingUser = await prisma.user.findUnique({ where: { username } })
        if (existingUser) {
            return NextResponse.json({ error: "El nombre de usuario ya existe" }, { status: 400 })
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        // Use a raw query to atomically get the next numericId and avoid race conditions
        const result = await prisma.$queryRaw`SELECT COALESCE(MAX("numericId"), 0) + 1 AS next_id FROM "User"`
        const nextNumericId = Number(result[0].next_id)

        const user = await prisma.user.create({
            data: {
                name,
                username,
                password: hashedPassword,
                numericId: nextNumericId
            }
        })

        return NextResponse.json({ message: "Usuario registrado con éxito", user }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
