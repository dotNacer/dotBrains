<script lang="ts">
    import * as Form from '$lib/components/ui/form'
    import { Input } from '$lib/components/ui/input'
    import { formSchema, type FormSchema } from './schema'
    import { Check } from 'lucide-svelte'
    import {
        type SuperValidated,
        type Infer,
        superForm,
    } from 'sveltekit-superforms'
    import { zodClient } from 'sveltekit-superforms/adapters'
    import { toast } from 'svelte-sonner'
    import { scenes } from '$lib/stores/sceneStore'
    import { characters } from '$lib/stores/characterStore'
    import SceneSelector from '$lib/components/forms/scene-selector.svelte'

    let { data } = $props<{ data: SuperValidated<Infer<FormSchema>> }>()

    const form = superForm(data, {
        validators: zodClient(formSchema),
        dataType: 'json',
        onResult: ({ result }) => {
            if (result.type === 'success') {
                if (result.data?.character) {
                    characters.addCharacter(result.data.character)
                    toast.success(result.data?.message)
                }
            }
        },
        onError: (error) => {
            toast.error('Something went wrong!')
        },
    })

    const { form: formData, enhance } = form

    function handleSceneChange(event: CustomEvent<number[]>) {
        $formData.sceneIds = [...event.detail]
    }
</script>

<form method="POST" action="?/create" use:enhance>
    <Form.Field {form} name="name">
        <Form.Control let:attrs>
            <Form.Label>Nom</Form.Label>
            <Input {...attrs} bind:value={$formData.name} />
        </Form.Control>
        <Form.Description
            >Ce nom sera utilisé pour identifier votre personnage.</Form.Description
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
    <Form.Field {form} name="sceneIds">
        <Form.Control let:attrs>
            <Form.Label>Scènes</Form.Label>
            <input
                type="hidden"
                name="sceneIds"
                value={JSON.stringify($formData.sceneIds)}
            />
            <SceneSelector
                scenes={$scenes.scenes}
                selectedIds={$formData.sceneIds}
                on:change={handleSceneChange}
            />
        </Form.Control>
        <Form.Description>
            Sélectionnez les scènes où ce personnage apparaît.
        </Form.Description>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Button>Submit</Form.Button>
</form>
