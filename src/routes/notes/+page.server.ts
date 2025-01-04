import type { PageServerLoad, Actions } from './$types'
import { fail } from '@sveltejs/kit'
import { sceneService } from '$lib/services/sceneService'
import { characterService } from '$lib/services/characterService'
import { noteService } from '$lib/services/noteService'

export const load: PageServerLoad = async () => {
    const [notes, scenes, characters] = await Promise.all([
        noteService.getAll(),
        sceneService.getAll(),
        characterService.getAll(),
    ])

    return {
        notes,
        scenes,
        characters,
    }
}

export const actions: Actions = {
    updateContent: async ({ request }) => {
        console.log("Ah merde c'est a moi", request)
        const formData = await request.formData()
        const id = Number(formData.get('id'))
        const content = formData.get('content')?.toString()

        if (!id || !content) {
            return fail(400, { message: 'Missing id or content' })
        }

        try {
            const updatedNote = await noteService.updateContent(id, content)
            return { success: true, note: updatedNote }
        } catch (error) {
            console.error('Error updating note:', error)
            return fail(500, { message: 'Failed to update note' })
        }
    },
}
