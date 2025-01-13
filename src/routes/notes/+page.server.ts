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

    updateNote: async ({ request }) => {
        const formData = await request.formData()
        const id = Number(formData.get('id'))
        const title = formData.get('title')?.toString()
        const content = formData.get('content')?.toString()
        const tags = JSON.parse(formData.get('tags')?.toString() ?? '[]')

        if (!id || !title || !content) {
            return fail(400, { message: 'Missing required fields' })
        }

        try {
            const updatedNote = await noteService.update(id, {
                title,
                content,
                tags,
            })
            return { success: true, note: updatedNote }
        } catch (error) {
            console.error('Error updating note:', error)
            return fail(500, { message: 'Failed to update note' })
        }
    },

    createNote: async ({ request }) => {
        const formData = await request.formData()
        const title = formData.get('title')?.toString()
        const content = formData.get('content')?.toString()
        const tags = JSON.parse(formData.get('tags')?.toString() ?? '[]')

        if (!title || !content) {
            return fail(400, { message: 'Missing required fields' })
        }

        try {
            const newNote = await noteService.create({
                title,
                content,
                tags,
            })
            return { success: true, note: newNote }
        } catch (error) {
            console.error('Error creating note:', error)
            return fail(500, { message: 'Failed to create note' })
        }
    },
}
