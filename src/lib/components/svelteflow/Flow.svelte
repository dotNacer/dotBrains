<script lang="ts">
	import '@xyflow/svelte/dist/style.css'
	import ConnectionLine from '$lib/components/svelteflow/ConnectionLine.svelte'
	import {
		SvelteFlow,
		type OnDelete,
		type OnConnectEnd,
		type Node,
		type Edge,
		type NodeTargetEventWithPointer,
		useSvelteFlow,
	} from '@xyflow/svelte'
	import { nodeTypes, defaultEdgeOptions } from '$lib'
	import { onMount } from 'svelte'
	import { nodesActions } from '@/stores/nodeStore'
	import { flowActions } from '@/stores/flowStore'
	import { formatDBNodes } from '@/utils/svelteflow'
	import { NodeType } from '@prisma/client'
	import type { Scene } from '$lib/types/Scene'

	let { scene, baseNodes, edges } = $props<{ scene: Scene; baseNodes: Node[]; edges: Edge[] }>()

	let isHandlingNodeHandling = $state(false)

	onMount(() => {
		nodesActions.setBaseNodes(baseNodes)
	})

	const { screenToFlowPosition } = useSvelteFlow()

	const handleDelete: OnDelete = async ({ nodes: deletedNodes, edges: deleteEdges }) => {
		// Suppression des edges avant les nodes

		deletedNodes.forEach((node) => {
			nodesActions.deleteNode(node.id, scene.id)
		})
	}

	// Déplacement et débounce
	let dragDebounceTimer: ReturnType<typeof setTimeout>

	const handleNodeDrag: NodeTargetEventWithPointer<MouseEvent | TouchEvent, Node> = (e) => {
		let draggedNodes = e.nodes as Node[]

		//FIXME: Quand je déplace un node alors qu'il est selectionné, le node passe en unselected, penser a le laisser selected
		//FIXME: Une erreur survient quand le node se fait supprimer avant que ça soit save, c'est pas handicapant mais il faudrait fix ça.
		clearTimeout(dragDebounceTimer)
		dragDebounceTimer = setTimeout(async () => {
			for (const node of draggedNodes) {
				nodesActions.updateNode(node.id, scene.id, {
					positionX: node.position.x,
					positionY: node.position.y,
				} as any)
			}
			console.log('Saved')
		}, 1000)
	}

	let nodes = $derived.by(() => {
		const baseNodes = formatDBNodes($nodesActions)
		if ($flowActions.menuNode.visible) {
			const position = $flowActions.menuNode.position
			baseNodes.push({
				id: '__menu__',
				type: 'MENU',
				position: { x: position.x, y: position.y },
				width: 320,
				height: 200,
				data: { title: 'Menu' },
			})
		}
		return baseNodes
	})

	const handleConnectEnd: OnConnectEnd = async (event, connectionState) => {
		let isConnectingToANode = connectionState.isValid
		if (isConnectingToANode) {
			const fromId = connectionState.fromHandle?.nodeId
			const toId = connectionState.toHandle?.nodeId
			console.log(fromId, toId)
		} else {
			if (!connectionState.to) return

			// Determine pointer coordinates for both touch and mouse events,
			// and exit early if we can't find any.
			const touch =
				'touches' in event ? (event.touches?.[0] ?? event.changedTouches?.[0]) : null
			const clientX = touch?.clientX ?? ('clientX' in event ? event.clientX : undefined)
			const clientY = touch?.clientY ?? ('clientY' in event ? event.clientY : undefined)
			if (clientX == null || clientY == null) return
			isHandlingNodeHandling = true
			flowActions.setMenuNode(true, screenToFlowPosition({ x: clientX, y: clientY }))

			setTimeout(() => {
				isHandlingNodeHandling = false
			}, 10)
		}
	}

	const handlePaneClick = ({ event }: { event: MouseEvent }) => {
		if (isHandlingNodeHandling) return
		flowActions.setMenuNode(false, { x: 0, y: 0 })
	}
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
				sceneId: scene.id,
			})}
	>
		Addnode
	</button>

	<SvelteFlow
		class="!bg-card"
		{nodes}
		{edges}
		{nodeTypes}
		{defaultEdgeOptions}
		fitView
		fitViewOptions={{ padding: 2, duration: 300, interpolate: 'smooth' }}
		ondelete={handleDelete}
		onnodedrag={handleNodeDrag}
		connectionLineComponent={ConnectionLine}
		onconnectend={handleConnectEnd}
		onpaneclick={handlePaneClick}
	>
		<div class="absolute bottom-0 flex w-full items-center justify-center">
			<div class="z-30 mb-4 rounded-xl border-[1px] bg-card p-4">
				{nodes.length}
				<p>{$flowActions.menuNode.visible ? 'Menu ouvert' : 'Menu fermé'}</p>
				<p>{$flowActions.menuNode.position.x}</p>
				<p>{$flowActions.menuNode.position.y}</p>
			</div>
		</div>
	</SvelteFlow>
</div>
