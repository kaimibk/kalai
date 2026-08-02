<script lang="ts">
	import Copy from 'lucide-svelte/icons/copy';
	import X from 'lucide-svelte/icons/x';
	import Ruler from 'lucide-svelte/icons/ruler';
	import type { CeramicPiece, ClayBody, CeramicStage } from '$lib/types/database';
	import { PYROMETRIC_CONES } from '$lib/constants/pyrometricCones';
	import { STAGES } from '$lib/constants/stages';
	import type { WeightUnit } from '$lib/utils/dimensions';

	let {
		isOpen = $bindable(false),
		pieceToDuplicate,
		clayBodies = [],
		onConfirm
	}: {
		isOpen: boolean;
		pieceToDuplicate: CeramicPiece | null;
		clayBodies: ClayBody[];
		onConfirm: (data: {
			title: string;
			pieceType: string;
			clayBodyId: string;
			stage: CeramicStage;
			targetBisqueCone: string;
			targetGlazeCone: string;
			weightAmount: number | null;
			weightUnit: WeightUnit;
			description: string;
			quantity: number;
			copyGlazes: boolean;
			targetLength: number | null;
			targetWidth: number | null;
			targetHeight: number | null;
		}) => void;
	} = $props();

	let duplicateTitle = $state('');
	let duplicatePieceType = $state('Mug');
	let duplicateClayBodyId = $state('cb-1');
	let duplicateStage = $state<CeramicStage>('backlog');
	let duplicateTargetBisqueCone = $state('Cone 06');
	let duplicateTargetGlazeCone = $state('Cone 6');
	let duplicateWeightAmount = $state<number | null>(null);
	let duplicateWeightUnit = $state<WeightUnit>('g');
	let duplicateDescription = $state('');
	let duplicateQuantity = $state(1);
	let duplicateCopyGlazes = $state(true);
	let duplicateTargetLength = $state<number | null>(null);
	let duplicateTargetWidth = $state<number | null>(null);
	let duplicateTargetHeight = $state<number | null>(null);

	$effect(() => {
		if (pieceToDuplicate && isOpen) {
			duplicateTitle = `${pieceToDuplicate.title} (Copy)`;
			duplicatePieceType = pieceToDuplicate.piece_type || 'Mug';
			const defaultClayId = clayBodies.length > 0 ? clayBodies[0].id : '';
			duplicateClayBodyId = (pieceToDuplicate.clay_body_id && pieceToDuplicate.clay_body_id !== 'cb-1') ? pieceToDuplicate.clay_body_id : defaultClayId;
			duplicateStage = pieceToDuplicate.stage || 'backlog';
			duplicateTargetBisqueCone = pieceToDuplicate.target_bisque_cone || 'Cone 06';
			duplicateTargetGlazeCone = pieceToDuplicate.target_glaze_cone || 'Cone 6';
			duplicateWeightAmount = pieceToDuplicate.weight_grams || null;
			duplicateWeightUnit = 'g';
			duplicateDescription = pieceToDuplicate.description || '';
			duplicateQuantity = 1;
			duplicateCopyGlazes = true;
			duplicateTargetLength = pieceToDuplicate.target_length_cm || null;
			duplicateTargetWidth = pieceToDuplicate.target_width_cm || null;
			duplicateTargetHeight = pieceToDuplicate.target_height_cm || null;
		}
	});

	function handleSubmit(e: Event) {
		e.preventDefault();
		onConfirm({
			title: duplicateTitle,
			pieceType: duplicatePieceType,
			clayBodyId: duplicateClayBodyId,
			stage: duplicateStage,
			targetBisqueCone: duplicateTargetBisqueCone,
			targetGlazeCone: duplicateTargetGlazeCone,
			weightAmount: duplicateWeightAmount,
			weightUnit: duplicateWeightUnit,
			description: duplicateDescription,
			quantity: duplicateQuantity,
			copyGlazes: duplicateCopyGlazes,
			targetLength: duplicateTargetLength,
			targetWidth: duplicateTargetWidth,
			targetHeight: duplicateTargetHeight
		});
		isOpen = false;
	}
</script>

