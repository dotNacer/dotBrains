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
        BookMarked,
        Users,
    } from 'lucide-svelte'
    import { page } from '$app/stores'
    import { fly, slide } from 'svelte/transition'

    let { children } = $props()
    let isExpanded = $state(true)

    const navigationLinks = [
        { href: '/', icon: Notebook, label: 'Note Taking' },
        { href: '/svelteflow', icon: Workflow, label: 'Flow' },
        { href: '/characters', icon: Users, label: 'Characters' },
        { href: '/scenes', icon: BookMarked, label: 'Scenes' },
        { href: '/notes', icon: Notebook, label: 'Notes' },
    ]

    onMount(() => {
        const storedTheme = localStorage.getItem('theme') as 'dark' | 'light'
        if (storedTheme) {
            $theme = storedTheme
        } else {
            const isDark = window.matchMedia(
                '(prefers-color-scheme: dark)',
            ).matches
            $theme = isDark ? 'dark' : 'light'
        }
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
        class={`h-screen p-4 transition-all duration-150 border-r border-border ${
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
        <div class="space-y-2 flex-1">
            {#each navigationLinks as { href, icon: Icon, label }}
                <a
                    {href}
                    class="flex items-center p-2 hover:opacity-80 {$page.url
                        .pathname === href
                        ? 'bg-primary text-primary-foreground'
                        : ''}
                        {isExpanded ? 'w-full' : 'w-8 h-8'}"
                >
                    <Icon class="h-5 w-5" />
                    {#if isExpanded}
                        <span class="ml-2" in:fly={{ y: -50, duration: 150 }}>
                            {label}
                        </span>
                    {/if}
                </a>
            {/each}
        </div>

        <div class="flex justify-end">
            <ModeToggle />
        </div>
    </nav>

    <!-- Contenu principal -->
    <div class={`flex-1 ${$page.url.pathname === '/svelteflow' ? '' : 'p-4'}`}>
        <Toaster />
        {@render children()}
    </div>
</div>
