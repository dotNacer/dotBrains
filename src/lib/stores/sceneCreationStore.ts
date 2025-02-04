import { writable } from 'svelte/store'

interface SceneCreationState {
    isOpen: boolean
    nodeId: string | null
    nodeRef: any | null
}

export const sceneCreationStore = writable<SceneCreationState>({
    isOpen: false,
    nodeId: null,
    nodeRef: null,
})
