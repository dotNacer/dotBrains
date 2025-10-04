import { error, json } from '@sveltejs/kit'
import type { RequestEvent, RequestHandler } from './$types'
import type { CreateNodeDto } from '$lib/types/Node'
import { nodeService } from '@/services/nodeService'

export async function POST(event: RequestEvent): Promise<Response> {
	try {
		const { scene_id } = event.params
		if (!scene_id || scene_id.trim() === '')
			return json({ error: 'Scene ID is required' }, { status: 400 })
		const node: CreateNodeDto = await event.request.json()
		const createdNode = await nodeService.create(node)
		return json(createdNode, { status: 201 })
	} catch (error) {
		console.error('Error fetching scene:', error)
		return json({ error: 'Failed to fetch scene' }, { status: 500 })
	}
}
