import { get } from 'svelte/store'
import { edges } from '$lib/stores/edgeStore'
import type { Edge } from '@xyflow/svelte'
import type { CreateEdgeDto } from '$lib/types/Edge'

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

export const addEdgeBetweenNodes = async (
    source: string,
    target: string,
    customFetch?: typeof fetch
) => {
    const edge: Edge = {
        id: Date.now().toString(),
        source: source,
        target: target,
        type: 'smoothstep',
        animated: true,
    }

    // Add to store
    addEdge(edge)

    try {
        // Add to database via API
        const fetchInstance = customFetch || fetch
        const response = await fetchInstance('/api/edges', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fromNodeId: parseInt(source),
                toNodeId: parseInt(target),
                type: edge.type,
                animated: edge.animated,
            }),
        })

        if (!response.ok) {
            throw new Error('Failed to create edge')
        }

        const dbEdge = await response.json()
        console.log('Edge created in database:', dbEdge)

        // Update the edge id in the store to match the response id
        edge.id = dbEdge.id
        updateEdge(edge.id, edge) // Update the edge in the store with the new id
    } catch (error) {
        console.error('Failed to create edge in database:', error)
        // Optionally remove from store if database creation fails
        removeEdge(edge.id)
    }
}

export const edgeService = {
    create: async (data: CreateEdgeDto, customFetch?: typeof fetch) => {
        const fetchInstance = customFetch || fetch
        const response = await fetchInstance('/api/edges', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            throw new Error('Failed to create edge')
        }

        return response.json()
    },

    update: async (
        id: number,
        data: Partial<CreateEdgeDto>,
        customFetch?: typeof fetch
    ) => {
        const fetchInstance = customFetch || fetch
        const response = await fetchInstance('/api/edges', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, ...data }),
        })

        if (!response.ok) {
            throw new Error('Failed to update edge')
        }

        return response.json()
    },

    delete: async (id: number, customFetch?: typeof fetch) => {
        const fetchInstance = customFetch || fetch
        const response = await fetchInstance(`/api/edges?id=${id}`, {
            method: 'DELETE',
        })

        if (!response.ok) {
            throw new Error('Failed to delete edge')
        }

        return response.json()
    },

    getAll: async (customFetch?: typeof fetch) => {
        const fetchInstance = customFetch || fetch
        const response = await fetchInstance('/api/edges')

        if (!response.ok) {
            throw new Error('Failed to fetch edges')
        }

        return response.json()
    },

    getById: async (id: number, customFetch?: typeof fetch) => {
        const fetchInstance = customFetch || fetch
        const response = await fetchInstance(`/api/edges?id=${id}`)

        if (!response.ok) {
            throw new Error('Failed to fetch edge')
        }

        return response.json()
    },

    getByNodes: async (
        fromNodeId: number,
        toNodeId: number,
        customFetch?: typeof fetch
    ) => {
        const fetchInstance = customFetch || fetch
        const response = await fetchInstance(
            `/api/edges?fromNodeId=${fromNodeId}&toNodeId=${toNodeId}`
        )

        if (!response.ok) {
            throw new Error('Failed to fetch edge by nodes')
        }

        return response.json()
    },
}
