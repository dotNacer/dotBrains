<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js'
	import { Component, Undo2, Plus, Group } from 'lucide-svelte'
	import { addNode } from '$lib/services/nodeService'
	import { useSvelteFlow } from '@xyflow/svelte'
	import { sceneCreationStore } from '$lib/stores/sceneCreationStore'
	import { get } from 'svelte/store'
	let { characters } = $props()
	const { screenToFlowPosition } = useSvelteFlow()

	function handleAddNode() {
		// Si un node de création est déjà ouvert, on le ferme
		const currentState = get(sceneCreationStore)
		if (currentState.isOpen) {
			currentState.nodeRef?.closeMenu?.()
			sceneCreationStore.set({
				isOpen: false,
				nodeId: null,
				nodeRef: null,
			})
			return
		}

		// Get the center of the viewport
		const centerPosition = screenToFlowPosition({
			x: window.innerWidth / 3,
			y: window.innerHeight / 3,
		})

		const newNodeId = addNode(
			'scene-creation',
			{
				ref: (node: any) => {
					sceneCreationStore.update((state) => ({
						...state,
						nodeRef: node,
					}))
				},
				characters,
			},
			centerPosition,
			'-1'
		)

		sceneCreationStore.set({
			isOpen: true,
			nodeId: '-1',
			nodeRef: null,
		})
	}

	function handleAddGroup() {
		// Get the center of the viewport
		const centerPosition = screenToFlowPosition({
			x: window.innerWidth / 2,
			y: window.innerHeight / 2,
		})

		// Add a group node with default settings
		const newGroupId = addNode(
			'GROUP',
			{
				group_name: 'New Group',
				width: 400,
				height: 300,
			},
			centerPosition
		)
	}
</script>

<div class="absolute bottom-0 flex w-full items-center justify-center">
	<div class="bg-card z-30 mb-4 rounded-xl border p-4">
		<Button variant="outline" class="z-30 gap-2"><Undo2 class="h-4 w-4" />Undo</Button>
		<Button variant="outline" class="gap-2" onclick={handleAddNode}
			><Plus class="h-4 w-4" />Add a node</Button
		>
		<Button variant="outline" class="gap-2" onclick={handleAddGroup}
			><Group class="h-4 w-4" />Add a group</Button
		>
		<Button variant="outline" class="gap-2 hover:bg-(--base)"
			><Component class="h-4 w-4" />Placeholder</Button
		>
	</div>
</div>
