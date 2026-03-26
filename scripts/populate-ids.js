const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const users = await prisma.user.findMany({ orderBy: { createdAt: 'asc' } })

    let currentId = 1
    for (const user of users) {
        if (!user.numericId) {
            await prisma.user.update({
                where: { id: user.id },
                data: { numericId: currentId }
            })
            console.log(`[OK] Assigned ID ${currentId} to user: ${user.username}`)
        } else {
            console.log(`[-] User ${user.username} already has ID ${user.numericId}`)
            currentId = Math.max(currentId, user.numericId)
        }
        currentId++
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
