import { get } from 'svelte/store'
import { edges } from '$lib/stores/edgeStore'
import type { Edge } from '@xyflow/svelte'

/* Documentation: https://svelteflow.dev/api-reference/types/edge */

/**
 * Adds an edge to the edges store.
 * @param edge - The edge to add.
 */

export const addEdge = (edge: Edge) => {
    edges.update((e) => [...e, edge])
}

export const removeEdge = (id: string) => {
    edges.update((e) => e.filter((e) => e.id !== id))
}

export const updateEdge = (id: string, edge: Edge) => {
    edges.update((e) => e.map((e) => (e.id === id ? edge : e)))
}

export const addEdgeBetweenNodes = (source: string, target: string) => {
    const edge: Edge = {
        id: `${source}-${target}`,
        source: source,
        target: target,
        type: 'smoothstep',
        animated: true,
    }
    addEdge(edge)
}
