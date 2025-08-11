import type { RequestEvent } from './$types'
import type { SceneDto } from '$lib/types/Scene'
import { sceneService2 } from '$lib/services/sceneService2'
import { json } from '@sveltejs/kit'
import { z } from 'zod'

// Define validation schema for Scene creation
const CreateSceneDtoSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	description: z.string().optional().default(''),
})

export async function GET(): Promise<Response> {
	try {
		const scenes = await sceneService2.getAll()
		return json(scenes, { status: 200 })
	} catch (error) {
		console.error('Error fetching scenes:', error)
		return json(
			{ error: 'Failed to fetch scenes' },
			{ status: 500 }
		)
	}
}

export async function POST(event: RequestEvent): Promise<Response> {
	try {
		const rawData = await event.request.json()
		
		// Validate the incoming data
		const validationResult = CreateSceneDtoSchema.safeParse(rawData)
		
		if (!validationResult.success) {
			return json(
				{ error: 'Invalid request data', details: validationResult.error.errors },
				{ status: 400 }
			)
		}
		
		const { name, description } = validationResult.data
		const scene = await sceneService2.create({ name, description })
		return json(scene, { status: 201 })
	} catch (error) {
		console.error('Error creating scene:', error)
		const errorMessage = error instanceof Error ? error.message : 'Failed to create scene'
		return json(
			{ error: errorMessage },
			{ status: 500 }
		)
	}
}
