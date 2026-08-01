<script lang="ts">
	import { onMount } from 'svelte';
	import { Calendar as CalendarIcon, X } from 'lucide-svelte';

	interface Props {
		value?: string; // YYYY-MM-DD format string
		placeholder?: string;
		class?: string;
		align?: 'left' | 'right';
		onchange?: (value: string) => void;
	}

	let { value = $bindable(''), placeholder = 'Select target date...', class: className = '', align = 'left', onchange }: Props = $props();

	let isOpen = $state(false);
	let isMounted = $state(false);

	onMount(() => {
		isMounted = true;
		import('cally');
	});

	function setupCally(node: HTMLElement) {
		const handleEvent = () => {
			const selectedVal = (node as any).value;
			if (selectedVal && typeof selectedVal === 'string') {
				value = selectedVal;
				if (onchange) onchange(selectedVal);
				isOpen = false;
			}
		};

		node.addEventListener('change', handleEvent);
		node.addEventListener('input', handleEvent);

		return {
			destroy() {
				node.removeEventListener('change', handleEvent);
				node.removeEventListener('input', handleEvent);
			}
		};
	}

	function handleClear(e: MouseEvent) {
		e.stopPropagation();
		value = '';
		if (onchange) onchange('');
		isOpen = false;
	}

	function setToday(e: MouseEvent) {
		e.stopPropagation();
		const today = new Date().toISOString().split('T')[0];
		value = today;
		if (onchange) onchange(today);
		isOpen = false;
	}

	function formatDisplayDate(dateStr: string): string {
		if (!dateStr) return '';
		const [y, m, d] = dateStr.split('-').map(Number);
		if (!y || !m || !d) return dateStr;
		const dateObj = new Date(y, m - 1, d);
		return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	}
</script>

<div class="relative inline-block w-full">
	<!-- Trigger Button -->
	<button
		type="button"
		onclick={() => isOpen = !isOpen}
		class="btn btn-sm bg-base-100 border border-base-300 text-base-content hover:bg-base-200 justify-between w-full font-normal shadow-xs cursor-pointer {className}"
	>
		<div class="flex items-center gap-2 overflow-hidden">
			<CalendarIcon class="w-4 h-4 text-primary flex-shrink-0" />
			<span class="truncate text-xs {value ? 'font-bold text-base-content' : 'text-base-content/60'}">
				{value ? formatDisplayDate(value) : placeholder}
			</span>
		</div>

		{#if value}
			<span
				role="button"
				tabindex="0"
				onclick={handleClear}
				onkeydown={(e) => { if (e.key === 'Enter') handleClear(e as any); }}
				class="p-0.5 rounded-full hover:bg-base-300 text-base-content/60 hover:text-base-content transition cursor-pointer"
				title="Clear date"
			>
				<X class="w-3.5 h-3.5" />
			</span>
		{/if}
	</button>

	<!-- Cally Calendar Dropdown Popover (Only rendered in client when mounted & open) -->
	{#if isOpen && isMounted}
		<!-- Click-outside backdrop -->
		<button
			type="button"
			tabindex="-1"
			aria-label="Close calendar"
			onclick={() => isOpen = false}
			class="fixed inset-0 z-40 bg-transparent cursor-default"
		></button>

		<div class="absolute {align === 'right' ? 'right-0 left-auto' : 'left-0 right-auto'} top-full mt-2 z-50 p-2.5 bg-base-100 border border-base-300 rounded-2xl shadow-2xl space-y-2 text-base-content outline-none max-w-[calc(100vw-2rem)]">
			<calendar-date
				use:setupCally
				class="cally bg-base-100 text-base-content"
				value={value || undefined}
			>
				<svg aria-label="Previous" class="fill-current size-4" {...{ slot: 'previous' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M15.75 19.5 8.25 12l7.5-7.5"></path></svg>
				<svg aria-label="Next" class="fill-current size-4" {...{ slot: 'next' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
				<calendar-month></calendar-month>
			</calendar-date>

			<!-- Calendar Action Footer -->
			<div class="flex items-center justify-between pt-2 border-t border-base-300 px-1 text-xs">
				<button
					type="button"
					onclick={setToday}
					class="btn btn-xs btn-ghost text-primary font-bold cursor-pointer"
				>
					Set Today
				</button>
				{#if value}
					<button
						type="button"
						onclick={handleClear}
						class="btn btn-xs btn-ghost text-error font-semibold cursor-pointer"
					>
						Clear Date
					</button>
				{/if}
			</div>
		</div>
	{/if}
</div>
