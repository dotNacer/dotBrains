import type { PageServerLoad, Actions } from './$types'
import { fail } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { formSchema } from './schema'
import type { Character } from '$lib/types/Character'
import type { Scene } from '$lib/types/Scene'
import { get } from 'svelte/store'
import { scenes } from '$lib/stores/sceneStore'

export const load: PageServerLoad = async () => {
    return {
        form: await superValidate(zod(formSchema)),
    }
}

export const actions: Actions = {
    create: async (event) => {
        const form = await superValidate(event, zod(formSchema))
        if (!form.valid) {
            return fail(400, { form })
        }

        console.log(form.data)
        const sceneStore = get(scenes)
        const selectedScenes = form.data.sceneIds
            ? form.data.sceneIds
                  .map((id) =>
                      sceneStore.scenes.find((s: Scene) => s.id === id)
                  )
                  .filter((scene): scene is Scene => scene !== undefined)
            : []

        const newCharacter: Character = {
            id: Date.now(),
            name: form.data.name,
            description: form.data.description,
            appearancesInScenes: selectedScenes,
            references: [],
        }

        selectedScenes.forEach((scene) => {
            scenes.updateScene(scene.id, {
                ...scene,
                characters: [...scene.characters, newCharacter],
            })
        })

        return {
            form,
            success: true,
            message: 'Character created successfully!',
            character: newCharacter,
        }
    },
}
