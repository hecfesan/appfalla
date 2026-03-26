"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createMealAction(dishName, dateISO, priceAdultStr, priceChildStr) {
    const session = await auth()
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
        throw new Error("No autorizado")
    }

    if (!dishName || !dateISO) {
        throw new Error("Faltan datos obligatorios del plato o la fecha.")
    }

    const pAdult = priceAdultStr ? parseFloat(priceAdultStr) : null
    const pChild = priceChildStr ? parseFloat(priceChildStr) : null

    if (pAdult === null && pChild === null) {
        throw new Error("Debes especificar al menos un precio (Adulto o Niño).")
    }

    if ((pAdult !== null && pAdult < 0) || (pChild !== null && pChild < 0)) {
        throw new Error("El precio no puede ser negativo.")
    }

    // Save Dish to history if new
    await prisma.dish.upsert({
        where: { name: dishName },
        update: {},
        create: { name: dishName }
    })

    // Create Adult Meal
    if (pAdult !== null) {
        await prisma.meal.create({
            data: {
                dishName,
                date: new Date(dateISO),
                type: "ADULT",
                price: pAdult
            }
        })
    }
    
    // Create Child Meal
    if (pChild !== null) {
        await prisma.meal.create({
            data: {
                dishName,
                date: new Date(dateISO),
                type: "CHILD",
                price: pChild
            }
        })
    }

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
