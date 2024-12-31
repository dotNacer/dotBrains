import type { PageServerLoad, Actions } from './$types'
import { fail } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { formSchema } from './schema'
import type { Character } from '$lib/types/Character'

export const load: PageServerLoad = async () => {
    return {
        form: await superValidate(zod(formSchema)),
    }
}

export const actions: Actions = {
    create: async (event) => {
        const form = await superValidate(event, zod(formSchema))
        if (!form.valid) {
            return fail(400, {
                form,
            })
        }

        const newCharacter: Character = {
            id: Date.now(),
            name: form.data.name,
            description: form.data.description,
            appearancesInScenes: [],
            references: [],
        }

        return {
            form,
            success: true,
            message: 'Character created successfully!',
            character: newCharacter,
        }
    },
}
