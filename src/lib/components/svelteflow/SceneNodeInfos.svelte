<script lang="ts">
    import type { Scene } from '@/types/Scene'
    import { Label } from '$lib/components/ui/label'

    import * as Sheet from '$lib/components/ui/sheet/'
    import { onMount } from 'svelte'
    let { scene } = $props<{ scene: Scene }>()
    onMount(() => {
        console.log(scene)
    })
</script>

<Sheet.Root>
    <Sheet.Trigger class="outline-none">
        <div
            class=" group-hover:border-l group-hover:border-b bg-accent dark:bg-stone-600 w-0 h-0 group-hover:w-8 group-hover:h-8 striped-background-light transition-[width & height] duration-150 ease-in-out"
        ></div>
    </Sheet.Trigger>
    <Sheet.Content class="w-[200rem]">
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
    }
</style>
