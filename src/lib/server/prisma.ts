import { PrismaClient } from '@prisma/client'

// TypeScript declaration for global property
declare global {
    // eslint-disable-next-line no-var
    var __prisma: PrismaClient | undefined
}

// Singleton pattern to prevent multiple instances during dev/hot-reloads
const prisma = globalThis.__prisma || new PrismaClient()

if (!globalThis.__prisma) {
    globalThis.__prisma = prisma
}

export async function initializePrisma() {
    try {
        console.log('Initializing Prisma')
        await prisma.$connect()
    } catch (error) {
        console.error('Error connecting to Prisma:', error)
        throw error // Re-throw to propagate the error
    }
}

export async function closePrisma() {
    try {
        console.log('Closing Prisma')
        await prisma.$disconnect()
    } catch (error) {
        console.error('Error closing Prisma:', error)
        throw error
    }
}

export default prisma
