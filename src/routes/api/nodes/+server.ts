import { json } from '@sveltejs/kit'
import type { RequestEvent } from './$types'
import prisma from '$lib/server/prisma'
import { z } from 'zod'
import type { NodeType } from '@prisma/client'

// Define the NodeCreateDto schema for validation
const NodeCreateDtoSchema = z.object({
	type: z
		.enum(['EVENT', 'GROUP'] as const)
		.optional()
		.default('EVENT'),
	positionX: z.number(),
	positionY: z.number(),
	width: z.number().optional().default(300),
	height: z.number().optional().default(150),
	sceneId: z.number().optional(),
	properties: z.any().optional(),
})

type NodeCreateDto = z.infer<typeof NodeCreateDtoSchema>

export async function GET({ url }: RequestEvent) {
	try {
		const id = url.searchParams.get('id')

		if (id) {
			const node = await prisma.node.findUnique({
				where: {
					id,
				},
				include: {
					scene: true,
					outgoing: true,
					incoming: true,
				},
			})
			return json(node)
		}

		const nodes = await prisma.node.findMany({
			include: {
				scene: true,
				outgoing: true,
				incoming: true,
			},
		})
		return json(nodes)
	} catch (error) {
		console.error('Error fetching nodes:', error)
		return new Response(JSON.stringify({ error: 'Failed to fetch nodes' }), {
			status: 500,
		})
	}
}

export async function POST({ request }: RequestEvent) {
	try {
		const rawData = await request.json()

		// Validate the incoming data against the DTO schema
		const validationResult = NodeCreateDtoSchema.safeParse(rawData)

		if (!validationResult.success) {
			return json(
				{ error: 'Invalid request data', details: validationResult.error.errors },
				{ status: 400 }
			)
		}

		const data: NodeCreateDto = validationResult.data

		const node = await prisma.node.create({
			data: {
				type: data.type as NodeType,
				positionX: data.positionX,
				positionY: data.positionY,
				width: data.width,
				height: data.height,
				sceneId: data.sceneId,
				properties: data.properties,
			},
		})
		return json({ success: true, node }, { status: 201 })
	} catch (error) {
		console.error('Error creating node:', error)
		return json({ error: 'Failed to create node' }, { status: 500 })
	}
}
