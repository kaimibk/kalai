<script lang="ts">
	import Package from 'lucide-svelte/icons/package';
	import X from 'lucide-svelte/icons/x';
	import type { ClayBody } from '$lib/types/database';
	import { PYROMETRIC_CONES } from '$lib/constants/pyrometricCones';
	import { MANUFACTURERS } from '$lib/constants/manufacturers';

	let {
		isOpen = $bindable(false),
		clayBodies = [],
		onAddClay
	}: {
		isOpen: boolean;
		clayBodies: ClayBody[];
		onAddClay: (clay: ClayBody) => void;
	} = $props();

	let newLibraryClayName = $state('');
	let newLibraryClayManufacturer = $state('Laguna Clay');
	let newLibraryClayMinCone = $state('Cone 5');
	let newLibraryClayMaxCone = $state('Cone 6');
	let newLibraryClayShrinkage = $state(12.0);
	let newLibraryClayRawColor = $state('Buff');
	let newLibraryClayFiredColor = $state('Speckled Cream');
	let newLibraryClayNotes = $state('');

	function handleAddCustomClay(e: Event) {
		e.preventDefault();
		if (!newLibraryClayName.trim()) return;

		const newClay: ClayBody = {
			id: `cb-custom-${Date.now()}`,
			is_global: false,
			name: newLibraryClayName.trim(),
			manufacturer: newLibraryClayManufacturer,
			min_cone: newLibraryClayMinCone,
			max_cone: newLibraryClayMaxCone,
			firing_range: `${newLibraryClayMinCone}-${newLibraryClayMaxCone.replace('Cone ', '')}`,
			shrinkage_pct: Number(newLibraryClayShrinkage) || 12.0,
			raw_color: newLibraryClayRawColor.trim() || 'Buff',
			fired_color: newLibraryClayFiredColor.trim() || 'Cream',
			notes: newLibraryClayNotes.trim() || undefined
		};

		onAddClay(newClay);
		newLibraryClayName = '';
		newLibraryClayNotes = '';
	}
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
		<div class="modal-box max-w-2xl bg-base-100 text-base-content border border-base-300 shadow-2xl p-6 rounded-2xl max-h-[90vh] overflow-y-auto">
			<div class="flex items-center justify-between border-b border-base-300 pb-4">
				<div class="flex items-center gap-2 text-base-content">
					<Package class="w-5 h-5 text-primary" />
					<h3 class="font-display font-bold text-lg">Studio Clay Body Library</h3>
				</div>
				<button onclick={() => isOpen = false} class="btn btn-sm btn-circle btn-ghost">
					<X class="w-4 h-4" />
				</button>
			</div>

			<!-- Studio Clay Library Stats Component -->
			<div class="stats stats-horizontal w-full bg-base-200/60 border border-base-300 shadow-xs rounded-xl my-4 text-center">
				<div class="stat p-2">
					<div class="stat-title text-[10px] font-extrabold uppercase text-base-content/60">Clay Bodies</div>
					<div class="stat-value text-base font-extrabold text-primary">{clayBodies.length}</div>
				</div>
				<div class="stat p-2 border-l border-base-300">
					<div class="stat-title text-[10px] font-extrabold uppercase text-base-content/60">Stoneware</div>
					<div class="stat-value text-base font-extrabold text-secondary">{clayBodies.filter(c => c.name.toLowerCase().includes('stoneware') || (c.notes || '').toLowerCase().includes('stoneware')).length}</div>
				</div>
				<div class="stat p-2 border-l border-base-300">
					<div class="stat-title text-[10px] font-extrabold uppercase text-base-content/60">Avg Shrinkage</div>
					<div class="stat-value text-base font-extrabold text-accent">{(clayBodies.reduce((acc, c) => acc + c.shrinkage_pct, 0) / (clayBodies.length || 1)).toFixed(1)}%</div>
				</div>
			</div>

			<div class="space-y-3 my-4">
				<h4 class="text-xs font-bold text-base-content/70 uppercase tracking-wider">Available Clay Bodies</h4>
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
					{#each clayBodies as cb}
						<div class="bg-base-200 p-3.5 rounded-xl border border-base-300 space-y-2">
							<div class="flex items-center justify-between">
								<span class="badge badge-primary badge-xs font-bold uppercase">
									{cb.manufacturer || 'Custom'}
								</span>
								<span class="badge badge-neutral badge-xs font-bold">
									{cb.firing_range}
								</span>
							</div>
							<h5 class="font-display font-bold text-base-content">{cb.name}</h5>
							<div class="grid grid-cols-3 gap-1 text-[11px] text-base-content/70">
								<span>Shrinkage: <strong class="text-base-content">{cb.shrinkage_pct}%</strong></span>
								<span>Raw Color: <strong class="text-base-content">{cb.raw_color}</strong></span>
								<span>Fired Color: <strong class="text-base-content">{cb.fired_color}</strong></span>
							</div>
							{#if cb.notes}
								<p class="text-base-content/70 text-[11px] leading-relaxed pt-1 border-t border-base-300">{cb.notes}</p>
							{/if}
							<div class="pt-2 border-t border-base-300 flex justify-between text-[10px] text-base-content/60">
								<span>Scope: <strong class="text-success">{cb.is_global ? 'Global' : 'Custom'}</strong></span>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<form onsubmit={handleAddCustomClay} class="pt-4 border-t border-base-300 space-y-3 text-xs">
				<span class="font-bold text-base-content block">Add Custom Clay Body to Library:</span>
				<div class="grid grid-cols-2 gap-3">
					<div class="space-y-1">
						<label for="lib-clay-name" class="text-base-content/70 text-[10px]">Clay Body Name</label>
						<input 
							id="lib-clay-name"
							type="text" 
							bind:value={newLibraryClayName}
							placeholder="e.g. Red Stoneware 266..." 
							class="input input-bordered input-sm w-full"
							required
						/>
					</div>
					<div class="space-y-1">
						<label for="lib-clay-mfr" class="text-base-content/70 text-[10px]">Manufacturer</label>
						<select 
							id="lib-clay-mfr"
							bind:value={newLibraryClayManufacturer}
							class="select select-bordered select-sm w-full"
						>
							{#each MANUFACTURERS as mfr}
								<option value={mfr.name}>{mfr.name}</option>
							{/each}
						</select>
					</div>
				</div>

				<div class="grid grid-cols-3 gap-3">
					<div class="space-y-1">
						<label for="lib-clay-mincone" class="text-base-content/70 text-[10px]">Min Firing Cone</label>
						<select 
							id="lib-clay-mincone"
							bind:value={newLibraryClayMinCone}
							class="select select-bordered select-sm w-full"
						>
							{#each PYROMETRIC_CONES as cone}
								<option value={cone.name}>{cone.name}</option>
							{/each}
						</select>
					</div>
					<div class="space-y-1">
						<label for="lib-clay-maxcone" class="text-base-content/70 text-[10px]">Max Firing Cone</label>
						<select 
							id="lib-clay-maxcone"
							bind:value={newLibraryClayMaxCone}
							class="select select-bordered select-sm w-full"
						>
							{#each PYROMETRIC_CONES as cone}
								<option value={cone.name}>{cone.name}</option>
							{/each}
						</select>
					</div>
					<div class="space-y-1">
						<label for="lib-clay-shrinkage" class="text-base-content/70 text-[10px]">Shrinkage %</label>
						<input 
							id="lib-clay-shrinkage"
							type="number" 
							step="0.1" 
							bind:value={newLibraryClayShrinkage}
							class="input input-bordered input-sm w-full"
						/>
					</div>
				</div>

				<div class="grid grid-cols-2 gap-3">
					<div class="space-y-1">
						<label for="lib-clay-rawcolor" class="text-base-content/70 text-[10px]">Raw Color</label>
						<input 
							id="lib-clay-rawcolor"
							type="text" 
							bind:value={newLibraryClayRawColor}
							placeholder="e.g. Grey" 
							class="input input-bordered input-sm w-full"
						/>
					</div>
					<div class="space-y-1">
						<label for="lib-clay-firedcolor" class="text-base-content/70 text-[10px]">Fired Color</label>
						<input 
							id="lib-clay-firedcolor"
							type="text" 
							bind:value={newLibraryClayFiredColor}
							placeholder="e.g. Dark Red-Brown" 
							class="input input-bordered input-sm w-full"
						/>
					</div>
				</div>

				<div class="space-y-1">
					<label for="lib-clay-notes" class="text-base-content/70 text-[10px]">Notes / Characteristics</label>
					<input 
						id="lib-clay-notes"
						type="text" 
						bind:value={newLibraryClayNotes}
						placeholder="e.g. High grog content for large sculptural throwing..." 
						class="input input-bordered input-sm w-full"
					/>
				</div>

				<div class="flex justify-end pt-2">
					<button type="submit" class="btn btn-sm btn-primary font-bold shadow">
						Add Clay Body to Library
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
