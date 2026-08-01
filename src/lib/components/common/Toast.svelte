<script lang="ts">
	import CheckCircle2 from 'lucide-svelte/icons/check-circle-2';
	import AlertCircle from 'lucide-svelte/icons/alert-circle';
	import ShieldAlert from 'lucide-svelte/icons/shield-alert';

	let {
		toastMessage = null,
		toastType = 'success'
	}: {
		toastMessage: string | null;
		toastType?: 'success' | 'warning' | 'error' | 'info';
	} = $props();
</script>

{#if toastMessage}
	<div class="toast toast-bottom toast-end z-50 animate-bounce">
		<div class="alert alert-{toastType} shadow-lg text-sm font-medium flex items-center gap-2">
			{#if toastType === 'warning'}
				<AlertCircle class="w-4 h-4" />
			{:else if toastType === 'error'}
				<ShieldAlert class="w-4 h-4" />
			{:else}
				<CheckCircle2 class="w-4 h-4" />
			{/if}
			<span>{toastMessage}</span>
		</div>
	</div>
{/if}
