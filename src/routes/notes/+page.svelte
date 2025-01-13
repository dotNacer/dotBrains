<script lang="ts">
    import type { PageData } from './$types'
    import { Button } from '$lib/components/ui/button'
    import { PlusIcon, X } from 'lucide-svelte'
    import NoteComponent from './note-component.svelte'
    import { slide, fade } from 'svelte/transition'
    import { cubicOut } from 'svelte/easing'
    import NoteForm from './note-form.svelte'

    let { data } = $props<{ data: PageData }>()

    let scenesList = $derived(data.scenes)
    let charactersList = $derived(data.characters)
    let notesList = $derived(data.notes)
    let isCreating = $state(false)

    function closeCreation() {
        isCreating = false
    }
</script>

<div class="space-y-2">
    <div class="flex justify-between">
        <h1 class="font-semibold text-3xl">Notes</h1>
        <Button onclick={() => (isCreating = true)}>
            <PlusIcon class="w-4 h-4 mr-2" />
            Ajouter une note
        </Button>
    </div>

    {#if notesList.length === 0 && !isCreating}
        <p>Aucune note trouvée</p>
    {/if}
    <div class="flex flex-wrap gap-2">
        {#each notesList as note (note.id)}
            <NoteComponent {note} />
        {/each}
    </div>
</div>

{#if isCreating}
    <div
        class="fixed inset-0 bg-background/60 backdrop-blur-[2px] z-50 flex items-center justify-center"
        onclick={(e) => e.target === e.currentTarget && closeCreation()}
        transition:fade={{ duration: 150 }}
        role="presentation"
    >
        <div
            class="bg-background border rounded-lg p-6 w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto relative"
        >
            <Button
                variant="ghost"
                class="absolute right-4 top-4"
                onclick={closeCreation}
            >
                <X class="h-4 w-4" />
            </Button>
            <NoteForm onClose={closeCreation} note={null} />
        </div>
    </div>
{/if}
