import { initializePrisma, closePrisma } from '$lib/server/prisma'
import { env } from '$env/dynamic/public'
;(async () => {
    await initializePrisma()
})()

process.on('SIGTERM', async () => {
    await closePrisma()
    process.exit(0)
})

process.on('SIGINT', async () => {
    await closePrisma()
    process.exit(0)
})
