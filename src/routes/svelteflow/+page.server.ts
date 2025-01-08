import type { PageServerLoad, Actions } from './$types'
import { fail } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { formSchema as FormSchemaScene } from '$lib/schemas/scenes'
import { formSchema as FormSchemaNode } from '$lib/schemas/nodes'
import type { CreateNodeDto } from '$lib/types/Node'

import { characterService } from '$lib/services/characterService'
import { sceneService } from '$lib/services/sceneService'
import { nodeService } from '$lib/services/nodeService'

export const load: PageServerLoad = async () => {
    const [characters, scenes] = await Promise.all([
        characterService.getAll(),
        sceneService.getAll(),
    ])

    return {
        form: await superValidate(zod(FormSchemaScene)),
        characters,
        scenes,
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
