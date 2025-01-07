<script lang="ts">
    import type { Scene } from '$lib/types/Scene'
    import { fly } from 'svelte/transition'
    import { enhance } from '$app/forms'
    import SceneEditForm from './scene-edit-form.svelte'
    import type { SuperValidated, Infer } from 'sveltekit-superforms'
    import { formSchema } from '$lib/schemas/scenes'
    import { Button } from '$lib/components/ui/button'
    import type { Character } from '$lib/types/Character'

    let { scene, editForm, characters } = $props<{
        scene: Scene
        editForm: SuperValidated<Infer<typeof formSchema>>
        characters: Character[]
    }>()
    let isExpanded = $state(false)
    let isEditing = $state(false)

    function handleEditSubmit({ result }: { result: { type: string } }) {
        if (result.type === 'success') {
            isEditing = false
        }
    }
</script>

<div
    class="border border-border p-4 w-[400px] bg-background relative group"
    class:h-[100px]={!isEditing}
    onclick={() => !isEditing && (isExpanded = !isExpanded)}
    role="presentation"
    in:fly={{ y: -100, duration: 150 }}
    out:fly={{ y: 100, duration: 150 }}
>
    {#if !isEditing}
        <h3 class="font-medium text-xl">{scene.title}</h3>
        <p class="">{scene.description}</p>
        <p class="text-sm text-muted-foreground">
            {#each scene.characters as characterRelation}
                {characterRelation.character.name}
            {/each}
        </p>

        <div
            class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2"
        >
            <Button
                variant="outline"
                onclick={(e) => {
                    e.stopPropagation()
                    isEditing = true
                }}
            >
                Edit
            </Button>

            <form
                method="POST"
                action="?/delete"
                use:enhance
                onclick={(e) => e.stopPropagation()}
                role="presentation"
            >
                <input type="hidden" name="id" value={scene.id} />
                <Button variant="destructive" type="submit">Delete</Button>
            </form>
        </div>
    {:else}
        <Button
            onclick={() => (isEditing = false)}
            variant="link"
            class="absolute top-2 right-2"
        >
            Cancel
        </Button>
        <SceneEditForm
            {scene}
            formData={editForm}
            onSubmit={handleEditSubmit}
            {characters}
        />
    {/if}
</div>
