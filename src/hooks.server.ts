import { initializePrisma, closePrisma } from '$lib/server/prisma'

;(async () => {
    try {
        await initializePrisma()
    } catch (error) {
        console.error('Failed to initialize Prisma:', error)
        process.exit(1)
    }
})()

process.on('SIGTERM', async () => {
    await closePrisma()
    process.exit(0)
})

process.on('SIGINT', async () => {
    await closePrisma()
    process.exit(0)
})
