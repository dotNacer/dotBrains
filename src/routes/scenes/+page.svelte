<script lang="ts">
    import type { PageData } from './$types'
    import SceneCard from '$lib/components/scene-card.svelte'
    import SceneCreateForm from '$lib/components/forms/scene-create-form.svelte'

    let { data } = $props<{ data: PageData }>()

    let scenesList = $derived(data.scenes)
    let charactersList = $derived(data.characters)
</script>

<div class="space-y-2">
    <h1 class="font-semibold text-3xl">Scenes</h1>
    <div class="gap-4 w-full flex flex-wrap">
        {#if scenesList.length === 0}
            <p>Aucune scène trouvée</p>
        {:else}
            {#each scenesList as scene}
                <SceneCard
                    {scene}
                    editForm={data.editForm}
                    characters={charactersList}
                />
            {/each}
        {/if}
    </div>

    <div class="w-[400px] p-4 bg-card border border-border">
        <SceneCreateForm data={{ ...data.form, characters: charactersList }} />
    </div>
</div>
