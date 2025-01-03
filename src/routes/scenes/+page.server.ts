import type { PageServerLoad, Actions } from './$types'
import { fail } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { formSchema } from './schema'
import { sceneService } from '$lib/services/sceneService'
import { characterService } from '$lib/services/characterService'

export const load: PageServerLoad = async () => {
    const [scenes, characters] = await Promise.all([
        sceneService.getAll(),
        characterService.getAll(),
    ])

    return {
        form: await superValidate(zod(formSchema)),
        editForm: await superValidate(zod(formSchema)),
        scenes,
        characters,
    }
}

export const actions: Actions = {
    create: async (event) => {
        const form = await superValidate(event, zod(formSchema))
        if (!form.valid) {
            return fail(400, { form })
        }

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

    update: async (event) => {
        const formData = await event.request.formData()
        const id = Number(formData.get('id'))

        if (!id || isNaN(id)) {
            return fail(400, {
                success: false,
                message: 'Invalid scene ID',
            })
        }

        const form = await superValidate(formData, zod(formSchema))
        if (!form.valid) {
            return fail(400, { form })
        }

        try {
            const scene = await sceneService.update(id, form.data)
            return {
                form,
                success: true,
                message: 'Scene updated successfully!',
                scene,
            }
        } catch (error) {
            console.error('Error in update action:', error)
            return fail(500, {
                form,
                success: false,
                message: 'Failed to update scene',
            })
        }
    },

    delete: async ({ request }) => {
        const formData = await request.formData()
        const id = Number(formData.get('id'))

        if (!id || isNaN(id)) {
            return fail(400, {
                success: false,
                message: 'Invalid scene ID',
            })
        }

        try {
            await sceneService.delete(id)
            return {
                success: true,
                message: 'Scene deleted successfully!',
            }
        } catch (error) {
            console.error('Error in delete action:', error)
            return fail(500, {
                success: false,
                message: 'Failed to delete scene',
            })
        }
    },
}
