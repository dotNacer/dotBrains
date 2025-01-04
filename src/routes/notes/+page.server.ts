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
