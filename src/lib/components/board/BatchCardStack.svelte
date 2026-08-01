<script lang="ts">
	import Clock from 'lucide-svelte/icons/clock';
	import Calendar from 'lucide-svelte/icons/calendar';
	import Layers2 from 'lucide-svelte/icons/layers-2';
	import ArrowRight from 'lucide-svelte/icons/arrow-right';
	import Info from 'lucide-svelte/icons/info';
	import GitFork from 'lucide-svelte/icons/git-fork';
	import Boxes from 'lucide-svelte/icons/boxes';
	import AlertTriangle from 'lucide-svelte/icons/alert-triangle';

	import type { CeramicPiece, CeramicStage, KanbanDisplayGroup } from '$lib/types/database';
	import { formatDateShort } from '$lib/utils/date';
	import { formatClayWeight } from '$lib/utils/dimensions';

	let {
		group,
		stageId,
		isCardHovered = false,
		draggedBatchKey = null,
		onSelectPiece,
		onOpenSplitBatchModal,
		onAdvanceBatchGroupStage,
		onPointerDownBatch
	}: {
		group: KanbanDisplayGroup;
		stageId: CeramicStage;
		isCardHovered?: boolean;
		draggedBatchKey?: string | null;
		onSelectPiece: (piece: CeramicPiece) => void;
		onOpenSplitBatchModal: (batchId: string, stageId: CeramicStage) => void;
		onAdvanceBatchGroupStage: (group: KanbanDisplayGroup) => void;
		onPointerDownBatch: (e: PointerEvent, batchId: string, stageId: CeramicStage, glazeSig: string, label: string) => void;
	} = $props();

	let groupKey = $derived(group.isBatch ? group.batchId! : group.primaryPiece.id);
	let isGrabbed = $derived(draggedBatchKey === `${group.batchId}::${stageId}::${group.glazeSignature}`);
</script>

<div 
	role="region"
	aria-label="Stacked batch card"
	data-card-group-key={groupKey}
	aria-grabbed={isGrabbed}
	class="stack w-full my-2 transition-transform duration-200 {isCardHovered ? 'scale-[1.02]' : ''}"
