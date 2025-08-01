import prisma from '$lib/server/prisma'
import type { Scene, SceneDto } from '$lib/types/Scene'
import type { Scene as PrismaScene } from '@prisma/client'
import { json } from '@sveltejs/kit'
import { tryCatch } from '@/utils'

//Type de store = PrismaScene[] ? vu qu'osef d'avoir les nodes et edges ?
export const sceneService2 = {
	getAll: async () => {
		const { data, error } = await tryCatch<PrismaScene[]>(prisma.scene.findMany())
		if (error) throw error

		return data as PrismaScene[]
	},
	get: async (scene_id: number) => {
		const { data, error } = await tryCatch<Scene | null>(
			prisma.scene.findUnique({
				where: { id: scene_id },
				include: {
					nodes: true,
					edges: true,
				},
			})
		)
		if (error) throw error
		if (!data) throw new Error('Scene not found')
		return data as Scene
	},
	create: async (scene: SceneDto) => {
		const { data, error } = await tryCatch<PrismaScene>(
			prisma.scene.create({
				data: {
					name: scene.name,
					description: scene.description,
				},
			})
		)
		if (error) throw error
		return data as PrismaScene
	},
	update: async (scene: SceneDto, scene_id: number) => {
		const { data, error } = await tryCatch<PrismaScene>(
			prisma.scene.update({
				where: { id: scene_id },
				data: scene,
			})
		)
		if (error) throw error
		if (!data) throw new Error('Scene not found')
		return data as PrismaScene
	},
	delete: async (scene_id: number) => {
		const { data, error } = await tryCatch<PrismaScene>(
			prisma.scene.delete({ where: { id: scene_id } })
		)
		if (error) throw error
		if (!data) throw new Error('Scene not found')
		return data as PrismaScene
	},
}
