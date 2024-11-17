<script lang="ts">
    import { onMount, getContext } from 'svelte'

    import {
        Handle,
        Position,
        type NodeProps,
        useHandleConnections,
        useSvelteFlow,
        type Edge,
    } from '@xyflow/svelte'

    let { id, data } = $props()

    const { updateNode, getEdges } = useSvelteFlow()

    import * as Command from '$lib/components/ui/command/index.js'

    // import { writable } from 'svelte/store'

    // const categories = writable<EffectCategory[]>(EffectsCategory)

    const addEdge = getContext<(edge: Edge) => void>('addEdge')

    const switchToTransformer = (effect: Effect) => {
        updateNode(id, {
            type: 'transformer',
            data: {
                name: effect.label,
                value: effect.value,
                requirement: effect.requirement,
            },
        })

        let newEdge: Edge | undefined
        if (data.sourceNodeId) {
            newEdge = {
                id: `e${data.sourceNodeId}-${id}`,
                source: data.sourceNodeId.toString(),
                target: id.toString(),
                // targetHandle: `input-handle-0`,
            }
        } else if (data.targetNodeId) {
            newEdge = {
                id: `e${data.targetNodeId}-${id}`,
                source: id.toString(),
                target: data.targetNodeId.toString(),
            }
        }

        if (newEdge) {
            setTimeout(() => {
                addEdge(newEdge)
            }, 15)
        }
    }

    onMount(() => {
        const input = document.getElementById(`input-${id}`)
        if (input) {
            setTimeout(() => {
                input.focus()
            }, 250)
        }
    })
</script>

<Command.Root class="nowheel">
    <Command.Input placeholder="Trouvez un effet..." id={`input-${id}`} />
    <Command.List>
        <Command.Empty>Aucun résultat trouvé.</Command.Empty>
        {#each data.effectTypes as category}
            <Command.Group heading={category.name}>
                {#each category.effects as effect}
                    <Command.Item
                        onclick={() => switchToTransformer(effect)}
                        class="cursor-pointer"
                    >
                        {effect.label}
                    </Command.Item>
                {/each}
            </Command.Group>
            <hr />
        {/each}
    </Command.List>
</Command.Root>
