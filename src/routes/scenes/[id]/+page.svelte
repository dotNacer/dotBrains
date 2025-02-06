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
        <h1 class="text-4xl font-bold mb-2">{data.data.title}</h1>
        <p class="text-sm text-muted-foreground">Scene ID: {data.data.id}</p>
    </div>

    <div class="space-y-4">
        <div>
            <h2 class="text-xl font-semibold mb-2">Description</h2>
            <p
                class="text-muted-foreground leading-relaxed whitespace-pre-wrap"
            >
                {data.data.description}
            </p>
        </div>

        {#if data.data.characters?.length > 0}
            <div>
                <h2 class="text-xl font-semibold mb-2">
                    Characters in this Scene
                </h2>
                <div class="grid gap-3 sm:grid-cols-2">
                    {#each data.data.characters as { character }}
                        <a
                            href="/characters/{character.id}"
                            class="p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                        >
                            <h3 class="font-medium">{character.name}</h3>
                            {#if character.description}
                                <p
                                    class="text-sm text-muted-foreground mt-1 line-clamp-2"
                                >
                                    {character.description}
                                </p>
                            {/if}
                        </a>
                    {/each}
                </div>
            </div>
        {/if}
    </div>
</div>
