<script lang="ts">
    import {
        SvelteFlow,
        useSvelteFlow,
        Background,
        type OnConnectEnd,
    } from '@xyflow/svelte'
    import '@xyflow/svelte/dist/style.css'

    import { addNode, getLastNodeID } from '$lib/services/nodeService'
    import { nodes } from '$lib/stores/nodeStore'
    import { edges } from '$lib/stores/edgeStore'
    import { nodeTypes } from '$lib'

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
        console.log('État de connexion', connectionState)
        /* console.table({
            fromNodeID: connectionState.fromNode?.id,
            fromNodeHandle:
                connectionState.fromHandle?.position &&
                connectionState.fromHandle.type,
            toNodeID: connectionState.toNode?.id,
            toNodeHandle:
                connectionState.toHandle?.position &&
                connectionState.toHandle.type,
        }) */
        // console.log(connectionState.fromHandle)
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
            'menu',
            {
                ref: (node: MenuNodeRef) => {
                    menuNodeRef = node
                },
                fromHandle: connectionState.fromHandle,
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
</script>

<div class="wrapper">
    <SvelteFlow
        {nodes}
        {nodeTypes}
        {edges}
        fitView
        fitViewOptions={{ padding: 2 }}
        onconnectend={handleConnectEnd}
        on:paneclick={handlePaneClick}
        class="!bg-card"
    ></SvelteFlow>
</div>

<style>
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
    }

    :global(.svelte-flow__attribution) {
        display: none;
    }
</style>
