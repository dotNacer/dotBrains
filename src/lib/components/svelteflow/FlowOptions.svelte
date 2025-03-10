<script lang="ts">
    import { Button } from '$lib/components/ui/button/index.js'
    import { Component, Undo2, Plus, Group } from 'lucide-svelte'
    import { addNode } from '$lib/services/nodeService'
    import { useSvelteFlow } from '@xyflow/svelte'
    import { sceneCreationStore } from '$lib/stores/sceneCreationStore'
    import { get } from 'svelte/store'
    let { characters } = $props()
    const { screenToFlowPosition } = useSvelteFlow()

    function handleAddNode() {
        // Si un node de création est déjà ouvert, on le ferme
        const currentState = get(sceneCreationStore)
        if (currentState.isOpen) {
            currentState.nodeRef?.closeMenu?.()
            sceneCreationStore.set({
                isOpen: false,
                nodeId: null,
                nodeRef: null,
            })
            return
        }

        // Get the center of the viewport
        const centerPosition = screenToFlowPosition({
            x: window.innerWidth / 3,
            y: window.innerHeight / 3,
        })

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
            centerPosition,
            '-1',
        )

        sceneCreationStore.set({
            isOpen: true,
            nodeId: '-1',
            nodeRef: null,
        })
    }
</script>

<div class="absolute bottom-0 w-full flex justify-center items-center">
    <div class="bg-card p-4 rounded-xl border-[1px] mb-4 z-30">
        <Button variant="outline" class="gap-2 z-30"
            ><Undo2 class="w-4 h-4" />Undo</Button
        >
        <Button variant="outline" class="gap-2" onclick={handleAddNode}
            ><Plus class="w-4 h-4" />Add a node</Button
        >
        <Button variant="outline" class="gap-2"
            ><Group class="w-4 h-4" />Add a group</Button
        >
        <Button variant="outline" class="gap-2 hover:bg-[var(--base)]"
            ><Component class="w-4 h-4" />Placeholder</Button
        >
    </div>
</div>
