import type { PageServerLoad } from './$types'
import { sceneService2 } from '$lib/services/sceneService2'
import { error } from '@sveltejs/kit'
import type { Scene } from '$lib/types/Scene'

export const load: PageServerLoad = async ({ params }) => {
	const scene_id = params.scene_id
	const scene: Scene | null = await sceneService2.get(scene_id)
	if (!scene) throw error(404, 'Scene not found')

	return {
		scene: scene,
		nodes: scene.nodes,
		edges: scene.edges,
	}
}
