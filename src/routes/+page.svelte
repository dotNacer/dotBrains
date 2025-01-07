<script lang="ts">
    import { Button } from '$lib/components/ui/button/index.js'
    import { Save } from 'lucide-svelte'
    import { Tipex, type TipexEditor } from '@friendofsvelte/tipex'

    import '@friendofsvelte/tipex/styles/Tipex.css'
    import '@friendofsvelte/tipex/styles/ProseMirror.css'
    import '@friendofsvelte/tipex/styles/Controls.css'
    import '@friendofsvelte/tipex/styles/EditLink.css'
    import '@friendofsvelte/tipex/styles/CodeBlock.css'

    let body = $state(`<p>The initial html content.</p>`)
    let debounceTimer: ReturnType<typeof setTimeout>

    import { TextAlign } from '@tiptap/extension-text-align'
    import { Mention } from '@tiptap/extension-mention'
    const extensions = [
        TextAlign.configure({
            types: ['heading', 'paragraph'],
        }),
    ]

    function handleChange(text: string) {
        body = text
        clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => {
            console.log('Pour cursor : ça doit save ici', text)
        }, 750)
    }
</script>

<Tipex
    {body}
    onupdate={(e) => handleChange(e.editor.getHTML())}
    controls
    {extensions}
    floating
    style="margin-top: 1rem; margin-bottom: 0;"
    class="h-[70vh] border max-w-[920px] border-neutral-200"
/>
