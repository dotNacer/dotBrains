<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Copy } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
</script>

<h1>Hello World</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<div class="flex flex-col gap-4">
	<div class="w-1/4">
		<div id="code" class="flex justify-between space-x-2 rounded-lg border bg-muted p-4 text-sm">
			<div class="flex items-center gap-2">
				<p class="select-none">$</p>
				<p class="font-mono">npm install 3rd-brain</p>
			</div>
			<Button
				size="icon"
				variant="outline"
				onclick={() => {
					navigator.clipboard.writeText('npm install 3rd-brain');
					toast('Copied to clipboard');
				}}
			>
				<Copy />
			</Button>
		</div>
	</div>
</div>
