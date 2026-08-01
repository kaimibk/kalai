<script lang="ts">
	import Palette from 'lucide-svelte/icons/palette';
	import X from 'lucide-svelte/icons/x';
	import type { GlazeRecipe, GlazeStyle } from '$lib/types/database';
	import { PYROMETRIC_CONES } from '$lib/constants/pyrometricCones';
	import { MANUFACTURERS } from '$lib/constants/manufacturers';

	let {
		isOpen = $bindable(false),
		glazes = [],
		onAddGlaze
	}: {
		isOpen: boolean;
		glazes: GlazeRecipe[];
		onAddGlaze: (glaze: GlazeRecipe) => void;
	} = $props();

	let newLibraryGlazeName = $state('');
	let newLibraryManufacturer = $state('Amaco');
	let newLibraryStyle = $state<GlazeStyle>('brush');
	let newLibraryMinCone = $state('Cone 5');
	let newLibraryMaxCone = $state('Cone 6');
	let newLibraryTargetCone = $state('Cone 6');
	let newLibraryNotes = $state('');

	function handleAddCustomGlaze(e: Event) {
		e.preventDefault();
		if (!newLibraryGlazeName.trim()) return;

		const newGlaze: GlazeRecipe = {
			id: `glz-custom-${Date.now()}`,
			is_global: false,
			name: newLibraryGlazeName.trim(),
			manufacturer: newLibraryManufacturer,
			default_style: newLibraryStyle,
			min_cone: newLibraryMinCone,
			max_cone: newLibraryMaxCone,
			target_cone: newLibraryTargetCone,
			atmosphere: 'Oxidation',
			batch_liters: 1.0,
			notes: newLibraryNotes.trim() || 'Custom studio glaze definition'
		};

		onAddGlaze(newGlaze);
		newLibraryGlazeName = '';
		newLibraryNotes = '';
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
					<Palette class="w-5 h-5 text-success" />
					<h3 class="font-display font-bold text-lg">Studio Glaze Library</h3>
				</div>
				<button onclick={() => isOpen = false} class="btn btn-sm btn-circle btn-ghost">
					<X class="w-4 h-4" />
				</button>
			</div>

			<!-- Studio Glaze Library Stats Component -->
			<div class="stats stats-horizontal w-full bg-base-200/60 border border-base-300 shadow-xs rounded-xl my-4 text-center">
				<div class="stat p-2">
					<div class="stat-title text-[10px] font-extrabold uppercase text-base-content/60">Total Glazes</div>
					<div class="stat-value text-base font-extrabold text-success">{glazes.length}</div>
				</div>
				<div class="stat p-2 border-l border-base-300">
					<div class="stat-title text-[10px] font-extrabold uppercase text-base-content/60">Global Recipes</div>
					<div class="stat-value text-base font-extrabold text-primary">{glazes.filter(g => g.is_global).length}</div>
				</div>
				<div class="stat p-2 border-l border-base-300">
					<div class="stat-title text-[10px] font-extrabold uppercase text-base-content/60">Cone 5–6</div>
					<div class="stat-value text-base font-extrabold text-warning">{glazes.filter(g => (g.max_cone || '').includes('6') || (g.min_cone || '').includes('5')).length}</div>
				</div>
			</div>

			<div class="space-y-3 my-4">
				<h4 class="text-xs font-bold text-base-content/70 uppercase tracking-wider">Available Predefined & Custom Glazes</h4>
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
					{#each glazes as g}
						<div class="bg-base-200 p-3.5 rounded-xl border border-base-300 space-y-2">
							<div class="flex items-center justify-between">
								<span class="badge badge-primary badge-xs font-bold uppercase">
									{g.manufacturer}
								</span>
								<span class="badge badge-neutral badge-xs font-bold">
									{g.min_cone || 'Cone 5'} – {g.max_cone || 'Cone 6'}
								</span>
							</div>
							<h5 class="font-display font-bold text-base-content">{g.name}</h5>
							<p class="text-base-content/70 text-[11px] leading-relaxed">{g.notes}</p>
							<div class="pt-2 border-t border-base-300 flex justify-between text-[10px] text-base-content/60">
								<span>Style: <strong class="text-base-content capitalize">{g.default_style}</strong></span>
								<span>Scope: <strong class="text-success">{g.is_global ? 'Global' : 'Custom'}</strong></span>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<form onsubmit={handleAddCustomGlaze} class="pt-4 border-t border-base-300 space-y-3 text-xs">
				<span class="font-bold text-base-content block">Add Custom Glaze to Library:</span>
				<div class="grid grid-cols-2 gap-3">
					<input 
						type="text" 
						bind:value={newLibraryGlazeName}
						placeholder="Glaze Name (e.g. Iron Red Satin)..." 
						class="input input-bordered input-sm w-full"
						required
					/>
					<select 
						bind:value={newLibraryManufacturer}
						class="select select-bordered select-sm w-full"
					>
						{#each MANUFACTURERS as mfr}
							<option value={mfr.name}>{mfr.name}</option>
						{/each}
					</select>
				</div>
				<div class="grid grid-cols-3 gap-3">
					<div class="space-y-1">
						<label for="lib-style-select" class="text-base-content/70 text-[10px]">Application Style</label>
						<select 
							id="lib-style-select"
							bind:value={newLibraryStyle}
							class="select select-bordered select-sm w-full"
						>
							<option value="brush">Brush Style</option>
							<option value="dip">Dipping Bucket</option>
							<option value="spray">Spray Style</option>
							<option value="underglaze">Underglaze</option>
						</select>
					</div>

					<div class="space-y-1">
						<label for="lib-min-cone" class="text-base-content/70 text-[10px]">Min Firing Cone</label>
						<select 
							id="lib-min-cone"
							bind:value={newLibraryMinCone}
							class="select select-bordered select-sm w-full"
						>
							{#each PYROMETRIC_CONES as cone}
								<option value={cone.name}>{cone.name}</option>
							{/each}
						</select>
					</div>

					<div class="space-y-1">
						<label for="lib-max-cone" class="text-base-content/70 text-[10px]">Max Firing Cone</label>
						<select 
							id="lib-max-cone"
							bind:value={newLibraryMaxCone}
							class="select select-bordered select-sm w-full"
						>
							{#each PYROMETRIC_CONES as cone}
								<option value={cone.name}>{cone.name}</option>
							{/each}
						</select>
					</div>
				</div>
				<div class="flex justify-end pt-2">
					<button type="submit" class="btn btn-sm btn-success text-success-content font-bold shadow">
						Add Glaze to Library
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
