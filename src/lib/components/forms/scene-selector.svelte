<script lang="ts">
	import type { Scene } from '@prisma/client'
	import { Check } from 'lucide-svelte'
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher<{
		change: number[]
	}>()

	let { selectedIds = $bindable([]), scenes = [] } = $props<{
		selectedIds: number[]
		scenes: Scene[]
	}>()

	function toggleScene(sceneId: number) {
		if (selectedIds.includes(sceneId)) {
			selectedIds = selectedIds.filter((id: number) => id !== sceneId)
		} else {
			selectedIds = [...selectedIds, sceneId]
		}
		dispatch('change', selectedIds)
	}
</script>

<div class="w-full space-y-2">
	{#each scenes as scene (scene.id)}
		<button
			type="button"
			class="hover:bg-muted flex w-full items-center justify-between border p-3 text-left transition-colors"
			class:bg-muted={selectedIds.includes(scene.id)}
			onclick={() => toggleScene(scene.id)}
		>
			<div>
				<h3 class="font-medium">{scene.title}</h3>
				<p class="text-muted-foreground text-sm">{scene.description}</p>
			</div>
			{#if selectedIds.includes(scene.id)}
				<Check class="text-primary h-4 w-4" />
			{/if}
		</button>
	{/each}
</div>
