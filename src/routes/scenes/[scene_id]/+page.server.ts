import type { PageServerLoad } from './$types'
import { getSceneById } from '$lib/api/scenes.remote'

export const load: PageServerLoad = async ({ params }) => {
	const scene_id = params.scene_id
	const scene = await getSceneById(scene_id)

	return {
		scene: scene,
		nodes: scene.nodes,
		edges: scene.edges,
	}
}
