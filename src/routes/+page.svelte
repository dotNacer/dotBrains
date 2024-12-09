<script lang="ts">
    import { Button } from '$lib/components/ui/button/index.js'
    import { Copy } from 'lucide-svelte'
    import { toast } from 'svelte-sonner'
    import { notes } from '$lib/stores/noteStore'
    import { Trash } from 'lucide-svelte'

    function addNote() {
        notes.addNote({
            title: 'Untitled Note',
            content: {},
        })
        toast.success('Note added')
    }

    function deleteNote(id: number) {
        notes.deleteNote(id)
        toast('Note deleted', { icon: Trash })
    }
</script>

<button onclick={addNote}>Add Note</button>
<div class="flex flex-col gap-4 w-1/4 border-slate-200 rounded-lg p-4 border">
    {#each $notes as note}
        <div class="flex justify-between items-center">
            <p>{note.title} | {note.id}</p>
            <button onclick={() => deleteNote(note.id)}>Delete</button>
        </div>
    {/each}
</div>
<div class="hidden">
    <h1>Hello World</h1>
    <p>
        Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read
        the documentation
    </p>

    <div class="flex flex-col gap-4">
        <div class="w-1/4">
            <div
                id="code"
                class="flex justify-between space-x-2 rounded-lg border bg-muted p-4 text-sm"
            >
                <div class="flex items-center gap-2">
                    <p class="select-none">$</p>
                    <p class="font-mono">npm install 3rd-brain</p>
                </div>
                <Button
                    size="icon"
                    variant="outline"
                    onclick={() => {
                        navigator.clipboard.writeText('npm install 3rd-brain')
                        toast('Copied to clipboard')
                    }}
                >
                    <Copy />
                </Button>
            </div>
        </div>
    </div>
</div>
