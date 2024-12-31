<script lang="ts">
    import type { PageData } from './$types'
    import SettingsForm from './settings-form.svelte'
    import { characters } from '$lib/stores/characterStore'

    let { data } = $props<{ data: PageData }>()

    // Utiliser $derived pour accéder aux personnages du store de manière réactive
    let charactersList = $derived($characters.characters)
</script>

<div class="w-[400px] p-4 bg-card border border-border">
    <SettingsForm data={data.form} />

    <!-- Afficher la liste des personnages -->
    <div class="mt-4">
        <h2 class="text-lg font-semibold mb-2">Liste des personnages</h2>
        {#if charactersList.length === 0}
            <p>Aucun personnage trouvé</p>
        {:else}
            <ul class="space-y-2">
                <!-- TODO : bien affecter les scenes -->
                {#each charactersList as character}
                    <li>{character.name}</li>
                    <li class="text-sm text-muted-foreground">
                        {character.appearancesInScenes.length}
                    </li>
                {/each}
            </ul>
        {/if}
    </div>
</div>
