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

<div>
    <h1>{data.data.id}</h1>
    <p>{data.data.name}</p>
    <p>{data.data.description}</p>
</div>
