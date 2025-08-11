import type { NodeTypes } from '@xyflow/svelte'
import { MarkerType } from '@xyflow/svelte'
import TestNode from '$lib/components/svelteflow/nodes/TestNode.svelte'

export const nodeTypes: NodeTypes = {
	EVENT: TestNode, // Utiliser un const, ou alors peut être l'enum prisma
}

export const defaultEdgeOptions = {
	type: 'floating',
	deletable: false,
	animated: true,
	markerEnd: {
		type: MarkerType.ArrowClosed,
	},
}
