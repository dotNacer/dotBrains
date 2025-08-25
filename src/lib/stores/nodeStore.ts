import type { CreateNodeDto } from '@/types/Node'
import { tryCatch } from '@/utils'
import type { Node as PrismaNode } from '@prisma/client'
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
		setBaseNodes: (nodes: PrismaNode[]) => set(nodes),
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
				update((nodes) => [...nodes, data as PrismaNode])
			}
		},
	}
}
export const nodesActions = createNodeStore() // Store qui contient les infos BD des nodes
