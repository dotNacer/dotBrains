<script lang="ts">
    import type { PageData } from './$types'
    import SettingsForm from './settings-form.svelte'
    let { data } = $props<{ data: PageData }>()
</script>

<div class="w-[400px] p-4 bg-card border border-border">
    <SettingsForm data={data.form} />
</div>
