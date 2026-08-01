<script lang="ts">
	import FilterX from 'lucide-svelte/icons/filter-x';
	import type { CeramicPiece, CeramicStage, KanbanDisplayGroup } from '$lib/types/database';
	import { STAGES } from '$lib/constants/stages';
	import PieceCard from '$lib/components/board/PieceCard.svelte';
	import BatchCardStack from '$lib/components/board/BatchCardStack.svelte';

	let {
		pieces = [],
		filteredPieces = [],
		showLossArchive = false,
		mobileActiveStage = 'all',
		draggedPieceId = null,
		draggedBatchKey = null,
		dragOverStageId = null,
		dragOverCardGroupKey = null,
		touchDragActive = false,
		hasActiveFilters = false,
		boardContainerRef = $bindable(null),
		onSelectPiece,
		onOpenDuplicateModal,
		onOpenFailModal,
		onOpenSplitBatchModal,
		onMovePieceToStage,
		onAdvanceBatchGroupStage,
		onClearAllFilters,
		onPointerDownPiece,
		onPointerDownBatch,
		onCardDragOver,
		onCardDragLeave,
		onCardDrop,
		onStageDragOver,
		onStageDragLeave,
		onStageDrop
	}: {
		pieces: CeramicPiece[];
		filteredPieces: CeramicPiece[];
		showLossArchive: boolean;
		mobileActiveStage: string;
		draggedPieceId: string | null;
		draggedBatchKey: string | null;
		dragOverStageId: CeramicStage | null;
		dragOverCardGroupKey: string | null;
		touchDragActive: boolean;
		hasActiveFilters: boolean;
		boardContainerRef: HTMLElement | null;
		onSelectPiece: (piece: CeramicPiece) => void;
		onOpenDuplicateModal: (piece: CeramicPiece) => void;
		onOpenFailModal: (piece: CeramicPiece) => void;
		onOpenSplitBatchModal: (batchId: string, stageId: CeramicStage) => void;
		onMovePieceToStage: (pieceId: string, targetStage: CeramicStage) => void;
		onAdvanceBatchGroupStage: (group: KanbanDisplayGroup) => void;
		onClearAllFilters: () => void;
		onPointerDownPiece: (e: PointerEvent, pieceId: string, label: string) => void;
		onPointerDownBatch: (e: PointerEvent, batchId: string, stageId: CeramicStage, glazeSig: string, label: string) => void;
		onCardDragOver: (e: DragEvent, group: KanbanDisplayGroup) => void;
		onCardDragLeave: (e: DragEvent, group: KanbanDisplayGroup) => void;
		onCardDrop: (e: DragEvent, group: KanbanDisplayGroup) => void;
		onStageDragOver: (e: DragEvent, stageId: CeramicStage) => void;
		onStageDragLeave: (e: DragEvent, stageId: CeramicStage) => void;
		onStageDrop: (e: DragEvent, stageId: CeramicStage) => void;
	} = $props();

	let activePieces = $derived(filteredPieces.filter(p => !p.is_failed));

	function getStageCardGroups(stageId: CeramicStage): KanbanDisplayGroup[] {
		const columnPieces = stageId === 'done'
			? (showLossArchive ? filteredPieces.filter(p => p.stage === 'done') : filteredPieces.filter(p => p.stage === 'done' && !p.is_failed))
			: filteredPieces.filter(p => p.stage === stageId && !p.is_failed);

		const groups: KanbanDisplayGroup[] = [];
		const batchMap = new Map<string, CeramicPiece[]>();
		const nonBatched: CeramicPiece[] = [];

		for (const piece of columnPieces) {
			if (piece.batch_id) {
				const current = batchMap.get(piece.batch_id) || [];
				current.push(piece);
				batchMap.set(piece.batch_id, current);
			} else {
				nonBatched.push(piece);
			}
		}

		for (const [batchId, bPieces] of batchMap.entries()) {
			const glazeGroups = new Map<string, CeramicPiece[]>();
			for (const p of bPieces) {
				const sig = p.glaze_layers ? p.glaze_layers.map(g => g.glaze_name).sort().join('|') : '';
				const list = glazeGroups.get(sig) || [];
				list.push(p);
				glazeGroups.set(sig, list);
			}

			for (const [sig, subPieces] of glazeGroups.entries()) {
				if (subPieces.length > 1) {
					const first = subPieces[0];
					const bTitle = first.batch?.title || `${first.title.replace(/\s*#\d+$/, '')} Batch`;
					groups.push({
						isBatch: true,
						batchId,
						batchTitle: bTitle,
						glazeSignature: sig,
						pieces: subPieces,
						primaryPiece: first
					});
				} else if (subPieces.length === 1) {
					groups.push({
						isBatch: false,
						pieces: subPieces,
						primaryPiece: subPieces[0]
					});
				}
			}
		}

		for (const p of nonBatched) {
			groups.push({
				isBatch: false,
				pieces: [p],
				primaryPiece: p
			});
		}

		return groups;
	}
