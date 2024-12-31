import type { Character } from './Character'

// TODO
export interface Scene {
    id: number
    title: string
    description: string
    characters: Character[]
}
