<script lang="ts">
    import type { PageData } from './$types'
    import SettingsForm from './character-create-form.svelte'
    import CharacterCard from '$lib/components/character-card.svelte'

    let { data } = $props<{ data: PageData }>()

    let charactersList = $derived(data.characters)
</script>

<div class="space-y-2">
    <h1 class="font-semibold text-3xl">Characters</h1>
    <div class="gap-4 w-full flex flex-wrap">
        {#if charactersList.length === 0}
            <p>Aucun personnage trouvé</p>
        {:else}
            {#each charactersList as character}
                <CharacterCard
                    {character}
                    editForm={data.editForm}
                    scenes={data.scenes}
                />
            {/each}
        {/if}
    </div>

    <div class="w-[400px] p-4 bg-card border border-border">
        <SettingsForm {data} />
    </div>
</div>
