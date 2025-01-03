<script lang="ts">
    import type { PageData } from './$types'
    import SceneCard from '$lib/components/scene-card.svelte'
    import { formSchema } from './schema'
    import * as Form from '$lib/components/ui/form'
    import { Input } from '$lib/components/ui/input'
    import { superForm } from 'sveltekit-superforms'
    import { zodClient } from 'sveltekit-superforms/adapters'
    import { toast } from 'svelte-sonner'
    import CharacterSelector from '$lib/components/forms/character-selector.svelte'

    let { data } = $props<{ data: PageData }>()

    let scenesList = $derived(data.scenes)
    let charactersList = $derived(data.characters)

    const form = superForm(data.form, {
        validators: zodClient(formSchema),
        dataType: 'json',
        onResult: ({ result }) => {
            if (result.type === 'success') {
                toast.success(result.data?.message)
            }
        },
        onError: (error) => {
            toast.error('Something went wrong!')
        },
    })

    const { form: formData, enhance } = form

    function handleCharacterChange(event: CustomEvent<number[]>) {
        $formData.characterIds = [...event.detail]
    }
</script>

<div class="space-y-2">
    <h1 class="font-semibold text-3xl">Scenes</h1>
    <div class="gap-4 w-full flex flex-wrap">
        {#if scenesList.length === 0}
            <p>Aucune scène trouvée</p>
        {:else}
            {#each scenesList as scene}
                <SceneCard
                    {scene}
                    editForm={data.editForm}
                    characters={charactersList}
                />
            {/each}
        {/if}
    </div>

    <div class="w-[400px] p-4 bg-card border border-border">
        <form method="POST" action="?/create" use:enhance>
            <Form.Field {form} name="title">
                <Form.Control let:attrs>
                    <Form.Label>Titre</Form.Label>
                    <Input {...attrs} bind:value={$formData.title} />
                </Form.Control>
                <Form.Description
                    >Ce titre sera utilisé pour identifier votre scène.</Form.Description
                >
                <Form.FieldErrors />
            </Form.Field>
            <Form.Field {form} name="description">
                <Form.Control let:attrs>
                    <Form.Label>Description</Form.Label>
                    <Input {...attrs} bind:value={$formData.description} />
                </Form.Control>
                <Form.FieldErrors />
            </Form.Field>
            <Form.Field {form} name="characterIds">
                <Form.Control let:attrs>
                    <Form.Label>Personnages</Form.Label>
                    <input
                        type="hidden"
                        name="characterIds"
                        value={JSON.stringify($formData.characterIds)}
                    />
                    <CharacterSelector
                        characters={charactersList}
                        selectedIds={$formData.characterIds}
                        on:change={handleCharacterChange}
                    />
                </Form.Control>
                <Form.Description>
                    Sélectionnez les personnages qui apparaissent dans cette
                    scène.
                </Form.Description>
                <Form.FieldErrors />
            </Form.Field>
            <Form.Button>Create</Form.Button>
        </form>
    </div>
</div>
