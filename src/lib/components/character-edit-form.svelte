<script lang="ts">
    import * as Form from '$lib/components/ui/form'
    import { Input } from '$lib/components/ui/input'
    import { formSchema } from '../../routes/characters/schema'
    import { Check } from 'lucide-svelte'
    import {
        type SuperValidated,
        type Infer,
        superForm,
    } from 'sveltekit-superforms'
    import { zodClient } from 'sveltekit-superforms/adapters'
    import { toast } from 'svelte-sonner'
    import { scenes } from '$lib/stores/sceneStore'
    import SceneSelector from '$lib/components/forms/scene-selector.svelte'
    import type { Character } from '$lib/types/Character'

    let { character, formData, onSubmit } = $props<{
        character: Character
        formData: SuperValidated<Infer<typeof formSchema>>
        onSubmit?: (result: { result: { type: string } }) => void
    }>()

    const form = superForm(formData, {
        validators: zodClient(formSchema),
        dataType: 'json',
        onResult: (result) => {
            if (result.result.type === 'success') {
                toast.success(
                    result.result.data?.message ||
                        'Character updated successfully!',
                )
                onSubmit?.(result)
            }
        },
        onError: (error) => {
            toast.error('Something went wrong!')
        },
    })

    const { form: editFormData, enhance } = form

    // Initialiser le formulaire avec les données du personnage
    $editFormData.name = character.name
    $editFormData.description = character.description
    $editFormData.sceneIds = character.scenes.map(
        (sceneRelation: { scene: { id: number } }) => sceneRelation.scene.id,
    )

    function handleSceneChange(event: CustomEvent<number[]>) {
        $editFormData.sceneIds = [...event.detail]
    }
</script>

<form method="POST" action="?/update" use:enhance>
    <input type="hidden" name="id" value={character.id} />
    <Form.Field {form} name="name">
        <Form.Control let:attrs>
            <Form.Label>Nom</Form.Label>
            <Input {...attrs} bind:value={$editFormData.name} />
        </Form.Control>
        <Form.Description
            >Ce nom sera utilisé pour identifier votre personnage.</Form.Description
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
    <Form.Field {form} name="sceneIds">
        <Form.Control let:attrs>
            <Form.Label>Scènes</Form.Label>
            <input
                type="hidden"
                name="sceneIds"
                value={JSON.stringify($editFormData.sceneIds)}
            />
            <SceneSelector
                scenes={$scenes.scenes}
                selectedIds={$editFormData.sceneIds}
                on:change={handleSceneChange}
            />
        </Form.Control>
        <Form.Description>
            Sélectionnez les scènes où ce personnage apparaît.
        </Form.Description>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Button>Update</Form.Button>
</form>
