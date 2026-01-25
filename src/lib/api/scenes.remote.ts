import { command, query } from '$app/server'
import { createSceneSchema } from '$lib/schemas/scenes'
import prisma from '$lib/server/prisma'
import { z } from 'zod'


export const getScenes = query(async () => {
	return await prisma.scene.findMany({
		orderBy: { updatedAt: 'desc' },
	})
})

export const getSceneById = query(z.string(), async (id) => {
	return await prisma.scene.findUnique({
		where: { id },
	})
})

export const createScene = command(createSceneSchema, async (data) => {
	const scene = await prisma.scene.create({
		data: {
			name: data.name,
			description: data.description,
		},
	})
	return scene
})

export const updateScene = command(
	z.object({
		id: z.string(),
		data: createSceneSchema.partial(),
	}),
	async ({ id, data }) => {
		return await prisma.scene.update({
			where: { id },
			data: {
				name: data.name,
				description: data.description,
			},
		})
	}
)

export const deleteScene = command(z.string(), async (id) => {
	return await prisma.scene.delete({
		where: { id },
	})
})