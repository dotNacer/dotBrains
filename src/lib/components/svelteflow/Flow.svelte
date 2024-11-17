<script lang="ts">
    import { writable } from 'svelte/store'
    import {
        SvelteFlow,
        useSvelteFlow,
        Background,
        type Edge,
        type Node,
        type OnConnectEnd,
    } from '@xyflow/svelte'
    import '@xyflow/svelte/dist/style.css'
    import { initialNodes, initialEdges } from './nodes-and-edges'
    import CustomNode from './nodes/CustomNode.svelte'
    import IntermediaryNode from './nodes/IntermediaryNode.svelte'

    const nodes = writable<Node[]>(initialNodes)
    const edges = writable<Edge[]>(initialEdges)

    let rect: DOMRectReadOnly
    let id = initialEdges.length + 2
    const getId = () => `${id++}`

    const { screenToFlowPosition } = useSvelteFlow()

    let isIntermediaryMenuOpenned = $state(false)
    const nodeTypes = {
        custom: CustomNode,
        intermediary: IntermediaryNode,
    }

    const addEdge = (newEdge: Edge) => {
        edges.update((e) => [...e, newEdge])
    }

    function deleteNode(node: Node) {
        nodes.update((n) => n.filter((n) => n.id !== node.id))
    }

    const handleConnectEnd: OnConnectEnd = (event, connectionState) => {
        if (connectionState.isValid) return

        const sourceNodeId = connectionState.fromNode?.id ?? '1'
        const id = getId()
        const { clientX, clientY } =
            'changedTouches' in event ? event.changedTouches[0] : event

        const newNode: Node = {
            id,
            type: 'intermediary',
            data: {
                name: `Node ${id}`,
                job: 'New Node',
                emoji: '🔄',
            },
            position: screenToFlowPosition({
                x: clientX,
                y: clientY,
            }),
            origin: [0.5, 0.0],
        }

        nodes.update((n) => [...n, newNode])
        edges.update((e) => [
            ...e,
            {
                source: sourceNodeId,
                target: id,
                id: `${sourceNodeId}--${id}`,
            },
        ])

        isIntermediaryMenuOpenned = true

        $nodes = $nodes
        $edges = $edges
    }
    function handlePaneClick(event: MouseEvent | TouchEvent) {
        if (isIntermediaryMenuOpenned) {
            const intermediaryNodeToDelete = $nodes.find(
                (node) => node.type === 'intermediary',
            )
            if (intermediaryNodeToDelete) {
                deleteNode(intermediaryNodeToDelete)
            }
            isIntermediaryMenuOpenned = false
        }
    }
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
        on:paneclick={(e) => handlePaneClick(e.detail.event)}
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

    :global(
            .svelte-flow .svelte-flow__edge path,
            .svelte-flow__connectionline path
        ) {
        stroke-width: 2;
    }

    .wrapper {
        height: 100vh;
        width: 100vw;
    }
</style>
