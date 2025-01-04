<script lang="ts">
    import type { PageData } from './$types'
    import { Button } from '$lib/components/ui/button'
    import { PlusIcon } from 'lucide-svelte'
    import NoteComponent from './note-component.svelte'
    import { slide } from 'svelte/transition'
    import { cubicOut } from 'svelte/easing'

    let { data } = $props<{ data: PageData }>()

    let scenesList = $derived(data.scenes)
    let charactersList = $derived(data.characters)
    let notesList = $derived(data.notes)

    $effect(() => {
        console.log(notesList)
    })
</script>

<div class="space-y-2">
    <div class="flex justify-between">
        <h1 class="font-semibold text-3xl">Notes</h1>
        <Button onclick={() => console.log('clicked')}>
            <PlusIcon class="w-4 h-4" />
            Ajouter une note
        </Button>
    </div>

    {#if notesList.length === 0}
        <p>Aucune note trouvée</p>
    {/if}
    <div class="flex flex-wrap gap-2">
        {#each notesList as note (note.id)}
            <NoteComponent {note} />
        {/each}
    </div>
</div>
