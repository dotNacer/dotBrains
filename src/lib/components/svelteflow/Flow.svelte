<script lang="ts">
    import {
        SvelteFlow,
        useSvelteFlow,
        type OnConnectEnd,
        type Edge as FlowEdge,
        type Node,
    } from '@xyflow/svelte'
    import '@xyflow/svelte/dist/style.css'
    import {
        addNode,
        getLastNodeID,
        nodeService,
    } from '$lib/services/nodeService'
    import { nodes as nodesStore } from '$lib/stores/nodeStore'
    import { edges as edgesStore } from '$lib/stores/edgeStore'
    import FlowOptions from '$lib/components/svelteflow/FlowOptions.svelte'
    import type { Scene } from '$lib/types/Scene'
    import { nodeTypes } from '$lib'
    import type { Character } from '$lib/types/Character'
    import { onMount } from 'svelte'
    import { edgeService } from '@/services/edgeService'
    import { sceneCreationStore } from '$lib/stores/sceneCreationStore'
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
        console.log(initialNodes)
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

        const currentState = get(sceneCreationStore)
        if (currentState.isOpen) {
            currentState.nodeRef?.closeMenu?.()
            sceneCreationStore.set({
                isOpen: false,
                nodeId: null,
                nodeRef: null,
            })
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

        const currentState = get(sceneCreationStore)
        if (currentState.isOpen) {
            currentState.nodeRef?.closeMenu?.()
            sceneCreationStore.set({
                isOpen: false,
                nodeId: null,
                nodeRef: null,
            })
        }

        if (isMenuOpened) {
            if (menuNodeRef?.closeMenu) {
                menuNodeRef.closeMenu()
                menuNodeRef = null
                menuNodeId = null
                isMenuOpened = false
            }
        }
    }

    async function handleDelete(event: any) {
        const edges = event.edges as FlowEdge[]
        for (const edge of edges) {
            edgeService.delete(parseInt(edge.id))
        }

        const nodes = event.nodes as Node[]
        // Extract scene IDs from nodes that have a scene property
        const scenes = nodes
            .filter((node: any) => node.data?.scene?.id)
            .map((node: any) => node.data.scene.id)

        // Delete nodes
        for (const node of nodes) {
            nodeService.delete(parseInt(node.id))
        }

        // Delete scenes
        for (const sceneId of scenes) {
            console.log('deleting scene', sceneId)
            const response = await fetch(`/api/scenes?id=${sceneId}`, {
                method: 'DELETE',
            })
            if (!response.ok) {
                console.error('Failed to delete scene:', response.statusText)
            }
        }
    }

    let dragDebounceTimer: ReturnType<typeof setTimeout>

    async function handleNodeDrag(e: any) {
        let draggedNodes = e.detail.nodes as Node[]

        clearTimeout(dragDebounceTimer)
        dragDebounceTimer = setTimeout(async () => {
            for (const node of draggedNodes) {
                try {
                    const response = await fetch('/api/nodes', {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            id: node.id,
                            positionX: node.position.x,
                            positionY: node.position.y,
                        }),
                    })

                    if (!response.ok) {
                        console.error('Failed to update node position')
                    }

                    console.log('updated node position', node.id, node.position)
                } catch (error) {
                    console.error('Error updating node position:', error)
                }
            }
        }, 1000)
    }

    function handlePaneContextMenu(e: any) {
        // Cancel le menu contextuel par défaut

        e.detail.event.preventDefault()

        console.log(e.detail.event.layerX, e.detail.event.layerY)
        const currentState = get(sceneCreationStore)
        if (currentState.isOpen) {
            currentState.nodeRef?.closeMenu?.()
            sceneCreationStore.set({
                isOpen: false,
                nodeId: null,
                nodeRef: null,
            })
        }

        const position = screenToFlowPosition({
            x: e.detail.event.layerX + 100,
            y: e.detail.event.layerY,
        })

        // Créer un nouveau node de création de scène
        const newNodeId = addNode(
            'scene-creation',
            {
                ref: (node: any) => {
                    sceneCreationStore.update((state) => ({
                        ...state,
                        nodeRef: node,
                    }))
                },
                characters,
            },
            position,
        )

        sceneCreationStore.set({
            isOpen: true,
            nodeId: newNodeId,
            nodeRef: null,
        })
    }
</script>

<div class="wrapper">
    <SvelteFlow
        nodes={nodesStore}
        {nodeTypes}
        edges={edgesStore}
        fitView
        fitViewOptions={{ padding: 2 }}
        onconnectend={handleConnectEnd}
        ondelete={(e) => handleDelete(e)}
        on:nodedrag={handleNodeDrag}
        on:paneclick={handlePaneClick}
        on:panecontextmenu={handlePaneContextMenu}
        class="!bg-card"
    >
        <FlowOptions {characters} />
    </SvelteFlow>
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
