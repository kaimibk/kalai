<script lang="ts">
	import Flame from 'lucide-svelte/icons/flame';
	import Palette from 'lucide-svelte/icons/palette';
	import Package from 'lucide-svelte/icons/package';
	import ShieldAlert from 'lucide-svelte/icons/shield-alert';
	import Plus from 'lucide-svelte/icons/plus';
	import Search from 'lucide-svelte/icons/search';
	import X from 'lucide-svelte/icons/x';
	import SlidersHorizontal from 'lucide-svelte/icons/sliders-horizontal';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import RotateCcw from 'lucide-svelte/icons/rotate-ccw';

	import type { CeramicPiece, ClayBody, GlazeRecipe } from '$lib/types/database';
	import { STAGES } from '$lib/constants/stages';
	import type { WeightUnit } from '$lib/utils/dimensions';

	let {
		pieces = [],
		clayBodies = [],
		glazes = [],
		showLossArchive = $bindable(false),
		mobileActiveStage = $bindable('all'),
		filterSearchQuery = $bindable(''),
		filterFormType = $bindable('all'),
		filterClayBody = $bindable('all'),
		filterGlaze = $bindable('all'),
		filterTargetCone = $bindable('all'),
		filterDueDate = $bindable('all'),
		filterWeightEnabled = $bindable(false),
		appliedMinWeight = $bindable(0),
		appliedMaxWeight = $bindable(2000),
		appliedWeightUnit = $bindable<WeightUnit>('g'),
		isMobileFilterDrawerOpen = $bindable(false),
		onOpenPyrometricChart: onOpenPyrometricChart,
		onOpenGlazeLibrary,
		onOpenClayLibrary,
		onOpenNewPieceModal
	}: {
		pieces: CeramicPiece[];
		clayBodies: ClayBody[];
		glazes: GlazeRecipe[];
		showLossArchive: boolean;
		mobileActiveStage: string;
		filterSearchQuery: string;
		filterFormType: string;
		filterClayBody: string;
		filterGlaze: string;
		filterTargetCone: string;
		filterDueDate: string;
		filterWeightEnabled: boolean;
		appliedMinWeight: number;
		appliedMaxWeight: number;
		appliedWeightUnit: WeightUnit;
		isMobileFilterDrawerOpen: boolean;
		onOpenPyrometricChart: () => void;
		onOpenGlazeLibrary: () => void;
		onOpenClayLibrary: () => void;
		onOpenNewPieceModal: () => void;
	} = $props();

	let activePieces = $derived(pieces.filter(p => !p.is_failed));
	let failedPieces = $derived(pieces.filter(p => p.is_failed));

	// Derived filter dropdown options
	let availablePieceTypes = $derived(Array.from(new Set(pieces.map(p => p.piece_type).filter(Boolean))).sort());
	let availableClayBodies = $derived(Array.from(new Set(pieces.map(p => p.clay_body_name).filter(Boolean) as string[])).sort());
	let availableCones = $derived(Array.from(new Set(pieces.map(p => p.target_glaze_cone).filter(Boolean))).sort());
	let availableGlazes = $derived(
		Array.from(new Set(pieces.flatMap(p => p.glaze_layers ? p.glaze_layers.map(g => g.glaze_name) : []))).sort()
	);

	let activeFilterCount = $derived(
		(filterSearchQuery.trim() ? 1 : 0) +
		(filterFormType !== 'all' ? 1 : 0) +
		(filterClayBody !== 'all' ? 1 : 0) +
		(filterGlaze !== 'all' ? 1 : 0) +
		(filterTargetCone !== 'all' ? 1 : 0) +
		(filterDueDate !== 'all' ? 1 : 0) +
		(filterWeightEnabled ? 1 : 0)
	);

	let hasActiveFilters = $derived(activeFilterCount > 0);

	// Weight Popover local draft state
	let showWeightSliderPopover = $state(false);
	let draftMinWeight = $state(0);
	let draftMaxWeight = $state(2000);
	let draftWeightUnit = $state<WeightUnit>('g');

	let weightSliderMax = $derived(draftWeightUnit === 'kg' ? 10 : draftWeightUnit === 'lbs' ? 20 : draftWeightUnit === 'oz' ? 320 : 5000);
	let weightSliderStep = $derived(draftWeightUnit === 'kg' ? 0.1 : draftWeightUnit === 'lbs' ? 0.25 : draftWeightUnit === 'oz' ? 1 : 25);

	function openWeightSliderPopover() {
		draftMinWeight = appliedMinWeight;
		draftMaxWeight = appliedMaxWeight;
		draftWeightUnit = appliedWeightUnit;
		showWeightSliderPopover = true;
	}

	function applyWeightFilter() {
		appliedMinWeight = draftMinWeight;
		appliedMaxWeight = draftMaxWeight;
		appliedWeightUnit = draftWeightUnit;
		filterWeightEnabled = true;
		showWeightSliderPopover = false;
	}

	function resetWeightFilter() {
		filterWeightEnabled = false;
		showWeightSliderPopover = false;
	}

	function handleWeightUnitChange(unit: WeightUnit) {
		draftWeightUnit = unit;
		if (unit === 'kg') {
			draftMinWeight = 0;
			draftMaxWeight = 5;
		} else if (unit === 'lbs') {
			draftMinWeight = 0;
			draftMaxWeight = 10;
		} else if (unit === 'oz') {
			draftMinWeight = 0;
			draftMaxWeight = 160;
		} else {
			draftMinWeight = 0;
			draftMaxWeight = 2000;
		}
	}

	function clearAllFilters() {
		filterSearchQuery = '';
		filterFormType = 'all';
		filterClayBody = 'all';
		filterGlaze = 'all';
		filterTargetCone = 'all';
		filterDueDate = 'all';
		filterWeightEnabled = false;
	}

	function resetSingleFilter(filterKey: string) {
		if (filterKey === 'search') filterSearchQuery = '';
		else if (filterKey === 'formType') filterFormType = 'all';
		else if (filterKey === 'clayBody') filterClayBody = 'all';
		else if (filterKey === 'glaze') filterGlaze = 'all';
		else if (filterKey === 'targetCone') filterTargetCone = 'all';
		else if (filterKey === 'dueDate') filterDueDate = 'all';
		else if (filterKey === 'weight') filterWeightEnabled = false;
	}
