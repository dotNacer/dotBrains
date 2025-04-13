import type { Node } from '@xyflow/svelte'
import { writable } from 'svelte/store'
import { nodeService } from '@/services/nodeService'

function createNodeStore() {
    const { subscribe, set, update } = writable<Node[]>([])

    return {
        subscribe,
        set,
        update,
        fetch: async () => {
            const nodes = await nodeService.getAll()
            set((nodes as unknown as Node[]) || []) // Degueux mais j'ai pas de co..
        },
    }
}
export const nodes = createNodeStore()
