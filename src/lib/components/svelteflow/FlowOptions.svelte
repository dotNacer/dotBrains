<script lang="ts">
    import { Button } from '$lib/components/ui/button/index.js'
    import { Component, Undo2, Plus } from 'lucide-svelte'
</script>

<div class="absolute bottom-0 w-full flex justify-center items-center">
    <div class="bg-[var(--base)] p-4 rounded-xl border-[1px] mb-4 z-30">
        <Button variant="outline" class="gap-2  z-30"
            ><Undo2 class="w-4 h-4" />Undo</Button
        >
        <Button variant="outline" class="gap-2 "
            ><Plus class="w-4 h-4" />Add a node</Button
        >
        <Button variant="outline" class="gap-2 hover:bg-[var(--base)]"
            ><Component class="w-4 h-4" />Placeholder</Button
        >
    </div>
</div>
