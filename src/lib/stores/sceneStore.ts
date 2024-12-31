import { writable } from 'svelte/store'
import type { Scene } from '$lib/types/Scene'

interface SceneStore {
    scenes: Scene[]
    error: string | null
}

const initialScenes: Scene[] = [
    {
        id: 1,
        title: 'Scene 1',
        description: 'Description 1',
        characters: [],
    },
    {
        id: 2,
        title: 'Scene 2',
        description: 'Description 2',
        characters: [],
    },
]

const initialState: SceneStore = {
    scenes: initialScenes,
    error: null,
}

function createSceneStore() {
    const { subscribe, set, update } = writable<SceneStore>(initialState)

    return {
        subscribe,

        addScene: (scene: Scene) => {
            update((state) => {
                const exists = state.scenes.some((s) => s.id === scene.id)
                if (exists) {
                    state.error = `Une scène avec l'ID ${scene.id} existe déjà`
                    return state
                }
                return {
                    ...state,
                    scenes: [...state.scenes, scene],
                    error: null,
                }
            })
        },

        updateScene: (id: number, updates: Partial<Scene>) => {
            update((state) => {
                const index = state.scenes.findIndex((s) => s.id === id)
                if (index === -1) {
                    state.error = `Scène avec l'ID ${id} non trouvée`
                    return state
                }
                const updatedScenes = [...state.scenes]
                updatedScenes[index] = {
                    ...updatedScenes[index],
                    ...updates,
                }
                return {
                    ...state,
                    scenes: updatedScenes,
                    error: null,
                }
            })
        },

        deleteScene: (id: number) => {
            update((state) => ({
                ...state,
                scenes: state.scenes.filter((s) => s.id !== id),
                error: null,
            }))
        },

        getScene: (id: number) => {
            let scene: Scene | undefined
            update((state) => {
                scene = state.scenes.find((s) => s.id === id)
                if (!scene) {
                    state.error = `Scène avec l'ID ${id} non trouvée`
                }
                return state
            })
            return scene
        },

        reset: () => set(initialState),

        setScenes: (scenes: Scene[]) => {
            update((state) => ({
                ...state,
                scenes,
                error: null,
            }))
        },
    }
}

export const scenes = createSceneStore()
