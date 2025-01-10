import type { PageServerLoad, Actions } from './$types'
import { fail } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { formSchema as FormSchemaScene } from '$lib/schemas/scenes'
import type { CreateNodeDto } from '$lib/types/Node'

import { nodes as nodesStore } from '$lib/stores/nodeStore'

import { characterService } from '$lib/services/characterService'
import { sceneService } from '$lib/services/sceneService'
import { nodeService } from '$lib/services/nodeService'

export const load: PageServerLoad = async () => {
    const [characters, scenes, dbNodes] = await Promise.all([
        characterService.getAll(),
        sceneService.getAll(),
        nodeService.getAll(),
    ])

    // Transform dbNodes into the format expected by SvelteFlow
    const flowNodes = dbNodes.map((node) => ({
        id: node.id.toString(),
        type: 'scene',
        position: {
            x: node.positionX,
            y: node.positionY,
        },
        data: {
            properties: node.properties,
            scene: node.scene,
            outgoing: node.outgoing,
            incoming: node.incoming,
        },
    }))

    return {
        form: await superValidate(zod(FormSchemaScene)),
        characters,
        scenes,
        nodes: flowNodes, // Send transformed nodes
    }
}

export const actions: Actions = {
    createNode: async (event) => {
        const data = await event.request.json()

        try {
            const node = await nodeService.create(data as CreateNodeDto)

            return {
                success: true,
                message: 'Node created successfully!',
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
