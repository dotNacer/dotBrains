<script lang="ts">
    import type { Character } from '$lib/types/Character'
    import { fly } from 'svelte/transition'

    let { character } = $props<{ character: Character }>()
    let isExpanded = $state(false)
</script>

<div
    class="border border-border p-4 w-[400px] h-[100px] bg-background"
    onclick={() => (isExpanded = !isExpanded)}
    role="presentation"
    in:fly={{ y: -100, duration: 150 }}
    out:fly={{ y: 100, duration: 150 }}
>
    <h3 class="font-medium text-xl">{character.name}</h3>
    <p class="">{character.description}</p>
    <p class="text-sm text-muted-foreground">
        {#each character.appearancesInScenes as scene}
            {scene.title}
        {/each}
    </p>
</div>
