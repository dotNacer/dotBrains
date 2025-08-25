<script lang="ts">
	import '@xyflow/svelte/dist/style.css'
	import type { PageData } from './$types'
	import ConnectionLine from '$lib/components/svelteflow/ConnectionLine.svelte'
	import { SvelteFlow, type OnDelete } from '@xyflow/svelte'
	import { nodeTypes, defaultEdgeOptions } from '$lib'
	import { onMount } from 'svelte'
	import { nodesActions } from '@/stores/nodeStore'
	let { data } = $props<{ data: PageData }>()
	import { formatDBNodes } from '@/utils/svelteflow'
	import { NodeType } from '@prisma/client'

	onMount(() => {
		nodesActions.setBaseNodes(data.nodes)
	})

	const handleDelete: OnDelete = async ({ nodes: deletedNodes, edges: deleteEdges }) => {
		console.log(
			deletedNodes.map((node) => node.id),
			deleteEdges.map((edge) => edge.id)
		)

		// Suppression des edges avant les nodes

		deletedNodes.forEach((node) => {
			nodesActions.deleteNode(node.id, data.scene_id)
		})
	}

	// Déplacement et débounce

	let nodes = $derived(formatDBNodes($nodesActions))
</script>

<div class="h-screen w-full">
	<button
		onclick={() =>
			nodesActions.addNode({
				type: NodeType.EVENT,
				positionX: 0,
				positionY: 0,
				width: 300,
				height: 150,
				title: 'test',
				sceneEventId: null,
				parentId: null,
				sceneId: data.scene_id,
				properties: {},
			})}
	>
		Addnode
	</button>
	<SvelteFlow
		class="!bg-card"
		{nodes}
		edges={data.edges}
		{nodeTypes}
		{defaultEdgeOptions}
		fitView
		fitViewOptions={{ padding: 2, duration: 300, interpolate: 'smooth' }}
		ondelete={handleDelete}
		connectionLineComponent={ConnectionLine}
	/>
</div>
