import type { Node as PrismaNode } from '@prisma/client'
import { tryCatch } from '$lib/utils'
import { createNode, deleteNode, updateNode } from '$lib/api/nodes.remote'
import type { CreateNodeSchema } from '$lib/schemas/nodes'
import { z } from 'zod'

export const nodeApi = {
	addNode: async (dtoNode: z.infer<CreateNodeSchema>): Promise<PrismaNode> => {
		const { data, error } = await tryCatch(createNode(dtoNode))
		if (error) {
			console.error('Error creating node:', error)
			throw error
		}
		return data!
	},

	deleteNode: async (nodeId: string, sceneId: string): Promise<PrismaNode> => {
		const { data, error } = await tryCatch(deleteNode({ id: nodeId, sceneId }))
		if (error) {
			console.error('Error deleting node:', error)
			throw error
		}
		return data!
	},

	saveNodePosition: async (nodeId: string, sceneId: string, x: number, y: number) => {
		const { error } = await tryCatch(
			updateNode({ id: nodeId, sceneId, data: { positionX: x, positionY: y } })
		)
		if (error) {
			console.error('Error saving node position:', error)
		}
	},

	updateNode: async (
		nodeId: string,
		sceneId: string,
		updates: Partial<z.infer<CreateNodeSchema>>
	): Promise<PrismaNode> => {
		const { data, error } = await tryCatch(updateNode({ id: nodeId, sceneId, data: updates }))
		if (error) {
			console.error('Error updating node:', error)
			throw error
		}
		return data!
	},
}
