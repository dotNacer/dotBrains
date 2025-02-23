import { PrismaClient, Prisma, type Scene } from '@prisma/client'
import type { CreateNodeDto } from '$lib/types/Node'
import { get } from 'svelte/store'
import { nodes } from '$lib/stores/nodeStore'
import type { Node, NodeTypes, XYPosition } from '@xyflow/svelte'
import type { Handle } from '@xyflow/system'
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
    position: XYPosition,
    specificId?: string
) => {
    /* 
    Infos importantes:
    - nodeId: id du node
    - position : "right left blabla"
    - type: "source" ou "target"
    
    */
    const newId =
        specificId ?? (parseInt(getLastNodeID() ?? '1') + 1).toString()
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

export const updateNodeId = (id: string, newId: string) => {
    console.log("Passage de l'id", id, 'à', newId.toString())
    nodes.update((nodes) =>
        nodes.map((n) => (n.id === id ? { ...n, id: newId } : n))
    )
}

export const updateNodeToCustom = (id: string, sceneData?: Scene) => {
    const existingNode = get(nodes).find((n) => n.id === id)
    if (!existingNode) return

    updateNode(id, {
        ...existingNode,
        id,
        type: 'scene',
        data: {
            ...existingNode.data,
            scene: sceneData,
        },
    })

    const fromHandle = existingNode.data?.fromHandle as Handle | undefined
    if (fromHandle?.type === 'source') {
        console.log(
            'Source type : ',
            typeof fromHandle.nodeId,
            ' | Target :',
            typeof id
        )
        addEdgeBetweenNodes(fromHandle.nodeId ?? '1', id.toString())
    } else if (fromHandle?.type === 'target') {
        console.log(
            'Source type : ',
            typeof fromHandle.nodeId,
            ' | Target :',
            typeof id
        )
        addEdgeBetweenNodes(id.toString(), fromHandle.nodeId ?? '1')
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
                    scene: {
                        include: {
                            characters: {
                                include: {
                                    character: true,
                                },
                            },
                        },
                    },
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

    delete: async (id: number, customFetch?: typeof fetch) => {
        const fetchInstance = customFetch || fetch
        const response = await fetchInstance(`/api/nodes?id=${id}`, {
            method: 'DELETE',
        })

        if (!response.ok) {
            throw new Error('Failed to delete node')
        }

        return response.json()
    },

    getAll: async () => {
        try {
            const dbNodes = await prisma.node.findMany({
                include: {
                    scene: {
                        include: {
                            characters: {
                                include: {
                                    character: true,
                                },
                            },
                        },
                    },
                    outgoing: true,
                    incoming: true,
                },
            })

            return dbNodes
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
                    scene: {
                        include: {
                            characters: {
                                include: {
                                    character: true,
                                },
                            },
                        },
                    },
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
                    scene: {
                        include: {
                            characters: {
                                include: {
                                    character: true,
                                },
                            },
                        },
                    },
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
