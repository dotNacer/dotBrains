import type { PageServerLoad } from './$types'
import { sceneService2 } from '$lib/services/sceneService2'
import { error } from '@sveltejs/kit'
import type { Scene } from '$lib/types/Scene'
import { formatDBEdges, formatDBNodes } from '$lib/utils/svelteflow'

export const load: PageServerLoad = async ({ params }) => {
	const scene_id = params.scene_id
	const scene = await sceneService2.get(scene_id)
	if (!scene) throw error(404, 'Scene not found')

	//Workflow :

	// Fonction qui prends en paramètre des edges et nodes et retourne les nodes et edges svelteflow
	// INPUT : edges, nodes Prisma
	// OUTPUT : nodes, edges Svelteflow

	// Fonction qui prends en paramètre une scene et retourne les nodes et edges svelteflow
	// INPUT : scene
	// OUTPUT : nodes, edges

	// Idée : Avoir le même type BD et Edge, pour ne pas avoir de grosse modif

	//Idée : J'ai un store writable pour store edges et nodes, au page.server, je renvoie les nodes et edges formatés par un utils
	// Après je pourrais modif les données tranquille.
	// Requirements du store : Add, Update, Delete, fonction get pour récupérer les données formatées

	return {
		scene_id,
		scene: scene,
		nodes: scene.nodes,
		edges: formatDBEdges(scene.edges),
	}
}
