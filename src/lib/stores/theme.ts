import { writable } from 'svelte/store'

type Theme = 'dark' | 'light'

export const theme = writable<Theme>('light')
