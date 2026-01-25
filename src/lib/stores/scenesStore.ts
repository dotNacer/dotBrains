import { writable } from 'svelte/store'
import type { CreateSceneSchema } from '$lib/schemas/scenes'
import { tryCatch } from '$lib/utils'
import { createScene, deleteScene, getScenes, updateScene } from '$lib/api/scenes.remote'
import type { Scene } from '@prisma/client'

function createScenesStore() {
	const { subscribe, set, update } = writable<Scene[]>([])

	return {
		subscribe,
		set,
		update,
		fetch: async () => {
			const { data, error } = await tryCatch(getScenes())
			if (error) {
				console.error('Error fetching scenes:', error)
			} else {
				set(data as Scene[])
			}
		},
		create: async (scene: CreateSceneSchema) => {
			const { data, error } = await tryCatch(createScene(scene))
			if (error) {
				console.error('Error creating scene:', error)
				throw error
			} else if (data) {
				update((scenes) => [data, ...scenes])
				return data
			}
		},
		edit: async (id: string, updates: Partial<CreateSceneSchema>) => {
			const { data, error } = await tryCatch(updateScene({ id, data: updates }))
			if (error) {
				console.error('Error updating scene:', error)
				throw error
			} else if (data) {
				update((scenes) => scenes.map((s) => (s.id === id ? data : s)))
				return data
			}
		},
		delete: async (sceneId: string) => {
			const { data, error } = await tryCatch(deleteScene(sceneId))
			if (error) {
				console.error('Error deleting scene:', error)
				throw error
			} else {
				update((scenes) => scenes.filter((s) => s.id !== sceneId))
				return data
			}
		},
	}
}

export const scenesStore = createScenesStore()