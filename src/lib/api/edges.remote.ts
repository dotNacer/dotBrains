import { command, query } from '$app/server'
import { createEdgeSchema, updateEdgeSchema } from '$lib/schemas/edges'
import prisma from '$lib/server/prisma'
import { z } from 'zod'

// --- COMMANDS ---

export const createEdge = command(createEdgeSchema, async (data) => {
	return await prisma.edge.create({
		data,
	})
})

export const updateEdge = command(updateEdgeSchema, async ({ id, data }) => {
	return await prisma.edge.update({
		where: { id },
		data,
	})
})

export const deleteEdge = command(
	z.object({
		id: z.string(),
		sceneId: z.string(),
	}),
	async ({ id }) => {
		return await prisma.edge.delete({
			where: { id },
		})
	}
)

// --- QUERIES ---

export const getEdgesBySceneId = query(z.string(), async (sceneId) => {
	return await prisma.edge.findMany({
		where: { sceneId },
	})
})
