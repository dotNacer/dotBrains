import type { XYPosition } from '@xyflow/svelte'
import { writable } from 'svelte/store'

// Store containg all the utils not related to the nodes or edges
// Related to flow functionalities
type FlowStore = {
	menuNode: {
		visible: boolean
		position: XYPosition
	}
}

function createFlowStore() {
	const { subscribe, set, update } = writable<FlowStore>({
		menuNode: { visible: false, position: { x: 0, y: 0 } },
	})

	return {
		subscribe,
		set,
		update,
		setMenuNode: (visible: boolean, position: XYPosition) =>
			update((state) => ({ ...state, menuNode: { visible, position } })),
	}
}

export const flowActions = createFlowStore()
