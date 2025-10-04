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
		{ href: '/scenes2', icon: BookMarked, label: 'Scenes2' },
	]

	onMount(() => {
		const storedTheme = localStorage.getItem('theme') as 'dark' | 'light'
		if (storedTheme) {
			$theme = storedTheme
		} else {
			const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
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
	class="relative flex h-screen flex-col border-r border-border p-4 transition-all duration-150"
>
	<div
		class="title flex items-center gap-2 border-b {isExpanded
			? 'gap-2 p-2'
			: 'justify-center gap-0 pb-2'}"
	>
		<Logo class="h-6 w-6" />

		{#if isExpanded}
			<h1
				class="font-title text-3xl font-extrabold"
				transition:slide={{ duration: 150, axis: 'x' }}
			>
				dotBrains
			</h1>
		{/if}
		{#if isExpanded}
			<button
				class="rounded-lg p-2 hover:bg-muted-foreground/20"
				onclick={() => (isExpanded = !isExpanded)}
			>
				<PanelRightOpen class="h-5 w-5" />
			</button>
		{/if}
	</div>
	<!-- Liens de navigation -->
	<div class="flex-1 space-y-2">
		{#each navigationLinks as { href, icon: Icon, label }}
			<a
				{href}
				class="flex items-center p-2 hover:opacity-80 {currentPath === href.split('/')[1]
					? 'bg-primary text-primary-foreground'
					: ''}
                        {isExpanded ? 'w-full' : 'h-8 w-8'}"
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
		class="absolute bottom-0 right-0 top-0 w-1 cursor-col-resize transition-colors hover:bg-primary/50"
		onmousedown={handleMouseDown}
		role="button"
		tabindex="0"
	></div>
</nav>
