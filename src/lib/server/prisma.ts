import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function initializePrisma() {
    try {
        console.log('Initializing Prisma')
        await prisma.$connect()
    } catch (error) {
        console.error('Erreur lors de la connexion à Prisma:', error)
    }
}

export async function closePrisma() {
    try {
        console.log('Closing Prisma')
        await prisma.$disconnect()
    } catch (error) {
        console.error('Erreur lors de la fermeture de Prisma:', error)
    }
}

export default prisma
