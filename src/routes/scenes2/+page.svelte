<script lang="ts">
	import { scenesStore } from '$lib/stores/scenesStore'
	import { onMount } from 'svelte'
	import { Button } from '$lib/components/ui/button'
	import type { Scene } from '$lib/types/Scene'
	import { goto } from '$app/navigation'
	onMount(async () => {
		await scenesStore.fetch()
	})

	function createScene() {
		scenesStore.create({
			name: 'Scène 1',
			description: 'Description de la scène 1',
		})
	}

	function editScene(scene: Scene) {
		// Prompt for new values (replace with modal/form in production)
		const newName = prompt('Enter new name for the scene:', scene.name) || scene.name
		const newDescription =
			prompt('Enter new description:', scene.description || '') || scene.description

		// Only update if values have changed
		if (newName !== scene.name || newDescription !== scene.description) {
			scenesStore.edit(
				{
					name: newName,
					description: newDescription,
				},
				scene.id
			)
		}
	}
</script>

<p>Créer les scènes</p>

<Button onclick={createScene}>Créer une scène</Button>
{#each $scenesStore as scene}
	<div
		class="flex gap-2"
		onclick={() => goto(`/scenes2/${scene.id}`)}
		role="button"
		tabindex="0"
		onkeydown={(e) => e.key === 'Enter' && goto(`/scenes2/${scene.id}`)}
	>
		<p>{scene.name}</p>
		<p>{scene.id}</p>
	</div>
	<button onclick={() => editScene(scene)}>Modifier</button>
	<button onclick={() => scenesStore.delete(scene.id)}>Supprimer</button>
{/each}
