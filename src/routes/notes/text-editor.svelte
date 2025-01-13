<script lang="ts">
    import { Tipex, type TipexEditor } from '@friendofsvelte/tipex'
    import type { Note } from '$lib/types/Note'

    import '@friendofsvelte/tipex/styles/Tipex.css'
    import '@friendofsvelte/tipex/styles/ProseMirror.css'
    import '@friendofsvelte/tipex/styles/Controls.css'
    import '@friendofsvelte/tipex/styles/EditLink.css'
    import '@friendofsvelte/tipex/styles/CodeBlock.css'

    import { TextAlign } from '@tiptap/extension-text-align'

    let { note } = $props<{ note: Note }>()
    let body = $state(note.content)
    let debounceTimer: ReturnType<typeof setTimeout>
    let saving = $state(false)

    const extensions = [
        TextAlign.configure({
            types: ['heading', 'paragraph'],
        }),
    ]

    async function saveContent(content: string) {
        if (note.id === -1) {
            // Pour une nouvelle note, on met à jour le champ caché du formulaire
            const contentInput = document.querySelector(
                'input[name="content"]',
            ) as HTMLInputElement
            if (contentInput) {
                contentInput.value = content
            }
            return
        }

        try {
            saving = true
            const formData = new FormData()
            formData.append('id', note.id.toString())
            formData.append('content', content)

            const response = await fetch('?/updateContent', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                throw new Error('Failed to save note')
            }
        } catch (error) {
            console.error('Error saving note:', error)
        } finally {
            saving = false
        }
    }

    function handleChange(text: string) {
        body = text
        clearTimeout(debounceTimer)
        debounceTimer = setTimeout(async () => {
            await saveContent(text)
        }, 750)
    }

    // Cleanup du timer quand le composant est détruit
    $effect.root(() => {
        return () => {
            clearTimeout(debounceTimer)
        }
    })
</script>

<div class="relative">
    <Tipex
        {body}
        onupdate={(e) => handleChange(e.editor.getHTML())}
        controls
        {extensions}
        floating
        style="margin-top: 1rem; margin-bottom: 0;"
        class="h-[70vh] border max-w-[920px] border-neutral-200"
    />

    {#if saving}
        <div class="absolute bottom-2 right-2 text-sm text-muted-foreground">
            Saving...
        </div>
    {/if}
</div>
