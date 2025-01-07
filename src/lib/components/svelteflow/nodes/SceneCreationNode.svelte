<script lang="ts">
    import { onMount, getContext } from 'svelte'
    import { scale } from 'svelte/transition'
    import { type Edge } from '@xyflow/svelte'
    import { removeNode, updateNodeToCustom } from '$lib/services/nodeService'
    import { toast } from 'svelte-sonner'
    import SceneCreateForm from '$lib/components/forms/scene-create-form.svelte'
    import { superValidate } from 'sveltekit-superforms'
    import { zod } from 'sveltekit-superforms/adapters'
    import { formSchema } from '$lib/schemas/scenes'

    let { id, data } = $props()

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
    let wasTransformed = $state(false)

    onMount(async () => {
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

    function handleSubmit(result: { result: { type: string; data?: any } }) {
        if (result.result.type === 'success') {
            wasTransformed = true
            updateNodeToCustom(id)
        }
    }

    let formData = $state({
        form: null as any,
        characters: data.characters || [],
    })

    onMount(async () => {
        formData.form = await superValidate(zod(formSchema))
    })
</script>

{#if mounted && formData.form}
    <div
        transition:scale={{ duration: 200, start: 0.95 }}
        class="border p-4 w-[400px] bg-background"
    >
        <h1 class="text-xl font-semibold mb-4">Create Scene</h1>
        <SceneCreateForm
            data={{ ...formData.form, characters: formData.characters }}
            onSubmit={handleSubmit}
        />
    </div>
{/if}
