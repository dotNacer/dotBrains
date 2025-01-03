<script lang="ts">
    import type { Character } from '$lib/types/Character'
    import { fly } from 'svelte/transition'
    import { enhance } from '$app/forms'
    import CharacterEditForm from './character-edit-form.svelte'
    import type { SuperValidated, Infer } from 'sveltekit-superforms'
    import { formSchema } from '../../routes/characters/schema'
    import { Button } from '$lib/components/ui/button'
    import type { Scene } from '$lib/types/Scene'

    let { character, editForm, scenes } = $props<{
        character: Character
        editForm: SuperValidated<Infer<typeof formSchema>>
        scenes: Scene[]
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
        <h3 class="font-medium text-xl">{character.name}</h3>
        <p class="">{character.description}</p>
        <p class="text-sm text-muted-foreground">
            {#each character.scenes as sceneRelation}
                {sceneRelation.scene.title}
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
                <input type="hidden" name="id" value={character.id} />
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
        <CharacterEditForm
            {character}
            formData={editForm}
            onSubmit={handleEditSubmit}
            {scenes}
        />
    {/if}
</div>
