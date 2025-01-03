<script lang="ts">
    import * as Form from '$lib/components/ui/form'
    import { Input } from '$lib/components/ui/input'
    import { formSchema } from '../../routes/scenes/schema'
    import { Check } from 'lucide-svelte'
    import {
        type SuperValidated,
        type Infer,
        superForm,
    } from 'sveltekit-superforms'
    import { zodClient } from 'sveltekit-superforms/adapters'
    import { toast } from 'svelte-sonner'
    import CharacterSelector from '$lib/components/forms/character-selector.svelte'
    import type { Scene } from '$lib/types/Scene'
    import { slide } from 'svelte/transition'
    import type { Character } from '$lib/types/Character'

    let { scene, formData, onSubmit, characters } = $props<{
        scene: Scene
        formData: SuperValidated<Infer<typeof formSchema>>
        onSubmit?: (result: { result: { type: string } }) => void
        characters: Character[]
    }>()

    const form = superForm(formData, {
        validators: zodClient(formSchema),
        dataType: 'json',
        onResult: (result) => {
            if (result.result.type === 'success') {
                toast.success(
                    result.result.data?.message ||
                        'Scene updated successfully!',
                )
                onSubmit?.(result)
            }
        },
        onError: (error) => {
            toast.error('Something went wrong!')
        },
    })

    const { form: editFormData, enhance } = form

    // Initialiser le formulaire avec les données de la scène
    $editFormData.title = scene.title
    $editFormData.description = scene.description
    $editFormData.characterIds = scene.characters.map(
        (characterRelation: { character: { id: number } }) =>
            characterRelation.character.id,
    )

    function handleCharacterChange(event: CustomEvent<number[]>) {
        $editFormData.characterIds = [...event.detail]
    }
</script>

<form method="POST" action="?/update" use:enhance transition:slide>
    <input type="hidden" name="id" value={scene.id} />
    <Form.Field {form} name="title">
        <Form.Control let:attrs>
            <Form.Label>Titre</Form.Label>
            <Input {...attrs} bind:value={$editFormData.title} />
        </Form.Control>
        <Form.Description
            >Ce titre sera utilisé pour identifier votre scène.</Form.Description
        >
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="description">
        <Form.Control let:attrs>
            <Form.Label>Description</Form.Label>
            <Input {...attrs} bind:value={$editFormData.description} />
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="characterIds">
        <Form.Control let:attrs>
            <Form.Label>Personnages</Form.Label>
            <input
                type="hidden"
                name="characterIds"
                value={JSON.stringify($editFormData.characterIds)}
            />
            <CharacterSelector
                {characters}
                selectedIds={$editFormData.characterIds}
                on:change={handleCharacterChange}
            />
        </Form.Control>
        <Form.Description>
            Sélectionnez les personnages qui apparaissent dans cette scène.
        </Form.Description>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Button>Update</Form.Button>
</form>
