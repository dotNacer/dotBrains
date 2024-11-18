<script lang="ts">
    import {
        SvelteFlow,
        useSvelteFlow,
        Background,
        type Edge,
        type Node,
        type OnConnectEnd,
    } from '@xyflow/svelte'
    import '@xyflow/svelte/dist/style.css'

    import {
        addNode,
        removeNode,
        updateNode,
        getLastNodeID,
    } from '$lib/services/nodeService'
    import { nodes } from '$lib/stores/nodeStore'
    import { edges } from '$lib/stores/edgeStore'
    import { nodeTypes } from '$lib'

    let rect = $state<DOMRectReadOnly | undefined>(undefined)

    const { screenToFlowPosition } = useSvelteFlow()

    let isMenuOpened = $state(false)
    let isConnecting = $state(false)
    let menuNodeRef = $state<MenuNodeRef | null>(null)

    $effect(() => {
        if (!isMenuOpened && menuNodeRef?.closeMenu) {
            menuNodeRef.closeMenu()
        }
    })

    interface MenuNodeRef {
        closeMenu: () => void
    }

    const handleConnectEnd: OnConnectEnd = (event, connectionState) => {
        isConnecting = true
        if (connectionState.isValid) {
            isConnecting = false
            return
        }

        const sourceNodeId = connectionState.fromNode?.id ?? '1'
        const id = getLastNodeID() ?? '1'
        const { clientX, clientY } =
            'changedTouches' in event ? event.changedTouches[0] : event

        addNode(
            'menu',
            {
                ref: (node: MenuNodeRef) => {
                    menuNodeRef = node
                },
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
            isMenuOpened = false
        }
    }
</script>

<div class="wrapper" bind:contentRect={rect}>
    <SvelteFlow
        {nodes}
        {nodeTypes}
        {edges}
        fitView
        fitViewOptions={{ padding: 2 }}
        onconnectend={handleConnectEnd}
        on:paneclick={handlePaneClick}
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

    /* :global(.svelte-flow .svelte-flow__node) {
        height: 40px;
        width: 150px;
        justify-content: center;
        align-items: center;
        display: flex;
        border-width: 2px;
        font-weight: 700;
    } */

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
