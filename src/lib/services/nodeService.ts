import { get } from 'svelte/store'
import { nodes } from '$lib/stores/nodeStore'
import type { Node, NodeTypes, XYPosition } from '@xyflow/svelte'

/* Documentation: https://svelteflow.dev/api-reference/types/node */

// addNode va chercher le dernier ID, et prends un type de Node en argument, prends ensuite les data en argument (T)

/**
 * Adds a node to the nodes store.
 * @param type - The type of the node.
 * @param data - The data of the node.
 * @param position - The position of the node.
 */
export const addNode = <T extends Record<string, unknown>>(
    type: keyof NodeTypes,
    data: T,
    position: XYPosition
) => {
    const newId = (parseInt(getLastNodeID() ?? '1') + 1).toString()
    const node = { id: newId, type, data, position }
    nodes.update((nodes) => [...nodes, node])
}

/**
 * Removes a node from the nodes store.
 * @param id - The ID of the node to remove.
 */
export const removeNode = (id: string) => {
    nodes.update((nodes) => nodes.filter((node) => node.id !== id))
}

/**
 * Updates a node in the nodes store.
 * @param id - The ID of the node to update.
 * @param node - The node to update.
 */
export const updateNode = (id: string, node: Node) => {
    nodes.update((nodes) => nodes.map((n) => (n.id === id ? node : n)))
}

export const updateNodeToCustom = (id: string) => {
    const existingNode = get(nodes).find((n) => n.id === id)
    if (!existingNode) return

    updateNode(id, {
        ...existingNode,
        id,
        type: 'custom',
    })
}

/**
 * Returns the last Node / the last Node ID.
 * @param isId - If true, returns the last Node ID.
 * @returns The last Node / the last Node ID.
 */
export const getLastNodeID = () => {
    return get(nodes).at(-1)?.id
}
