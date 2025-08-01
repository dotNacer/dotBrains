import type { RequestEvent } from './$types'
import type { SceneDto } from '$lib/types/Scene'
import { sceneService2 } from '$lib/services/sceneService2'
import type { Scene } from '$lib/types/Scene'
import { json } from '@sveltejs/kit'

//TODO: vraiment améliorer le systeme d'erreur pck la...
export async function GET(): Promise<Response> {
	return json(await sceneService2.getAll())
}

export async function POST(event: RequestEvent): Promise<Response> {
	const { name, description }: SceneDto = await event.request.json()
	return json(await sceneService2.create({ name, description }))
}
