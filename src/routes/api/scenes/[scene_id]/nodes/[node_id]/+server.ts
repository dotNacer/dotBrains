import type { RequestEvent } from './$types'
import { nodeService } from '$lib/services/nodeService'
import { json } from '@sveltejs/kit'

export async function PATCH(event: RequestEvent): Promise<Response> {
	try {
		const { scene_id, node_id } = event.params

		if (!scene_id || scene_id.trim() === '')
			return json({ error: 'Scene ID is required' }, { status: 400 })

		if (!node_id || node_id.trim() === '')
			return json({ error: 'Node ID is required' }, { status: 400 })

		const body = await event.request.json().catch(() => null)
		if (!body || typeof body !== 'object')
			return json({ error: 'Invalid JSON body' }, { status: 400 })

		// Ensure we don't allow changing id or sceneId via PATCH
		const { id, sceneId, createdAt, updatedAt, ...updates } = body as Record<string, unknown>
		if (Object.keys(updates).length === 0)
			return json({ error: 'No updatable fields provided' }, { status: 400 })

		// Optional: verify node exists and belongs to scene
		const existing = await nodeService.getById(node_id)
		if (!existing) return json({ error: 'Node not found' }, { status: 404 })
		if (existing.sceneId !== scene_id)
			return json({ error: 'Node does not belong to scene' }, { status: 403 })

		const updated = await nodeService.updatePartial(node_id, updates as any)
		return json(updated, { status: 200 })
	} catch (error) {
		console.error('Error updating node:', error)
		return json({ error: 'Failed to update node' }, { status: 500 })
	}
}

export async function DELETE(event: RequestEvent): Promise<Response> {
	try {
		const { scene_id, node_id } = event.params

		if (!scene_id || scene_id.trim() === '')
			return json({ error: 'Scene ID is required' }, { status: 400 })

		if (!node_id || node_id.trim() === '')
			return json({ error: 'Node ID is required' }, { status: 400 })

		// Vérification si le node est dans la scène ?
		const deletedNode = await nodeService.delete(node_id)
		return json(deletedNode, { status: 200 })
	} catch (error) {
		console.error('Error deleting scene:', error)

		if (error instanceof Error && error.message === 'Scene not found') {
			return json({ error: 'Scene not found' }, { status: 404 })
		}

		return json({ error: 'Failed to delete scene' }, { status: 500 })
	}
}
