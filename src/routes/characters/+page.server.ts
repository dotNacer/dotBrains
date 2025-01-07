import type { PageServerLoad, Actions } from './$types'
import { fail } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { formSchema } from '$lib/schemas/characters'
import { characterService } from '$lib/services/characterService'
import { sceneService } from '$lib/services/sceneService'

export const load: PageServerLoad = async () => {
    const [characters, scenes] = await Promise.all([
        characterService.getAll(),
        sceneService.getAll(),
    ])

    return {
        form: await superValidate(zod(formSchema)),
        editForm: await superValidate(zod(formSchema)),
        characters,
        scenes,
    }
}

export const actions: Actions = {
    create: async (event) => {
        const form = await superValidate(event, zod(formSchema))
        if (!form.valid) return fail(400, { form })

        try {
            const character = await characterService.create(form.data)
            return {
                form,
                success: true,
                message: 'Character created successfully!',
                character,
            }
        } catch (error) {
            console.error('Error in create action:', error)
            return fail(500, {
                form,
                success: false,
                message: 'Failed to create character',
            })
        }
    },

    update: async (event) => {
        const formData = await event.request.formData()
        const id = Number(formData.get('id'))

        if (!id || isNaN(id)) {
            return fail(400, {
                success: false,
                message: 'Invalid character ID',
            })
        }

        const form = await superValidate(formData, zod(formSchema))
        if (!form.valid) {
            return fail(400, { form })
        }

        try {
            const character = await characterService.update(id, form.data)
            return {
                form,
                success: true,
                message: 'Character updated successfully!',
                character,
            }
        } catch (error) {
            console.error('Error in update action:', error)
            return fail(500, {
                form,
                success: false,
                message: 'Failed to update character',
            })
        }
    },

    delete: async ({ request }) => {
        const formData = await request.formData()
        const id = Number(formData.get('id'))

        if (!id || isNaN(id)) {
            return fail(400, {
                success: false,
                message: 'Invalid character ID',
            })
        }

        try {
            await characterService.delete(id)
            return {
                success: true,
                message: 'Character deleted successfully!',
            }
        } catch (error) {
            console.error('Error in delete action:', error)
            return fail(500, {
                success: false,
                message: 'Failed to delete character',
            })
        }
    },
}
