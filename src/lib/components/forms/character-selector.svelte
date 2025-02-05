<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    import type { Character } from '$lib/types/Character'
    import { Button } from '$lib/components/ui/button'
    import { Check } from 'lucide-svelte'
    import { slide } from 'svelte/transition'
    let { characters, selectedIds = [] } = $props<{
        characters: Character[]
        selectedIds: number[]
    }>()

    const dispatch = createEventDispatcher<{ change: number[] }>()

    function toggleCharacter(id: number) {
        const newSelectedIds = selectedIds.includes(id)
            ? selectedIds.filter((selectedId: number) => selectedId !== id)
            : [...selectedIds, id]
        dispatch('change', newSelectedIds)
    }
</script>

<div class="flex flex-wrap gap-2">
    {#each characters as character}
        <Button
            variant={selectedIds.includes(character.id) ? 'default' : 'outline'}
            class="flex items-center gap-2 transition-all duration-150 ease-in-out"
            onclick={() => toggleCharacter(character.id)}
        >
            {#if selectedIds.includes(character.id)}
                <div
                    transition:slide={{ axis: 'y', duration: 150 }}
                    class="overflow-hidden"
                >
                    <Check class="h-4 w-4" />
                </div>
            {/if}
            {character.name}
        </Button>
    {/each}
</div>
