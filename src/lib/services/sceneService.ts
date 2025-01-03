import { PrismaClient } from '@prisma/client'
import type { CreateSceneDto } from '$lib/types/Scene'

const prisma = new PrismaClient()

export const sceneService = {
    create: async (data: CreateSceneDto) => {
        try {
            const scene = await prisma.scene.create({
                data: {
                    title: data.title,
                    description: data.description,
                    characters: data.characterIds
                        ? {
                              create: data.characterIds.map((characterId) => ({
                                  character: {
                                      connect: { id: characterId },
                                  },
                              })),
                          }
                        : undefined,
                },
                include: {
                    characters: {
                        include: {
                            character: true,
                        },
                    },
                },
            })
            return scene
        } catch (error) {
            console.error('Error creating scene:', error)
            throw error
        }
    },

    update: async (id: number, data: CreateSceneDto) => {
        try {
            // D'abord, supprimer toutes les relations existantes
            await prisma.charactersOnScenes.deleteMany({
                where: { sceneId: id },
            })

            // Ensuite, mettre à jour la scène et créer les nouvelles relations
            const scene = await prisma.scene.update({
                where: { id },
                data: {
                    title: data.title,
                    description: data.description,
                    characters: data.characterIds
                        ? {
                              create: data.characterIds.map((characterId) => ({
                                  character: {
                                      connect: { id: characterId },
                                  },
                              })),
                          }
                        : undefined,
                },
                include: {
                    characters: {
                        include: {
                            character: true,
                        },
                    },
                },
            })
            return scene
        } catch (error) {
            console.error('Error updating scene:', error)
            throw error
        }
    },

    delete: async (id: number) => {
        try {
            // D'abord supprimer les relations dans CharactersOnScenes
            await prisma.charactersOnScenes.deleteMany({
                where: { sceneId: id },
            })

            // Ensuite supprimer la scène
            return await prisma.scene.delete({
                where: { id },
                include: {
                    characters: true,
                },
            })
        } catch (error) {
            console.error('Error deleting scene:', error)
            throw error
        }
    },

    getAll: async () => {
        try {
            return await prisma.scene.findMany({
                include: {
                    characters: {
                        include: {
                            character: true,
                        },
                    },
                },
            })
        } catch (error) {
            console.error('Error fetching scenes:', error)
            throw error
        }
    },
}
