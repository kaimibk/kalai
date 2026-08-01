<script lang="ts">
	import Package from 'lucide-svelte/icons/package';
	import Layers2 from 'lucide-svelte/icons/layers-2';
	import Ruler from 'lucide-svelte/icons/ruler';
	import Sparkles from 'lucide-svelte/icons/sparkles';
	import Calendar from 'lucide-svelte/icons/calendar';
	import X from 'lucide-svelte/icons/x';
	import type { CeramicPiece, ClayBody, CeramicStage } from '$lib/types/database';
	import { PYROMETRIC_CONES } from '$lib/constants/pyrometricCones';
	import { PIECE_TYPES } from '$lib/constants/manufacturers';
	import { toGrams, formatClayWeight, calculateFormedDimension, type WeightUnit } from '$lib/utils/dimensions';
	import CallyDatePicker from '$lib/components/CallyDatePicker.svelte';

	let {
		isOpen = $bindable(false),
		clayBodies = [],
		onCreatePiece,
		onManageClay
	}: {
		isOpen: boolean;
		clayBodies: ClayBody[];
		onCreatePiece: (pieceData: {
			title: string;
			quantity: number;
			batchTitle: string;
			pieceType: string;
			clayBodyId: string;
			targetBisqueCone: string;
			targetGlazeCone: string;
			weightAmount: number | null;
			weightUnit: WeightUnit;
			description: string;
			initialPhotoUrl: string;
			dueDate: string;
			targetLength: number | null;
			targetWidth: number | null;
			targetHeight: number | null;
		}) => void;
		onManageClay: () => void;
	} = $props();

	let newTitle = $state('');
	let newDescription = $state('');
	let newPieceType = $state('Mug');
	let newClayBodyId = $state('cb-1');
	let newTargetBisqueCone = $state('Cone 06');
	let newTargetGlazeCone = $state('Cone 6');
	let newWeightAmount = $state<number | null>(null);
	let newWeightUnit = $state<WeightUnit>('g');
	let newInitialPhotoUrl = $state('');
	let newDueDate = $state('');
	let newQuantity = $state(1);
	let newBatchTitle = $state('');
	let newTargetLength = $state<number | null>(null);
	let newTargetWidth = $state<number | null>(null);
	let newTargetHeight = $state<number | null>(null);

	let selectedClayForNewPiece = $derived(clayBodies.find(c => c.id === newClayBodyId));

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (!newTitle.trim()) return;

		onCreatePiece({
			title: newTitle.trim(),
			quantity: newQuantity,
			batchTitle: newBatchTitle.trim(),
			pieceType: newPieceType,
			clayBodyId: newClayBodyId,
			targetBisqueCone: newTargetBisqueCone,
			targetGlazeCone: newTargetGlazeCone,
			weightAmount: newWeightAmount,
			weightUnit: newWeightUnit,
			description: newDescription.trim(),
			initialPhotoUrl: newInitialPhotoUrl.trim(),
			dueDate: newDueDate,
			targetLength: newTargetLength,
			targetWidth: newTargetWidth,
			targetHeight: newTargetHeight
		});

		newTitle = '';
		newDescription = '';
		newQuantity = 1;
		newBatchTitle = '';
		newWeightAmount = null;
		newInitialPhotoUrl = '';
		newDueDate = '';
		newTargetLength = null;
		newTargetWidth = null;
		newTargetHeight = null;
		isOpen = false;
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
		<div class="modal-box max-w-lg bg-base-100 text-base-content border border-base-300 shadow-2xl p-6 rounded-2xl">
			<div class="flex items-center justify-between border-b border-base-300 pb-4">
				<div class="flex items-center gap-2">
					<Package class="w-5 h-5 text-primary" />
					<h3 class="font-display font-bold text-lg text-base-content">New Ceramic Piece</h3>
				</div>
				<button onclick={() => isOpen = false} class="btn btn-sm btn-circle btn-ghost">
					<X class="w-4 h-4" />
				</button>
			</div>

			<form onsubmit={handleSubmit} class="space-y-4 text-xs mt-4">
				<div class="space-y-1.5">
					<label for="piece-title" class="text-base-content font-semibold">Piece Title</label>
					<input 
						id="piece-title"
						type="text" 
						bind:value={newTitle}
						placeholder="e.g. Fluted Amaco PC Mug, Handbuilt Ikebana Bowl" 
						class="input input-bordered input-sm w-full"
						required
					/>
				</div>

				<!-- MULTI-PIECE BATCH CREATION INPUTS -->
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-base-200 p-3 rounded-xl border border-base-300">
					<div class="space-y-1.5">
						<label for="piece-qty" class="text-base-content font-bold flex items-center gap-1">
							<Layers2 class="w-3.5 h-3.5 text-primary" />
							<span>Quantity (Duplicate Pieces)</span>
						</label>
						<input 
							id="piece-qty"
							type="number" 
							min="1"
							max="50"
							bind:value={newQuantity}
							class="input input-bordered input-sm w-full font-bold"
						/>
					</div>

					{#if newQuantity > 1}
						<div class="space-y-1.5">
							<label for="batch-title-input" class="text-base-content font-bold">Batch Title (Optional)</label>
							<input 
								id="batch-title-input"
								type="text" 
								bind:value={newBatchTitle}
								placeholder="e.g. 6x Espresso Mug Batch"
								class="input input-bordered input-sm w-full"
							/>
						</div>
					{/if}
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<div class="space-y-1.5 min-w-0">
						<label for="piece-type" class="text-base-content font-semibold block">Form Type</label>
						<select 
							id="piece-type"
							bind:value={newPieceType}
							class="select select-bordered select-sm w-full truncate"
						>
							{#each PIECE_TYPES as pt}
								<option value={pt.name}>{pt.name} ({pt.description})</option>
							{/each}
						</select>
					</div>

					<div class="space-y-1.5 min-w-0">
						<label for="target-glaze-cone-select" class="text-base-content font-semibold block">Target Glaze Cone</label>
						<select 
							id="target-glaze-cone-select"
							bind:value={newTargetGlazeCone}
							class="select select-bordered select-sm w-full truncate"
						>
							{#each PYROMETRIC_CONES as cone}
								<option value={cone.name}>
									{cone.name} ({cone.temp_f}°F / {cone.temp_c}°C)
								</option>
							{/each}
						</select>
					</div>
				</div>

				<div class="space-y-1.5 min-w-0">
					<div class="flex items-center justify-between flex-wrap gap-1">
						<label for="clay-select" class="text-base-content font-semibold">Clay Body</label>
						<button type="button" onclick={onManageClay} class="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1">
							<Package class="w-3 h-3" />
							<span>Manage Clay Bodies</span>
						</button>
					</div>
					<select 
						id="clay-select"
						bind:value={newClayBodyId}
						class="select select-bordered select-sm w-full truncate"
					>
						{#each clayBodies as clay}
							<option value={clay.id}>
								{clay.is_global ? '🌐 [Global]' : '👤 [Custom]'} {clay.name} ({clay.firing_range})
							</option>
						{/each}
					</select>
				</div>

				<!-- DESIRED GOAL DIMENSIONS & SHRINKAGE PREVIEW -->
				<div class="space-y-2 p-3 bg-base-200 rounded-xl border border-base-300">
					<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
						<label class="text-base-content font-bold flex items-center gap-1.5 text-xs min-w-0">
							<Ruler class="w-3.5 h-3.5 text-primary flex-shrink-0" />
							<span class="truncate sm:whitespace-normal">Desired Goal Dimensions (Final Fired Size in cm)</span>
						</label>
						{#if selectedClayForNewPiece}
							<span class="badge badge-primary badge-outline badge-sm self-start sm:self-auto flex-shrink-0">
								Shrinkage: {selectedClayForNewPiece.shrinkage_pct}%
							</span>
						{/if}
					</div>

					<div class="grid grid-cols-3 gap-2">
						<div class="space-y-1">
							<label for="piece-target-length" class="text-[10px] text-base-content/70 font-medium">Goal Length (cm)</label>
							<input 
								id="piece-target-length"
								type="number" 
								step="0.1" 
								min="0"
								bind:value={newTargetLength}
								placeholder="e.g. 10.0" 
								class="input input-bordered input-sm w-full"
							/>
						</div>
						<div class="space-y-1">
							<label for="piece-target-width" class="text-[10px] text-base-content/70 font-medium">Goal Width (cm)</label>
							<input 
								id="piece-target-width"
								type="number" 
								step="0.1" 
								min="0"
								bind:value={newTargetWidth}
								placeholder="e.g. 10.0" 
								class="input input-bordered input-sm w-full"
							/>
						</div>
						<div class="space-y-1">
							<label for="piece-target-height" class="text-[10px] text-base-content/70 font-medium">Goal Height (cm)</label>
							<input 
								id="piece-target-height"
								type="number" 
								step="0.1" 
								min="0"
								bind:value={newTargetHeight}
								placeholder="e.g. 12.5" 
								class="input input-bordered input-sm w-full"
							/>
						</div>
					</div>

					{#if newTargetLength || newTargetWidth || newTargetHeight}
						{@const shrinkPct = selectedClayForNewPiece ? selectedClayForNewPiece.shrinkage_pct : 12.0}
						{@const fLen = calculateFormedDimension(newTargetLength, shrinkPct)}
						{@const fWid = calculateFormedDimension(newTargetWidth, shrinkPct)}
						{@const fHgt = calculateFormedDimension(newTargetHeight, shrinkPct)}
						<div class="mt-2 p-2.5 rounded-lg bg-success/10 border border-success/30 text-xs space-y-1">
							<div class="flex flex-col sm:flex-row sm:items-center justify-between font-bold text-success gap-1">
								<span class="flex items-center gap-1">
									<Sparkles class="w-3.5 h-3.5 flex-shrink-0" />
									<span>Recommended Pre-Fire Build Target:</span>
								</span>
								<span class="badge badge-success badge-sm font-extrabold uppercase self-start sm:self-auto flex-shrink-0">
									+{((1 / (1 - shrinkPct/100) - 1) * 100).toFixed(1)}% Pre-Fire Target
								</span>
							</div>
							<div class="font-mono text-xs font-extrabold text-base-content">
								{#if fLen}<span>L: <strong class="text-primary">{fLen} cm</strong></span>{/if}
								{#if fLen && (fWid || fHgt)}<span class="text-base-content/40"> × </span>{/if}
								{#if fWid}<span>W: <strong class="text-primary">{fWid} cm</strong></span>{/if}
								{#if fWid && fHgt}<span class="text-base-content/40"> × </span>{/if}
								{#if fHgt}<span>H: <strong class="text-primary">{fHgt} cm</strong></span>{/if}
							</div>
							<p class="text-[10px] text-base-content/70 italic">
								Form/trim clay to these pre-fire dimensions so it shrinks to your goal size after {shrinkPct}% {selectedClayForNewPiece ? selectedClayForNewPiece.name : 'clay'} shrinkage.
							</p>
						</div>
					{/if}
				</div>

				<div class="space-y-1.5">
					<label for="piece-weight-amount" class="text-base-content font-semibold">Clay Weight Used (Formed Weight)</label>
					<div class="flex gap-2">
						<input 
							id="piece-weight-amount"
							type="number" 
							step="any"
							min="0"
							bind:value={newWeightAmount}
							placeholder="e.g. 550 or 1.5..." 
							class="input input-bordered input-sm flex-1"
						/>
						<select 
							bind:value={newWeightUnit}
							class="select select-bordered select-sm w-28"
						>
							<option value="g">grams (g)</option>
							<option value="kg">kilograms (kg)</option>
							<option value="lbs">pounds (lbs)</option>
							<option value="oz">ounces (oz)</option>
						</select>
					</div>
					{#if newWeightAmount && newWeightAmount > 0}
						<div class="text-[11px] font-semibold text-success">
							≈ {formatClayWeight(toGrams(newWeightAmount, newWeightUnit))}
						</div>
					{/if}
				</div>

				<div class="space-y-1.5">
					<span class="text-base-content font-semibold flex items-center gap-1.5 text-xs">
						<Calendar class="w-3.5 h-3.5 text-primary" />
						<span>Target Due Date (Optional)</span>
					</span>
					<CallyDatePicker
						bind:value={newDueDate}
						placeholder="Select due date..."
					/>
				</div>

				<div class="space-y-1.5">
					<label for="piece-notes-input" class="text-base-content font-semibold">Notes / Description (Optional)</label>
					<textarea 
						id="piece-notes-input"
						bind:value={newDescription}
						rows="2"
						placeholder="e.g. Fluted lip design, gift for Sarah, test glaze pairing..." 
						class="textarea textarea-bordered textarea-sm w-full"
					></textarea>
				</div>

				<div class="space-y-1.5">
					<label for="photo-url" class="text-base-content font-semibold">Initial Photo URL (Optional)</label>
					<input 
						id="photo-url"
						type="url" 
						bind:value={newInitialPhotoUrl}
						placeholder="https://..." 
						class="input input-bordered input-sm w-full"
					/>
				</div>

				<div class="modal-action border-t border-base-300 pt-4">
					<button 
						type="button" 
						onclick={() => isOpen = false}
						class="btn btn-ghost btn-sm"
					>
						Cancel
					</button>
					<button 
						type="submit" 
						class="btn btn-primary btn-sm font-bold shadow-md"
					>
						Create Piece
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
