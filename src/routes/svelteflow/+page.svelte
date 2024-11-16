<script lang="ts">
	import { SvelteFlowProvider } from '@xyflow/svelte';
	import Flow from '$lib/components/svelteflow/Flow.svelte';
</script>

<!-- You need the SvelteFlowProvider so you can useSvelteFlow  -->
<SvelteFlowProvider>
	<Flow />
</SvelteFlowProvider>
