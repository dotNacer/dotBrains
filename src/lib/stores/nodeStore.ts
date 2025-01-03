import type { Node } from '@xyflow/svelte'
import { writable } from 'svelte/store'

const initialNodes: Node[] = [
    {
        id: '1',
        type: 'custom',
        data: { name: 'Jane Doe', job: 'CEO', emoji: '😎' },
        position: { x: 0, y: 50 },
    },
    {
        id: '2',
        type: 'custom',
        data: { name: 'Tyler Weary', job: 'Designer', emoji: '🤓' },

        position: { x: -200, y: 200 },
    },
    {
        id: '3',
        type: 'custom',
        data: { name: 'Kristi Price', job: 'Developer', emoji: '🤩' },
        position: { x: 200, y: 200 },
    },
]

export const nodes = writable<Node[]>(initialNodes)