{#if isOpen && pieceToDuplicate}
	<div 
		role="dialog" 
		aria-modal="true"
		tabindex="-1"
		onclick={(e) => { if (e.target === e.currentTarget) isOpen = false; }}
		onkeydown={(e) => { if (e.key === 'Escape') isOpen = false; }}
		class="modal modal-open"
	>
		<div class="modal-box max-w-lg bg-base-100 text-base-content border border-base-300 shadow-2xl p-6 rounded-2xl space-y-5 max-h-[90vh] overflow-y-auto">
			<div class="flex items-center justify-between border-b border-base-300 pb-4">
				<div class="flex items-center gap-2">
					<Copy class="w-5 h-5 text-primary" />
					<div>
						<h3 class="font-display font-bold text-lg text-base-content">Duplicate Ceramic Piece</h3>
						<p class="text-xs text-base-content/70">Review & edit details before creating copy</p>
					</div>
				</div>
				<button onclick={() => isOpen = false} class="btn btn-sm btn-circle btn-ghost">
					<X class="w-4 h-4" />
				</button>
			</div>

			<form onsubmit={handleSubmit} class="space-y-4 text-xs">
				<!-- SECTION 1: CORE PIECE DETAILS (DEFAULT OPEN) -->
				<div class="space-y-3 p-3 bg-base-200/70 rounded-xl border border-base-300">
					<div class="flex items-center justify-between">
						<span class="font-bold text-xs text-base-content flex items-center gap-1.5">
							<Copy class="w-4 h-4 text-primary" />
							<span>Core Details</span>
						</span>
						<span class="badge badge-primary badge-xs font-bold uppercase">Required</span>
					</div>

					<div class="space-y-1.5">
						<label for="dup-title" class="text-base-content font-semibold">New Piece Title</label>
						<input 
							id="dup-title"
							type="text" 
							bind:value={duplicateTitle}
							required
							placeholder="e.g. Ribbed Matcha Bowl (Copy)"
							class="input input-bordered input-sm w-full font-semibold"
						/>
					</div>

					<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<div class="space-y-1.5">
							<label for="dup-type" class="text-base-content font-semibold">Form / Piece Type</label>
							<select 
								id="dup-type"
								bind:value={duplicatePieceType}
								class="select select-bordered select-sm w-full"
							>
								<option value="Mug">Mug</option>
								<option value="Bowl">Bowl</option>
								<option value="Vase">Vase</option>
								<option value="Plate">Plate</option>
								<option value="Pitcher">Pitcher</option>
								<option value="Planter">Planter</option>
								<option value="Teapot">Teapot</option>
								<option value="Sculpture">Sculpture</option>
								<option value="Custom">Custom Form</option>
							</select>
						</div>

						<div class="space-y-1.5">
							<label for="dup-clay" class="text-base-content font-semibold">Clay Body</label>
							<select 
								id="dup-clay"
								bind:value={duplicateClayBodyId}
								class="select select-bordered select-sm w-full"
							>
								{#each clayBodies as cb}
									<option value={cb.id}>{cb.name} ({cb.manufacturer || 'Studio'})</option>
								{/each}
							</select>
						</div>
					</div>

					<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<div class="space-y-1.5">
							<label for="dup-stage" class="text-base-content font-semibold">Starting Stage</label>
							<select 
								id="dup-stage"
								bind:value={duplicateStage}
								class="select select-bordered select-sm w-full"
							>
								{#each STAGES as s}
									<option value={s.id}>{s.icon} {s.label}</option>
								{/each}
							</select>
						</div>

						<div class="space-y-1.5">
							<label for="dup-quantity" class="text-base-content font-semibold">Quantity to Create</label>
							<input 
								id="dup-quantity"
								type="number" 
								min="1"
								max="50"
								bind:value={duplicateQuantity}
								class="input input-bordered input-sm w-full"
							/>
						</div>
					</div>

					{#if pieceToDuplicate.glaze_layers && pieceToDuplicate.glaze_layers.length > 0}
						<div class="flex items-center gap-2 pt-1">
							<input 
								id="dup-copy-glazes"
								type="checkbox"
								bind:checked={duplicateCopyGlazes}
								class="checkbox checkbox-primary checkbox-sm"
							/>
							<label for="dup-copy-glazes" class="text-base-content font-medium cursor-pointer">
								Copy {pieceToDuplicate.glaze_layers.length} tagged glaze layer(s) to new piece
							</label>
						</div>
					{/if}
				</div>

				<!-- SECTION 2: FIRING TARGETS & CONES (DEFAULT COLLAPSED) -->
				<details class="collapse collapse-arrow border border-base-300 bg-base-200/50 rounded-xl">
					<summary class="collapse-title font-bold text-xs text-base-content py-2 min-h-0 flex items-center justify-between">
						<span>Firing Cones</span>
						<span class="badge badge-ghost border border-base-300 text-[10px] font-mono mr-5">
							{duplicateTargetBisqueCone} / {duplicateTargetGlazeCone}
						</span>
					</summary>
					<div class="collapse-content pt-1 pb-3">
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<div class="space-y-1.5">
								<label for="dup-bisque" class="text-base-content font-semibold">Target Bisque Cone</label>
								<select 
									id="dup-bisque"
									bind:value={duplicateTargetBisqueCone}
									class="select select-bordered select-sm w-full"
								>
									{#each PYROMETRIC_CONES as c}
										<option value={c.name}>{c.name} ({c.temp_c}°C / {c.temp_f}°F)</option>
									{/each}
								</select>
							</div>

							<div class="space-y-1.5">
								<label for="dup-glaze-cone" class="text-base-content font-semibold">Target Glaze Cone</label>
								<select 
									id="dup-glaze-cone"
									bind:value={duplicateTargetGlazeCone}
									class="select select-bordered select-sm w-full"
								>
									{#each PYROMETRIC_CONES as c}
										<option value={c.name}>{c.name} ({c.temp_c}°C / {c.temp_f}°F)</option>
									{/each}
								</select>
							</div>
						</div>
					</div>
				</details>

				<!-- SECTION 3: DIMENSIONS, WEIGHT & NOTES (DEFAULT COLLAPSED) -->
				<details class="collapse collapse-arrow border border-base-300 bg-base-200/50 rounded-xl">
					<summary class="collapse-title font-bold text-xs text-base-content py-2 min-h-0 flex items-center justify-between">
						<span class="flex items-center gap-1.5">
							<Ruler class="w-3.5 h-3.5 text-primary" />
							<span>Dimensions & Notes</span>
						</span>
						<span class="text-[10px] text-base-content/60 italic mr-5">Dimensions, Weight, Notes</span>
					</summary>
					<div class="collapse-content pt-1 pb-3 space-y-3">
						<div class="space-y-1.5">
							<label for="dup-weight" class="text-base-content font-semibold">Clay Weight</label>
							<div class="flex items-center gap-2">
								<input 
									id="dup-weight"
									type="number" 
									step="any"
									bind:value={duplicateWeightAmount}
									placeholder="e.g. 450"
									class="input input-bordered input-sm flex-1"
								/>
								<select 
									bind:value={duplicateWeightUnit}
									class="select select-bordered select-sm font-bold"
								>
									<option value="g">grams (g)</option>
									<option value="oz">ounces (oz)</option>
									<option value="lbs">pounds (lbs)</option>
								</select>
							</div>
						</div>

						<div class="space-y-2 p-3 bg-base-100 rounded-xl border border-base-300">
							<label class="text-base-content font-bold flex items-center gap-1.5">
								<Ruler class="w-3.5 h-3.5 text-primary" />
								<span>Goal Dimensions (Final Fired Size in cm)</span>
							</label>
							<div class="grid grid-cols-3 gap-2">
								<div class="space-y-1">
									<label for="dup-target-len" class="text-[10px] text-base-content/70 font-medium">Length (cm)</label>
									<input 
										id="dup-target-len"
										type="number" 
										step="0.1" 
										min="0"
										bind:value={duplicateTargetLength}
										placeholder="e.g. 10.0" 
										class="input input-bordered input-sm w-full"
									/>
								</div>
								<div class="space-y-1">
									<label for="dup-target-wid" class="text-[10px] text-base-content/70 font-medium">Width (cm)</label>
									<input 
										id="dup-target-wid"
										type="number" 
										step="0.1" 
										min="0"
										bind:value={duplicateTargetWidth}
										placeholder="e.g. 10.0" 
										class="input input-bordered input-sm w-full"
									/>
								</div>
								<div class="space-y-1">
									<label for="dup-target-hgt" class="text-[10px] text-base-content/70 font-medium">Height (cm)</label>
									<input 
										id="dup-target-hgt"
										type="number" 
										step="0.1" 
										min="0"
										bind:value={duplicateTargetHeight}
										placeholder="e.g. 12.5" 
										class="input input-bordered input-sm w-full"
									/>
								</div>
							</div>
						</div>

						<div class="space-y-1.5">
							<label for="dup-desc" class="text-base-content font-semibold">Description / Artistic Notes</label>
							<textarea 
								id="dup-desc"
								bind:value={duplicateDescription}
								rows="2"
								placeholder="Add notes..."
								class="textarea textarea-bordered textarea-sm w-full"
							></textarea>
						</div>
					</div>
				</details>

				<div class="modal-action border-t border-base-300 pt-4 flex justify-end gap-2">
					<button 
						type="button"
						onclick={() => isOpen = false}
						class="btn btn-ghost btn-sm"
					>
						Cancel
					</button>
					<button 
						type="submit"
						class="btn btn-primary btn-sm font-bold shadow"
					>
						{duplicateQuantity > 1 ? `Create Batch (${duplicateQuantity} pcs)` : 'Create Duplicate Piece'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
