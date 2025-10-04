import { error, json } from '@sveltejs/kit'
import type { RequestEvent } from './$types'
import type { CreateEdgeDto } from '$lib/types/Edge'
import { edgeService } from '@/services/edgeService'

export async function POST(event: RequestEvent): Promise<Response> {
	try {
		const { scene_id } = event.params
		if (!scene_id || scene_id.trim() === '')
			return json({ error: 'Scene ID is required' }, { status: 400 })

		const edgeData: CreateEdgeDto = await event.request.json()

		// Ensure the sceneId matches the route parameter
		const edgeToCreate = { ...edgeData, sceneId: scene_id }

		const createdEdge = await edgeService.create(edgeToCreate)
		return json(createdEdge, { status: 201 })
	} catch (error) {
		console.error('Error creating edge:', error)
		return json({ error: 'Failed to create edge' }, { status: 500 })
	}
}
