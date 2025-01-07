import type { PageServerLoad, Actions } from './$types'
import { fail } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { formSchema } from '$lib/schemas/scenes'
import { characterService } from '$lib/services/characterService'
import { sceneService } from '$lib/services/sceneService'

export const load: PageServerLoad = async () => {
    const [characters, scenes] = await Promise.all([
        characterService.getAll(),
        sceneService.getAll(),
    ])

    return { form: await superValidate(zod(formSchema)), characters, scenes }
}

export const actions: Actions = {
    create: async (event) => {
        const form = await superValidate(event, zod(formSchema))
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
