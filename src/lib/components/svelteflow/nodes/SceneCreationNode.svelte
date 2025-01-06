<script lang="ts">
    import { onMount, getContext } from 'svelte'
    import { scale } from 'svelte/transition'

    import { type Edge } from '@xyflow/svelte'

    import {
        removeNode,
        updateNodeToCustom,
        updateNode,
    } from '$lib/services/nodeService'
    import { toast } from 'svelte-sonner'

    let { id, data } = $props()

    import * as Command from '$lib/components/ui/command/'

    const addEdge = getContext<(edge: Edge) => void>('addEdge')

    // Expose closeMenu to parent
    $effect(() => {
        if (typeof data.ref === 'function') {
            data.ref({ closeMenu })
        }
    })

    // Function to close menu and remove node
    function closeMenu() {
        if (!wasTransformed) {
            removeNode(id)
        }
    }

    let mounted = $state(false)

    onMount(() => {
        mounted = true
        const input = document.getElementById(`input-${id}`)
        if (input) {
            setTimeout(() => {
                input.focus()
            }, 250)
        }

        // Optional: Setup event listener for Escape key
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeMenu()
            }
        }
        document.addEventListener('keydown', handleEscape)

        return () => {
            document.removeEventListener('keydown', handleEscape)
        }
    })

    let wasTransformed = $state(false)

    function transformToCustomNode() {
        wasTransformed = true
        updateNodeToCustom(id)
        const input = document.getElementById(`input-${id}`)
        toast.success('Node created')
        if (input) {
            input.blur()
        }
    }
</script>

{#if mounted}
    <div transition:scale={{ duration: 200, start: 0.95 }}></div>
{/if}
