import { command, query } from '$app/server'
import { error } from '@sveltejs/kit'
import { createSceneSchema } from '$lib/schemas/scenes'
import prisma from '$lib/server/prisma'
import { tryCatch } from '$lib/utils'
import { z } from 'zod'

export const createScene = command(createSceneSchema, async (data) => {
	const { data: scene, error: err } = await tryCatch(
		prisma.scene.create({
			data: {
				name: data.name,
				description: data.description,
			},
		})
	)

	if (err) {
		console.error('Error creating scene:', err)
		error(500, 'Une erreur est survenue lors de la création de la scène')
	}

	return scene
})

export const updateScene = command(
	z.object({
		id: z.string(),
		data: createSceneSchema.partial(),
	}),
	async ({ id, data }) => {
		const { data: updatedScene, error: err } = await tryCatch(
			prisma.scene.update({
				where: { id },
				data: {
					name: data.name,
					description: data.description,
				},
			})
		)

		if (err) {
			console.error('Error updating scene:', err)
			error(500, 'Une erreur est survenue lors de la mise à jour de la scène')
		}

		return updatedScene
	}
)

export const deleteScene = command(z.string(), async (id) => {
	const { data: deletedScene, error: err } = await tryCatch(
		prisma.scene.delete({
			where: { id },
		})
	)

	if (err) {
		console.error('Error deleting scene:', err)
		error(500, 'Une erreur est survenue lors de la suppression de la scène')
	}

	return deletedScene
})

export const getScenes = query(async () => {
	const { data: scenes, error: err } = await tryCatch(
		prisma.scene.findMany({
			orderBy: { updatedAt: 'desc' },
			include: {
				_count: {
					select: { nodes: true },
				},
			},
		})
	)

	if (err) {
		console.error('Error fetching scenes:', err)
		error(500, 'Impossible de récupérer les scènes')
	}

	return scenes
})

export const getSceneById = query(z.string(), async (id) => {
	const { data: scene, error: err } = await tryCatch(
		prisma.scene.findUnique({
			where: { id },
			include: {
				nodes: {
					include: {
						sceneEvent: {
							include: {
								characters: true,
							},
						},
					},
				},
				edges: true,
			},
		})
	)

	if (err) {
		console.error('Error fetching scene:', err)
		error(500, 'Erreur lors de la récupération de la scène')
	}

	if (!scene)
		error(404, 'Scène introuvable')


	return scene
})
