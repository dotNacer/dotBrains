import { PrismaClient } from '@prisma/client'
import type { CreateNoteDto } from '$lib/types/Note'

const prisma = new PrismaClient()

export const noteService = {
    create: async (data: CreateNoteDto) => {
        try {
            const note = await prisma.note.create({
                data: {
                    title: data.title,
                    content: data.content,
                    tags: data.tags,
                },
            })
            return note
        } catch (error) {
            console.error('Error creating note:', error)
            throw error
        }
    },

    update: async (id: number, data: CreateNoteDto) => {
        try {
            const note = await prisma.note.update({
                where: { id },
                data: {
                    title: data.title,
                    content: data.content,
                    tags: data.tags,
                },
            })
            return note
        } catch (error) {
            console.error('Error updating note:', error)
            throw error
        }
    },

    delete: async (id: number) => {
        try {
            return await prisma.note.delete({
                where: { id },
            })
        } catch (error) {
            console.error('Error deleting note:', error)
            throw error
        }
    },

    getAll: async () => {
        try {
            return await prisma.note.findMany({
                orderBy: {
                    updatedAt: 'desc',
                },
            })
        } catch (error) {
            console.error('Error fetching notes:', error)
            throw error
        }
    },

    getById: async (id: number) => {
        try {
            return await prisma.note.findUnique({
                where: { id },
            })
        } catch (error) {
            console.error('Error fetching note:', error)
            throw error
        }
    },
}
