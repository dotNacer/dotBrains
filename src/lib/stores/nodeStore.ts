import type { Node } from '@xyflow/svelte'
import { writable } from 'svelte/store'

function createNodeStore() {
	const { subscribe, set, update } = writable<Node[]>([])

	return {
		subscribe,
		set,
		update,
		// Mettre les fonctions (Add, Update, Delete) juste en dessous
	}
}
export const nodes = createNodeStore()
