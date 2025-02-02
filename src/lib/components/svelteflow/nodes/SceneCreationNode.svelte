<script lang="ts">
    import { onMount, getContext } from 'svelte'
    import { scale } from 'svelte/transition'
    import {
        removeNode,
        updateNodeToCustom,
        updateNodeId,
    } from '$lib/services/nodeService'
    import { toast } from 'svelte-sonner'
    import SceneCreateForm from '$lib/components/forms/scene-create-form.svelte'
    import { superValidate } from 'sveltekit-superforms'
    import { zod } from 'sveltekit-superforms/adapters'
    import { formSchema } from '$lib/schemas/nodes'

    let { id, data, positionAbsoluteX, positionAbsoluteY } = $props()

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

    onMount(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeMenu()
            }
        }
        document.addEventListener('keydown', handleEscape)

        mounted = true
        const input = document.getElementById(`input-${id}`)
        if (input) {
            setTimeout(() => {
                input.focus()
            }, 250)
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
        }
    })

    async function handleSubmit(result: {
        result: { type: string; data?: any }
    }) {
        if (result.result.type === 'success') {
            wasTransformed = true
            const sceneData = result.result.data

            // Créer le formulaire pour le node
            const nodeForm = await superValidate(zod(formSchema))
            nodeForm.data = {
                positionX: Math.round(positionAbsoluteX),
                positionY: Math.round(positionAbsoluteY),
                sceneId: sceneData.id,
                outgoingId: [],
                incomingId: [],
                properties: [],
            }

            // Envoyer la requête pour créer le node
            const response = await fetch('?/createNode', {
                method: 'POST',
                body: JSON.stringify(nodeForm.data),
            })

            const responseData = await response.json()

            if (response.ok) {
                toast.success('Node created successfully!')
                // Parser la réponse qui est une chaîne JSON
                const parsedData = JSON.parse(responseData.data)
                // L'ID du node se trouve à l'index 3 du tableau
                const nodeId = parsedData[3].toString()

                updateNodeId(id, nodeId)

                updateNodeToCustom(nodeId, sceneData)
            } else {
                toast.error('Failed to create node')
            }
        }
    }

    let formData = $state({
        form: null as any,
        characters: data.characters || [],
    })

    async function initForm() {
        formData.form = await superValidate(zod(formSchema))
    }

    onMount(() => {
        initForm()
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
