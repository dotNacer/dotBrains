import type { Edge as PrismaEdge } from '@prisma/client'
import { tryCatch } from '$lib/utils'
import { createEdge, deleteEdge, updateEdge } from '$lib/api/edges.remote'
import type { CreateEdgeSchema } from '$lib/schemas/edges'
import { z } from 'zod'

export const edgeApi = {
	addEdge: async (dtoEdge: z.infer<CreateEdgeSchema>): Promise<PrismaEdge> => {
		const { data, error } = await tryCatch(createEdge(dtoEdge))
		if (error) {
			console.error('Error creating edge:', error)
			throw error
		}
		return data!
	},

	deleteEdge: async (edgeId: string, sceneId: string): Promise<PrismaEdge> => {
		const { data, error } = await tryCatch(deleteEdge({ id: edgeId, sceneId }))
		if (error) {
			console.error('Error deleting edge:', error)
			throw error
		}
		return data!
	},

	updateEdge: async (
		edgeId: string,
		sceneId: string,
		updates: Partial<z.infer<CreateEdgeSchema>>
	): Promise<PrismaEdge> => {
		const { data, error } = await tryCatch(
			updateEdge({ id: edgeId, sceneId, data: updates })
		)
		if (error) {
			console.error('Error updating edge:', error)
			throw error
		}
		return data!
	},
}
