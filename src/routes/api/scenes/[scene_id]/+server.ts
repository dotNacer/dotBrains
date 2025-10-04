import type { RequestEvent } from './$types'
import type { SceneDto } from '$lib/types/Scene'
import { sceneService2 } from '$lib/services/sceneService2'
import { json } from '@sveltejs/kit'
import { z } from 'zod'

// Validation schema for scene updates
const UpdateSceneDtoSchema = z.object({
	name: z.string().min(1, 'Name is required').optional(),
	description: z.string().optional(),
})

export async function GET(event: RequestEvent): Promise<Response> {
	try {
		const { scene_id } = event.params
		
		if (!scene_id || scene_id.trim() === '') {
			return json(
				{ error: 'Scene ID is required' },
				{ status: 400 }
			)
		}
		
		const scene = await sceneService2.get(scene_id)
		return json(scene, { status: 200 })
	} catch (error) {
		console.error('Error fetching scene:', error)
		
		if (error instanceof Error && error.message === 'Scene not found') {
			return json(
				{ error: 'Scene not found' },
				{ status: 404 }
			)
		}
		
		return json(
			{ error: 'Failed to fetch scene' },
			{ status: 500 }
		)
	}
}

export async function PUT(event: RequestEvent): Promise<Response> {
	try {
		const { scene_id } = event.params
		
		if (!scene_id || scene_id.trim() === '') {
			return json(
				{ error: 'Scene ID is required' },
				{ status: 400 }
			)
		}
		
		const rawData = await event.request.json()
		
		// Validate the incoming data
		const validationResult = UpdateSceneDtoSchema.safeParse(rawData)
		
		if (!validationResult.success) {
			return json(
				{ error: 'Invalid request data', details: validationResult.error.errors },
				{ status: 400 }
			)
		}
		
		const updatedScene = await sceneService2.update(validationResult.data as SceneDto, scene_id)
		return json(updatedScene, { status: 200 })
	} catch (error) {
		console.error('Error updating scene:', error)
		
		if (error instanceof Error && error.message === 'Scene not found') {
			return json(
				{ error: 'Scene not found' },
				{ status: 404 }
			)
		}
		
		return json(
			{ error: 'Failed to update scene' },
			{ status: 500 }
		)
	}
}

export async function DELETE(event: RequestEvent): Promise<Response> {
	try {
		const { scene_id } = event.params
		
		if (!scene_id || scene_id.trim() === '') {
			return json(
				{ error: 'Scene ID is required' },
				{ status: 400 }
			)
		}
		
		const deletedScene = await sceneService2.delete(scene_id)
		return json(deletedScene, { status: 200 })
	} catch (error) {
		console.error('Error deleting scene:', error)
		
		if (error instanceof Error && error.message === 'Scene not found') {
			return json(
				{ error: 'Scene not found' },
				{ status: 404 }
			)
		}
		
		return json(
			{ error: 'Failed to delete scene' },
			{ status: 500 }
		)
	}
}
