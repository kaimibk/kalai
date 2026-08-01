<script lang="ts">
	import Droplets from 'lucide-svelte/icons/droplets';
	import Clock from 'lucide-svelte/icons/clock';
	import Sparkles from 'lucide-svelte/icons/sparkles';
	import AlertTriangle from 'lucide-svelte/icons/alert-triangle';
	import X from 'lucide-svelte/icons/x';
	import Camera from 'lucide-svelte/icons/camera';
	import Layers2 from 'lucide-svelte/icons/layers-2';
	import Trash2 from 'lucide-svelte/icons/trash-2';
	import RotateCcw from 'lucide-svelte/icons/rotate-ccw';
	import Palette from 'lucide-svelte/icons/palette';
	import FileText from 'lucide-svelte/icons/file-text';
	import Ruler from 'lucide-svelte/icons/ruler';
	import Plus from 'lucide-svelte/icons/plus';

	import type { CeramicPiece, ClayBody, GlazeRecipe, GlazeStyle, GlazeLocation, PieceGlazeLayer } from '$lib/types/database';
	import { PYROMETRIC_CONES } from '$lib/constants/pyrometricCones';
	import { MANUFACTURERS } from '$lib/constants/manufacturers';
	import { GLAZE_LOCATIONS } from '$lib/constants/glazeLocations';
	import { formatDateShort, formatDateInput, parseDateInput } from '$lib/utils/date';
	import { formatClayWeight, toGrams, calculateFormedDimension, calculateFiredDimension, type WeightUnit } from '$lib/utils/dimensions';
	import CallyDatePicker from '$lib/components/CallyDatePicker.svelte';

	function isDimensionsRelevant(stage?: string) {
		if (!stage) return true;
		return ['formed', 'leather_hard', 'trimmed', 'pending_bisque', 'bisqued', 'done'].includes(stage);
	}

	function isGlazeRelevant(stage?: string) {
		if (!stage) return true;
		return ['pending_bisque', 'bisqued', 'glazed'].includes(stage);
	}

	function isNotesRelevant(stage?: string, notes?: string | null, desc?: string | null) {
		if (!stage) return true;
		return stage === 'backlog' || Boolean(notes && notes.trim()) || Boolean(desc && desc.trim());
	}

	let {
		selectedPiece = $bindable(null),
		pieces = [],
		clayBodies = [],
		glazes = [],
		onUpdatePiece,
		onRestoreFailedPiece,
		onShowToast
	}: {
		selectedPiece: CeramicPiece | null;
		pieces: CeramicPiece[];
		clayBodies: ClayBody[];
		glazes: GlazeRecipe[];
		onUpdatePiece: (piece: CeramicPiece, updateBatchGlaze?: { removeIndex?: number; addLayer?: PieceGlazeLayer }) => void;
		onRestoreFailedPiece: (pieceId: string) => void;
		onShowToast: (msg: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
	} = $props();

	let selectedPieceClay = $derived(selectedPiece ? clayBodies.find(c => c.id === selectedPiece?.clay_body_id || c.name === selectedPiece?.clay_body_name) : null);
	let selectedPieceShrinkPct = $derived(selectedPieceClay ? selectedPieceClay.shrinkage_pct : 12.0);

	let currentGlazeSig = $derived(selectedPiece && selectedPiece.glaze_layers ? selectedPiece.glaze_layers.map(g => g.glaze_name).sort().join('|') : '');
	let activeBatchCount = $derived(selectedPiece && selectedPiece.batch_id ? pieces.filter(p => p.batch_id === selectedPiece!.batch_id && p.stage === selectedPiece!.stage && p.is_failed === selectedPiece!.is_failed && ((p.glaze_layers ? p.glaze_layers.map(g => g.glaze_name).sort().join('|') : '') === currentGlazeSig)).length : 1);

	// Dimension editing state
	let editingDimensionMode = $state<'none' | 'goal' | 'actual_formed' | 'actual_fired'>('none');
	let editingTargetLength = $state<number | null>(null);
	let editingTargetWidth = $state<number | null>(null);
	let editingTargetHeight = $state<number | null>(null);
	let editingActualFormedLength = $state<number | null>(null);
	let editingActualFormedWidth = $state<number | null>(null);
	let editingActualFormedHeight = $state<number | null>(null);
	let editingActualFiredLength = $state<number | null>(null);
	let editingActualFiredWidth = $state<number | null>(null);
	let editingActualFiredHeight = $state<number | null>(null);

	// Notes editing state
	let editingPieceNotes = $state('');
	let isEditingNotes = $state(false);

	// Glaze Tagging Form State
	let selectedGlazeOption = $state<string>('glz-1');
	let tagGlazeName = $state('PC-20 Blue Rutile');
	let tagGlazeManufacturer = $state('Amaco');
	let tagGlazeMethod = $state<GlazeStyle>('brush');
	let tagGlazeCoats = $state(3);
	let tagGlazeLocation = $state<GlazeLocation>('entire');

	// Stage Log Add State
	let newLogNote = $state('');
	let newLogPhoto = $state('');
	let newLogWeightAmount = $state<number | null>(null);
	let newLogWeightUnit = $state<WeightUnit>('g');

	function startEditGoalDimensions() {
		if (!selectedPiece) return;
		editingTargetLength = selectedPiece.target_length_cm || null;
		editingTargetWidth = selectedPiece.target_width_cm || null;
		editingTargetHeight = selectedPiece.target_height_cm || null;
		editingDimensionMode = 'goal';
	}

	function startEditActualFormedDimensions() {
		if (!selectedPiece) return;
		editingActualFormedLength = selectedPiece.actual_formed_length_cm || null;
		editingActualFormedWidth = selectedPiece.actual_formed_width_cm || null;
		editingActualFormedHeight = selectedPiece.actual_formed_height_cm || null;
		editingDimensionMode = 'actual_formed';
	}

	function startEditActualFiredDimensions() {
		if (!selectedPiece) return;
		editingActualFiredLength = selectedPiece.actual_fired_length_cm || null;
		editingActualFiredWidth = selectedPiece.actual_fired_width_cm || null;
		editingActualFiredHeight = selectedPiece.actual_fired_height_cm || null;
		editingDimensionMode = 'actual_fired';
	}

	function saveGoalDimensions() {
		if (!selectedPiece) return;
		const shrinkPct = selectedPieceShrinkPct;
		const tLen = editingTargetLength && editingTargetLength > 0 ? editingTargetLength : null;
		const tWid = editingTargetWidth && editingTargetWidth > 0 ? editingTargetWidth : null;
		const tHgt = editingTargetHeight && editingTargetHeight > 0 ? editingTargetHeight : null;

		const fLen = calculateFormedDimension(tLen, shrinkPct);
		const fWid = calculateFormedDimension(tWid, shrinkPct);
		const fHgt = calculateFormedDimension(tHgt, shrinkPct);

		const updated: CeramicPiece = {
			...selectedPiece,
			target_length_cm: tLen,
			target_width_cm: tWid,
			target_height_cm: tHgt,
			formed_length_cm: fLen,
			formed_width_cm: fWid,
			formed_height_cm: fHgt,
			updated_at: new Date()
		};

		selectedPiece = updated;
		onUpdatePiece(updated);
		editingDimensionMode = 'none';
		onShowToast(`Updated goal dimensions & recalculated pre-fire target!`);
	}

	function saveActualFormedDimensions() {
		if (!selectedPiece) return;
		const afLen = editingActualFormedLength && editingActualFormedLength > 0 ? editingActualFormedLength : null;
		const afWid = editingActualFormedWidth && editingActualFormedWidth > 0 ? editingActualFormedWidth : null;
		const afHgt = editingActualFormedHeight && editingActualFormedHeight > 0 ? editingActualFormedHeight : null;

		const updated: CeramicPiece = {
			...selectedPiece,
			actual_formed_length_cm: afLen,
			actual_formed_width_cm: afWid,
			actual_formed_height_cm: afHgt,
			width_cm: afWid || selectedPiece.formed_width_cm || selectedPiece.width_cm,
			height_cm: afHgt || selectedPiece.formed_height_cm || selectedPiece.height_cm,
			length_cm: afLen || selectedPiece.formed_length_cm || selectedPiece.length_cm,
			updated_at: new Date()
		};

		selectedPiece = updated;
		onUpdatePiece(updated);
		editingDimensionMode = 'none';
		onShowToast(`Saved actual measured pre-fire dimensions!`);
	}

	function saveActualFiredDimensions() {
		if (!selectedPiece) return;
		const afiLen = editingActualFiredLength && editingActualFiredLength > 0 ? editingActualFiredLength : null;
		const afiWid = editingActualFiredWidth && editingActualFiredWidth > 0 ? editingActualFiredWidth : null;
		const afiHgt = editingActualFiredHeight && editingActualFiredHeight > 0 ? editingActualFiredHeight : null;

		const updated: CeramicPiece = {
			...selectedPiece,
			actual_fired_length_cm: afiLen,
			actual_fired_width_cm: afiWid,
			actual_fired_height_cm: afiHgt,
			width_cm: afiWid || selectedPiece.actual_formed_width_cm || selectedPiece.formed_width_cm || selectedPiece.width_cm,
			height_cm: afiHgt || selectedPiece.actual_formed_height_cm || selectedPiece.formed_height_cm || selectedPiece.height_cm,
			length_cm: afiLen || selectedPiece.actual_formed_length_cm || selectedPiece.formed_length_cm || selectedPiece.length_cm,
			updated_at: new Date()
		};

		selectedPiece = updated;
		onUpdatePiece(updated);
		editingDimensionMode = 'none';
		onShowToast(`Saved actual measured final fired dimensions!`);
	}

	function savePieceNotes() {
		if (!selectedPiece) return;
		const updated: CeramicPiece = {
			...selectedPiece,
			notes: editingPieceNotes.trim() || null,
			updated_at: new Date()
		};
		selectedPiece = updated;
		onUpdatePiece(updated);
		isEditingNotes = false;
		onShowToast('Saved piece notes!');
	}

	function handleGlazeSelectionChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		const val = target.value;
		selectedGlazeOption = val;
		if (val !== 'custom') {
			const preset = glazes.find(g => g.id === val);
			if (preset) {
				tagGlazeName = preset.name;
				tagGlazeManufacturer = preset.manufacturer;
				tagGlazeMethod = preset.default_style;
			}
		}
	}

	function addGlazeTagToPiece() {
		if (!selectedPiece || !tagGlazeName.trim()) return;

		const newLayer: PieceGlazeLayer = {
			id: `gl-${Date.now()}`,
			piece_id: selectedPiece.id,
			glaze_name: tagGlazeName.trim(),
			manufacturer: tagGlazeManufacturer,
			layer_order: (selectedPiece.glaze_layers?.length || 0) + 1,
			coat_count: Number(tagGlazeCoats) || 1,
			application_method: tagGlazeMethod,
			location: tagGlazeLocation,
			created_at: new Date()
		};

		const updatedLayers = [...(selectedPiece.glaze_layers || []), newLayer];
		const updatedPiece = { ...selectedPiece, glaze_layers: updatedLayers, updated_at: new Date() };

		selectedPiece = updatedPiece;
		onUpdatePiece(updatedPiece, { addLayer: newLayer });
		onShowToast(`Tagged glaze "${tagGlazeName}" to piece!`);
	}

	function removeGlazeLayer(index: number) {
		if (!selectedPiece || !selectedPiece.glaze_layers) return;
		const updatedLayers = selectedPiece.glaze_layers.filter((_, i) => i !== index);
		const updatedPiece = { ...selectedPiece, glaze_layers: updatedLayers, updated_at: new Date() };

		selectedPiece = updatedPiece;
		onUpdatePiece(updatedPiece, { removeIndex: index });
		onShowToast('Removed glaze layer!');
	}

	function addStageLogNote() {
		if (!selectedPiece) return;
		const weightGrams = newLogWeightAmount ? toGrams(newLogWeightAmount, newLogWeightUnit) : null;
		const newLog = {
			id: `log-${Date.now()}`,
			piece_id: selectedPiece.id,
			user_id: selectedPiece.user_id,
			stage: selectedPiece.stage,
			notes: newLogNote.trim() || null,
			photo_url: newLogPhoto.trim() || null,
			weight_grams: weightGrams,
			created_at: new Date()
		};

		const updatedLogs = [newLog, ...(selectedPiece.stage_logs || [])];
		const updatedPiece = { ...selectedPiece, stage_logs: updatedLogs, updated_at: new Date() };

		selectedPiece = updatedPiece;
		onUpdatePiece(updatedPiece);

		newLogNote = '';
		newLogPhoto = '';
		newLogWeightAmount = null;
		onShowToast('Saved stage log snapshot!');
	}

	function handleBisqueConeChange(newCone: string) {
		if (!selectedPiece) return;
		const updated = { ...selectedPiece, target_bisque_cone: newCone, updated_at: new Date() };
		selectedPiece = updated;
		onUpdatePiece(updated);
		onShowToast(`Updated target bisque cone to ${newCone}`);
	}

	function handleGlazeConeChange(newCone: string) {
		if (!selectedPiece) return;
		const updated = { ...selectedPiece, target_glaze_cone: newCone, updated_at: new Date() };
		selectedPiece = updated;
		onUpdatePiece(updated);
		onShowToast(`Updated target glaze cone to ${newCone}`);
	}
