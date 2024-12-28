<script lang="ts">
    import '../app.css'
    import { Toaster } from '$lib/components/ui/sonner/index.js'
    import { ModeToggle } from '$lib/components/ui/mode-toggle'
    import { theme } from '$lib/stores/theme'
    import { onMount } from 'svelte'
    import {
        Notebook,
        ChevronLeft,
        ChevronRight,
        Workflow,
    } from 'lucide-svelte'

    let { children } = $props()
    let isExpanded = $state(true)

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

<div class="min-h-screen bg-background text-foreground flex">
    <!-- Sidebar -->
    <nav
        class={`h-screen bg-muted p-4 transition-all duration-300 border-r border-border ${
            isExpanded ? 'w-64' : 'w-16'
        } flex flex-col`}
    >
        <button
            class="mb-8 p-2 hover:bg-muted-foreground/20 rounded-lg"
            onclick={() => (isExpanded = !isExpanded)}
        >
            {#if isExpanded}
                <ChevronLeft class="h-5 w-5" />
            {:else}
                <ChevronRight class="h-5 w-5" />
            {/if}
        </button>

        <!-- Liens de navigation -->
        <div class="space-y-2">
            <a
                href="/"
                class="flex items-center p-2 hover:bg-muted-foreground/20 rounded-lg"
            >
                <Notebook class="h-5 w-5" />
                {#if isExpanded}
                    <span class="ml-2">Note Taking</span>
                {/if}
            </a>
            <a
                href="/svelteflow"
                class="flex items-center p-2 hover:bg-muted-foreground/20 rounded-lg"
            >
                <Workflow class="h-5 w-5" />
                {#if isExpanded}
                    <span class="ml-2">Flow</span>
                {/if}
            </a>
            <!-- Ajoutez d'autres liens selon vos besoins -->
        </div>
    </nav>

    <!-- Contenu principal -->
    <div class="flex-1">
        <div class="fixed top-4 right-4 z-50">
            <ModeToggle />
        </div>
        <Toaster />
        {@render children()}
    </div>
</div>
