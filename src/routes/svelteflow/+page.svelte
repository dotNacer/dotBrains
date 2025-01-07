<script lang="ts">
    import { SvelteFlowProvider } from '@xyflow/svelte'
    import Flow from '$lib/components/svelteflow/Flow.svelte'
    import type { PageData } from './$types'

    let { data } = $props<{ data: PageData }>()
</script>

<!-- You need the SvelteFlowProvider so you can useSvelteFlow  -->
<SvelteFlowProvider>
    <Flow characters={data.characters} />
</SvelteFlowProvider>
