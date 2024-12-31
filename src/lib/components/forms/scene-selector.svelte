<script lang="ts">
    import type { Scene } from '$lib/types/Scene'
    import { Check } from 'lucide-svelte'

    export let selectedIds: number[] = []
    export let scenes: Scene[] = []

    function toggleScene(sceneId: number) {
        if (selectedIds.includes(sceneId)) {
            selectedIds = selectedIds.filter((id) => id !== sceneId)
        } else {
            selectedIds = [...selectedIds, sceneId]
        }
    }
</script>

<div class="w-full space-y-2">
    {#each scenes as scene (scene.id)}
        <button
            type="button"
            class="w-full flex items-center justify-between p-3 text-left border hover:bg-muted transition-colors"
            class:bg-muted={selectedIds.includes(scene.id)}
            on:click={() => toggleScene(scene.id)}
        >
            <div>
                <h3 class="font-medium">{scene.title}</h3>
                <p class="text-sm text-muted-foreground">{scene.description}</p>
            </div>
            {#if selectedIds.includes(scene.id)}
                <Check class="h-4 w-4 text-primary" />
            {/if}
        </button>
    {/each}
</div>