</script>

{#if selectedPiece}
	<div 
		role="dialog" 
		aria-modal="true"
		tabindex="-1"
		onclick={(e) => { if (e.target === e.currentTarget) selectedPiece = null; }}
		onkeydown={(e) => { if (e.key === 'Escape') selectedPiece = null; }}
		class="modal modal-open"
	>
		<div class="modal-box max-w-2xl bg-base-100 text-base-content border border-base-300 shadow-2xl p-6 rounded-2xl max-h-[90vh] overflow-y-auto">
			<div class="flex items-start justify-between border-b border-base-300 pb-4 gap-2">
				<div class="space-y-1 min-w-0 flex-1">
					<div class="flex flex-wrap items-center gap-2">
						<h3 class="font-display font-bold text-lg sm:text-xl text-base-content break-words">{selectedPiece.title}</h3>
						<span class="badge badge-primary badge-outline badge-sm uppercase font-bold flex-shrink-0">
							Stage: {selectedPiece.stage}
						</span>
					</div>
					<div class="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-success font-semibold">
						<span>Clay: {selectedPiece.clay_body_name}</span>
						{#if selectedPiece.weight_grams}
							<span class="badge badge-xs badge-ghost border border-base-300 font-bold">
								Weight: {formatClayWeight(selectedPiece.weight_grams)}
							</span>
						{/if}
					</div>
				</div>
				<button onclick={() => selectedPiece = null} class="btn btn-sm btn-circle btn-ghost flex-shrink-0">
					<X class="w-4 h-4" />
				</button>
			</div>

			<!-- Failed Banner (if applicable) -->
			{#if selectedPiece.is_failed}
				<div class="alert alert-error my-3 text-xs flex items-center justify-between">
					<div class="flex items-center gap-2 font-semibold">
						<AlertTriangle class="w-4.5 h-4.5 flex-shrink-0" />
						<div>
							<span class="font-bold uppercase text-[10px] block">Flagged as Failed (Finished Stage):</span>
							<span class="text-sm font-bold">"{selectedPiece.failure_reason || 'Failure logged'}"</span>
							{#if selectedPiece.failure_stage}
								<span class="text-[10px] block font-normal mt-0.5 opacity-80">Failed during: {selectedPiece.failure_stage} stage</span>
							{/if}
						</div>
					</div>
					<button 
						onclick={() => {
							onRestoreFailedPiece(selectedPiece!.id);
							selectedPiece = pieces.find(p => p.id === selectedPiece!.id) || null;
						}}
						class="btn btn-sm btn-outline gap-1 font-bold"
					>
						<RotateCcw class="w-3.5 h-3.5" />
						<span>Restore to Active</span>
					</button>
				</div>
			{/if}

			<!-- Piece Dates & Lifecycle Timeline -->
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 my-3 rounded-xl bg-base-200 border border-base-300 text-xs">
				<div class="space-y-0.5">
					<span class="text-[10px] uppercase font-extrabold text-base-content/70 block tracking-wider">Date Created</span>
					<div class="flex items-center gap-1.5 font-bold text-base-content">
						<Clock class="w-3.5 h-3.5 text-base-content/50" />
						<span>{formatDateShort(selectedPiece.created_at)}</span>
					</div>
				</div>

				<div class="space-y-0.5">
					<span class="text-[10px] uppercase font-extrabold text-base-content/70 block tracking-wider">Date Started</span>
					<div class="flex items-center gap-1.5 font-bold text-success">
						<Sparkles class="w-3.5 h-3.5 text-success" />
						<span>{selectedPiece.started_at ? formatDateShort(selectedPiece.started_at) : 'In Backlog'}</span>
					</div>
				</div>

				<div class="space-y-0.5 min-w-0">
					<span class="text-[10px] uppercase font-extrabold text-base-content/70 block tracking-wider">Target Due Date</span>
					<CallyDatePicker
						align="right"
						value={formatDateInput(selectedPiece.due_date)}
						placeholder="Set due date..."
						onchange={(valStr) => {
							const parsedDate = parseDateInput(valStr);
							const updated = { ...selectedPiece!, due_date: parsedDate };
							selectedPiece = updated;
							onUpdatePiece(updated);
							onShowToast(parsedDate ? `Updated due date to ${formatDateShort(parsedDate)}` : 'Cleared due date');
						}}
					/>
				</div>
			</div>

			<!-- SECTION 1: Goal Dimensions & Clay Shrinkage Target Breakdown -->
			<div class="indicator w-full my-3">
				{#if isDimensionsRelevant(selectedPiece.stage)}
					<span class="indicator-item indicator-top indicator-start badge badge-primary h-2.5 w-2.5 min-h-0 min-w-0 p-0 rounded-full shadow-sm z-10 -translate-x-1 -translate-y-1 pointer-events-none" title="Stage Focus"></span>
				{/if}
				<details class="collapse collapse-arrow border border-base-300 bg-base-200/50 rounded-xl w-full" open={isDimensionsRelevant(selectedPiece.stage)}>
					<summary class="collapse-title font-bold text-xs text-base-content py-3 min-h-0 flex items-center justify-between pr-8">
						<div class="flex items-center gap-1.5 min-w-0">
							<Ruler class="w-4 h-4 text-primary flex-shrink-0" />
							<span class="truncate">Dimensions & Clay Shrinkage</span>
						</div>
						<span class="badge badge-ghost border border-base-300 text-[10px] font-semibold flex-shrink-0">
							Shrinkage: {selectedPieceShrinkPct}%
						</span>
					</summary>
					<div class="collapse-content pt-1 space-y-3">
						{#if editingDimensionMode === 'goal'}
							<!-- EDIT GOAL SIZE FORM -->
							<div class="space-y-3 pt-1 bg-base-100 p-3 rounded-xl border border-base-300">
								<div class="flex items-center justify-between font-bold text-warning text-xs">
									<span>🎯 Edit Desired Goal Fired Size</span>
									<span class="text-[10px] text-base-content/70 font-normal">Final size desired after firing</span>
								</div>
								<div class="grid grid-cols-3 gap-2">
									<div class="space-y-1">
										<label for="edit-target-len" class="text-[10px] font-semibold text-base-content/70">Goal Length (cm)</label>
										<input 
											id="edit-target-len"
											type="number" 
											step="0.1" 
											min="0"
											bind:value={editingTargetLength}
											placeholder="e.g. 10.0" 
											class="input input-bordered input-sm w-full"
										/>
									</div>
									<div class="space-y-1">
										<label for="edit-target-wid" class="text-[10px] font-semibold text-base-content/70">Goal Width (cm)</label>
										<input 
											id="edit-target-wid"
											type="number" 
											step="0.1" 
											min="0"
											bind:value={editingTargetWidth}
											placeholder="e.g. 10.0" 
											class="input input-bordered input-sm w-full"
										/>
									</div>
									<div class="space-y-1">
										<label for="edit-target-hgt" class="text-[10px] font-semibold text-base-content/70">Goal Height (cm)</label>
										<input 
											id="edit-target-hgt"
											type="number" 
											step="0.1" 
											min="0"
											bind:value={editingTargetHeight}
											placeholder="e.g. 12.5" 
											class="input input-bordered input-sm w-full"
										/>
									</div>
								</div>

								{#if editingTargetLength || editingTargetWidth || editingTargetHeight}
									{@const fLen = calculateFormedDimension(editingTargetLength, selectedPieceShrinkPct)}
									{@const fWid = calculateFormedDimension(editingTargetWidth, selectedPieceShrinkPct)}
									{@const fHgt = calculateFormedDimension(editingTargetHeight, selectedPieceShrinkPct)}
									<div class="p-2 rounded-lg bg-success/10 border border-success/30 text-[11px] space-y-0.5">
										<span class="font-bold text-success block">📐 Updated Recommended Pre-Fire Target:</span>
										<div class="font-mono text-xs font-extrabold text-base-content">
											{#if fLen}<span>L: <strong class="text-primary">{fLen} cm</strong></span>{/if}
											{#if fLen && (fWid || fHgt)}<span class="text-base-content/40"> × </span>{/if}
											{#if fWid}<span>W: <strong class="text-primary">{fWid} cm</strong></span>{/if}
											{#if fWid && fHgt}<span class="text-base-content/40"> × </span>{/if}
											{#if fHgt}<span>H: <strong class="text-primary">{fHgt} cm</strong></span>{/if}
										</div>
									</div>
								{/if}

								<div class="flex justify-end gap-2 pt-1 border-t border-base-300">
									<button 
										type="button" 
										onclick={() => editingDimensionMode = 'none'}
										class="btn btn-ghost btn-xs"
									>
										Cancel
									</button>
									<button 
										type="button" 
										onclick={saveGoalDimensions}
										class="btn btn-primary btn-xs font-bold shadow-md"
									>
										Save Goal Size
									</button>
								</div>
							</div>
						{:else if editingDimensionMode === 'actual_formed'}
							<!-- EDIT ACTUAL MEASURED PRE-FIRE SIZE FORM -->
							<div class="space-y-3 pt-1 bg-base-100 p-3 rounded-xl border border-base-300">
								<div class="flex items-center justify-between font-bold text-success text-xs">
									<span>🏺 Record Actual Measured Pre-Fire Size</span>
									<span class="text-[10px] text-base-content/70 font-normal">Measured pre-fire (formed, trimmed, bone dry)</span>
								</div>

								<!-- Reference Recommended Size Banner -->
								<div class="p-2 rounded-lg bg-success/10 border border-success/25 text-[11px] flex items-center justify-between">
									<span class="font-semibold text-base-content">📐 Recommended Target (Pre-Fire):</span>
									<span class="font-mono font-extrabold text-success">
										{#if selectedPiece.formed_length_cm || selectedPiece.formed_width_cm || selectedPiece.formed_height_cm}
											{#if selectedPiece.formed_length_cm}{selectedPiece.formed_length_cm}L{/if}{#if selectedPiece.formed_length_cm && (selectedPiece.formed_width_cm || selectedPiece.formed_height_cm)}×{/if}{#if selectedPiece.formed_width_cm}{selectedPiece.formed_width_cm}W{/if}{#if selectedPiece.formed_width_cm && selectedPiece.formed_height_cm}×{/if}{#if selectedPiece.formed_height_cm}{selectedPiece.formed_height_cm}H{/if}cm
										{:else if selectedPiece.target_length_cm || selectedPiece.target_width_cm || selectedPiece.target_height_cm}
											{@const rL = calculateFormedDimension(selectedPiece.target_length_cm, selectedPieceShrinkPct)}
											{@const rW = calculateFormedDimension(selectedPiece.target_width_cm, selectedPieceShrinkPct)}
											{@const rH = calculateFormedDimension(selectedPiece.target_height_cm, selectedPieceShrinkPct)}
											{#if rL}{rL}L{/if}{#if rL && (rW || rH)}×{/if}{#if rW}{rW}W{/if}{#if rW && rH}×{/if}{#if rH}{rH}H{/if}cm
										{:else}
											Not set
										{/if}
									</span>
								</div>

								<div class="grid grid-cols-3 gap-2">
									<div class="space-y-1">
										<label for="edit-formed-len" class="text-[10px] font-semibold text-base-content/70">Actual Pre-Fire L (cm)</label>
										<input 
											id="edit-formed-len"
											type="number" 
											step="0.1" 
											min="0"
											bind:value={editingActualFormedLength}
											placeholder="e.g. 11.4" 
											class="input input-bordered input-sm w-full"
										/>
									</div>
									<div class="space-y-1">
										<label for="edit-formed-wid" class="text-[10px] font-semibold text-base-content/70">Actual Pre-Fire W (cm)</label>
										<input 
											id="edit-formed-wid"
											type="number" 
											step="0.1" 
											min="0"
											bind:value={editingActualFormedWidth}
											placeholder="e.g. 11.4" 
											class="input input-bordered input-sm w-full"
										/>
									</div>
									<div class="space-y-1">
										<label for="edit-formed-hgt" class="text-[10px] font-semibold text-base-content/70">Actual Pre-Fire H (cm)</label>
										<input 
											id="edit-formed-hgt"
											type="number" 
											step="0.1" 
											min="0"
											bind:value={editingActualFormedHeight}
											placeholder="e.g. 14.2" 
											class="input input-bordered input-sm w-full"
										/>
									</div>
								</div>

								{#if editingActualFormedLength || editingActualFormedWidth || editingActualFormedHeight}
									{@const pL = calculateFiredDimension(editingActualFormedLength, selectedPieceShrinkPct)}
									{@const pW = calculateFiredDimension(editingActualFormedWidth, selectedPieceShrinkPct)}
									{@const pH = calculateFiredDimension(editingActualFormedHeight, selectedPieceShrinkPct)}
									<div class="p-2 rounded-lg bg-warning/10 border border-warning/30 text-[11px] space-y-0.5">
										<span class="font-bold text-warning block">🔮 Predicted Post-Firing Fired Outcome (-{selectedPieceShrinkPct}% shrinkage):</span>
										<div class="font-mono text-xs font-extrabold text-base-content">
											{#if pL}<span>L: <strong class="text-warning">{pL} cm</strong></span>{/if}
											{#if pL && (pW || pH)}<span class="text-base-content/40"> × </span>{/if}
											{#if pW}<span>W: <strong class="text-warning">{pW} cm</strong></span>{/if}
											{#if pW && pH}<span class="text-base-content/40"> × </span>{/if}
											{#if pH}<span>H: <strong class="text-warning">{pH} cm</strong></span>{/if}
										</div>
									</div>
								{/if}

								<div class="flex justify-end gap-2 pt-1 border-t border-base-300">
									<button 
										type="button" 
										onclick={() => editingDimensionMode = 'none'}
										class="btn btn-ghost btn-xs"
									>
										Cancel
									</button>
									<button 
										type="button" 
										onclick={saveActualFormedDimensions}
										class="btn btn-success btn-xs text-success-content font-bold shadow-md"
									>
										Save Measured Size
									</button>
								</div>
							</div>
						{:else if editingDimensionMode === 'actual_fired'}
							<!-- EDIT ACTUAL MEASURED FINAL FIRED SIZE FORM -->
							<div class="space-y-3 pt-1 bg-base-100 p-3 rounded-xl border border-base-300">
								<div class="flex items-center justify-between font-bold text-success text-xs">
									<span>✨ Record Actual Measured Final Fired Size</span>
									<span class="text-[10px] text-base-content/70 font-normal">Measured after final glaze firing</span>
								</div>

								<!-- Reference Target / Goal Banner -->
								<div class="p-2 rounded-lg bg-success/10 border border-success/25 text-[11px] flex items-center justify-between">
									<span class="font-semibold text-base-content">🎯 Original Goal (Fired):</span>
									<span class="font-mono font-extrabold text-success">
										{#if selectedPiece.target_length_cm || selectedPiece.target_width_cm || selectedPiece.target_height_cm}
											{#if selectedPiece.target_length_cm}{selectedPiece.target_length_cm}L{/if}{#if selectedPiece.target_length_cm && (selectedPiece.target_width_cm || selectedPiece.target_height_cm)}×{/if}{#if selectedPiece.target_width_cm}{selectedPiece.target_width_cm}W{/if}{#if selectedPiece.target_width_cm && selectedPiece.target_height_cm}×{/if}{#if selectedPiece.target_height_cm}{selectedPiece.target_height_cm}H{/if}cm
										{:else}
											Not specified
										{/if}
									</span>
								</div>

								<div class="grid grid-cols-3 gap-2">
									<div class="space-y-1">
										<label for="edit-fired-len" class="text-[10px] font-semibold text-base-content/70">Final Fired L (cm)</label>
										<input 
											id="edit-fired-len"
											type="number" 
											step="0.1" 
											min="0"
											bind:value={editingActualFiredLength}
											placeholder="e.g. 10.1" 
											class="input input-bordered input-sm w-full"
										/>
									</div>
									<div class="space-y-1">
										<label for="edit-fired-wid" class="text-[10px] font-semibold text-base-content/70">Final Fired W (cm)</label>
										<input 
											id="edit-fired-wid"
											type="number" 
											step="0.1" 
											min="0"
											bind:value={editingActualFiredWidth}
											placeholder="e.g. 10.1" 
											class="input input-bordered input-sm w-full"
										/>
									</div>
									<div class="space-y-1">
										<label for="edit-fired-hgt" class="text-[10px] font-semibold text-base-content/70">Final Fired H (cm)</label>
										<input 
											id="edit-fired-hgt"
											type="number" 
											step="0.1" 
											min="0"
											bind:value={editingActualFiredHeight}
											placeholder="e.g. 12.6" 
											class="input input-bordered input-sm w-full"
										/>
									</div>
								</div>

								{#if selectedPiece.actual_formed_length_cm && editingActualFiredLength}
									{@const achShrink = (((selectedPiece.actual_formed_length_cm - editingActualFiredLength) / selectedPiece.actual_formed_length_cm) * 100).toFixed(1)}
									<div class="p-2 rounded-lg bg-success/10 border border-success/30 text-[11px]">
										<span class="font-bold text-success">🔥 True Achieved Shrinkage Rate: </span>
										<span class="font-mono font-extrabold text-base-content">{achShrink}%</span>
										<span class="text-base-content/70 text-[10px] italic"> (from actual pre-fire {selectedPiece.actual_formed_length_cm}cm to fired {editingActualFiredLength}cm)</span>
									</div>
								{/if}

								<div class="flex justify-end gap-2 pt-1 border-t border-base-300">
									<button 
										type="button" 
										onclick={() => editingDimensionMode = 'none'}
										class="btn btn-ghost btn-xs"
									>
										Cancel
									</button>
									<button 
										type="button" 
										onclick={saveActualFiredDimensions}
										class="btn btn-success btn-xs text-success-content font-bold shadow-md"
									>
										Save Final Fired Size
									</button>
								</div>
							</div>
						{:else}
							<!-- 4 BREAKDOWN CARDS DISPLAY MODE -->
							<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
								<!-- Card 1: Desired Final Fired Goal Size -->
								<div class="bg-base-100 p-3 rounded-xl border border-base-300 flex flex-col justify-between space-y-2">
									<div>
										<div class="flex items-center justify-between mb-1">
											<span class="text-[10px] font-bold uppercase tracking-wider text-warning">
												🎯 Desired Goal (Fired)
											</span>
											<button 
												type="button" 
												onclick={startEditGoalDimensions}
												class="text-[10px] font-bold text-primary hover:underline"
											>
												✏️ Edit
											</button>
										</div>
										{#if selectedPiece.target_length_cm || selectedPiece.target_width_cm || selectedPiece.target_height_cm}
											<div class="font-mono text-sm font-extrabold text-base-content">
												{#if selectedPiece.target_length_cm}{selectedPiece.target_length_cm} <span class="text-xs font-normal text-base-content/60">L</span>{/if}
												{#if selectedPiece.target_length_cm && (selectedPiece.target_width_cm || selectedPiece.target_height_cm)} × {/if}
												{#if selectedPiece.target_width_cm}{selectedPiece.target_width_cm} <span class="text-xs font-normal text-base-content/60">W</span>{/if}
												{#if selectedPiece.target_width_cm && selectedPiece.target_height_cm} × {/if}
												{#if selectedPiece.target_height_cm}{selectedPiece.target_height_cm} <span class="text-xs font-normal text-base-content/60">H</span>{/if}
												<span class="text-xs font-normal text-base-content/60">cm</span>
											</div>
										{:else}
											<span class="text-base-content/50 italic text-[11px]">No goal size set.</span>
										{/if}
									</div>
									<span class="text-[9.5px] text-base-content/60 italic">Target size after firing</span>
								</div>

								<!-- Card 2: Recommended Formed Build Target -->
								<div class="bg-success/10 p-3 rounded-xl border border-success/30 flex flex-col justify-between space-y-2">
									<div>
										<span class="text-[10px] font-bold uppercase tracking-wider text-success block mb-1">
											📐 Recommended Pre-Fire Target
										</span>
										{#if selectedPiece.formed_length_cm || selectedPiece.formed_width_cm || selectedPiece.formed_height_cm}
											<div class="font-mono text-sm font-extrabold text-success">
												{#if selectedPiece.formed_length_cm}{selectedPiece.formed_length_cm} <span class="text-xs font-normal">L</span>{/if}
												{#if selectedPiece.formed_length_cm && (selectedPiece.formed_width_cm || selectedPiece.formed_height_cm)} × {/if}
												{#if selectedPiece.formed_width_cm}{selectedPiece.formed_width_cm} <span class="text-xs font-normal">W</span>{/if}
												{#if selectedPiece.formed_width_cm && selectedPiece.formed_height_cm} × {/if}
												{#if selectedPiece.formed_height_cm}{selectedPiece.formed_height_cm} <span class="text-xs font-normal">H</span>{/if}
												<span class="text-xs font-normal">cm</span>
											</div>
										{:else if selectedPiece.target_length_cm || selectedPiece.target_width_cm || selectedPiece.target_height_cm}
											{@const fLen = calculateFormedDimension(selectedPiece.target_length_cm, selectedPieceShrinkPct)}
											{@const fWid = calculateFormedDimension(selectedPiece.target_width_cm, selectedPieceShrinkPct)}
											{@const fHgt = calculateFormedDimension(selectedPiece.target_height_cm, selectedPieceShrinkPct)}
											<div class="font-mono text-sm font-extrabold text-success">
												{#if fLen}{fLen} <span class="text-xs font-normal">L</span>{/if}
												{#if fLen && (fWid || fHgt)} × {/if}
												{#if fWid}{fWid} <span class="text-xs font-normal">W</span>{/if}
												{#if fWid && fHgt} × {/if}
												{#if fHgt}{fHgt} <span class="text-xs font-normal">H</span>{/if}
												<span class="text-xs font-normal">cm</span>
											</div>
										{:else}
											<span class="text-base-content/50 italic text-[11px]">Set goal size to view build target.</span>
										{/if}
									</div>
									<span class="text-[9.5px] text-base-content/60 italic">Pre-fire size to hit goal</span>
								</div>

								<!-- Card 3: Actual Measured Pre-Fire Size & Predicted Post-Firing Size -->
								<div class="bg-warning/10 p-3 rounded-xl border border-warning/30 flex flex-col justify-between space-y-2">
									<div>
										<div class="flex items-center justify-between mb-1">
											<span class="text-[10px] font-bold uppercase tracking-wider text-warning">
												🏺 Actual Measured Pre-Fire Size
											</span>
											{#if selectedPiece.actual_formed_length_cm || selectedPiece.actual_formed_width_cm || selectedPiece.actual_formed_height_cm}
												<button 
													type="button" 
													onclick={startEditActualFormedDimensions}
													class="text-[10px] font-bold text-warning hover:underline"
												>
													✏️ Edit
												</button>
											{/if}
										</div>
										{#if selectedPiece.actual_formed_length_cm || selectedPiece.actual_formed_width_cm || selectedPiece.actual_formed_height_cm}
											{@const afL = selectedPiece.actual_formed_length_cm}
											{@const afW = selectedPiece.actual_formed_width_cm}
											{@const afH = selectedPiece.actual_formed_height_cm}
											{@const predL = calculateFiredDimension(afL, selectedPieceShrinkPct)}
											{@const predW = calculateFiredDimension(afW, selectedPieceShrinkPct)}
											{@const predH = calculateFiredDimension(afH, selectedPieceShrinkPct)}
											<div class="font-mono text-sm font-extrabold text-base-content">
												{#if afL}{afL} <span class="text-xs font-normal">L</span>{/if}
												{#if afL && (afW || afH)} × {/if}
												{#if afW}{afW} <span class="text-xs font-normal">W</span>{/if}
												{#if afW && afH} × {/if}
												{#if afH}{afH} <span class="text-xs font-normal">H</span>{/if}
												<span class="text-xs font-normal">cm</span>
											</div>
											<div class="text-[10px] font-bold text-warning pt-1">
												<span>🔮 Predicted Post-Fire: </span>
												<span class="font-mono font-extrabold">
													{#if predL}{predL}L{/if}{#if predL && (predW || predH)}×{/if}{#if predW}{predW}W{/if}{#if predW && predH}×{/if}{#if predH}{predH}H{/if}cm
												</span>
											</div>
										{:else}
											<span class="text-base-content/50 italic text-[10px] block mb-1">Not recorded yet.</span>
											<button 
												type="button" 
												onclick={startEditActualFormedDimensions}
												class="btn btn-xs btn-warning btn-outline font-bold"
											>
												+ Record Size
											</button>
										{/if}
									</div>
									<span class="text-[9.5px] text-base-content/60 italic">Measured before firing (formed, trimmed, bone dry)</span>
								</div>

								<!-- Card 4: Actual Measured Final Fired Size -->
								<div class="bg-success/10 p-3 rounded-xl border border-success/30 flex flex-col justify-between space-y-2">
									<div>
										<div class="flex items-center justify-between mb-1">
											<span class="text-[10px] font-bold uppercase tracking-wider text-success">
												✨ Actual Measured Final Fired Size
											</span>
											{#if selectedPiece.actual_fired_length_cm || selectedPiece.actual_fired_width_cm || selectedPiece.actual_fired_height_cm}
												<button 
													type="button" 
													onclick={startEditActualFiredDimensions}
													class="text-[10px] font-bold text-success hover:underline"
												>
													✏️ Edit
												</button>
											{/if}
										</div>
										{#if selectedPiece.actual_fired_length_cm || selectedPiece.actual_fired_width_cm || selectedPiece.actual_fired_height_cm}
											{@const afiL = selectedPiece.actual_fired_length_cm}
											{@const afiW = selectedPiece.actual_fired_width_cm}
											{@const afiH = selectedPiece.actual_fired_height_cm}
											<div class="font-mono text-sm font-extrabold text-base-content">
												{#if afiL}{afiL} <span class="text-xs font-normal">L</span>{/if}
												{#if afiL && (afiW || afiH)} × {/if}
												{#if afiW}{afiW} <span class="text-xs font-normal">W</span>{/if}
												{#if afiW && afiH} × {/if}
												{#if afiH}{afiH} <span class="text-xs font-normal">H</span>{/if}
												<span class="text-xs font-normal">cm</span>
											</div>
											{#if selectedPiece.actual_formed_length_cm && afiL}
												{@const trueShrink = (((selectedPiece.actual_formed_length_cm - afiL) / selectedPiece.actual_formed_length_cm) * 100).toFixed(1)}
												<div class="text-[10px] font-bold text-success pt-1">
													<span>🔥 Actual Shrinkage: </span>
													<span class="font-mono font-extrabold">{trueShrink}%</span>
												</div>
											{/if}
										{:else}
											<span class="text-base-content/50 italic text-[10px] block mb-1">Not recorded yet.</span>
											<button 
												type="button" 
												onclick={startEditActualFiredDimensions}
												class="btn btn-xs btn-success btn-outline font-bold"
											>
												+ Record Size
											</button>
										{/if}
									</div>
									<span class="text-[9.5px] text-base-content/60 italic">Measured after final firing</span>
								</div>
							</div>
						{/if}
					</div>
				</details>
			</div>

			<!-- SECTION 2: Piece Notes & Intent -->
			<div class="indicator w-full my-3">
				{#if selectedPiece.stage === 'backlog'}
					<span class="indicator-item indicator-top indicator-start badge badge-primary h-2.5 w-2.5 min-h-0 min-w-0 p-0 rounded-full shadow-sm z-10 -translate-x-1 -translate-y-1 pointer-events-none" title="Stage Focus"></span>
				{/if}
				<details class="collapse collapse-arrow border border-base-300 bg-base-200/50 rounded-xl w-full" open={isNotesRelevant(selectedPiece.stage, selectedPiece.notes, selectedPiece.description)}>
					<summary class="collapse-title font-bold text-xs text-base-content py-3 min-h-0 flex items-center justify-between pr-8">
						<div class="flex items-center gap-1.5 min-w-0">
							<FileText class="w-4 h-4 text-primary flex-shrink-0" />
							<span class="truncate">Piece Notes & Intent</span>
						</div>
					</summary>
					<div class="collapse-content pt-1 space-y-2">
						<div class="flex items-center justify-end mb-1">
							{#if !isEditingNotes}
								<button 
									type="button" 
									onclick={() => { editingPieceNotes = selectedPiece?.notes || selectedPiece?.description || ''; isEditingNotes = true; }} 
									class="text-[11px] font-bold text-primary hover:underline"
								>
									✏️ Edit Notes
								</button>
							{/if}
						</div>

						{#if isEditingNotes}
							<div class="space-y-2 pt-1">
								<textarea 
									bind:value={editingPieceNotes}
									rows="3"
									placeholder="Add details, inspiration, dimensions, firing notes..."
									class="textarea textarea-bordered textarea-sm w-full"
								></textarea>
								<div class="flex justify-end gap-2">
									<button 
										type="button" 
										onclick={() => isEditingNotes = false}
										class="btn btn-ghost btn-xs"
									>
										Cancel
									</button>
									<button 
										type="button" 
										onclick={savePieceNotes}
										class="btn btn-primary btn-xs font-bold shadow"
									>
										Save Notes
									</button>
								</div>
							</div>
						{:else}
							<p class="text-base-content/80 text-[11px] leading-relaxed italic p-2 bg-base-100 rounded-lg border border-base-300">
								{selectedPiece.notes || selectedPiece.description || 'No notes added yet for this piece. Click "Edit Notes" to add artistic intent, dimensions, or firing notes.'}
							</p>
						{/if}
					</div>
				</details>
			</div>

			<!-- SECTION 3: Firing Targets & Glaze Tagging Section -->
			<div class="indicator w-full my-3">
				{#if isGlazeRelevant(selectedPiece.stage)}
					<span class="indicator-item indicator-top indicator-start badge badge-success h-2.5 w-2.5 min-h-0 min-w-0 p-0 rounded-full shadow-sm z-10 -translate-x-1 -translate-y-1 pointer-events-none" title="Stage Focus"></span>
				{/if}
				<details class="collapse collapse-arrow border border-base-300 bg-base-200/50 rounded-xl w-full" open={isGlazeRelevant(selectedPiece.stage)}>
					<summary class="collapse-title font-bold text-xs text-base-content py-3 min-h-0 flex items-center justify-between pr-8">
						<div class="flex items-center gap-1.5 min-w-0">
							<Droplets class="w-4 h-4 text-success flex-shrink-0" />
							<span class="truncate">Firing Targets & Glaze Tagging</span>
						</div>
						{#if selectedPiece.glaze_layers && selectedPiece.glaze_layers.length > 0}
							<span class="badge badge-neutral badge-xs font-bold text-[9px] flex-shrink-0">
								{selectedPiece.glaze_layers.length} {selectedPiece.glaze_layers.length === 1 ? 'layer' : 'layers'}
							</span>
						{/if}
					</summary>
					<div class="collapse-content pt-1 space-y-4">
						<!-- Firing Cones Controls -->
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-base-100 rounded-xl border border-base-300">
							<div class="space-y-1">
								<label for="detail-bisque-cone" class="text-[11px] font-semibold text-base-content/80 block">Target Bisque Cone</label>
								<select 
									id="detail-bisque-cone"
									value={selectedPiece.target_bisque_cone || 'Cone 06'}
									onchange={(e) => handleBisqueConeChange(e.currentTarget.value)}
									class="select select-bordered select-xs w-full font-mono font-semibold"
								>
									{#each PYROMETRIC_CONES as cone}
										<option value={cone.name}>{cone.name} ({cone.temp_f}°F / {cone.temp_c}°C)</option>
									{/each}
								</select>
							</div>
							<div class="space-y-1">
								<label for="detail-glaze-cone" class="text-[11px] font-semibold text-base-content/80 block">Target Glaze Cone</label>
								<select 
									id="detail-glaze-cone"
									value={selectedPiece.target_glaze_cone || 'Cone 6'}
									onchange={(e) => handleGlazeConeChange(e.currentTarget.value)}
									class="select select-bordered select-xs w-full font-mono font-semibold"
								>
									{#each PYROMETRIC_CONES as cone}
										<option value={cone.name}>{cone.name} ({cone.temp_f}°F / {cone.temp_c}°C)</option>
									{/each}
								</select>
							</div>
						</div>

						<div class="flex items-center justify-between">
							<h4 class="font-display font-bold text-xs text-base-content flex items-center gap-1.5">
								<Droplets class="w-3.5 h-3.5 text-success" />
								<span>Applied Glazes</span>
							</h4>
							{#if activeBatchCount > 1}
								<span class="badge badge-primary badge-outline text-[10px] font-bold gap-1" title="Applying or removing glaze will affect all pieces in this stack">
									<Layers2 class="w-3 h-3" />
									<span>Applies to active batch ({activeBatchCount} pcs)</span>
								</span>
							{/if}
						</div>

						{#if selectedPiece.glaze_layers && selectedPiece.glaze_layers.length > 0}
							<div class="space-y-2">
								{#each selectedPiece.glaze_layers as gl, i}
									<div class="bg-base-100 p-3 rounded-xl border border-base-300 flex items-center justify-between text-xs">
										<div class="flex items-center gap-2">
											<span class="badge badge-neutral badge-sm font-bold">
												#{i + 1}
											</span>
											<div>
												<div class="flex items-center gap-2">
													<span class="badge badge-primary badge-xs font-bold">
														{gl.manufacturer}
													</span>
													<span class="font-bold text-base-content">{gl.glaze_name}</span>
													{#if gl.location}
														<span class="badge badge-success badge-xs font-bold">
															{gl.location}
														</span>
													{/if}
												</div>
												<span class="text-[11px] text-base-content/70">
													Applied: <strong class="text-base-content">{gl.coat_count} coats ({gl.application_method})</strong>
												</span>
											</div>
										</div>
										<button 
											type="button"
											onclick={() => removeGlazeLayer(i)}
											class="btn btn-ghost btn-xs text-error hover:bg-error/10 p-1"
											title="Remove Glaze Layer"
										>
											<Trash2 class="w-3.5 h-3.5" />
										</button>
									</div>
								{/each}
							</div>
						{/if}

						<!-- Tag Glaze Form -->
						<div class="p-3.5 bg-base-100 rounded-xl border border-base-300 space-y-3 text-xs">
							<span class="font-bold text-base-content block">Tag New Glaze Layer:</span>
							
							<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<div class="space-y-1">
									<label for="glaze-preset-select" class="text-base-content/70 font-medium">Select Predefined Glaze</label>
									<select 
										id="glaze-preset-select"
										onchange={handleGlazeSelectionChange}
										class="select select-bordered select-sm w-full"
									>
										<optgroup label="Predefined Glaze Library">
											{#each glazes as g}
												<option value={g.id}>
													[{g.manufacturer}] {g.name} ({g.min_cone || 'Cone 5'} – {g.max_cone || 'Cone 6'})
												</option>
											{/each}
										</optgroup>
										<option value="custom">✍️ Enter Custom Glaze...</option>
									</select>
								</div>

								<div class="space-y-1">
									<label for="glaze-name-input" class="text-base-content/70 font-medium">Glaze Name</label>
									<input 
										id="glaze-name-input"
										type="text" 
										bind:value={tagGlazeName}
										placeholder="e.g. PC-20 Blue Rutile" 
										class="input input-bordered input-sm w-full"
									/>
								</div>
							</div>

							<div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
								<div class="space-y-1">
									<label for="glaze-mfr-input" class="text-base-content/70 font-medium">Manufacturer</label>
									<select 
										id="glaze-mfr-input"
										bind:value={tagGlazeManufacturer}
										class="select select-bordered select-sm w-full"
									>
										{#each MANUFACTURERS as mfr}
											<option value={mfr.name}>{mfr.name}</option>
										{/each}
									</select>
								</div>

								<div class="space-y-1">
									<label for="glaze-style-input" class="text-base-content/70 font-medium">Style / Method</label>
									<select 
										id="glaze-style-input"
										bind:value={tagGlazeMethod}
										class="select select-bordered select-sm w-full"
									>
										<option value="brush">Brush (Painted)</option>
										<option value="dip">Dip (Dipped bucket)</option>
										<option value="spray">Spray</option>
										<option value="pour">Pour</option>
										<option value="underglaze">Underglaze</option>
										<option value="wax_accent">Wax Accent</option>
									</select>
								</div>

								<div class="space-y-1">
									<label for="glaze-coats-input" class="text-base-content/70 font-medium">Coats</label>
									<select 
										id="glaze-coats-input"
										bind:value={tagGlazeCoats}
										class="select select-bordered select-sm w-full"
									>
										<option value={1}>1 Coat</option>
										<option value={2}>2 Coats</option>
										<option value={3}>3 Coats</option>
										<option value={4}>4 Coats</option>
									</select>
								</div>

								<div class="space-y-1">
									<label for="glaze-location-input" class="text-base-content/70 font-medium">Location / Coverage</label>
									<select 
										id="glaze-location-input"
										bind:value={tagGlazeLocation}
										class="select select-bordered select-sm w-full"
									>
										{#each GLAZE_LOCATIONS as loc}
											<option value={loc.id}>{loc.label}</option>
										{/each}
									</select>
								</div>
							</div>

							<div class="pt-2 flex justify-end">
								<button 
									onclick={addGlazeTagToPiece}
									class="btn btn-sm btn-success text-success-content font-bold shadow gap-1.5"
								>
									<Plus class="w-4 h-4" />
									<span>Tag Glaze Layer {activeBatchCount > 1 ? `(${activeBatchCount} Pcs)` : ''}</span>
								</button>
							</div>
						</div>
					</div>
				</details>
			</div>

			<!-- SECTION 4: Stage Timeline & Photo Log -->
			<details class="collapse collapse-arrow border border-base-300 bg-base-200/50 rounded-xl my-3" open={true}>
				<summary class="collapse-title font-bold text-xs text-base-content py-3 min-h-0 flex flex-wrap sm:flex-nowrap items-center justify-between gap-1.5 pr-8">
					<div class="flex items-center gap-1.5 min-w-0">
						<Camera class="w-4 h-4 text-primary flex-shrink-0" />
						<span class="truncate">Stage Snapshots & Photo History</span>
					</div>
					{#if selectedPiece.stage_logs && selectedPiece.stage_logs.length > 0}
						<span class="badge badge-ghost border border-base-300 text-[9px] sm:text-[10px] font-bold">
							{selectedPiece.stage_logs.length} {selectedPiece.stage_logs.length === 1 ? 'log' : 'logs'}
						</span>
					{/if}
				</summary>
				<div class="collapse-content pt-1 space-y-4">
					{#if selectedPiece.stage_logs && selectedPiece.stage_logs.length > 0}
						<div class="space-y-3">
							{#each selectedPiece.stage_logs as log}
								<div class="bg-base-100 p-3.5 rounded-xl border border-base-300 space-y-2 text-xs">
									<div class="flex items-center justify-between text-base-content/70">
										<div class="flex items-center gap-2">
											<span class="font-bold text-primary uppercase">{log.stage}</span>
											{#if log.weight_grams}
												<span class="badge badge-xs badge-neutral font-bold">
													{formatClayWeight(log.weight_grams)}
												</span>
											{/if}
										</div>
										<span>{formatDateShort(log.created_at)}</span>
									</div>
									{#if log.notes}
										<p class="text-base-content">{log.notes}</p>
									{/if}
									{#if log.photo_url}
										<img src={log.photo_url} alt="Stage log snapshot" class="w-32 h-32 object-cover rounded-lg border border-base-300" />
									{/if}
								</div>
							{/each}
						</div>
					{/if}

					<div class="space-y-2 p-3 bg-base-100 rounded-xl border border-base-300 text-xs">
						<input 
							type="text" 
							bind:value={newLogNote}
							placeholder="Add note for current stage..." 
							class="input input-bordered input-sm w-full"
						/>
						<div class="flex gap-2">
							<input 
								type="url" 
								bind:value={newLogPhoto}
								placeholder="Photo URL..." 
								class="input input-bordered input-sm flex-1"
							/>
							<input 
								type="number" 
								step="any"
								min="0"
								bind:value={newLogWeightAmount}
								placeholder="Weight..." 
								class="input input-bordered input-sm w-24"
							/>
							<select 
								bind:value={newLogWeightUnit}
								class="select select-bordered select-sm w-20"
							>
								<option value="g">g</option>
								<option value="kg">kg</option>
								<option value="lbs">lbs</option>
								<option value="oz">oz</option>
							</select>
							<button 
								onclick={addStageLogNote}
								class="px-4 py-2 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold rounded-lg transition"
							>
								Save Log
							</button>
						</div>
					</div>
				</div>
			</details>
		</div>
	</div>
{/if}
