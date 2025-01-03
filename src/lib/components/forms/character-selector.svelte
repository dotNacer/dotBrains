<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    import type { Character } from '$lib/types/Character'
    import { Button } from '$lib/components/ui/button'
    import { Check } from 'lucide-svelte'

    let { characters, selectedIds = [] } = $props<{
        characters: Character[]
        selectedIds: number[]
    }>()

    const dispatch = createEventDispatcher<{ change: number[] }>()

    function toggleCharacter(id: number) {
        const newSelectedIds = selectedIds.includes(id)
            ? selectedIds.filter((selectedId) => selectedId !== id)
            : [...selectedIds, id]
        dispatch('change', newSelectedIds)
    }
</script>

<div class="flex flex-wrap gap-2">
    {#each characters as character}
        <Button
            variant={selectedIds.includes(character.id) ? 'default' : 'outline'}
            class="flex items-center gap-2"
            onclick={() => toggleCharacter(character.id)}
        >
            {#if selectedIds.includes(character.id)}
                <Check class="h-4 w-4" />
            {/if}
            {character.name}
        </Button>
    {/each}
</div>
