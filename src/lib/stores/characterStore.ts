import { writable } from 'svelte/store'
import type { Character } from '$lib/types/Character'

// Interface pour le store
interface CharacterStore {
    characters: Character[]
    error: string | null
}

// État initial
const initialState: CharacterStore = {
    characters: [],
    error: null,
}

// Création du store
function createCharacterStore() {
    const { subscribe, set, update } = writable<CharacterStore>(initialState)

    return {
        subscribe,

        // Ajouter un personnage
        addCharacter: (character: Character) => {
            update((state) => {
                const exists = state.characters.some(
                    (c) => c.id === character.id,
                )
                if (exists) {
                    state.error = `Un personnage avec l'ID ${character.id} existe déjà`
                    return state
                }
                return {
                    ...state,
                    characters: [...state.characters, character],
                    error: null,
                }
            })
        },

        // Mettre à jour un personnage
        updateCharacter: (id: number, updates: Partial<Character>) => {
            update((state) => {
                const index = state.characters.findIndex((c) => c.id === id)
                if (index === -1) {
                    state.error = `Personnage avec l'ID ${id} non trouvé`
                    return state
                }
                const updatedCharacters = [...state.characters]
                updatedCharacters[index] = {
                    ...updatedCharacters[index],
                    ...updates,
                }
                return {
                    ...state,
                    characters: updatedCharacters,
                    error: null,
                }
            })
        },

        // Supprimer un personnage
        deleteCharacter: (id: number) => {
            update((state) => ({
                ...state,
                characters: state.characters.filter((c) => c.id !== id),
                error: null,
            }))
        },

        // Récupérer un personnage par ID
        getCharacter: (id: number) => {
            let character: Character | undefined
            update((state) => {
                character = state.characters.find((c) => c.id === id)
                if (!character) {
                    state.error = `Personnage avec l'ID ${id} non trouvé`
                }
                return state
            })
            return character
        },

        // Réinitialiser le store
        reset: () => set(initialState),

        // Définir tous les personnages (utile pour l'initialisation depuis une API)
        setCharacters: (characters: Character[]) => {
            update((state) => ({
                ...state,
                characters,
                error: null,
            }))
        },
    }
}

// Export du store
export const characters = createCharacterStore()
