<script lang="ts">
	import Clock from 'lucide-svelte/icons/clock';
	import Calendar from 'lucide-svelte/icons/calendar';
	import Layers2 from 'lucide-svelte/icons/layers-2';
	import ArrowRight from 'lucide-svelte/icons/arrow-right';
	import Info from 'lucide-svelte/icons/info';
	import Copy from 'lucide-svelte/icons/copy';
	import AlertTriangle from 'lucide-svelte/icons/alert-triangle';

	import type { CeramicPiece, CeramicStage } from '$lib/types/database';
	import { formatDateShort } from '$lib/utils/date';
	import { formatClayWeight } from '$lib/utils/dimensions';

	let {
		piece,
		stageId,
		isCardHovered = false,
		draggedPieceId = null,
		onSelectPiece,
		onOpenDuplicateModal,
		onOpenFailModal,
		onMovePieceToStage,
		onPointerDownPiece
	}: {
		piece: CeramicPiece;
		stageId: CeramicStage;
		isCardHovered?: boolean;
		draggedPieceId?: string | null;
		onSelectPiece: (piece: CeramicPiece) => void;
		onOpenDuplicateModal: (piece: CeramicPiece) => void;
		onOpenFailModal: (piece: CeramicPiece) => void;
		onMovePieceToStage: (pieceId: string, nextStage: CeramicStage) => void;
		onPointerDownPiece: (e: PointerEvent, pieceId: string, label: string) => void;
	} = $props();

	function getNextStage(current: CeramicStage): CeramicStage {
		const stages: CeramicStage[] = ['backlog', 'formed', 'leather_hard', 'trimmed', 'pending_bisque', 'bisqued', 'glazed', 'done'];
		const idx = stages.indexOf(current);
		return idx >= 0 && idx < stages.length - 1 ? stages[idx + 1] : 'done';
	}
</script>

