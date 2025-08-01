import type { RequestEvent } from './$types'
import type { SceneDto } from '$lib/types/Scene'
import { sceneService2 } from '$lib/services/sceneService2'
import { json } from '@sveltejs/kit'

export async function GET(event: RequestEvent): Promise<Response> {
	const { scene_id } = event.params
	return json(await sceneService2.get(parseInt(scene_id)))
}

export async function PUT(event: RequestEvent): Promise<Response> {
	const { scene_id }: { scene_id: string } = event.params
	const body: SceneDto = await event.request.json()
	return json(await sceneService2.update(body, parseInt(scene_id)))
}

export async function DELETE(event: RequestEvent): Promise<Response> {
	const { scene_id }: { scene_id: string } = event.params
	return json(await sceneService2.delete(parseInt(scene_id)))
}
