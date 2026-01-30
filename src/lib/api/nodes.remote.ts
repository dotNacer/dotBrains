import { command, query } from '$app/server'
import { createNodeSchema, updateNodeSchema } from '$lib/schemas/nodes'
import prisma from '$lib/server/prisma'
import { z } from 'zod'

// --- COMMANDS ---

export const createNode = command(createNodeSchema, async (data) => {
	return await prisma.node.create({
		data,
	})
})

export const updateNode = command(updateNodeSchema, async ({ id, data }) => {
	return await prisma.node.update({
		where: { id },
		data,
	})
})

export const deleteNode = command(
	z.object({
		id: z.string(),
		sceneId: z.string(), // On garde sceneId pour la cohérence même si non utilisé par Prisma
	}),
	async ({ id }) => {
		return await prisma.node.delete({
			where: { id },
		})
	}
)


export const getNodesBySceneId = query(z.string(), async (sceneId) => {
	return await prisma.node.findMany({
		where: { sceneId },
		include: {
			sceneEvent: {
				include: {
					characters: true,
				},
			},
		},
	})
})