import type { CreateNodeDto } from '@/types/Node'
import { tryCatch } from '@/utils'
import type { Node as PrismaNode, Prisma } from '@prisma/client'
import { writable } from 'svelte/store'
// deux stores, mais c'est possiblement plus optimisable
// En gros le store nodes get les informations grace au page server,
// Dans ce store, on a avoir les fonctions correspondant a la BD
// - Supprimer, Ajouter, editer des infos BD

function createNodeStore() {
	const { subscribe, set, update } = writable<PrismaNode[]>([])

	return {
		subscribe,
		set,
		update,
		setBaseNodes: (nodes: PrismaNode[]) => update((state) => [...state, ...nodes]),
		addNode: async (dtoNode: CreateNodeDto) => {
			// const node = nodeService.create(dtoNode) // Dans la prochaine version, utiliser un truc comme ça avec les RFC.

			const { data, error } = await tryCatch(
				fetch(`/api/scenes/${dtoNode.sceneId}/nodes`, {
					method: 'POST',
					body: JSON.stringify(dtoNode),
				}).then((res) => res.json())
			)
			if (error) {
				console.error(error)
			} else {
				update((state) => [...state, data as PrismaNode])
			}
		},
		deleteNode: async (nodeId: string, sceneId: string) => {
			const { data, error } = await tryCatch(
				fetch(`/api/scenes/${sceneId}/nodes/${nodeId}`, {
					method: 'DELETE',
				}).then((res) => res.json())
			)
			if (error) {
				console.error(error)
			} else {
				update((state) => state.filter((node) => node.id !== data.id))
			}
		},
		updateNode: async (
			nodeId: string,
			sceneId: string,
			updates: Prisma.NodeUncheckedUpdateInput
		) => {
			const { data, error } = await tryCatch(
				fetch(`/api/scenes/${sceneId}/nodes/${nodeId}`, {
					method: 'PATCH',
					body: JSON.stringify(updates),
				}).then((res) => res.json())
			)
			if (error) {
				console.error(error)
			} else {
				update((state) =>
					state.map((node) =>
						node.id === nodeId ? { ...node, ...(data as PrismaNode) } : node
					)
				)
			}
		},
	}
}
export const nodesActions = createNodeStore() // Store qui contient les infos BD des nodes