</script>

<div class="flex items-center justify-between gap-2 border-b border-base-300 pb-2.5 mb-3 transition-colors flex-shrink-0">
	<div>
		<div class="flex items-center gap-2 sm:gap-3">				
			<!-- Studio Statistics Component (daisyUI stat) -->
			<div class="stats stats-horizontal bg-base-200/60 border border-base-300 shadow-xs py-0.5 px-2 rounded-xl">
				<div class="stat p-1 flex items-center gap-1.5">
					<div class="stat-title text-[10px] font-extrabold uppercase text-base-content/60">Active</div>
					<div class="stat-value text-xs sm:text-sm font-extrabold text-primary">{activePieces.length}</div>
				</div>
				<div class="stat p-1 flex items-center gap-1.5 border-l border-base-300">
					<div class="stat-title text-[10px] font-extrabold uppercase text-base-content/60 hidden sm:block">Done</div>
					<div class="stat-value text-xs sm:text-sm font-extrabold text-success">{activePieces.filter(p => p.stage === 'done').length}</div>
				</div>
				{#if failedPieces.length > 0}
					<div class="stat p-1 flex items-center gap-1.5 border-l border-base-300">
						<div class="stat-title text-[10px] font-extrabold uppercase text-base-content/60 hidden sm:block">Losses</div>
						<div class="stat-value text-xs sm:text-sm font-extrabold text-error">{failedPieces.length}</div>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<div class="flex items-center gap-1.5 sm:gap-2">
		<button 
			onclick={onOpenPyrometricChart}
			class="btn btn-sm btn-ghost border border-base-300 text-xs font-semibold gap-1.5"
			title="Pyrometric Cone Temp Chart"
		>
			<Flame class="w-4 h-4 text-warning" />
			<span class="hidden md:inline">Cone Temp Chart</span>
			<span class="hidden sm:inline md:hidden">Cones</span>
		</button>

		<button 
			onclick={onOpenGlazeLibrary}
			class="btn btn-sm btn-ghost border border-base-300 text-xs font-semibold gap-1.5"
			title="Glaze Library"
		>
			<Palette class="w-4 h-4 text-success" />
			<span class="hidden md:inline">Glaze Library ({glazes.length})</span>
			<span class="hidden sm:inline md:hidden">Glazes ({glazes.length})</span>
		</button>

		<button 
			onclick={onOpenClayLibrary}
			class="btn btn-sm btn-ghost border border-base-300 text-xs font-semibold gap-1.5"
			title="Clay Bodies Library"
		>
			<Package class="w-4 h-4 text-primary" />
			<span class="hidden md:inline">Clay Bodies ({clayBodies.length})</span>
			<span class="hidden sm:inline md:hidden">Clay ({clayBodies.length})</span>
		</button>

		<button 
			onclick={() => showLossArchive = !showLossArchive}
			class="btn btn-sm gap-1.5 {showLossArchive ? 'btn-error' : 'btn-outline btn-error'}"
			title="Toggle Loss Archive (Failed Pieces in Finished Stage)"
		>
			<ShieldAlert class="w-4 h-4" />
			<span class="hidden md:inline">Loss Archive ({failedPieces.length})</span>
			<span class="hidden sm:inline md:hidden">Losses ({failedPieces.length})</span>
			{#if showLossArchive}
				<span class="badge badge-xs badge-neutral uppercase font-extrabold">Shown</span>
			{/if}
		</button>

		<button 
			onclick={onOpenNewPieceModal}
			class="btn btn-sm btn-primary font-bold gap-1.5 shadow-md"
			title="Create New Piece"
		>
			<Plus class="w-4 h-4" />
			<span class="hidden sm:inline">Create Piece</span>
		</button>
	</div>
</div>

<!-- DYNAMIC RESPONSIVE FILTER TOOLBAR -->
<div class="w-full bg-base-100/90 backdrop-blur-md border border-base-300 rounded-2xl p-2.5 sm:p-3 mb-1.5 sm:mb-3 shadow-sm space-y-2 flex-shrink-0 relative z-30">
	<div class="flex flex-wrap items-center justify-between gap-2">
		<!-- Search Bar -->
		<div class="relative flex-1 min-w-[200px] sm:min-w-[260px]">
			<Search class="w-4 h-4 text-base-content/50 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
			<input
				type="text"
				bind:value={filterSearchQuery}
				placeholder="Search titles, clay, forms, glazes, notes..."
				class="input input-bordered input-sm w-full pl-9 pr-8 text-xs"
			/>
			{#if filterSearchQuery}
				<button
					type="button"
					onclick={() => filterSearchQuery = ''}
					class="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-0.5 rounded-full cursor-pointer"
					aria-label="Clear search"
				>
					<X class="w-3.5 h-3.5" />
				</button>
			{/if}
		</div>

		<!-- Mobile Filter Drawer Toggle Button -->
		<button
			type="button"
			onclick={() => isMobileFilterDrawerOpen = true}
			class="lg:hidden btn btn-sm btn-outline gap-1.5 cursor-pointer {hasActiveFilters ? 'btn-primary' : ''}"
		>
			<SlidersHorizontal class="w-4 h-4" />
			<span>Filter</span>
			{#if activeFilterCount > 0}
				<span class="badge badge-xs badge-neutral">
					{activeFilterCount}
				</span>
			{/if}
		</button>

		<!-- Desktop Filter Dropdowns -->
		<div class="hidden lg:flex items-center gap-2 flex-wrap">
			<!-- Form Type Filter -->
			<div class="relative">
				<select
					bind:value={filterFormType}
					class="select select-bordered select-sm text-xs font-semibold"
				>
					<option value="all">All Forms</option>
					{#each availablePieceTypes as typeName}
						<option value={typeName}>{typeName}</option>
					{/each}
				</select>
			</div>

			<!-- Clay Body Filter -->
			<div class="relative">
				<select
					bind:value={filterClayBody}
					class="select select-bordered select-sm text-xs font-semibold"
				>
					<option value="all">All Clay Bodies</option>
					{#each availableClayBodies as clayName}
						<option value={clayName}>{clayName}</option>
					{/each}
				</select>
			</div>

			<!-- Glaze Filter -->
			<div class="relative">
				<select
					bind:value={filterGlaze}
					class="select select-bordered select-sm text-xs font-semibold"
				>
					<option value="all">All Glazes</option>
					<option value="unglazed">Unglazed Only</option>
					{#each availableGlazes as glazeName}
						<option value={glazeName}>{glazeName}</option>
					{/each}
				</select>
			</div>

			<!-- Target Cone Filter -->
			<div class="relative">
				<select
					bind:value={filterTargetCone}
					class="select select-bordered select-sm text-xs font-semibold"
				>
					<option value="all">All Cones</option>
					{#each availableCones as coneName}
						<option value={coneName}>{coneName}</option>
					{/each}
				</select>
			</div>

			<!-- Due Date Filter -->
			<div class="relative">
				<select
					bind:value={filterDueDate}
					class="select select-bordered select-sm text-xs font-semibold"
				>
					<option value="all">All Due Dates</option>
					<option value="overdue">Late / Overdue</option>
					<option value="due_today">Due Today</option>
					<option value="less_than_1_week">Due in &lt; 1 Week</option>
					<option value="less_than_2_weeks">Due in &lt; 2 Weeks</option>
					<option value="has_due_date">Has Due Date</option>
					<option value="no_due_date">No Due Date</option>
				</select>
			</div>

			<!-- Weight Range Filter Popover -->
			<div class="relative flex-shrink-0">
				<button
					type="button"
					onclick={() => { if (showWeightSliderPopover) showWeightSliderPopover = false; else openWeightSliderPopover(); }}
					class="btn btn-sm bg-base-100 border border-base-300 text-base-content hover:bg-base-200 gap-1.5 cursor-pointer font-semibold shadow-xs {filterWeightEnabled ? 'btn-primary border-primary text-primary-content' : ''}"
				>
					<span>Weight</span>
					{#if filterWeightEnabled}
						<span class="badge badge-xs badge-primary-content text-primary font-bold">
							{appliedMinWeight}–{appliedMaxWeight}{appliedWeightUnit}
						</span>
					{:else}
						<span class="text-base-content/60 font-normal">All</span>
					{/if}
					<ChevronDown class="w-3.5 h-3.5 opacity-60" />
				</button>

				{#if showWeightSliderPopover}
					<!-- Click outside backdrop -->
					<button
						type="button"
						tabindex="-1"
						aria-label="Close weight filter popover backdrop"
						onclick={() => showWeightSliderPopover = false}
						class="fixed inset-0 z-40 bg-transparent cursor-default"
					></button>

					<div class="absolute right-0 top-full mt-2 w-72 max-w-[calc(100vw-2rem)] p-4 bg-base-100 border border-base-300 rounded-2xl shadow-2xl z-50 space-y-3.5 text-base-content outline-none ring-0">
						<div class="flex items-center justify-between">
							<span class="text-xs font-extrabold uppercase tracking-wider text-base-content/70">Weight Range</span>
							<!-- Unit Selector -->
							<div class="join bg-base-200 p-0.5 rounded-lg">
								{#each (['g', 'kg', 'oz', 'lbs'] as WeightUnit[]) as u}
									<button
										type="button"
										onclick={() => handleWeightUnitChange(u)}
										class="join-item btn btn-xs transition-all {draftWeightUnit === u ? 'btn-primary font-bold shadow-xs' : 'btn-ghost text-base-content/60'}"
									>
										{u}
									</button>
								{/each}
							</div>
						</div>

						<!-- Min Weight Slider -->
						<div class="space-y-1">
							<div class="flex items-center justify-between text-xs text-base-content/70">
								<span>Min Weight:</span>
								<span class="font-extrabold text-base-content">{draftMinWeight} {draftWeightUnit}</span>
							</div>
							<input
								type="range"
								min="0"
								max={weightSliderMax}
								step={weightSliderStep}
								bind:value={draftMinWeight}
								class="range range-xs range-primary w-full cursor-pointer"
							/>
						</div>

						<!-- Max Weight Slider -->
						<div class="space-y-1">
							<div class="flex items-center justify-between text-xs text-base-content/70">
								<span>Max Weight:</span>
								<span class="font-extrabold text-base-content">{draftMaxWeight} {draftWeightUnit}</span>
							</div>
							<input
								type="range"
								min="0"
								max={weightSliderMax}
								step={weightSliderStep}
								bind:value={draftMaxWeight}
								class="range range-xs range-primary w-full cursor-pointer"
							/>
						</div>

						<!-- Popover Footer -->
						<div class="flex items-center justify-between pt-2.5 border-t border-base-300">
							<button
								type="button"
								onclick={resetWeightFilter}
								class="btn btn-xs btn-ghost text-base-content/60 font-semibold cursor-pointer"
							>
								Reset Weight
							</button>
							<button
								type="button"
								onclick={applyWeightFilter}
								class="btn btn-xs btn-primary font-bold shadow-xs cursor-pointer"
							>
								Apply Range
							</button>
						</div>
					</div>
				{/if}
			</div>

			<!-- Clear All Button -->
			<button
				type="button"
				onclick={clearAllFilters}
				class="btn btn-xs btn-error btn-outline rounded-xl flex items-center gap-1 font-bold transition-all duration-200 cursor-pointer {hasActiveFilters ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}"
				title="Clear all active filters"
			>
				<RotateCcw class="w-3.5 h-3.5" />
				<span>Clear Filters</span>
			</button>
		</div>
	</div>

	<!-- ACTIVE FILTER CHIPS / TAGS BAR -->
	{#if hasActiveFilters}
		<div class="flex items-center gap-1.5 flex-wrap pt-2 border-t border-base-300 text-xs">
			<span class="text-[11px] font-extrabold uppercase tracking-wider text-base-content/50 mr-1">Active:</span>
			
			{#if filterSearchQuery.trim()}
				<span class="badge badge-primary gap-1.5 font-bold py-2 px-2.5 text-xs">
					<span>Search: "{filterSearchQuery}"</span>
					<button type="button" onclick={() => resetSingleFilter('search')} class="hover:opacity-75 cursor-pointer" aria-label="Remove search filter"><X class="w-3 h-3" /></button>
				</span>
			{/if}

			{#if filterFormType !== 'all'}
				<span class="badge badge-secondary gap-1.5 font-bold py-2 px-2.5 text-xs">
					<span>Form: {filterFormType}</span>
					<button type="button" onclick={() => resetSingleFilter('formType')} class="hover:opacity-75 cursor-pointer" aria-label="Remove form type filter"><X class="w-3 h-3" /></button>
				</span>
			{/if}

			{#if filterClayBody !== 'all'}
				<span class="badge badge-accent gap-1.5 font-bold py-2 px-2.5 text-xs">
					<span>Clay: {filterClayBody}</span>
					<button type="button" onclick={() => resetSingleFilter('clayBody')} class="hover:opacity-75 cursor-pointer" aria-label="Remove clay body filter"><X class="w-3 h-3" /></button>
				</span>
			{/if}

			{#if filterGlaze !== 'all'}
				<span class="badge badge-info gap-1.5 font-bold py-2 px-2.5 text-xs">
					<span>Glaze: {filterGlaze === 'unglazed' ? 'Unglazed' : filterGlaze}</span>
					<button type="button" onclick={() => resetSingleFilter('glaze')} class="hover:opacity-75 cursor-pointer" aria-label="Remove glaze filter"><X class="w-3 h-3" /></button>
				</span>
			{/if}

			{#if filterTargetCone !== 'all'}
				<span class="badge badge-warning gap-1.5 font-bold py-2 px-2.5 text-xs">
					<span>Cone: {filterTargetCone}</span>
					<button type="button" onclick={() => resetSingleFilter('targetCone')} class="hover:opacity-75 cursor-pointer" aria-label="Remove target cone filter"><X class="w-3 h-3" /></button>
				</span>
			{/if}

			{#if filterDueDate !== 'all'}
				<span class="badge badge-error gap-1.5 font-bold py-2 px-2.5 text-xs">
					<span>Due: {filterDueDate === 'overdue' ? 'Late / Overdue' : filterDueDate === 'due_today' ? 'Due Today' : filterDueDate === 'less_than_1_week' ? '< 1 Week' : filterDueDate === 'less_than_2_weeks' ? '< 2 Weeks' : filterDueDate === 'has_due_date' ? 'Has Date' : 'No Date'}</span>
					<button type="button" onclick={() => resetSingleFilter('dueDate')} class="hover:opacity-75 cursor-pointer" aria-label="Remove due date filter"><X class="w-3 h-3" /></button>
				</span>
			{/if}

			{#if filterWeightEnabled}
				<span class="badge badge-primary badge-outline gap-1.5 font-bold py-2 px-2.5 text-xs">
					<span>Weight: {appliedMinWeight}–{appliedMaxWeight} {appliedWeightUnit}</span>
					<button type="button" onclick={() => resetSingleFilter('weight')} class="hover:opacity-75 cursor-pointer" aria-label="Remove weight filter"><X class="w-3 h-3" /></button>
				</span>
			{/if}

			<button
				type="button"
				onclick={clearAllFilters}
				class="btn btn-ghost btn-xs text-xs font-bold text-base-content/60 underline ml-1 cursor-pointer"
			>
				Reset all
			</button>
		</div>
	{/if}
</div>

<!-- MOBILE/TABLET STAGE FOCUS SELECTOR TABS -->
<div class="w-full overflow-x-auto pb-1.5 pt-0.5 no-scrollbar flex-shrink-0 2xl:hidden mt-0 mb-3">
	<div role="tablist" class="tabs tabs-lift tabs-sm flex items-center justify-start w-max min-w-full px-1">
		<button
			type="button"
			role="tab"
			onclick={() => mobileActiveStage = 'all'}
			class="tab font-extrabold gap-1.5 whitespace-nowrap transition-all cursor-pointer {mobileActiveStage === 'all' ? 'tab-active border-base-300 font-black text-primary' : 'text-base-content/70 hover:text-base-content'}"
		>
			<span>All Stages</span>
			<span class="badge badge-sm {mobileActiveStage === 'all' ? 'badge-primary font-bold' : 'badge-neutral'}">
				{activePieces.length}
			</span>
		</button>

		{#each STAGES as stageInfo}
			{@const count = stageInfo.id === 'done'
				? (showLossArchive ? pieces.filter(p => p.stage === 'done').length : pieces.filter(p => p.stage === 'done' && !p.is_failed).length)
				: activePieces.filter(p => p.stage === stageInfo.id).length}
			<button
				type="button"
				role="tab"
				onclick={() => mobileActiveStage = stageInfo.id}
				class="tab font-extrabold gap-1.5 whitespace-nowrap transition-all cursor-pointer {mobileActiveStage === stageInfo.id ? 'tab-active border-base-300 font-black text-primary' : 'text-base-content/70 hover:text-base-content'}"
			>
				<span class="text-xs">{stageInfo.icon}</span>
				<span>{stageInfo.label}</span>
				<span class="badge badge-sm {mobileActiveStage === stageInfo.id ? 'badge-primary' : stageInfo.badgeColor} font-bold">
					{count}
				</span>
			</button>
		{/each}
	</div>
</div>

<!-- MOBILE FILTER DRAWER MODAL -->
{#if isMobileFilterDrawerOpen}
	<div 
		role="dialog" 
		aria-modal="true"
		tabindex="-1"
		onclick={(e) => { if (e.target === e.currentTarget) isMobileFilterDrawerOpen = false; }}
		onkeydown={(e) => { if (e.key === 'Escape') isMobileFilterDrawerOpen = false; }}
		class="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity duration-300 cursor-pointer"
	>
		<div class="w-full max-w-sm bg-base-100 h-full flex flex-col shadow-2xl border-l border-base-300 text-base-content">
			<!-- Drawer Header -->
			<div class="p-4 border-b border-base-300 flex items-center justify-between bg-base-200/50">
				<div class="flex items-center gap-2">
					<SlidersHorizontal class="w-5 h-5 text-primary" />
					<h3 class="font-display font-extrabold text-base text-base-content">Filter Pieces</h3>
				</div>
				<button
					type="button"
					onclick={() => isMobileFilterDrawerOpen = false}
					class="btn btn-ghost btn-xs btn-square cursor-pointer"
					aria-label="Close filter drawer"
				>
					<X class="w-5 h-5" />
				</button>
			</div>

			<!-- Drawer Form Controls -->
			<div class="p-4 space-y-4 flex-1 overflow-y-auto touch-pan-y">
				<!-- Search -->
				<div class="space-y-1.5">
					<label for="drawer-search-input" class="block text-xs font-extrabold uppercase tracking-wider text-base-content/70">Search Query</label>
					<div class="relative">
						<Search class="w-4 h-4 text-base-content/50 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
						<input
							id="drawer-search-input"
							type="text"
							bind:value={filterSearchQuery}
							placeholder="Search titles, notes, clay..."
							class="input input-sm input-bordered w-full pl-9 pr-8 bg-base-100 text-base-content"
						/>
						{#if filterSearchQuery}
							<button
								type="button"
								onclick={() => filterSearchQuery = ''}
								class="absolute right-2.5 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content cursor-pointer"
							>
								<X class="w-4 h-4" />
							</button>
						{/if}
					</div>
				</div>

				<!-- Form Type -->
				<div class="space-y-1.5">
					<label for="drawer-form-type" class="block text-xs font-extrabold uppercase tracking-wider text-base-content/70">Form Type</label>
					<select
						id="drawer-form-type"
						bind:value={filterFormType}
						class="select select-sm select-bordered w-full bg-base-100 text-base-content cursor-pointer"
					>
						<option value="all">All Form Types</option>
						{#each availablePieceTypes as typeName}
							<option value={typeName}>{typeName}</option>
						{/each}
					</select>
				</div>

				<!-- Clay Body -->
				<div class="space-y-1.5">
					<label for="drawer-clay-body" class="block text-xs font-extrabold uppercase tracking-wider text-base-content/70">Clay Body</label>
					<select
						id="drawer-clay-body"
						bind:value={filterClayBody}
						class="select select-sm select-bordered w-full bg-base-100 text-base-content cursor-pointer"
					>
						<option value="all">All Clay Bodies</option>
						{#each availableClayBodies as clayName}
							<option value={clayName}>{clayName}</option>
						{/each}
					</select>
				</div>

				<!-- Glaze -->
				<div class="space-y-1.5">
					<label for="drawer-glaze" class="block text-xs font-extrabold uppercase tracking-wider text-base-content/70">Glaze Application</label>
					<select
						id="drawer-glaze"
						bind:value={filterGlaze}
						class="select select-sm select-bordered w-full bg-base-100 text-base-content cursor-pointer"
					>
						<option value="all">All Glazes</option>
						<option value="unglazed">Unglazed Only</option>
						{#each availableGlazes as glazeName}
							<option value={glazeName}>{glazeName}</option>
						{/each}
					</select>
				</div>

				<!-- Target Cone -->
				<div class="space-y-1.5">
					<label for="drawer-target-cone" class="block text-xs font-extrabold uppercase tracking-wider text-base-content/70">Firing Cone</label>
					<select
						id="drawer-target-cone"
						bind:value={filterTargetCone}
						class="select select-sm select-bordered w-full bg-base-100 text-base-content cursor-pointer"
					>
						<option value="all">All Cones</option>
						{#each availableCones as coneName}
							<option value={coneName}>{coneName}</option>
						{/each}
					</select>
				</div>

				<!-- Due Date -->
				<div class="space-y-1.5">
					<label for="drawer-due-date" class="block text-xs font-extrabold uppercase tracking-wider text-base-content/70">Due Date Status</label>
					<select
						id="drawer-due-date"
						bind:value={filterDueDate}
						class="select select-sm select-bordered w-full bg-base-100 text-base-content cursor-pointer"
					>
						<option value="all">All Due Dates</option>
						<option value="overdue">Late / Overdue</option>
						<option value="due_today">Due Today</option>
						<option value="less_than_1_week">Due in &lt; 1 Week</option>
						<option value="less_than_2_weeks">Due in &lt; 2 Weeks</option>
						<option value="has_due_date">Has Due Date</option>
						<option value="no_due_date">No Due Date</option>
					</select>
				</div>

				<!-- Clay Weight Range Slider & Unit Selector -->
				<div class="space-y-3 p-3.5 bg-base-200/50 rounded-xl border border-base-300">
					<div class="flex items-center justify-between">
						<label for="mobile-weight-range-min" class="block text-xs font-extrabold uppercase tracking-wider text-base-content/70">Clay Weight</label>
						<!-- Unit Selector Pills -->
						<div class="join bg-base-200 p-0.5 rounded-lg">
							{#each (['g', 'kg', 'oz', 'lbs'] as WeightUnit[]) as u}
								<button
									type="button"
									onclick={() => handleWeightUnitChange(u)}
									class="join-item btn btn-xs transition-all {draftWeightUnit === u ? 'btn-primary font-bold shadow-xs' : 'btn-ghost text-base-content/60'}"
								>
									{u}
								</button>
							{/each}
						</div>
					</div>

					<!-- Min Slider -->
					<div class="space-y-1 pt-1">
						<div class="flex items-center justify-between text-xs text-base-content/70">
							<span>Min Weight:</span>
							<span class="font-extrabold text-base-content">{draftMinWeight} {draftWeightUnit}</span>
						</div>
						<input
							id="mobile-weight-range-min"
							type="range"
							min="0"
							max={weightSliderMax}
							step={weightSliderStep}
							bind:value={draftMinWeight}
							class="range range-xs range-primary w-full cursor-pointer"
						/>
					</div>

					<!-- Max Slider -->
					<div class="space-y-1">
						<div class="flex items-center justify-between text-xs text-base-content/70">
							<span>Max Weight:</span>
							<span class="font-extrabold text-base-content">{draftMaxWeight} {draftWeightUnit}</span>
						</div>
						<input
							type="range"
							min="0"
							max={weightSliderMax}
							step={weightSliderStep}
							bind:value={draftMaxWeight}
							class="range range-xs range-primary w-full cursor-pointer"
						/>
					</div>

					<!-- Apply / Reset Weight Buttons -->
					<div class="flex items-center gap-2 pt-1.5">
						<button
							type="button"
							onclick={resetWeightFilter}
							class="btn btn-xs btn-ghost flex-1 text-base-content/60 font-semibold cursor-pointer"
						>
							Reset Weight
						</button>
						<button
							type="button"
							onclick={applyWeightFilter}
							class="btn btn-xs btn-primary flex-1 font-bold shadow-xs cursor-pointer"
						>
							Apply Weight
						</button>
					</div>
				</div>
			</div>

			<!-- Drawer Footer -->
			<div class="p-4 border-t border-base-300 bg-base-200/50 flex items-center gap-3">
				<button
					type="button"
					onclick={clearAllFilters}
					class="btn btn-sm btn-ghost flex-1 text-base-content/70 font-bold rounded-xl cursor-pointer"
				>
					Reset All
				</button>
				<button
					type="button"
					onclick={() => isMobileFilterDrawerOpen = false}
					class="btn btn-sm btn-primary flex-1 font-bold rounded-xl shadow-md cursor-pointer"
				>
					Close Drawer
				</button>
			</div>
		</div>
	</div>
{/if}
