import { writable } from 'svelte/store'
import type { Node as PrismaNode } from '@prisma/client'
import { tryCatch } from '$lib/utils'
import { createNode, deleteNode, updateNode } from '$lib/api/nodes.remote'
import type { CreateNodeSchema } from '$lib/schemas/nodes'
import { z } from 'zod'

function createNodeStore() {
	const { subscribe, set, update } = writable<PrismaNode[]>([])

	return {
		subscribe,
		set,
		update,
		setBaseNodes: (nodes: PrismaNode[]) => set(nodes),
		addNode: async (dtoNode: z.infer<CreateNodeSchema>) => {
			const { data, error } = await tryCatch(createNode(dtoNode))

			if (error) {
				console.error('Error creating node:', error)
				throw error
			} else if (data) {
				update((state) => [...state, data])
				return data
			}
		},
		deleteNode: async (nodeId: string, sceneId: string) => {
			const { data, error } = await tryCatch(deleteNode({ id: nodeId, sceneId }))

			if (error) {
				console.error('Error deleting node:', error)
				throw error
			} else if (data) {
				update((state) => state.filter((node) => node.id !== nodeId))
				return data
			}
		},
		updateNode: async (
			nodeId: string,
			sceneId: string,
			updates: Partial<z.infer<CreateNodeSchema>>
		) => {
			const { data, error } = await tryCatch(
				updateNode({
					id: nodeId,
					sceneId,
					data: updates
				})
			)

			if (error) {
				console.error('Error updating node:', error)
				throw error
			} else if (data) {
				update((state) =>
					state.map((node) =>
						node.id === nodeId ? data : node
					)
				)
				return data
			}
		},
	}
}

export const nodesActions = createNodeStore()