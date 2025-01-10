import type { Node } from '@xyflow/svelte'
import { writable } from 'svelte/store'

export const nodes = writable<Node[]>([])
