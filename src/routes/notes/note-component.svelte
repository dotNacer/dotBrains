<script lang="ts">
    import type { Note } from '$lib/types/Note'
    import { Badge } from '$lib/components/ui/badge'
    import { Button } from '$lib/components/ui/button'
    import { X } from 'lucide-svelte'
    import { crossfade, fade } from 'svelte/transition'
    import { cubicOut } from 'svelte/easing'
    import NoteForm from './note-form.svelte'

    let { note: initialNote } = $props<{ note: Note }>()
    let note = $state<Note>(initialNote)
    let isOpen = $state(false)
    let cardElement = $state<HTMLElement | null>(null)
    let cardHeight = $state(0)

    const [send, receive] = crossfade({
        duration: 250,
        easing: cubicOut,
        fallback(node) {
            const style = getComputedStyle(node)
            const transform = style.transform === 'none' ? '' : style.transform
            return {
                duration: 250,
                easing: cubicOut,
                css: (t) => `
                    transform: ${transform} scale(${t});
                    opacity: ${t};
                `,
            }
        },
    })

    async function reloadNote() {
        try {
            const response = await fetch(`/notes/${note.id}`)
            if (response.ok) {
                const updatedNote = await response.json()
                note = updatedNote
            }
        } catch (error) {
            console.error('Error reloading note:', error)
        }
    }

    function toggleModal() {
        if (!isOpen && cardElement) {
            cardHeight = cardElement.offsetHeight
        }
        isOpen = !isOpen
    }

    async function handleClose() {
        isOpen = false
        await reloadNote()
    }

    function handleBackdropClick(event: MouseEvent) {
        if (event.target === event.currentTarget) {
            handleClose()
        }
    }
</script>

<div
    class="relative w-full md:w-auto"
    style:height={isOpen ? cardHeight + 'px' : 'auto'}
>
    {#if !isOpen}
        <div
            bind:this={cardElement}
            class="flex bg-background flex-col gap-2 border p-4 rounded-md md:w-[350px] w-full cursor-pointer hover:border-primary transition-colors h-32"
            onclick={toggleModal}
            in:receive={{ key: note.id }}
            out:send={{ key: note.id }}
            role="presentation"
        >
            <h2 class="font-semibold text-xl">{note.title}</h2>
            <p class="text-sm text-muted-foreground line-clamp-3">
                {note.content}
            </p>
            <div class="flex gap-2">
                {#each note.tags as tag}
                    <Badge>{tag}</Badge>
                {/each}
            </div>
        </div>
    {/if}
</div>

{#if isOpen}
    <div
        class="fixed inset-0 bg-background/60 backdrop-blur-[2px] z-50 flex items-center justify-center"
        onclick={handleBackdropClick}
        transition:fade={{ duration: 150 }}
        role="presentation"
    >
        <div
            class="bg-background border rounded-lg p-6 w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto relative"
            in:receive={{ key: note.id }}
            out:send={{ key: note.id }}
        >
            <Button
                variant="ghost"
                class="absolute right-4 top-4"
                onclick={handleClose}
            >
                <X class="h-4 w-4" />
            </Button>
            <NoteForm {note} onClose={handleClose} />
        </div>
    </div>
{/if}
