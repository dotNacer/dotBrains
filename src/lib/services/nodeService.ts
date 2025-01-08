import { PrismaClient, Prisma } from '@prisma/client'
import type { CreateNodeDto } from '$lib/types/Node'
import { get } from 'svelte/store'
import { nodes } from '$lib/stores/nodeStore'
import type { Node, NodeTypes, XYPosition } from '@xyflow/svelte'
import type { Handle } from '@xyflow/system'
import { edges } from '$lib/stores/edgeStore'
import { addEdgeBetweenNodes } from './edgeService'

const prisma = new PrismaClient()

/* Documentation: https://svelteflow.dev/api-reference/types/node */
// addNode va chercher le dernier ID, et prends un type de Node en argument, prends ensuite les data en argument (T)

/**
 * Adds a node to the nodes store.
 * @param type - The type of the node.
 * @param data - The data of the node.
 * @param position - The position of the node.
 * @param fromNode - Node informations where the node was dragged
 */
export const addNode = <T extends Record<string, unknown>>(
    type: keyof NodeTypes,
    data: T,
    position: XYPosition
) => {
    /* 
    Infos importantes:
    - nodeId: id du node
    - position : "right left blabla"
    - type: "source" ou "target"
    
    */
    const newId = (parseInt(getLastNodeID() ?? '1') + 1).toString()
    const node = { id: newId, type, data, position } as Node
    nodes.update((nodes) => [...nodes, node])
    return newId
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

    const fromHandle = existingNode.data?.fromHandle as Handle | undefined
    if (fromHandle?.type === 'source') {
        addEdgeBetweenNodes(fromHandle.nodeId ?? '1', id)
    } else if (fromHandle?.type === 'target') {
        addEdgeBetweenNodes(id, fromHandle.nodeId ?? '1')
    }
}

/**
 * Returns the last Node / the last Node ID.
 * @param isId - If true, returns the last Node ID.
 * @returns The last Node / the last Node ID.
 */
export const getLastNodeID = () => {
    return get(nodes).at(-1)?.id
}

export const nodeService = {
    create: async (data: CreateNodeDto) => {
        try {
            const node = await prisma.node.create({
                data: {
                    positionX: data.positionX,
                    positionY: data.positionY,
                    scene: data.sceneId
                        ? {
                              connect: { id: data.sceneId },
                          }
                        : undefined,
                    properties: data.properties,
                },
                include: {
                    scene: true,
                    outgoing: true,
                    incoming: true,
                },
            })
            return node
        } catch (error) {
            console.error('Error creating node:', error)
            throw error
        }
    },

    update: async (id: number, data: Partial<CreateNodeDto>) => {
        try {
            const node = await prisma.node.update({
                where: { id },
                data: {
                    positionX: data.positionX,
                    positionY: data.positionY,
                    scene: data.sceneId
                        ? {
                              connect: { id: data.sceneId },
                          }
                        : undefined,
                    properties: data.properties,
                },
                include: {
                    scene: true,
                    outgoing: true,
                    incoming: true,
                },
            })
            return node
        } catch (error) {
            console.error('Error updating node:', error)
            throw error
        }
    },

    delete: async (id: number) => {
        try {
            // First delete all edges connected to this node
            await prisma.edge.deleteMany({
                where: {
                    OR: [{ fromNodeId: id }, { toNodeId: id }],
                },
            })

            // Then delete the node
            return await prisma.node.delete({
                where: { id },
                include: {
                    scene: true,
                    outgoing: true,
                    incoming: true,
                },
            })
        } catch (error) {
            console.error('Error deleting node:', error)
            throw error
        }
    },

    getAll: async () => {
        try {
            return await prisma.node.findMany({
                include: {
                    scene: true,
                    outgoing: true,
                    incoming: true,
                },
            })
        } catch (error) {
            console.error('Error fetching nodes:', error)
            throw error
        }
    },

    getById: async (id: number) => {
        try {
            return await prisma.node.findUnique({
                where: { id },
                include: {
                    scene: true,
                    outgoing: true,
                    incoming: true,
                },
            })
        } catch (error) {
            console.error('Error fetching node:', error)
            throw error
        }
    },

    getBySceneId: async (sceneId: number) => {
        try {
            return await prisma.node.findUnique({
                where: { sceneId },
                include: {
                    scene: true,
                    outgoing: true,
                    incoming: true,
                },
            })
        } catch (error) {
            console.error('Error fetching node by scene ID:', error)
            throw error
        }
    },
}
