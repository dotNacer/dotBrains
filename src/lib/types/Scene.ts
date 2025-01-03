import type { Character } from './Character'

export interface CreateSceneDto {
    title: string
    description: string
    characterIds?: number[]
}

export interface Scene {
    id: number
    title: string
    description: string
    characters: {
        character: Character
    }[]
}
