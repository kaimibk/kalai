<script lang="ts">
	import Flame from 'lucide-svelte/icons/flame';
	import X from 'lucide-svelte/icons/x';
	import { PYROMETRIC_CONES } from '$lib/constants/pyrometricCones';

	let {
		isOpen = $bindable(false)
	}: {
		isOpen: boolean;
	} = $props();
</script>

{#if isOpen}
	<div 
		role="dialog" 
		aria-modal="true"
		tabindex="-1"
		onclick={(e) => { if (e.target === e.currentTarget) isOpen = false; }}
		onkeydown={(e) => { if (e.key === 'Escape') isOpen = false; }}
		class="modal modal-open"
	>
		<div class="modal-box max-w-3xl bg-base-100 text-base-content border border-base-300 shadow-2xl p-6 rounded-2xl max-h-[90vh] overflow-y-auto">
			<div class="flex items-center justify-between border-b border-base-300 pb-4">
				<div class="flex items-center gap-2 text-base-content">
					<Flame class="w-5 h-5 text-warning" />
					<h3 class="font-display font-bold text-lg">Pyrometric Cone Temperature Equivalents</h3>
				</div>
				<button onclick={() => isOpen = false} class="btn btn-sm btn-circle btn-ghost">
					<X class="w-4 h-4" />
				</button>
			</div>

			<p class="text-xs text-base-content/70 my-3">
				Standard Orton / Skutt kiln firing temperatures rated at 108°F/hr during final heating:
			</p>

			<!-- Key Firing Cone Temperatures Stats Component -->
			<div class="stats stats-horizontal w-full bg-base-200/60 border border-base-300 shadow-xs rounded-xl my-3 text-center">
				<div class="stat p-2">
					<div class="stat-title text-[10px] font-extrabold uppercase text-base-content/60">Bisque (Cone 06)</div>
					<div class="stat-value text-base font-extrabold text-info">1828°F</div>
					<div class="stat-desc text-[10px]">998°C</div>
				</div>
				<div class="stat p-2 border-l border-base-300">
					<div class="stat-title text-[10px] font-extrabold uppercase text-base-content/60">Mid-Fire (Cone 6)</div>
					<div class="stat-value text-base font-extrabold text-warning">2232°F</div>
					<div class="stat-desc text-[10px]">1222°C</div>
				</div>
				<div class="stat p-2 border-l border-base-300">
					<div class="stat-title text-[10px] font-extrabold uppercase text-base-content/60">High-Fire (Cone 10)</div>
					<div class="stat-value text-base font-extrabold text-error">2345°F</div>
					<div class="stat-desc text-[10px]">1285°C</div>
				</div>
			</div>

			<div class="overflow-x-auto rounded-xl border border-base-300">
				<table class="table table-sm table-zebra w-full text-xs">
					<thead>
						<tr class="bg-base-200 text-base-content">
							<th>Cone</th>
							<th>°F</th>
							<th>°C</th>
							<th>Color Fire</th>
							<th>Firing Category</th>
						</tr>
					</thead>
					<tbody>
						{#each PYROMETRIC_CONES as cone}
							<tr>
								<td class="font-bold text-warning">{cone.name}</td>
								<td>{cone.temp_f}°F</td>
								<td>{cone.temp_c}°C</td>
								<td class="text-base-content/70">{cone.color_fire}</td>
								<td class="uppercase text-[10px] font-semibold text-success">{cone.firing_category.replace('_', ' ')}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
{/if}