<div class="ceramic-card-aura relative z-10">
	<div 
		role="listitem"
		data-card-group-key={piece.id}
		aria-grabbed={draggedPieceId === piece.id}
		draggable={false}
		onpointerdown={(e) => onPointerDownPiece(e, piece.id, piece.title)}
		class="ceramic-card relative z-10 snap-start p-3.5 rounded-xl border border-base-300 group space-y-3 cursor-grab active:cursor-grabbing select-none shadow-md hover:shadow-xl transition-all duration-200 min-w-0 {piece.is_failed ? 'border-2 border-error/70 bg-error/10 dark:bg-error/15 border-l-4 border-l-error shadow-error/15' : ''} {draggedPieceId === piece.id ? 'opacity-40 scale-95 border-dashed border-primary' : ''} {isCardHovered ? 'ring-2 ring-primary border-primary bg-primary/15' : ''}"
	>
		<!-- Merge Hover Highlight Banner -->
		{#if isCardHovered}
			<div class="bg-primary text-primary-content text-[10px] font-extrabold px-2.5 py-1 rounded-md text-center shadow-md animate-pulse flex items-center justify-center gap-1">
				<Layers2 class="w-3.5 h-3.5" />
				<span>Drop card to merge into batch!</span>
			</div>
		{/if}

		<!-- Card Top Tags -->
		<div class="flex items-center justify-between gap-1">
			<div class="flex items-center gap-1 truncate">
				{#if piece.is_failed}
					<span class="badge badge-error badge-sm font-extrabold text-[10px] gap-1 text-error-content shadow-xs">
						<AlertTriangle class="w-3 h-3 flex-shrink-0" />
						<span>FAILED</span>
					</span>
				{:else}
					<span class="badge badge-outline badge-sm font-semibold text-[10px] uppercase tracking-wider text-base-content/70">
						{piece.piece_type}
					</span>
				{/if}
			</div>
			<div class="flex items-center gap-1">
				{#if piece.is_failed}
					<span class="badge badge-outline badge-error badge-sm font-semibold text-[10px]">
						{piece.piece_type}
					</span>
				{/if}
				<span class="badge badge-accent badge-sm font-semibold text-[10px]">
					{piece.target_glaze_cone}
				</span>
			</div>
		</div>

		<!-- Thumbnail / Photo -->
		{#if piece.initial_photo_url}
			<button 
				type="button"
				onclick={() => onSelectPiece(piece)}
				class="w-full h-28 rounded-lg overflow-hidden relative bg-base-200 border border-base-300 text-left cursor-pointer group/photo block"
				title="Click to view details & photos"
			>
				<img src={piece.initial_photo_url} alt={piece.title} draggable={false} class="w-full h-full object-cover group-hover/photo:scale-105 transition duration-300 pointer-events-none select-none {piece.is_failed ? 'grayscale-[25%] opacity-90' : ''}" />
				{#if piece.is_failed}
					<div class="absolute inset-0 bg-error/10 mix-blend-multiply pointer-events-none"></div>
					<span class="absolute bottom-2 left-2 text-[10px] font-extrabold badge badge-error text-error-content gap-1 shadow-sm">
						<AlertTriangle class="w-3 h-3" />
						<span>Loss Archive</span>
					</span>
				{/if}
			</button>
		{/if}

		<!-- Piece Title & Info -->
		<div class="space-y-1">
			<button 
				type="button"
				onclick={() => onSelectPiece(piece)}
				class="text-left w-full hover:underline focus:outline-hidden group/title cursor-pointer block"
				title="Click to view details"
			>
				<h4 class="font-display font-bold text-sm text-base-content group-hover/title:text-primary transition leading-snug truncate {piece.is_failed ? 'text-error font-extrabold' : ''}">
					{piece.title}
				</h4>
			</button>
			{#if piece.is_failed && piece.failure_reason}
				<p class="text-[10.5px] font-semibold text-error bg-error/10 px-2 py-0.5 rounded border border-error/20 truncate" title={`Failure reason: ${piece.failure_reason}`}>
					Reason: {piece.failure_reason}
				</p>
			{/if}
			<div class="flex items-center gap-1.5 flex-wrap text-[11px] text-success font-medium">
				<span>{piece.clay_body_name}</span>
				{#if piece.weight_grams}
					<span class="badge badge-xs badge-ghost border border-base-300 font-bold">
						{formatClayWeight(piece.weight_grams)}
					</span>
				{/if}
			</div>
		</div>

		<!-- Dates Bar -->
		<div class="flex items-center justify-between text-[10px] text-base-content/70 font-medium pt-1 border-t border-base-300">
			{#if piece.started_at}
				<span class="flex items-center gap-1 text-success" title={`Started work on ${piece.started_at}`}>
					<Clock class="w-3 h-3 text-success" />
					<span>Started {formatDateShort(piece.started_at)}</span>
				</span>
			{:else}
				<span class="flex items-center gap-1 text-base-content/50" title={`Created on ${piece.created_at}`}>
					<Clock class="w-3 h-3" />
					<span>Created {formatDateShort(piece.created_at)}</span>
				</span>
			{/if}

			{#if piece.due_date}
				<span class="badge badge-warning badge-xs font-bold gap-1" title={`Due date: ${piece.due_date}`}>
					<Calendar class="w-3 h-3" />
					<span>Due {formatDateShort(piece.due_date)}</span>
				</span>
			{/if}
		</div>

		<!-- Tagged Glazes -->
		{#if piece.glaze_layers && piece.glaze_layers.length > 0}
			<div class="pt-2 border-t border-base-300 space-y-1">
				<span class="text-[10px] font-semibold text-base-content/70 block">Glazes Applied:</span>
				<div class="flex flex-col gap-1">
					{#each piece.glaze_layers as gl}
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

		<!-- Action Buttons Bar -->
		<div class="pt-2.5 border-t border-base-300 flex items-center justify-between text-xs gap-1">
			<div class="flex items-center gap-1">
				<button 
					onclick={() => onSelectPiece(piece)}
					class="btn btn-xs btn-ghost p-1"
					title="View Details"
				>
					<Info class="w-3.5 h-3.5" />
				</button>
				<button 
					onclick={() => onOpenDuplicateModal(piece)}
					class="btn btn-xs btn-ghost p-1"
					title="Duplicate Piece"
				>
					<Copy class="w-3.5 h-3.5" />
				</button>
				{#if !piece.is_failed}
					<button 
						onclick={() => onOpenFailModal(piece)}
						class="btn btn-xs btn-ghost text-error p-1"
						title="Flag as Failed / Loss"
					>
						<AlertTriangle class="w-3.5 h-3.5" />
					</button>
				{/if}
			</div>

			{#if stageId !== 'done'}
				<button 
					type="button"
					data-action-button
					onclick={() => onMovePieceToStage(piece.id, getNextStage(stageId))}
					class="btn btn-xs btn-primary font-bold gap-1 shadow-xs"
				>
					<span>Next</span>
					<ArrowRight class="w-3 h-3" />
				</button>
			{/if}
		</div>
	</div>
</div>
