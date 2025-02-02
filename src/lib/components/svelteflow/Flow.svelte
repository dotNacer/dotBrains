<script lang="ts">
    import {
        SvelteFlow,
        useSvelteFlow,
        type OnConnectEnd,
        type Node,
        type Edge as FlowEdge,
    } from '@xyflow/svelte'
    import '@xyflow/svelte/dist/style.css'
    import { Button } from '$lib/components/ui/button'
    import {
        addNode,
        getLastNodeID,
        nodeService,
    } from '$lib/services/nodeService'
    import { nodes as nodesStore } from '$lib/stores/nodeStore'
    import { edges as edgesStore } from '$lib/stores/edgeStore'

    import type { Scene } from '$lib/types/Scene'
    import { nodeTypes } from '$lib'
    import type { Character } from '$lib/types/Character'
    import { onMount } from 'svelte'
    import { edgeService } from '@/services/edgeService'
    import { get } from 'svelte/store'
    let {
        characters,
        scenes,
        db_nodes: initialNodes,
        db_edges: initialEdges,
    } = $props<{
        characters: Character[]
        scenes: Scene[]
        db_nodes: Node[]
        db_edges: FlowEdge[]
    }>()

    onMount(() => {
        if (initialNodes && initialNodes.length > 0) {
            nodesStore.set(initialNodes)
        }
        if (initialEdges && initialEdges.length > 0) {
            edgesStore.set(initialEdges)
        }
    })

    const { screenToFlowPosition } = useSvelteFlow()

    let isMenuOpened = $state(false)
    let isConnecting = $state(false)
    let menuNodeRef = $state<MenuNodeRef | null>(null)
    let menuNodeId = $state<string | null>(null)

    $effect(() => {
        if (!isMenuOpened && menuNodeRef?.closeMenu) {
            menuNodeRef.closeMenu()
        }
    })

    interface MenuNodeRef {
        closeMenu: () => void
    }

    const handleConnectEnd: OnConnectEnd = (event, connectionState) => {
        if (connectionState.isValid) {
            return
        }

        if (isMenuOpened) {
            if (menuNodeRef?.closeMenu) {
                menuNodeRef.closeMenu()
            }
            menuNodeRef = null
            menuNodeId = null
            isMenuOpened = false
        }

        const { clientX, clientY } =
            'changedTouches' in event ? event.changedTouches[0] : event
        const id = getLastNodeID() ?? '1'

        menuNodeId = id
        isConnecting = true

        addNode(
            'scene-creation',
            {
                ref: (node: MenuNodeRef) => {
                    menuNodeRef = node
                },
                fromHandle: connectionState.fromHandle,
                characters,
            },
            screenToFlowPosition({
                x: clientX,
                y: clientY,
            }),
        )

        isMenuOpened = true

        setTimeout(() => {
            isConnecting = false
        }, 100)
    }

    function handlePaneClick() {
        if (isConnecting) return

        if (isMenuOpened) {
            if (menuNodeRef?.closeMenu) {
                menuNodeRef.closeMenu()
                menuNodeRef = null
                menuNodeId = null
                isMenuOpened = false
            }
        }
    }

    function handleDelete(event: any) {
        const edges = event.edges as FlowEdge[]
        for (const edge of edges) {
            edgeService.delete(parseInt(edge.id))
        }

        const nodes = event.nodes as Node[]
        for (const node of nodes) {
            // console.log('node', node)
            nodeService.delete(parseInt(node.id))
        }
    }

    function logs() {
        console.log(
            'Dernier edge : ',
            get(edgesStore)[get(edgesStore).length - 1],
        )
        console.log(
            'Dernier node : ',
            get(nodesStore)[get(nodesStore).length - 1],
        )
    }
</script>

<div class="wrapper">
    <Button onclick={logs}>Logs</Button>
    <Button onclick={() => console.log(get(edgesStore))}>Log edges</Button>
    <Button onclick={() => console.log(get(nodesStore))}>Log nodes</Button>
    <SvelteFlow
        nodes={nodesStore}
        {nodeTypes}
        edges={edgesStore}
        fitView
        fitViewOptions={{ padding: 2 }}
        onconnectend={handleConnectEnd}
        ondelete={(e) => handleDelete(e)}
        on:paneclick={handlePaneClick}
        class="!bg-card"
    />
</div>

<style>
    :global(
        .svelte-flow .svelte-flow__edge path,
        .svelte-flow__connectionline path
    ) {
        stroke-width: 2;
    }

    .wrapper {
        height: 100vh;
    }

    :global(.svelte-flow__attribution) {
        display: none;
    }
</style>
