import { writable } from 'svelte/store'
import type { Edge as PrismaEdge } from '@prisma/client'
import { tryCatch } from '$lib/utils'
import { createEdge, deleteEdge, updateEdge } from '$lib/api/edges.remote'
import type { CreateEdgeSchema } from '$lib/schemas/edges'
import { z } from 'zod'

function createEdgeStore() {
	const { subscribe, set, update } = writable<PrismaEdge[]>([])

	return {
		subscribe,
		set,
		update,
		setBaseEdges: (edges: PrismaEdge[]) => set(edges),
		addEdge: async (dtoEdge: z.infer<CreateEdgeSchema>) => {
			const { data, error } = await tryCatch(createEdge(dtoEdge))
			
			if (error) {
				console.error('Error creating edge:', error)
				throw error
			} else if (data) {
				update((state) => [...state, data])
				return data
			}
		},
		deleteEdge: async (edgeId: string, sceneId: string) => {
			const { data, error } = await tryCatch(deleteEdge({ id: edgeId, sceneId }))
			
			if (error) {
				console.error('Error deleting edge:', error)
				throw error
			} else if (data) {
				update((state) => state.filter((edge) => edge.id !== edgeId))
				return data
			}
		},
		updateEdge: async (
			edgeId: string,
			sceneId: string,
			updates: Partial<z.infer<CreateEdgeSchema>>
		) => {
			const { data, error } = await tryCatch(
				updateEdge({ 
					id: edgeId, 
					sceneId, 
					data: updates 
				})
			)
			
			if (error) {
				console.error('Error updating edge:', error)
				throw error
			} else if (data) {
				update((state) =>
					state.map((edge) =>
						edge.id === edgeId ? data : edge
					)
				)
				return data
			}
		},
	}
}

export const edgesActions = createEdgeStore()