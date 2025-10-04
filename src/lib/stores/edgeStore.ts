import type { CreateEdgeDto } from '@/types/Edge'
import { tryCatch } from '@/utils'
import type { Edge as PrismaEdge, Prisma } from '@prisma/client'
import { writable } from 'svelte/store'

function createEdgeStore() {
	const { subscribe, set, update } = writable<PrismaEdge[]>([])

	return {
		subscribe,
		set,
		update,
		setBaseEdges: (edges: PrismaEdge[]) => update((state) => [...state, ...edges]),
		addEdge: async (dtoEdge: CreateEdgeDto) => {
			const { data, error } = await tryCatch(
				fetch(`/api/scenes/${dtoEdge.sceneId}/edges`, {
					method: 'POST',
					body: JSON.stringify(dtoEdge),
				}).then((res) => res.json())
			)
			if (error) {
				console.error(error)
			} else {
				update((state) => [...state, data as PrismaEdge])
			}
		},
		deleteEdge: async (edgeId: string, sceneId: string) => {
			const { data, error } = await tryCatch(
				fetch(`/api/scenes/${sceneId}/edges/${edgeId}`, {
					method: 'DELETE',
				}).then((res) => res.json())
			)
			if (error) {
				console.error(error)
			} else {
				update((state) => state.filter((edge) => edge.id !== data.id))
			}
		},
		updateEdge: async (
			edgeId: string,
			sceneId: string,
			updates: Prisma.EdgeUncheckedUpdateInput
		) => {
			const { data, error } = await tryCatch(
				fetch(`/api/scenes/${sceneId}/edges/${edgeId}`, {
					method: 'PATCH',
					body: JSON.stringify(updates),
				}).then((res) => res.json())
			)
			if (error) {
				console.error(error)
			} else {
				update((state) =>
					state.map((edge) =>
						edge.id === edgeId ? { ...edge, ...(data as PrismaEdge) } : edge
					)
				)
			}
		},
	}
}

export const edgesActions = createEdgeStore() // Store qui contient les infos BD des edges
