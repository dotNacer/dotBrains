import type { PageServerLoad, Actions } from './$types'
import { fail } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { formSchema as FormSchemaScene } from '$lib/schemas/scenes'
import type { CreateNodeDto } from '$lib/types/Node'
import { characterService } from '$lib/services/characterService'
import { sceneService } from '$lib/services/sceneService'
import { nodeService, mapNodeType } from '$lib/services/nodeService'
import { edgeService } from '$lib/services/edgeService'
import { nodes } from '$lib/stores/nodeStore'

export const load: PageServerLoad = async ({ fetch }) => {
    const [characters, scenes, dbNodes, dbEdges] = await Promise.all([
        characterService.getAll(),
        sceneService.getAll(),
        nodeService.getAll(),
        edgeService.getAll(fetch),
    ])

    // Transform dbNodes into the format expected by SvelteFlow
    const flowNodes = (dbNodes as any[]).map((node) => ({
        id: node.id.toString(),
        type: mapNodeType(node.type),
        position: {
            x: node.positionX,
            y: node.positionY,
        },
        width: node.width,
        height: node.height,
        data: {
            properties: node.properties,
            scene: node.scene,
            outgoing: node.outgoing,
            incoming: node.incoming,
        },
    }))

    // Transform dbEdges into the format expected by SvelteFlow
    const flowEdges = (dbEdges as any[]).map((edge) => ({
        id: edge.id,
        source: edge.fromNodeId.toString(),
        target: edge.toNodeId.toString(),
        type: edge.type || 'smoothstep',
        animated: edge.animated || false,
        label: edge.label,
    }))

    return {
        form: await superValidate(zod(FormSchemaScene)),
        characters,
        scenes,
        nodes: flowNodes,
        edges: flowEdges,
    }
}

export const actions: Actions = {
    createNode: async (event) => {
        const data = await event.request.json()

        try {
            const node = await nodeService.create(data as CreateNodeDto)

            return {
                success: true,
                data: {
                    node_id: node.id,
                },
            }
        } catch (error) {
            console.error('Error in create node action:', error)
            return fail(500, {
                success: false,
                message: 'Failed to create node',
            })
        }
    },

    createScene: async (event) => {
        const form = await superValidate(event, zod(FormSchemaScene))
        if (!form.valid) return fail(400, { form })

        try {
            const scene = await sceneService.create(form.data)
            return {
                form,
                success: true,
                message: 'Scene created successfully!',
                scene,
            }
        } catch (error) {
            console.error('Error in create action:', error)
            return fail(500, {
                form,
                success: false,
                message: 'Failed to create scene',
            })
        }
    },
}
