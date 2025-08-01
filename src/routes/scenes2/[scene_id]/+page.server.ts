import type { PageServerLoad } from './$types'
import { sceneService2 } from '$lib/services/sceneService2'
import { error } from '@sveltejs/kit'
import type { Scene } from '$lib/types/Scene'

export const load: PageServerLoad = async ({ params }) => {
	const scene_id = params.scene_id
	const scene = (await sceneService2.get(parseInt(scene_id))) as unknown as Scene
	if (!scene) {
		throw error(404, 'Scene not found')
	}

	//Workflow :

	// Fonction qui prends en paramètre des edges et nodes et retourne les nodes et edges svelteflow
	// INPUT : edges, nodes Prisma
	// OUTPUT : nodes, edges Svelteflow

	// Fonction qui prends en paramètre une scene et retourne les nodes et edges svelteflow
	// INPUT : scene
	// OUTPUT : nodes, edges

	return {
		scene_id,
		scene: scene,
	}
}
