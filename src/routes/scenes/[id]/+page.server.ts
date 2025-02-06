import { error } from '@sveltejs/kit'
import { sceneService } from '$lib/services/sceneService'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params }) => {
    const id = parseInt(params.id)

    if (isNaN(id)) {
        throw error(400, 'Invalid ID parameter')
    }

    const data = await sceneService.getById(id)

    if (!data) {
        throw error(404, 'Data not found')
    }

    return {
        data,
    }
}
