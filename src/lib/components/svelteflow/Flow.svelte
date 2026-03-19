<script lang="ts">
	import '@xyflow/svelte/dist/style.css'
	import ConnectionLine from '$lib/components/svelteflow/ConnectionLine.svelte'
	import {
		SvelteFlow,
		type OnDelete,
		type OnConnectEnd,
		type Node,
		type Edge,
		type XYPosition,
		type NodeTargetEventWithPointer,
		useSvelteFlow,
	} from '@xyflow/svelte'
	import { untrack } from 'svelte'
	import { nodeTypes, defaultEdgeOptions } from '$lib'
	import { nodeApi } from '$lib/stores/nodeStore'
	import { edgeApi } from '$lib/stores/edgeStore'
	import { formatDBNodes, formatDBEdges, formatDBNode, formatDBEdge } from '$lib/utils/svelteflow'
	import { NodeType, EdgeType } from '@prisma/client'
	import type { Scene } from '@prisma/client'
	import type { Node as PrismaNode, Edge as PrismaEdge } from '@prisma/client'

	let { scene, baseNodes, baseEdges } = $props<{
		scene: Scene
		baseNodes: PrismaNode[]
		baseEdges: PrismaEdge[]
	}>()

	let nodes = $state.raw<Node[]>(untrack(() => formatDBNodes(baseNodes)))
	let edges = $state.raw<Edge[]>(untrack(() => formatDBEdges(baseEdges)))

	let isHandlingNodeHandling = $state(false)
	let menuNodeVisible = $state(false)

	const { screenToFlowPosition } = useSvelteFlow()

	const handleDelete: OnDelete = async ({ nodes: deletedNodes, edges: deletedEdges }) => {
		const deletedNodeIds = new Set(deletedNodes.map((n) => n.id))
		const deletedEdgeIds = new Set(deletedEdges.map((e) => e.id))

		nodes = nodes.filter((n) => !deletedNodeIds.has(n.id))
		edges = edges.filter((e) => !deletedEdgeIds.has(e.id))

		for (const edge of deletedEdges) {
			edgeApi.deleteEdge(edge.id, scene.id)
		}
		for (const node of deletedNodes) {
			nodeApi.deleteNode(node.id, scene.id)
		}
	}

	const handleNodeDragStop: NodeTargetEventWithPointer<MouseEvent | TouchEvent, Node> = (e) => {
		for (const node of e.nodes as Node[]) {
			nodeApi.saveNodePosition(node.id, scene.id, node.position.x, node.position.y)
		}
	}

	const handleConnectEnd: OnConnectEnd = async (event, connectionState) => {
		if (connectionState.isValid) {
			const sourceId = connectionState.fromHandle?.nodeId
			const targetId = connectionState.toHandle?.nodeId

			if (sourceId && targetId) {
				const prismaEdge = await edgeApi.addEdge({
					sourceId,
					targetId,
					sceneId: scene.id,
					type: EdgeType.smoothstep,
					animated: true,
				})
				edges = [...edges, formatDBEdge(prismaEdge)]
			}
		} else {
			if (!connectionState.to) return

			const touch =
				'touches' in event ? (event.touches?.[0] ?? event.changedTouches?.[0]) : null
			const clientX = touch?.clientX ?? ('clientX' in event ? event.clientX : undefined)
			const clientY = touch?.clientY ?? ('clientY' in event ? event.clientY : undefined)
			if (clientX == null || clientY == null) return

			isHandlingNodeHandling = true
			showMenuNode(screenToFlowPosition({ x: clientX, y: clientY }))

			setTimeout(() => {
				isHandlingNodeHandling = false
			}, 10)
		}
	}

	const handlePaneClick = ({ event }: { event: MouseEvent }) => {
		if (isHandlingNodeHandling) return
		hideMenuNode()
	}

	async function addNode(type: NodeType, position: { x: number; y: number }) {
		const prismaNode = await nodeApi.addNode({
			type,
			positionX: position.x,
			positionY: position.y,
			width: 300,
			height: 150,
			title: 'test',
			sceneId: scene.id,
		})
		nodes = [...nodes, formatDBNode(prismaNode)]
	}

	function showMenuNode(position: XYPosition) {
		hideMenuNode()
		menuNodeVisible = true
		nodes = [
			...nodes,
			{
				id: '__menu__',
				type: 'MENU',
				position: { x: position.x, y: position.y },
				width: 320,
				height: 200,
				data: { title: 'Menu' },
			},
		]
	}

	function hideMenuNode() {
		if (!menuNodeVisible) return
		menuNodeVisible = false
		nodes = nodes.filter((n) => n.id !== '__menu__')
	}
</script>

<div class="h-screen w-full">
	<button onclick={() => addNode(NodeType.EVENT, { x: 0, y: 0 })}> Addnode </button>

	<SvelteFlow
		class="bg-card!"
		bind:nodes
		bind:edges
		{nodeTypes}
		{defaultEdgeOptions}
		fitView
		fitViewOptions={{ padding: 2, duration: 300, interpolate: 'smooth' }}
		ondelete={handleDelete}
		onnodedragstop={handleNodeDragStop}
		connectionLineComponent={ConnectionLine}
		onconnectend={handleConnectEnd}
		onpaneclick={handlePaneClick}
	>
		<div class="absolute bottom-0 flex w-full items-center justify-center">
			<div class="bg-card z-30 mb-4 rounded-xl border p-4">
				{nodes.length}
				<p>{menuNodeVisible ? 'Menu ouvert' : 'Menu fermé'}</p>
			</div>
		</div>
	</SvelteFlow>
</div>
