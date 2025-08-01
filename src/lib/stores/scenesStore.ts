import { writable } from 'svelte/store'
import type { Scene, SceneDto } from '$lib/types/Scene'
import { tryCatch } from '@/utils'

function createScenesStore() {
	const { subscribe, set, update } = writable<Scene[]>([])

	return {
		subscribe,
		set,
		update,
		fetch: async () => {
			const { data, error } = await tryCatch(fetch('/api/scenes').then((res) => res.json()))
			if (error) {
				console.error(error)
			} else {
				set(data as Scene[])
			}
		},
		create: async (scene: SceneDto) => {
			const { data, error } = await tryCatch(
				fetch('/api/scenes', {
					method: 'POST',
					body: JSON.stringify(scene),
				}).then((res) => res.json())
			)
			if (error) {
				console.error(error)
			} else {
				update((scenes) => [...scenes, data as Scene])
				return data as Scene
			}
		},
		edit: async (scene: SceneDto, sceneId: number) => {
			const { data, error } = await tryCatch(
				fetch(`/api/scenes/${sceneId}`, {
					method: 'PUT',
					body: JSON.stringify(scene as SceneDto),
				}).then((res) => res.json())
			)
			if (error) {
				console.error(error)
			} else {
				update((scenes) => scenes.map((s) => (s.id === sceneId ? (data as Scene) : s)))
				return data as Scene
			}
		},
		delete: async (sceneId: number) => {
			const { data, error } = await tryCatch(
				fetch(`/api/scenes/${sceneId}`, {
					method: 'DELETE',
				}).then((res) => res.json())
			)
			if (error) {
				console.error(error)
			} else {
				update((scenes) => scenes.filter((s) => s.id !== sceneId))
				return data as Scene
			}
		},
	}
}

export const scenesStore = createScenesStore()
