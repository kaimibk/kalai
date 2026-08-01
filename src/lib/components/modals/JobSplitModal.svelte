<script lang="ts">
	import GitFork from 'lucide-svelte/icons/git-fork';
	import Boxes from 'lucide-svelte/icons/boxes';
	import AlertCircle from 'lucide-svelte/icons/alert-circle';
	import X from 'lucide-svelte/icons/x';
	import type { CeramicPiece, CeramicStage } from '$lib/types/database';

	let {
		isOpen = $bindable(false),
		splitTargetBatchTitle,
		splitBatchPieces,
		onConfirm
	}: {
		isOpen: boolean;
		splitTargetBatchTitle: string;
		splitBatchPieces: CeramicPiece[];
		onConfirm: (data: {
			selectedPieceIds: string[];
			action: 'new_batch' | 'detach' | 'fail';
			newSubBatchTitle: string;
			failReason: string;
		}) => void;
	} = $props();

	let splitSelectedPieceIds = $state<string[]>([]);
	let splitAction = $state<'new_batch' | 'detach' | 'fail'>('new_batch');
	let splitNewSubBatchTitle = $state<string>('');
	let splitFailReason = $state<string>('S-crack in foot during firing');

	$effect(() => {
		if (isOpen && splitBatchPieces.length > 0) {
			splitSelectedPieceIds = [splitBatchPieces[0].id];
			splitNewSubBatchTitle = `${splitTargetBatchTitle} (Branch)`;
			splitAction = 'new_batch';
		}
	});

	function selectAllSplitPieces() {
		splitSelectedPieceIds = splitBatchPieces.map(p => p.id);
	}

	function deselectAllSplitPieces() {
		splitSelectedPieceIds = [];
	}

	function toggleSplitSelection(pieceId: string) {
		if (splitSelectedPieceIds.includes(pieceId)) {
			splitSelectedPieceIds = splitSelectedPieceIds.filter(id => id !== pieceId);
		} else {
			splitSelectedPieceIds = [...splitSelectedPieceIds, pieceId];
		}
	}

	function handleExecute() {
		if (splitSelectedPieceIds.length === 0) return;
		onConfirm({
			selectedPieceIds: splitSelectedPieceIds,
			action: splitAction,
			newSubBatchTitle: splitNewSubBatchTitle,
			failReason: splitFailReason
		});
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
		<div class="modal-box max-w-xl bg-base-100 text-base-content border border-base-300 shadow-2xl p-6 rounded-2xl space-y-6 max-h-[90vh] overflow-y-auto">
			<div class="flex items-start justify-between border-b border-base-300 pb-4">
				<div>
					<div class="flex items-center gap-2">
						<GitFork class="w-5 h-5 text-warning" />
						<h3 class="font-display font-bold text-lg text-base-content">Split Batch & Diverge Jobs</h3>
					</div>
					<p class="text-xs text-base-content/70 mt-1">
						Splitting batch: <strong class="text-base-content">{splitTargetBatchTitle}</strong> ({splitBatchPieces.length} active pieces)
					</p>
				</div>
				<button onclick={() => isOpen = false} class="btn btn-sm btn-circle btn-ghost">
					<X class="w-4 h-4" />
				</button>
			</div>

			<!-- Piece Selection Section -->
			<div class="space-y-3 text-xs">
				<div class="flex items-center justify-between">
					<span class="font-bold text-base-content">
						Select Pieces to Split ({splitSelectedPieceIds.length} of {splitBatchPieces.length} selected):
					</span>
					<div class="flex items-center gap-2">
						<button type="button" onclick={selectAllSplitPieces} class="text-[11px] text-primary hover:underline font-semibold">Select All</button>
						<span class="text-base-content/40">•</span>
						<button type="button" onclick={deselectAllSplitPieces} class="text-[11px] text-base-content/70 hover:underline font-semibold">Clear</button>
					</div>
				</div>

				<div class="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto touch-pan-y p-2 bg-base-200 rounded-xl border border-base-300">
					{#each splitBatchPieces as p}
						<label class="flex items-center gap-2.5 p-2 rounded-lg bg-base-100 border border-base-300 cursor-pointer hover:border-primary transition text-base-content">
							<input 
								type="checkbox" 
								checked={splitSelectedPieceIds.includes(p.id)}
								onchange={() => toggleSplitSelection(p.id)}
								class="checkbox checkbox-primary checkbox-xs"
							/>
							<span class="font-semibold truncate">{p.title}</span>
						</label>
					{/each}
				</div>
			</div>

			<!-- Action Options -->
			<div class="space-y-4 text-xs pt-2 border-t border-base-300">
				<span class="font-bold text-base-content block">Choose Action for Selected Pieces:</span>

				<div class="grid grid-cols-3 gap-3">
					<button 
						type="button"
						onclick={() => splitAction = 'new_batch'}
						class="p-3 rounded-xl border text-left transition flex flex-col gap-1 {splitAction === 'new_batch' ? 'border-primary bg-primary/10 text-primary font-bold' : 'border-base-300 bg-base-100 text-base-content'}"
					>
						<span class="flex items-center gap-1.5 font-bold">
							<GitFork class="w-4 h-4" />
							<span>Split into Sub-Batch</span>
						</span>
						<span class="text-[10px] text-base-content/70 font-normal">Separate into a new sibling batch group</span>
					</button>

					<button 
						type="button"
						onclick={() => splitAction = 'detach'}
						class="p-3 rounded-xl border text-left transition flex flex-col gap-1 {splitAction === 'detach' ? 'border-warning bg-warning/10 text-warning font-bold' : 'border-base-300 bg-base-100 text-base-content'}"
					>
						<span class="flex items-center gap-1.5 font-bold">
							<Boxes class="w-4 h-4" />
							<span>Detach as Standalone</span>
						</span>
						<span class="text-[10px] text-base-content/70 font-normal font-sans">Make pieces individual (remove batch link)</span>
					</button>

					<button 
						type="button"
						onclick={() => splitAction = 'fail'}
						class="p-3 rounded-xl border text-left transition flex flex-col gap-1 {splitAction === 'fail' ? 'border-error bg-error/10 text-error font-bold' : 'border-base-300 bg-base-100 text-base-content'}"
					>
						<span class="flex items-center gap-1.5 font-bold">
							<AlertCircle class="w-4 h-4 text-error" />
							<span>Mark as Failed</span>
						</span>
						<span class="text-[10px] text-base-content/70 font-normal font-sans">Flag selected items failed without ruining batch</span>
					</button>
				</div>

				<!-- Dynamic Action Inputs -->
				{#if splitAction === 'new_batch'}
					<div class="p-3 bg-base-200 rounded-xl border border-base-300 space-y-1.5">
						<label for="split-subbatch-title" class="text-base-content font-semibold">Sub-Batch Title</label>
						<input 
							id="split-subbatch-title"
							type="text" 
							bind:value={splitNewSubBatchTitle}
							class="input input-bordered input-sm w-full"
						/>
					</div>
				{:else if splitAction === 'fail'}
					<div class="p-3 bg-error/10 rounded-xl border border-error/30 space-y-1.5 text-xs">
						<label for="split-fail-reason" class="text-error font-semibold">Failure Reason</label>
						<input 
							id="split-fail-reason"
							type="text" 
							list="split-fail-reasons-list"
							bind:value={splitFailReason}
							placeholder="Select or enter failure reason..."
							class="input input-bordered input-sm w-full"
						/>
						<datalist id="split-fail-reasons-list">
							<option value="S-crack in foot during drying"></option>
							<option value="Handle attachment popped off"></option>
							<option value="Glaze ran onto kiln shelf"></option>
							<option value="Exploded in bisque firing"></option>
							<option value="Shivering / glaze crawling defect"></option>
							<option value="Thermal shock / dunting crack"></option>
							<option value="Warped rim during glaze fire"></option>
							<option value="Pinholing / blistering in glaze"></option>
						</datalist>
					</div>
				{/if}
			</div>

			<div class="modal-action border-t border-base-300 pt-4 flex justify-end gap-2 text-xs">
				<button 
					type="button" 
					onclick={() => isOpen = false}
					class="btn btn-ghost btn-sm"
				>
					Cancel
				</button>
				<button 
					type="button" 
					onclick={handleExecute}
					class="btn btn-warning btn-sm font-bold shadow"
				>
					Execute Split ({splitSelectedPieceIds.length} pcs)
				</button>
			</div>
		</div>
	</div>
{/if}
