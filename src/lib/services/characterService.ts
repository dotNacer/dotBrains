import { PrismaClient } from '@prisma/client'
import type { CreateCharacterDto } from '$lib/types/Character'

const prisma = new PrismaClient()

export const characterService = {
    create: async (data: CreateCharacterDto) => {
        try {
            const character = await prisma.character.create({
                data: {
                    name: data.name,
                    description: data.description,
                    scenes: data.sceneIds
                        ? {
                              create: data.sceneIds.map((sceneId) => ({
                                  scene: {
                                      connect: { id: sceneId },
                                  },
                              })),
                          }
                        : undefined,
                },
                include: {
                    scenes: {
                        include: {
                            scene: true,
                        },
                    },
                    references: true,
                },
            })
            return character
        } catch (error) {
            console.error('Error creating character:', error)
            throw error
        }
    },

    update: async (id: number, data: CreateCharacterDto) => {
        try {
            // D'abord, supprimer toutes les relations existantes
            await prisma.charactersOnScenes.deleteMany({
                where: { characterId: id },
            })

            // Ensuite, mettre à jour le personnage et créer les nouvelles relations
            const character = await prisma.character.update({
                where: { id },
                data: {
                    name: data.name,
                    description: data.description,
                    scenes: data.sceneIds
                        ? {
                              create: data.sceneIds.map((sceneId) => ({
                                  scene: {
                                      connect: { id: sceneId },
                                  },
                              })),
                          }
                        : undefined,
                },
                include: {
                    scenes: {
                        include: {
                            scene: true,
                        },
                    },
                    references: true,
                },
            })
            return character
        } catch (error) {
            console.error('Error updating character:', error)
            throw error
        }
    },

    delete: async (id: number) => {
        try {
            // D'abord supprimer les relations dans CharactersOnScenes
            await prisma.charactersOnScenes.deleteMany({
                where: {
                    characterId: id,
                },
            })

            // Ensuite supprimer les références
            await prisma.reference.deleteMany({
                where: {
                    characterId: id,
                },
            })

            // Enfin supprimer le personnage
            return await prisma.character.delete({
                where: { id },
                include: {
                    scenes: true,
                    references: true,
                },
            })
        } catch (error) {
            console.error('Error deleting character:', error)
            throw error
        }
    },

    getAll: async () => {
        try {
            return await prisma.character.findMany({
                include: {
                    scenes: {
                        include: {
                            scene: true,
                        },
                    },
                    references: true,
                },
            })
        } catch (error) {
            console.error('Error fetching characters:', error)
            throw error
        }
    },
    getById: async (id: number) => {
        try {
            return await prisma.character.findUnique({
                where: { id },
            })
        } catch (error) {
            console.error('Error fetching character by ID:', error)
            throw error
        }
    },
}