</script>

<div 
	bind:this={boardContainerRef} 
	class="w-full flex-1 min-h-0 flex flex-col overflow-x-auto {touchDragActive ? 'snap-none scroll-auto' : 'snap-x snap-mandatory scroll-smooth'} pb-2"
>
	<div class="flex-1 min-h-0 flex justify-start {touchDragActive ? 'snap-none' : 'snap-x snap-mandatory'} gap-3.5 pb-2 min-w-full w-max px-2 sm:px-4">
		{#each STAGES as stageInfo}
			{@const columnPieces = stageInfo.id === 'done'
				? (showLossArchive ? filteredPieces.filter(p => p.stage === 'done') : filteredPieces.filter(p => p.stage === 'done' && !p.is_failed))
				: activePieces.filter(p => p.stage === stageInfo.id)}

			{#if mobileActiveStage === 'all' || mobileActiveStage === stageInfo.id}
				<div 
					role="region"
					aria-label={stageInfo.label}
					data-stage-id={stageInfo.id}
					class="{mobileActiveStage === stageInfo.id ? 'w-full min-w-full' : 'w-[85vw] min-w-[280px] max-w-[340px]'} flex-shrink-0 snap-center snap-always rounded-2xl p-3 backdrop-blur-xs transition-all duration-200 flex flex-col flex-1 min-h-[480px] max-h-[70vh] overflow-hidden shadow-sm {stageInfo.color} {dragOverStageId === stageInfo.id ? 'ring-2 ring-primary scale-[1.01] shadow-lg' : ''}"
					ondragover={(e) => onStageDragOver(e, stageInfo.id)}
					ondragenter={(e) => onStageDragOver(e, stageInfo.id)}
					ondragleave={(e) => onStageDragLeave(e, stageInfo.id)}
					ondrop={(e) => onStageDrop(e, stageInfo.id)}
				>
					<!-- Column Header -->
					<div class="flex items-center justify-between px-2 py-1.5 border-b border-base-300 mb-2.5 flex-shrink-0">
						<div class="flex items-center gap-2">
							<span class="text-base">{stageInfo.icon}</span>
							<h3 class="font-display text-m font-extrabold text-base-content tracking-tight">{stageInfo.label}</h3>
						</div>
						<span class="badge {stageInfo.badgeColor} badge-sm font-bold">
							{columnPieces.length}
						</span>
					</div>

					<!-- Cards Column -->
					<div class="space-y-3 flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth px-1.5 py-1" role="list">
						{#each getStageCardGroups(stageInfo.id) as group}
							{@const groupKey = group.isBatch ? group.batchId! : group.primaryPiece.id}
							{@const isCardHovered = dragOverCardGroupKey === groupKey}
							{#if group.isBatch}
								<BatchCardStack
									{group}
									stageId={stageInfo.id}
									{isCardHovered}
									{draggedBatchKey}
									{onSelectPiece}
									{onOpenSplitBatchModal}
									{onAdvanceBatchGroupStage}
									{onPointerDownBatch}
								/>
							{:else}
								<PieceCard
									piece={group.primaryPiece}
									stageId={stageInfo.id}
									{isCardHovered}
									{draggedPieceId}
									{onSelectPiece}
									{onOpenDuplicateModal}
									{onOpenFailModal}
									{onMovePieceToStage}
									{onPointerDownPiece}
								/>
							{/if}
						{/each}

						{#if columnPieces.length === 0}
							{#if hasActiveFilters}
								<div class="h-44 border border-dashed rounded-xl flex flex-col items-center justify-center text-center p-4 bg-stone-100/60 dark:bg-stone-900/40 border-stone-300 dark:border-stone-800 space-y-1">
									<FilterX class="w-7 h-7 text-stone-400 dark:text-stone-600 mb-1" />
									<p class="text-xs font-bold text-stone-700 dark:text-stone-300">No matching pieces</p>
									<p class="text-[10px] text-stone-500 dark:text-stone-400">Try adjusting your active filters.</p>
									<button type="button" onclick={onClearAllFilters} class="mt-2 px-2.5 py-1 text-[10px] font-bold bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 rounded-lg transition cursor-pointer">Clear Filters</button>
								</div>
							{:else}
								<div class="h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center p-3 transition-all duration-200 {dragOverStageId === stageInfo.id ? 'border-primary bg-primary/10 scale-[1.02]' : 'border-base-300'}">
									<p class="text-[11px] font-medium {dragOverStageId === stageInfo.id ? 'text-primary font-extrabold' : 'text-base-content/60'}">
										{dragOverStageId === stageInfo.id ? 'Release to drop piece here' : 'Empty stage'}
									</p>
									{#if dragOverStageId === stageInfo.id}
										<span class="text-[10px] text-base-content/70 font-semibold mt-1">Move to {stageInfo.label}</span>
									{/if}
								</div>
							{/if}
						{/if}
					</div>
				</div>
			{/if}
		{/each}
	</div>
</div>
