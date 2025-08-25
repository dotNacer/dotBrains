import type { RequestEvent } from './$types'
import { nodeService } from '$lib/services/nodeService'
import { error, json } from '@sveltejs/kit'

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
