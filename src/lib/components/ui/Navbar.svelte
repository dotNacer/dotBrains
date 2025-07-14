<script lang="ts">
    import { ModeToggle } from '$lib/components/ui/mode-toggle'
    import { theme } from '$lib/stores/theme'
    import Logo from '$lib/components/ui/Logo.svelte'
    import { onMount } from 'svelte'
    import { Workflow, BookMarked, Users, PanelRightOpen } from 'lucide-svelte'
    import { page } from '$app/stores'
    import { fly, slide } from 'svelte/transition'
    let isExpanded = $state(true)
    let navWidth = $derived(isExpanded ? 256 : 64)
    let isDragging = $state(false)

    const navigationLinks = [
        { href: '/svelteflow', icon: Workflow, label: 'Flow' },
        { href: '/characters', icon: Users, label: 'Characters' },
        { href: '/scenes', icon: BookMarked, label: 'Scenes' },
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
    let currentPath = $derived($page.url.pathname.split('/')[1])

    function handleMouseDown(event: MouseEvent) {
        isDragging = true
        const startX = event.clientX
        const initialExpanded = isExpanded

        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                const diff = e.clientX - startX
                if (initialExpanded) {
                    // Si on était étendu, on réduit si on tire vers la gauche
                    if (diff < -50) isExpanded = false
                } else {
                    // Si on était réduit, on étend si on tire vers la droite
                    if (diff > 50) isExpanded = true
                }
            }
        }

        const handleMouseUp = () => {
            isDragging = false
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseup', handleMouseUp)
    }
</script>

<nav
    style="width: {navWidth}px"
    class="h-screen p-4 transition-all duration-150 border-r border-border flex flex-col relative"
>
    <div
        class="title border-b flex items-center gap-2 {isExpanded
            ? 'gap-2 p-2'
            : 'gap-0 justify-center pb-2'}"
    >
        <Logo class="w-6 h-6" />

        {#if isExpanded}
            <h1
                class="text-3xl font-extrabold font-title"
                transition:slide={{ duration: 150, axis: 'x' }}
            >
                dotBrains
            </h1>
        {/if}
        {#if isExpanded}
            <button
                class="p-2 hover:bg-muted-foreground/20 rounded-lg"
                onclick={() => (isExpanded = !isExpanded)}
            >
                <PanelRightOpen class="h-5 w-5" />
            </button>
        {/if}
    </div>
    <!-- Liens de navigation -->
    <div class="space-y-2 flex-1">
        {#each navigationLinks as { href, icon: Icon, label }}
            <a
                {href}
                class="flex items-center p-2 hover:opacity-80 {currentPath ===
                href.split('/')[1]
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

    <div
        class="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/50 transition-colors"
        onmousedown={handleMouseDown}
        role="button"
        tabindex="0"
    ></div>
</nav>
