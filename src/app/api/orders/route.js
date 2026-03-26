import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req) {
    try {
        const session = await auth()

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { tokensAmount, paymentMethod } = await req.json()

        if (!tokensAmount || tokensAmount <= 0) {
            return NextResponse.json({ error: "Cantidad de tokens inválida" }, { status: 400 })
        }

        if (paymentMethod !== "CASH") {
            return NextResponse.json({ error: "El método de pago online está deshabilitado temporalmente." }, { status: 400 })
        }

        const order = await prisma.order.create({
            data: {
                userId: session.user.id,
                tokensAmount: parseInt(tokensAmount),
                paymentMethod: paymentMethod, // CASH
                status: "PENDING"
            }
        })

        return NextResponse.json({ success: true, order })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
