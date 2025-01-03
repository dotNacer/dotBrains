import { writable } from 'svelte/store'
import type { Note } from '$lib/types/Note'

function createNoteStore() {
    // Charger les notes depuis localStorage au démarrage
    const storedNotes =
        typeof window !== 'undefined'
            ? JSON.parse(localStorage.getItem('notes') || '[]')
            : []

    const { subscribe, set, update } = writable<Note[]>(storedNotes)

    // Sauvegarder dans localStorage à chaque modification
    subscribe((notes) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('notes', JSON.stringify(notes))
        }
    })

    return {
        subscribe,
        set,
        update,
        addNote: (note: Omit<Note, 'id'>) =>
            update((notes) => [...notes, { ...note, id: notes.length + 1 }]),
        updateNote: (id: number, updatedNote: Partial<Note>) =>
            update((notes) =>
                notes.map((note) =>
                    note.id === id
                        ? { ...note, ...updatedNote, updatedAt: new Date() }
                        : note,
                ),
            ),
        deleteNote: (id: number) =>
            update((notes) => notes.filter((note) => note.id !== id)),
    }
}

export const notes = createNoteStore()
