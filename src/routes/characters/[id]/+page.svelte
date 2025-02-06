<script lang="ts">
    import { onMount } from 'svelte'
    import type { PageData } from './$types'
    import { Button } from '$lib/components/ui/button'
    import { ArrowLeft } from 'lucide-svelte'

    let { data } = $props<{ data: PageData }>()

    onMount(async () => {
        console.log(data)
    })
</script>

<Button variant="ghost" size="sm" class="mb-4" onclick={() => history.back()}>
    <ArrowLeft class="w-4 h-4 mr-2" />
    Back
</Button>

<div class="space-y-6 max-w-3xl">
    <div class="border-b pb-4">
        <h1 class="text-4xl font-bold mb-2">{data.data.name}</h1>
        <p class="text-sm text-muted-foreground">
            Character ID: {data.data.id}
        </p>
    </div>

    <div class="space-y-4">
        <div>
            <h2 class="text-xl font-semibold mb-2">Description</h2>
            <p class="text-muted-foreground leading-relaxed">
                {data.data.description}
            </p>
        </div>

        {#if data.data.appearancesInScenes?.length > 0}
            <div>
                <h2 class="text-xl font-semibold mb-2">
                    Appearances in Scenes
                </h2>
                <ul class="space-y-2">
                    {#each data.data.appearancesInScenes as scene}
                        <li class="p-3 rounded-lg bg-secondary">
                            <h3 class="font-medium">{scene.name}</h3>
                            {#if scene.description}
                                <p class="text-sm text-muted-foreground mt-1">
                                    {scene.description}
                                </p>
                            {/if}
                        </li>
                    {/each}
                </ul>
            </div>
        {/if}

        {#if data.data.references?.length > 0}
            <div>
                <h2 class="text-xl font-semibold mb-2">References</h2>
                <ul class="space-y-2">
                    {#each data.data.references as reference}
                        <li class="p-3 rounded-lg bg-secondary">
                            <h3 class="font-medium">{reference.name}</h3>
                            <p class="text-sm text-muted-foreground mt-1">
                                {reference.description}
                            </p>
                            <a
                                href={reference.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                class="text-sm text-primary hover:underline mt-2 inline-block"
                            >
                                View Reference
                            </a>
                        </li>
                    {/each}
                </ul>
            </div>
        {/if}
    </div>
</div>
