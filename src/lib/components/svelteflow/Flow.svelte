<script lang="ts">
	import { writable } from 'svelte/store';
	import {
		SvelteFlow,
		useSvelteFlow,
		Background,
		type Edge,
		type Node,
		type OnConnectEnd
	} from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';
	import { initialNodes, initialEdges } from './nodes-and-edges';
	import CustomNode from './CustomNode.svelte';

	const nodes = writable<Node[]>(initialNodes);
	const edges = writable<Edge[]>(initialEdges);

	let rect: DOMRectReadOnly;
	let id = initialEdges.length + 2;
	const getId = () => `${id++}`;

	const { screenToFlowPosition } = useSvelteFlow();

	const handleConnectEnd: OnConnectEnd = (event, connectionState) => {
		if (connectionState.isValid) return;

		const sourceNodeId = connectionState.fromNode?.id ?? '1';
		const id = getId();
		const { clientX, clientY } = 'changedTouches' in event ? event.changedTouches[0] : event;

		const newNode: Node = {
			id,
			type: 'custom', // Use custom node type
			data: {
				name: `Node ${id}`,
				job: 'New Node',
				emoji: '🔄'
			},
			position: screenToFlowPosition({
				x: clientX,
				y: clientY
			}),
			origin: [0.5, 0.0]
		};

		$nodes.push(newNode);
		$edges.push({
			source: sourceNodeId,
			target: id,
			id: `${sourceNodeId}--${id}`
		});

		$nodes = $nodes;
		$edges = $edges;
	};

	const nodeTypes = {
		custom: CustomNode
	};
</script>

<svelte:window />

<div class="wrapper" bind:contentRect={rect}>
	<SvelteFlow
		{nodes}
		{nodeTypes}
		{edges}
		fitView
		fitViewOptions={{ padding: 2 }}
		onconnectend={handleConnectEnd}
	>
		<Background />
	</SvelteFlow>
</div>

<style>
	:global(.svelte-flow .svelte-flow__handle) {
		width: 30px;
		height: 14px;
		border-radius: 3px;
		background-color: #784be8;
	}

	:global(.svelte-flow .svelte-flow__handle-top) {
		top: -10px;
	}

	:global(.svelte-flow .svelte-flow__handle-bottom) {
		bottom: -10px;
	}

	:global(.svelte-flow .svelte-flow__node) {
		height: 40px;
		width: 150px;
		justify-content: center;
		align-items: center;
		display: flex;
		border-width: 2px;
		font-weight: 700;
	}

	:global(.svelte-flow .svelte-flow__edge path, .svelte-flow__connectionline path) {
		stroke-width: 2;
	}

	.wrapper {
		height: 100vh;
		width: 100vw;
	}
</style>
