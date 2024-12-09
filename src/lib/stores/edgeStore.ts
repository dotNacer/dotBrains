import type { Edge } from '@xyflow/svelte'
import { writable } from 'svelte/store'

const initialEdges: Edge[] = [
    {
        id: 'e1-2',
        source: '1',
        target: '2',
        type: 'smoothstep',
        animated: true,
    },
    {
        id: 'e1-3',
        source: '1',
        target: '3',
        type: 'smoothstep',
        animated: true,
    },
]

export const edges = writable<Edge[]>(initialEdges)