>
	<!-- Front Primary Batch Card (Layer 1) -->
	<div class="ceramic-card-aura relative z-10">
		<div 
			role="listitem"
			data-card-group-key={groupKey}
			aria-grabbed={isGrabbed}
			draggable={false}
			onpointerdown={(e) => onPointerDownBatch(e, group.batchId!, stageId, group.glazeSignature || '', group.batchTitle || 'Batch')}
			class="ceramic-card relative z-10 snap-start p-3.5 rounded-xl border border-base-300 border-l-4 border-l-primary group space-y-3 cursor-grab active:cursor-grabbing select-none shadow-lg min-w-0 {group.primaryPiece.is_failed ? 'border-2 border-error/70 bg-error/10 dark:bg-error/15 border-l-4 border-l-error shadow-error/15' : ''} {isGrabbed ? 'opacity-40 scale-95 border-dashed border-primary' : ''} {isCardHovered ? 'ring-2 ring-primary border-primary bg-primary/15' : ''}"
		>
			<!-- Merge Hover Highlight Banner -->
			{#if isCardHovered}
				<div class="bg-primary text-primary-content text-[10px] font-extrabold px-2.5 py-1 rounded-md text-center shadow-md animate-pulse flex items-center justify-center gap-1">
					<Layers2 class="w-3.5 h-3.5" />
					<span>Drop card to merge into batch!</span>
				</div>
			{/if}

			<!-- Stacked Visual Indicator Badge & Cone Badge -->
			<div class="flex items-center justify-between gap-1">
				{#if group.primaryPiece.is_failed}
					<div class="badge badge-error badge-sm gap-1 font-extrabold text-[10px]">
						<AlertTriangle class="w-3.5 h-3.5 flex-shrink-0" />
						<span>{group.pieces.length} PCS FAILED STACK</span>
					</div>
				{:else}
					<div class="badge badge-primary badge-outline badge-sm gap-1 font-extrabold text-[10px]">
						<Layers2 class="w-3.5 h-3.5 flex-shrink-0" />
						<span>{group.pieces.length} PCS STACK</span>
					</div>
				{/if}
				<span class="badge badge-accent badge-sm font-semibold text-[10px]">
					{group.primaryPiece.target_glaze_cone}
				</span>
			</div>

			<!-- Thumbnail / Photo -->
			{#if group.primaryPiece.initial_photo_url}
				<button 
					type="button"
					onclick={() => onSelectPiece(group.primaryPiece)}
					class="w-full h-28 rounded-lg overflow-hidden relative bg-base-200 border border-base-300 text-left cursor-pointer group/photo block"
					title="Click to view details & photos"
				>
					<img src={group.primaryPiece.initial_photo_url} alt={group.batchTitle} draggable={false} class="w-full h-full object-cover group-hover/photo:scale-105 transition duration-300 pointer-events-none select-none {group.primaryPiece.is_failed ? 'grayscale-[25%] opacity-90' : ''}" />
					{#if group.primaryPiece.is_failed}
						<div class="absolute inset-0 bg-error/10 mix-blend-multiply pointer-events-none"></div>
						<span class="absolute bottom-2 left-2 text-[10px] font-extrabold badge badge-error text-error-content gap-1 shadow-sm">
							<AlertTriangle class="w-3 h-3" />
							<span>Failed Stack</span>
						</span>
					{:else}
						<span class="absolute bottom-2 left-2 text-[10px] font-bold badge badge-neutral gap-1">
							<Boxes class="w-3 h-3 text-primary" />
							<span>{group.primaryPiece.piece_type} Stack</span>
						</span>
					{/if}
				</button>
			{/if}

			<!-- Batch Card Header & Info -->
			<div class="space-y-1">
				<button 
					type="button"
					onclick={() => onSelectPiece(group.primaryPiece)}
					class="text-left w-full hover:underline focus:outline-hidden group/title cursor-pointer block"
					title="Click to view details"
				>
					<h4 class="font-display font-extrabold text-sm text-base-content group-hover/title:text-primary transition leading-snug truncate {group.primaryPiece.is_failed ? 'text-error font-extrabold' : ''}">
						{group.batchTitle}
					</h4>
				</button>
				{#if group.primaryPiece.is_failed && group.primaryPiece.failure_reason}
					<p class="text-[10.5px] font-semibold text-error bg-error/10 px-2 py-0.5 rounded border border-error/20 truncate" title={`Failure reason: ${group.primaryPiece.failure_reason}`}>
						Reason: {group.primaryPiece.failure_reason}
					</p>
				{/if}
				<div class="flex items-center gap-1.5 flex-wrap text-[11px] text-success font-medium">
					<span>{group.primaryPiece.clay_body_name}</span>
					{#if group.primaryPiece.weight_grams}
						<span class="badge badge-xs badge-ghost border border-base-300 font-bold">
							{formatClayWeight(group.primaryPiece.weight_grams)}/ea
						</span>
					{/if}
				</div>
			</div>

			<!-- Batch Dates Bar -->
			<div class="flex items-center justify-between text-[10px] text-base-content/70 font-medium pt-1 border-t border-base-300">
				{#if group.primaryPiece.started_at}
					<span class="flex items-center gap-1 text-success" title={`Started work on ${group.primaryPiece.started_at}`}>
						<Clock class="w-3 h-3 text-success" />
						<span>Started {formatDateShort(group.primaryPiece.started_at)}</span>
					</span>
				{:else}
					<span class="flex items-center gap-1 text-base-content/50" title={`Created on ${group.primaryPiece.created_at}`}>
						<Clock class="w-3 h-3" />
						<span>Created {formatDateShort(group.primaryPiece.created_at)}</span>
					</span>
				{/if}

				{#if group.primaryPiece.due_date}
					<span class="badge badge-warning badge-xs font-bold gap-1" title={`Due date: ${group.primaryPiece.due_date}`}>
						<Calendar class="w-3 h-3" />
						<span>Due {formatDateShort(group.primaryPiece.due_date)}</span>
					</span>
				{/if}
			</div>

			<!-- Tagged Glazes on Batch -->
			{#if group.primaryPiece.glaze_layers && group.primaryPiece.glaze_layers.length > 0}
				<div class="pt-2 border-t border-base-300 space-y-1">
					<span class="text-[10px] font-semibold text-base-content/70 block">Batch Glaze:</span>
					<div class="flex flex-col gap-1">
						{#each group.primaryPiece.glaze_layers as gl}
							<div class="text-[10px] font-medium px-2 py-0.5 rounded bg-base-200 text-base-content border border-base-300 flex items-center justify-between">
								<div class="flex items-center gap-1 truncate">
									<span class="badge badge-xs badge-primary">
										{gl.manufacturer}
									</span>
									<span class="truncate font-semibold">{gl.glaze_name}</span>
								</div>
								<span class="text-[8.5px] text-base-content/60 capitalize">{gl.coat_count}c</span>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Batch Action Bar -->
			<div class="pt-2.5 border-t border-base-300 flex items-center justify-between text-xs gap-1.5">
				<div class="flex items-center gap-1">
					<button 
						onclick={() => onSelectPiece(group.primaryPiece)}
						class="btn btn-xs btn-ghost p-1"
						title="View Details"
					>
						<Info class="w-3.5 h-3.5" />
					</button>

					<button 
						type="button"
						data-action-button
						onclick={() => onOpenSplitBatchModal(group.batchId!, stageId)}
						class="btn btn-xs btn-warning btn-outline gap-1 font-bold"
						title="Split Batch or Glaze Jobs Separately"
					>
						<GitFork class="w-3 h-3" />
						<span>Split Jobs</span>
					</button>
				</div>

				{#if stageId !== 'done'}
					<button 
						type="button"
						data-action-button
						onclick={() => onAdvanceBatchGroupStage(group)}
						class="btn btn-xs btn-success btn-outline gap-1 font-bold"
					>
						<span>Next ({group.pieces.length})</span>
						<ArrowRight class="w-3 h-3" />
					</button>
				{/if}
			</div>
		</div>
	</div>

	<!-- Stack Layer 2 (Middle Stack Card) -->
	<div class="ceramic-card bg-base-200 border border-base-300 h-full w-full pointer-events-none opacity-90 rounded-xl {group.primaryPiece.is_failed ? 'border-error/50 bg-error/10' : ''}"></div>
	<!-- Stack Layer 3 (Back Stack Card) -->
	<div class="ceramic-card bg-base-300 border border-base-300 h-full w-full pointer-events-none opacity-75 rounded-xl {group.primaryPiece.is_failed ? 'border-error/40 bg-error/15' : ''}"></div>
</div>
