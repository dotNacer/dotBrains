<script lang="ts">
    import {
        SvelteFlow,
        useSvelteFlow,
        type OnConnectEnd,
        type Edge as FlowEdge,
        type Node,
    } from '@xyflow/svelte'
    import '@xyflow/svelte/dist/style.css'
    import ConnectionLine from '$lib/components/svelteflow/ConnectionLine.svelte'
    import { addNode, nodeService } from '$lib/services/nodeService'
    import { nodes as nodesStore } from '$lib/stores/nodeStore'
    import { Button } from '$lib/components/ui/button'
    import {
        edges as edgesStore,
        defaultEdgeOptions,
    } from '$lib/stores/edgeStore'
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

    const SCENE_CREATION_NODE_ID = '-1'

    onMount(() => {
        // console.log(initialNodes)
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

    interface MenuNodeRef {
        closeMenu: () => void
    }

    const handleConnectEnd: OnConnectEnd = (event, connectionState) => {
        let isConnectingToANode = connectionState.isValid
        if (isConnectingToANode) {
            const fromId = connectionState.fromHandle?.nodeId
            const toId = connectionState.toHandle?.nodeId
            if (fromId && toId) {
                createEdge(fromId, toId)
            }
        } else {
            createSceneNode(event, connectionState)
        }
    }

    function createEdge(fromId: string, toId: string) {
        // Vérifier si une connexion existe déjà entre ces nodes
        const existingEdge = get(edgesStore).find(
            (edge) => edge.source === fromId && edge.target === toId,
        )

        if (existingEdge) return
        edgeService.create({
            fromNodeId: parseInt(fromId),
            toNodeId: parseInt(toId),
            type: 'smoothstep',
            animated: true,
        })
    }

    function createSceneNode(event: any, connectionState: any) {
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

        menuNodeId = SCENE_CREATION_NODE_ID
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
            SCENE_CREATION_NODE_ID,
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
        e.detail.event.preventDefault()

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

        addNode(
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
            SCENE_CREATION_NODE_ID,
        )

        sceneCreationStore.set({
            isOpen: true,
            nodeId: SCENE_CREATION_NODE_ID,
            nodeRef: null,
        })
    }
</script>

<div class="wrapper">
    <Button
        onclick={() => {
            console.log(get(edgesStore)[get(edgesStore).length - 2])
            console.log(get(edgesStore)[get(edgesStore).length - 1])
        }}
    >
        Log last edge
    </Button>
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
        {defaultEdgeOptions}
        class="!bg-card"
    >
        <FlowOptions {characters} />
        <ConnectionLine slot="connectionLine" />
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
