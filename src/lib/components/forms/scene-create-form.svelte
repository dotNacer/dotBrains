<script lang="ts">
    import * as Form from '$lib/components/ui/form'
    import { Input } from '$lib/components/ui/input'
    import { formSchema, type FormSchema } from '$lib/schemas/scenes'
    import { superForm } from 'sveltekit-superforms'
    import { zodClient } from 'sveltekit-superforms/adapters'
    import { toast } from 'svelte-sonner'
    import CharacterSelector from '$lib/components/forms/character-selector.svelte'
    import type { Character } from '$lib/types/Character'
    import type { SuperValidated, Infer } from 'sveltekit-superforms'
    import { sceneService } from '$lib/services/sceneService'

    let { data, onSubmit } = $props<{
        data: SuperValidated<Infer<FormSchema>> & { characters: Character[] }
        onSubmit?: (result: { result: { type: string; data?: any } }) => void
    }>()

    const form = superForm(data, {
        validators: zodClient(formSchema),
        dataType: 'json',
        onResult: ({ result }) => {
            if (result.type === 'success') {
                toast.success(
                    result.data?.message || 'Scene created successfully!',
                )
                onSubmit?.({
                    result: {
                        type: 'success',
                        data: result.data?.scene ?? null,
                    },
                })
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

<form method="POST" action="?/createScene" use:enhance>
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
                characters={data.characters}
                selectedIds={$formData.characterIds}
                on:change={handleCharacterChange}
            />
        </Form.Control>
        <Form.Description>
            Sélectionnez les personnages qui apparaissent dans cette scène.
        </Form.Description>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Button>Create</Form.Button>
</form>
