import type { RequestEvent } from './$types'
import { edgeService } from '$lib/services/edgeService'
import { json } from '@sveltejs/kit'
import type { Prisma } from '@prisma/client'

export async function PATCH(event: RequestEvent): Promise<Response> {
	try {
		const { scene_id, edge_id } = event.params

		if (!scene_id || scene_id.trim() === '')
			return json({ error: 'Scene ID is required' }, { status: 400 })

		if (!edge_id || edge_id.trim() === '')
			return json({ error: 'Edge ID is required' }, { status: 400 })

		const body = await event.request.json().catch(() => null)
		if (!body || typeof body !== 'object')
			return json({ error: 'Invalid JSON body' }, { status: 400 })

		const updates = body as Prisma.EdgeUncheckedUpdateInput
		if (Object.keys(updates).length === 0)
			return json({ error: 'No updatable fields provided' }, { status: 400 })

		// Optional: verify edge exists and belongs to scene
		const existing = await edgeService.getById(edge_id)
		if (!existing) return json({ error: 'Edge not found' }, { status: 404 })
		if (existing.sceneId !== scene_id)
			return json({ error: 'Edge does not belong to scene' }, { status: 403 })

		const updated = await edgeService.updatePartial(edge_id, updates)
		return json(updated, { status: 200 })
	} catch (error) {
		console.error('Error updating edge:', error)
		return json({ error: 'Failed to update edge' }, { status: 500 })
	}
}

export async function DELETE(event: RequestEvent): Promise<Response> {
	try {
		const { scene_id, edge_id } = event.params

		if (!scene_id || scene_id.trim() === '')
			return json({ error: 'Scene ID is required' }, { status: 400 })

		if (!edge_id || edge_id.trim() === '')
			return json({ error: 'Edge ID is required' }, { status: 400 })

		// Optional: verify edge exists and belongs to scene
		const existing = await edgeService.getById(edge_id)
		if (!existing) return json({ error: 'Edge not found' }, { status: 404 })
		if (existing.sceneId !== scene_id)
			return json({ error: 'Edge does not belong to scene' }, { status: 403 })

		const deletedEdge = await edgeService.delete(edge_id)
		return json(deletedEdge, { status: 200 })
	} catch (error) {
		console.error('Error deleting edge:', error)
		return json({ error: 'Failed to delete edge' }, { status: 500 })
	}
}
