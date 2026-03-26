"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createMealAction(dishName, dateISO, type, price) {
    const session = await auth()
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
        throw new Error("No autorizado")
    }

    if (!dishName || !dateISO || !type || isNaN(price)) {
        throw new Error("Datos de comida inválidos o incompletos.")
    }

    const parsedPrice = parseFloat(price)
    if (parsedPrice < 0) {
        throw new Error("El precio no puede ser negativo.")
    }

    // Save Dish to history if new
    await prisma.dish.upsert({
        where: { name: dishName },
        update: {},
        create: { name: dishName }
    })

    // Create Meal
    await prisma.meal.create({
        data: {
            dishName,
            date: new Date(dateISO),
            type,
            price: parsedPrice
        }
    })

    revalidatePath("/admin/comidas")
    revalidatePath("/comidas")

    return { success: true }
}

export async function getDishesAction() {
    const session = await auth()
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) return []
    const dishes = await prisma.dish.findMany({ orderBy: { name: 'asc' } })
    return dishes.map(d => d.name)
}
