<script lang="ts">
    import '../app.css'
    import { Toaster } from '$lib/components/ui/sonner/index.js'
    import { ModeToggle } from '$lib/components/ui/mode-toggle'
    import { theme } from '$lib/stores/theme'
    import { onMount } from 'svelte'

    let { children } = $props()

    onMount(() => {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        $theme = isDark ? 'dark' : 'light'
    })

    $effect(() => {
        if ($theme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    })
</script>

<div class="min-h-screen bg-background text-foreground">
    <div class="fixed top-4 right-4 z-50">
        <ModeToggle />
    </div>
    <Toaster />
    {@render children()}
</div>
