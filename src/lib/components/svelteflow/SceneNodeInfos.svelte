<script lang="ts">
	import type { Scene } from '@prisma/client'
	import { Label } from '$lib/components/ui/label'

	import * as Sheet from '$lib/components/ui/sheet/'
	let { scene } = $props<{ scene: Scene }>()
</script>

<Sheet.Root>
	<Sheet.Trigger class="outline-none">
		<div
			class=" bg-accent striped-background-light transition-[width & height] h-0 w-0 duration-150 ease-in-out group-hover:h-8 group-hover:w-8 group-hover:border-b group-hover:border-l dark:bg-stone-600"
		></div>
	</Sheet.Trigger>
	<Sheet.Content class="w-800">
		<Sheet.Title>{scene.title}</Sheet.Title>
		<Label>Description</Label>
		<p>{scene.description}</p>
	</Sheet.Content>
</Sheet.Root>

<style>
	.striped-background-light {
		background-image: repeating-linear-gradient(
			45deg,
			transparent,
			transparent 10px,
			rgba(0, 0, 0, 0.05) 10px,
			rgba(0, 0, 0, 0.05) 20px
		);
		animation: stripe-slide 1s linear infinite;
	}

	@keyframes stripe-slide {
		from {
			background-position: 0 0;
		}
		to {
			background-position: -32px 0;
		}
	}
</style>
