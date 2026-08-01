<script lang="ts">
	import AlertTriangle from 'lucide-svelte/icons/alert-triangle';
	import X from 'lucide-svelte/icons/x';
	import type { CeramicPiece } from '$lib/types/database';

	let {
		isOpen = $bindable(false),
		pieceToFail,
		onConfirm
	}: {
		isOpen: boolean;
		pieceToFail: CeramicPiece | null;
		onConfirm: (reason: string) => void;
	} = $props();

	let failReason = $state('S-crack in foot during drying');
</script>

{#if isOpen && pieceToFail}
	<div 
		role="dialog" 
		aria-modal="true"
		tabindex="-1"
		onclick={(e) => { if (e.target === e.currentTarget) isOpen = false; }}
		onkeydown={(e) => { if (e.key === 'Escape') isOpen = false; }}
		class="modal modal-open"
	>
		<div class="modal-box max-w-md bg-base-100 text-base-content border border-error/40 shadow-2xl p-6 rounded-2xl space-y-5">
			<div class="flex items-center justify-between border-b border-base-300 pb-3">
				<div class="flex items-center gap-2 text-error font-display font-bold text-base">
					<AlertTriangle class="w-5 h-5" />
					<h3>Flag Piece as Failed</h3>
				</div>
				<button onclick={() => isOpen = false} class="btn btn-sm btn-circle btn-ghost">
					<X class="w-4 h-4" />
				</button>
			</div>

			<p class="text-xs text-base-content/80 leading-relaxed">
				Flagging <strong class="text-base-content">{pieceToFail.title}</strong> will move it into your studio failure archives.
			</p>

			<div class="space-y-1.5 text-xs">
				<label for="fail-reason" class="text-base-content font-semibold">Failure Reason</label>
				<input 
					id="fail-reason"
					type="text" 
					list="fail-reasons-list"
					bind:value={failReason} 
					placeholder="Select or enter failure reason..."
					class="input input-bordered input-sm w-full"
				/>
				<datalist id="fail-reasons-list">
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

			<div class="modal-action border-t border-base-300 pt-3 flex justify-end gap-2 text-xs">
				<button 
					onclick={() => isOpen = false}
					class="btn btn-ghost btn-sm"
				>
					Cancel
				</button>
				<button 
					onclick={() => { onConfirm(failReason); isOpen = false; }}
					class="btn btn-error btn-sm font-bold text-white shadow"
				>
					Flag as Failed
				</button>
			</div>
		</div>
	</div>
{/if}
