import type { Scene } from './Scene'

// TODO : Enrichir avec des informations supplémentaires
export interface Character {
    id: number
    name: string
    description: string
    appearancesInScenes: Scene[] // Scenes peut être vide
    references: Reference[] // References peut être vide
}

interface Reference {
    id: number
    name: string
    description: string
    url: string
}
