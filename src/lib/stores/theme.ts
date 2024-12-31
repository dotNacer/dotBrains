import { writable } from 'svelte/store'

type Theme = 'dark' | 'light'

// Récupérer le thème depuis localStorage ou utiliser 'light' par défaut
const storedTheme =
    typeof window !== 'undefined'
        ? (localStorage.getItem('theme') as Theme) || 'light'
        : 'light'

export const theme = writable<Theme>(storedTheme)

// Sauvegarder dans localStorage quand le thème change
theme.subscribe((value) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('theme', value)
    }
})
