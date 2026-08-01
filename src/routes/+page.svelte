<script lang="ts">
	import GripVertical from 'lucide-svelte/icons/grip-vertical';

	import type { 
		CeramicPiece, 
		ClayBody, 
		CeramicStage, 
		PieceStageLog, 
		PieceGlazeLayer, 
		GlazeRecipe, 
		GlazeStyle, 
		GlazeLocation, 
		PieceBatch, 
		KanbanDisplayGroup 
	} from '$lib/types/database';

	import { PYROMETRIC_CONES } from '$lib/constants/pyrometricCones';
	import { STAGES } from '$lib/constants/stages';
	import { MANUFACTURERS, PIECE_TYPES } from '$lib/constants/manufacturers';
	import { GLAZE_LOCATIONS } from '$lib/constants/glazeLocations';
	import { formatDateShort, formatDateInput, parseDateInput } from '$lib/utils/date';
	import { toGrams, formatClayWeight, calculateFormedDimension, calculateFiredDimension, type WeightUnit } from '$lib/utils/dimensions';

	import Toast from '$lib/components/common/Toast.svelte';
	import BoardHeader from '$lib/components/board/BoardHeader.svelte';
	import KanbanBoard from '$lib/components/board/KanbanBoard.svelte';
	import PyrometricChartModal from '$lib/components/modals/PyrometricChartModal.svelte';
	import ClayLibraryModal from '$lib/components/modals/ClayLibraryModal.svelte';
	import GlazeLibraryModal from '$lib/components/modals/GlazeLibraryModal.svelte';
	import FailPieceModal from '$lib/components/modals/FailPieceModal.svelte';
	import DuplicateModal from '$lib/components/modals/DuplicateModal.svelte';
	import JobSplitModal from '$lib/components/modals/JobSplitModal.svelte';
	import NewPieceModal from '$lib/components/modals/NewPieceModal.svelte';
	import PieceDetailModal from '$lib/components/modals/PieceDetailModal.svelte';

	// Initial State
	let clayBodies = $state<ClayBody[]>([
		{ id: 'cb-1', is_global: true, name: 'Speckled Buff 80', manufacturer: 'Laguna Clay', min_cone: 'Cone 5', max_cone: 'Cone 10', firing_range: 'Cone 5-10', shrinkage_pct: 12.0, raw_color: 'Buff', fired_color: 'Speckled Cream' },
		{ id: 'cb-2', is_global: true, name: 'B-Mix 5 (with Grog)', manufacturer: 'Laguna Clay', min_cone: 'Cone 5', max_cone: 'Cone 6', firing_range: 'Cone 5-6', shrinkage_pct: 11.5, raw_color: 'Off-White', fired_color: 'Cream Smooth' },
		{ id: 'cb-3', is_global: true, name: 'Frost Porcelain 365', manufacturer: 'Standard Clay', min_cone: 'Cone 6', max_cone: 'Cone 6', firing_range: 'Cone 6', shrinkage_pct: 14.0, raw_color: 'Pure White', fired_color: 'Translucent White' },
		{ id: 'cb-4', is_global: true, name: 'Red Terracotta Earthenware', manufacturer: 'Highwater', min_cone: 'Cone 06', max_cone: 'Cone 04', firing_range: 'Cone 06-04', shrinkage_pct: 9.5, raw_color: 'Red', fired_color: 'Terracotta Rust' },
		{ id: 'cb-5', is_global: false, name: 'Studio Reclaim Blend #3', manufacturer: 'Custom Studio', min_cone: 'Cone 5', max_cone: 'Cone 6', firing_range: 'Cone 5-6', shrinkage_pct: 12.5, raw_color: 'Grey', fired_color: 'Toasted Oatmeal' }
	]);

	let glazes = $state<GlazeRecipe[]>([
		{ id: 'glz-1', is_global: true, name: 'PC-20 Blue Rutile', manufacturer: 'Amaco', default_style: 'brush', min_cone: 'Cone 5', max_cone: 'Cone 6', target_cone: 'Cone 6', atmosphere: 'Oxidation', batch_liters: 0.5, notes: 'Flowing blue and rutile highlights. 3 brushed coats.' },
		{ id: 'glz-2', is_global: true, name: 'PC-50 Seafoam', manufacturer: 'Amaco', default_style: 'brush', min_cone: 'Cone 5', max_cone: 'Cone 6', target_cone: 'Cone 6', atmosphere: 'Oxidation', batch_liters: 0.5, notes: 'Soft satin green glaze. Beautiful over texture.' },
		{ id: 'glz-3', is_global: true, name: 'SW-119 Honey Flux', manufacturer: 'Mayco', default_style: 'brush', min_cone: 'Cone 5', max_cone: 'Cone 6', target_cone: 'Cone 6', atmosphere: 'Oxidation', batch_liters: 0.5, notes: 'High mobility accent glaze. Flowing rim drips.' },
		{ id: 'glz-4', is_global: true, name: 'Celadon Jade Studio Bucket', manufacturer: 'Custom Studio', default_style: 'dip', min_cone: 'Cone 5', max_cone: 'Cone 6', target_cone: 'Cone 6', atmosphere: 'Oxidation', batch_liters: 10.0, notes: '3-second dipping bucket for smooth translucent celadon.' },
		{ id: 'glz-5', is_global: true, name: 'Floating Blue Studio Bucket', manufacturer: 'Custom Studio', default_style: 'dip', min_cone: 'Cone 5', max_cone: 'Cone 6', target_cone: 'Cone 6', atmosphere: 'Oxidation', batch_liters: 8.0, notes: 'Variegated cobalt floating bucket glaze.' },
		{ id: 'glz-6', is_global: false, name: 'Tenmoku Satin Black', manufacturer: 'Custom Studio', default_style: 'dip', min_cone: 'Cone 5', max_cone: 'Cone 6', target_cone: 'Cone 6', atmosphere: 'Oxidation / Reduction', batch_liters: 5.0, notes: 'Rich iron black with bronze oil-spotting.' }
	]);

	const sampleBatchObj: PieceBatch = {
		id: 'b-101',
		user_id: 'user-1',
		title: '6x Speckled Studio Mugs',
		description: 'Board of 6 identical thrown mugs',
		created_at: new Date('2026-07-25T00:00:00'),
		updated_at: new Date('2026-07-25T00:00:00')
	};

	const sampleBatchPieces: CeramicPiece[] = Array.from({ length: 6 }).map((_, i) => ({
		id: `p-batch-101-${i + 1}`,
		user_id: 'user-1',
		title: `Speckled Studio Mug #${i + 1}`,
		description: 'Thrown on wheel with 420g Laguna Speckled Buff. Clean rim.',
		piece_type: 'Mug',
		clay_body_id: 'cb-1',
		clay_body_name: 'Speckled Buff 80',
		stage: 'pending_bisque' as CeramicStage,
		batch_id: 'b-101',
		batch_sequence: i + 1,
		batch: sampleBatchObj,
		is_failed: false,
		target_bisque_cone: 'Cone 04',
		target_glaze_cone: 'Cone 6',
		weight_grams: 420,
		height_cm: 9.5,
		width_cm: 8.5,
		target_length_cm: 8.5,
		target_width_cm: 8.5,
		target_height_cm: 9.5,
		formed_length_cm: 9.66,
		formed_width_cm: 9.66,
		formed_height_cm: 10.80,
		initial_photo_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80',
		started_at: new Date('2026-07-25T00:00:00'),
		due_date: new Date('2026-08-10T00:00:00'),
		created_at: new Date('2026-07-25T00:00:00'),
		updated_at: new Date('2026-07-25T00:00:00'),
		stage_logs: [
			{ id: `log-b-${i + 1}`, piece_id: `p-batch-101-${i + 1}`, user_id: 'user-1', stage: 'formed', weight_grams: 480, notes: 'Thrown in batch of 6.', created_at: new Date('2026-07-25T00:00:00') }
		],
		glaze_layers: []
	}));

	let pieces = $state<CeramicPiece[]>([
		...sampleBatchPieces,
		{
			id: 'p-101',
			user_id: 'user-1',
			title: 'Ribbed Matcha Bowl',
			description: 'Deep wall design with flared rim and hand-carved exterior fluting.',
			piece_type: 'Bowl',
			clay_body_id: 'cb-1',
			clay_body_name: 'Speckled Buff 80',
			stage: 'trimmed',
			is_failed: false,
			target_bisque_cone: 'Cone 06',
			target_glaze_cone: 'Cone 6',
			weight_grams: 480,
			height_cm: 8.5,
			width_cm: 13.0,
			target_length_cm: 13.0,
			target_width_cm: 13.0,
			target_height_cm: 8.5,
			formed_length_cm: 14.77,
			formed_width_cm: 14.77,
			formed_height_cm: 9.66,
			initial_photo_url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&auto=format&fit=crop&q=80',
			started_at: new Date('2026-07-22T00:00:00'),
			due_date: new Date('2026-08-05T00:00:00'),
			created_at: new Date('2026-07-22T00:00:00'),
			updated_at: new Date('2026-07-23T00:00:00'),
			stage_logs: [
				{ id: 'log-1', piece_id: 'p-101', user_id: 'user-1', stage: 'formed', weight_grams: 550, notes: 'Thrown on wheel with 550g clay. Fluted walls.', created_at: new Date('2026-07-22T00:00:00') }
			],
			glaze_layers: []
		},
		{
			id: 'p-102',
			user_id: 'user-1',
			title: 'Tapered Espresso Cup #1',
			description: 'Single finger pulled handle. Layered Amaco PC-20 over Honey Flux.',
			piece_type: 'Mug',
			clay_body_id: 'cb-2',
			clay_body_name: 'B-Mix 5 (with Grog)',
			stage: 'glazed',
			is_failed: false,
			target_bisque_cone: 'Cone 04',
			target_glaze_cone: 'Cone 6',
			weight_grams: 210,
			height_cm: 7.0,
			width_cm: 8.0,
			target_length_cm: 8.0,
			target_width_cm: 8.0,
			target_height_cm: 7.0,
			formed_length_cm: 9.04,
			formed_width_cm: 9.04,
			formed_height_cm: 7.91,
			initial_photo_url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&auto=format&fit=crop&q=80',
			started_at: new Date('2026-07-18T00:00:00'),
			due_date: new Date('2026-07-30T00:00:00'),
			created_at: new Date('2026-07-18T00:00:00'),
			updated_at: new Date('2026-07-24T00:00:00'),
			stage_logs: [
				{ id: 'log-4', piece_id: 'p-102', user_id: 'user-1', stage: 'glazed', notes: 'Bisque fired clean cone 04. Ready for glaze kiln.', created_at: new Date('2026-07-24T00:00:00') }
			],
			glaze_layers: [
				{ id: 'gl-1', piece_id: 'p-102', glaze_id: 'glz-1', glaze_name: 'PC-20 Blue Rutile', manufacturer: 'Amaco', layer_order: 1, coat_count: 3, application_method: 'brush', location: 'outside', created_at: new Date('2026-07-24T00:00:00') },
				{ id: 'gl-2', piece_id: 'p-102', glaze_id: 'glz-3', glaze_name: 'SW-119 Honey Flux', manufacturer: 'Mayco', layer_order: 2, coat_count: 2, application_method: 'brush', location: 'top', created_at: new Date('2026-07-24T00:00:00') }
			]
		},
		{
			id: 'p-103',
			user_id: 'user-1',
			title: 'Tall Ikebana Flower Vase',
			description: 'Commission for Studio Gallery exhibit.',
			piece_type: 'Vase',
			clay_body_id: 'cb-3',
			clay_body_name: 'Frost Porcelain 365',
			stage: 'backlog',
			is_failed: false,
			target_bisque_cone: 'Cone 06',
			target_glaze_cone: 'Cone 6',
			weight_grams: 1200,
			height_cm: 24.0,
			width_cm: 11.0,
			target_length_cm: 11.0,
			target_width_cm: 11.0,
			target_height_cm: 24.0,
			formed_length_cm: 12.79,
			formed_width_cm: 12.79,
			formed_height_cm: 27.91,
			initial_photo_url: null,
			started_at: null,
			due_date: new Date('2026-08-15T00:00:00'),
			created_at: new Date('2026-07-24T00:00:00'),
			updated_at: new Date('2026-07-24T00:00:00'),
			stage_logs: [],
			glaze_layers: []
		},
		{
			id: 'p-failed-101',
			user_id: 'user-1',
			title: 'Cracked Slab Pitcher',
			description: 'Bottom wall cracked during bisque expansion.',
			piece_type: 'Pitcher',
			clay_body_id: 'cb-4',
			clay_body_name: 'Red Terracotta Earthenware',
			stage: 'done',
			is_failed: true,
			failure_stage: 'pending_bisque',
			failure_reason: 'Thermal stress S-crack in base',
			failed_at: new Date('2026-07-24T00:00:00'),
			target_bisque_cone: 'Cone 04',
			target_glaze_cone: 'Cone 06',
			weight_grams: 850,
			height_cm: 18.0,
			width_cm: 12.0,
			target_length_cm: 14.0,
			target_width_cm: 12.0,
			target_height_cm: 18.0,
			formed_length_cm: 15.47,
			formed_width_cm: 13.26,
			formed_height_cm: 19.89,
			initial_photo_url: null,
			started_at: new Date('2026-07-20T00:00:00'),
			due_date: null,
			created_at: new Date('2026-07-20T00:00:00'),
			updated_at: new Date('2026-07-24T00:00:00'),
			stage_logs: [],
			glaze_layers: []
		}
	]);

	// View Mode & Navigation
	let viewMode = $state<'lanes' | 'table'>('lanes');
	let mobileActiveStage = $state<CeramicStage | 'all'>('all');
	let showLossArchive = $state(false);

	// Modals State
	let showGlazeLibraryModal = $state(false);
	let showClayLibraryModal = $state(false);
	let showPyrometricChartModal = $state(false);
	let isNewPieceModalOpen = $state(false);
	let isFailModalOpen = $state(false);
	let isDuplicateModalOpen = $state(false);
	let isSplitModalOpen = $state(false);
	let isMobileFilterDrawerOpen = $state(false);

	let selectedPiece = $state<CeramicPiece | null>(null);
	let pieceToFail = $state<CeramicPiece | null>(null);
	let pieceToDuplicate = $state<CeramicPiece | null>(null);
	let splitTargetBatchId = $state<string | null>(null);
	let splitTargetBatchTitle = $state<string>('');
	let splitBatchPieces = $state<CeramicPiece[]>([]);

	// Filtering State
	let filterSearchQuery = $state('');
	let filterFormType = $state('all');
	let filterClayBody = $state('all');
	let filterGlaze = $state('all');
	let filterTargetCone = $state('all');
	let filterDueDate = $state('all');
	let filterWeightEnabled = $state(false);
	let appliedMinWeight = $state(0);
	let appliedMaxWeight = $state(2000);
	let appliedWeightUnit = $state<WeightUnit>('g');

	// Toast Notification State
	let toastMessage = $state<string | null>(null);
	let toastType = $state<'success' | 'warning' | 'error' | 'info'>('success');
	let toastTimeout: ReturnType<typeof setTimeout>;

	function showToast(message: string, type: 'success' | 'warning' | 'error' | 'info' = 'success') {
		toastMessage = message;
		toastType = type;
		if (toastTimeout) clearTimeout(toastTimeout);
		toastTimeout = setTimeout(() => {
			toastMessage = null;
		}, 3500);
	}

	// Filtered Pieces Derived State
	let filteredPieces = $derived.by(() => {
		return pieces.filter(piece => {
			if (filterSearchQuery.trim()) {
				const q = filterSearchQuery.toLowerCase().trim();
				const matchTitle = piece.title.toLowerCase().includes(q);
				const matchClay = (piece.clay_body_name || '').toLowerCase().includes(q);
				const matchForm = piece.piece_type.toLowerCase().includes(q);
				const matchNotes = (piece.notes || piece.description || '').toLowerCase().includes(q);
				const matchGlaze = piece.glaze_layers ? piece.glaze_layers.some(g => g.glaze_name.toLowerCase().includes(q)) : false;
				if (!matchTitle && !matchClay && !matchForm && !matchNotes && !matchGlaze) return false;
			}

			if (filterFormType !== 'all' && piece.piece_type !== filterFormType) return false;
			if (filterClayBody !== 'all' && piece.clay_body_name !== filterClayBody) return false;

			if (filterGlaze === 'unglazed') {
				if (piece.glaze_layers && piece.glaze_layers.length > 0) return false;
			} else if (filterGlaze !== 'all') {
				if (!piece.glaze_layers || !piece.glaze_layers.some(g => g.glaze_name === filterGlaze)) return false;
			}

			if (filterTargetCone !== 'all' && piece.target_glaze_cone !== filterTargetCone) return false;

			if (filterDueDate !== 'all') {
				if (filterDueDate === 'no_due_date' && piece.due_date) return false;
				if (filterDueDate === 'has_due_date' && !piece.due_date) return false;
				if (piece.due_date) {
					const now = new Date();
					now.setHours(0, 0, 0, 0);
					const due = new Date(piece.due_date);
					due.setHours(0, 0, 0, 0);
					const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

					if (filterDueDate === 'overdue' && diffDays >= 0) return false;
					if (filterDueDate === 'due_today' && diffDays !== 0) return false;
					if (filterDueDate === 'less_than_1_week' && (diffDays < 0 || diffDays > 7)) return false;
					if (filterDueDate === 'less_than_2_weeks' && (diffDays < 0 || diffDays > 14)) return false;
				}
			}

			if (filterWeightEnabled && piece.weight_grams) {
				const minGrams = toGrams(appliedMinWeight, appliedWeightUnit);
				const maxGrams = toGrams(appliedMaxWeight, appliedWeightUnit);
				if (piece.weight_grams < minGrams || piece.weight_grams > maxGrams) return false;
			}

			return true;
		});
	});

	// Drag & Drop State & Unified Pointer Drag
	let draggedPieceId = $state<string | null>(null);
	let draggedBatchKey = $state<string | null>(null);
	let dragOverStageId = $state<CeramicStage | null>(null);
	let dragOverCardGroupKey = $state<string | null>(null);
	let touchDragActive = $state(false);
	let touchDragGhostX = $state(0);
	let touchDragGhostY = $state(0);
	let touchDragLabel = $state('');
	let boardContainerRef = $state<HTMLElement | null>(null);
	let touchLongPressTimer: ReturnType<typeof setTimeout> | null = null;
	let pendingPieceId: string | null = null;
	let pendingBatchKey: string | null = null;
	let pendingLabel = '';
	let pendingPointerTarget: HTMLElement | null = null;
	let pendingPointerId: number | null = null;
	let touchStartX = 0;
	let touchStartY = 0;
	const TOUCH_MOVE_THRESHOLD = 18;
	const TOUCH_HOLD_MS = 450;
	const MOUSE_HOLD_MS = 50;
	let autoScrollAnimFrame: number | null = null;
	let isSnappingStage = false;
	let lastStageSnapTime = 0;

	function resetDragState() {
		if (touchLongPressTimer) {
			clearTimeout(touchLongPressTimer);
			touchLongPressTimer = null;
		}
		if (autoScrollAnimFrame !== null) {
			cancelAnimationFrame(autoScrollAnimFrame);
			autoScrollAnimFrame = null;
		}
		if (pendingPointerTarget && pendingPointerId !== null) {
			try {
				if (pendingPointerTarget.hasPointerCapture(pendingPointerId)) {
					pendingPointerTarget.releasePointerCapture(pendingPointerId);
				}
			} catch {}
		}
		pendingPointerTarget = null;
		pendingPointerId = null;
		pendingPieceId = null;
		pendingBatchKey = null;
		touchDragActive = false;
		isSnappingStage = false;
		draggedPieceId = null;
		draggedBatchKey = null;
		dragOverStageId = null;
		dragOverCardGroupKey = null;
	}

	function handlePointerDownPiece(e: PointerEvent, pieceId: string, label: string) {
		if (e.button !== 0) return;
		resetDragState();
		pendingPieceId = pieceId;
		pendingBatchKey = null;
		pendingLabel = label;
		pendingPointerTarget = e.currentTarget as HTMLElement;
		pendingPointerId = e.pointerId;
		touchStartX = e.clientX;
		touchStartY = e.clientY;

		const holdMs = e.pointerType === 'mouse' ? MOUSE_HOLD_MS : TOUCH_HOLD_MS;

		touchLongPressTimer = setTimeout(() => {
			if (!pendingPieceId) return;
			draggedPieceId = pendingPieceId;
			draggedBatchKey = null;
			touchDragActive = true;
			touchDragGhostX = touchStartX;
			touchDragGhostY = touchStartY;
			touchDragLabel = pendingLabel;

			try {
				if (pendingPointerTarget && pendingPointerId !== null) {
					pendingPointerTarget.setPointerCapture(pendingPointerId);
				}
			} catch {}
		}, holdMs);
	}

	function handlePointerDownBatch(e: PointerEvent, batchId: string, stageId: CeramicStage, glazeSig: string, label: string) {
		if (e.button !== 0) return;
		resetDragState();
		pendingBatchKey = `${batchId}::${stageId}::${glazeSig}`;
		pendingPieceId = null;
		pendingLabel = label;
		pendingPointerTarget = e.currentTarget as HTMLElement;
		pendingPointerId = e.pointerId;
		touchStartX = e.clientX;
		touchStartY = e.clientY;

		const holdMs = e.pointerType === 'mouse' ? MOUSE_HOLD_MS : TOUCH_HOLD_MS;

		touchLongPressTimer = setTimeout(() => {
			if (!pendingBatchKey) return;
			draggedBatchKey = pendingBatchKey;
			draggedPieceId = null;
			touchDragActive = true;
			touchDragGhostX = touchStartX;
			touchDragGhostY = touchStartY;
			touchDragLabel = pendingLabel;

			try {
				if (pendingPointerTarget && pendingPointerId !== null) {
					pendingPointerTarget.setPointerCapture(pendingPointerId);
				}
			} catch {}
		}, holdMs);
	}

	function snapStageToCenter(stageId: CeramicStage) {
		if (!boardContainerRef) return;
		const stageEl = boardContainerRef.querySelector(`[data-stage-id="${stageId}"]`) as HTMLElement | null;
		if (stageEl) {
			stageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
		}
	}

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

	function executeCardMerge(targetCardKey: string) {
		let targetGroup: KanbanDisplayGroup | undefined;
		for (const stage of STAGES) {
			const groups = getStageCardGroups(stage.id);
			const match = groups.find(g => (g.isBatch ? g.batchId! : g.primaryPiece.id) === targetCardKey);
			if (match) {
				targetGroup = match;
				break;
			}
		}
		if (!targetGroup) return;

		const targetPiece = targetGroup.primaryPiece;
		const targetBatchId = targetGroup.isBatch ? targetGroup.batchId : targetPiece.batch_id;

		let sourcePiecesToMerge: CeramicPiece[] = [];

		if (draggedBatchKey) {
			const [srcBatchId, srcStage] = draggedBatchKey.split('::');
			if (srcBatchId === targetBatchId) return;
			sourcePiecesToMerge = pieces.filter(p => p.batch_id === srcBatchId && p.stage === srcStage && !p.is_failed);
		} else if (draggedPieceId) {
			if (draggedPieceId === targetPiece.id) return;
			const srcPiece = pieces.find(p => p.id === draggedPieceId);
			if (srcPiece) sourcePiecesToMerge = [srcPiece];
		}

		if (sourcePiecesToMerge.length === 0) return;

		const invalidItems = sourcePiecesToMerge.filter(p => 
			(p.clay_body_id && targetPiece.clay_body_id ? p.clay_body_id !== targetPiece.clay_body_id : p.clay_body_name !== targetPiece.clay_body_name) ||
			p.piece_type !== targetPiece.piece_type ||
			p.stage !== targetPiece.stage
		);

		if (invalidItems.length > 0) {
			showToast(`Cannot merge: Items must share the same clay (${targetPiece.clay_body_name}), form type (${targetPiece.piece_type}), and stage!`, 'warning');
			return;
		}

		const effectiveBatchId = targetBatchId || `b-${Date.now()}`;
		const effectiveBatchTitle = targetGroup.batchTitle || targetPiece.batch?.title || `${targetPiece.title.replace(/\s*#\d+$/, '')} Batch`;

		const batchObj: PieceBatch = targetPiece.batch || {
			id: effectiveBatchId,
			user_id: 'user-1',
			title: effectiveBatchTitle,
			created_at: new Date(),
			updated_at: new Date()
		};

		const sourceSet = new Set(sourcePiecesToMerge.map(p => p.id));

		pieces = pieces.map(p => {
			if (sourceSet.has(p.id)) {
				return { ...p, batch_id: effectiveBatchId, batch: batchObj, updated_at: new Date() };
			}
			if (p.id === targetPiece.id && !p.batch_id) {
				return { ...p, batch_id: effectiveBatchId, batch: batchObj, updated_at: new Date() };
			}
			return p;
		});

		showToast(`Merged ${sourcePiecesToMerge.length} piece(s) into batch "${effectiveBatchTitle}"!`);
		snapStageToCenter(targetPiece.stage);
	}

	function executeStageMove(targetStage: CeramicStage) {
		const targetStageObj = STAGES.find(s => s.id === targetStage);
		const stageName = targetStageObj?.label || targetStage;
		const now = new Date();

		if (draggedBatchKey) {
			const [bId, srcStage, glazeSig] = draggedBatchKey.split('::');
			const isMovingOutFromBacklog = srcStage === 'backlog' && targetStage !== 'backlog';

			pieces = pieces.map(p => {
				if (p.batch_id === bId && p.stage === srcStage && !p.is_failed) {
					const pGlazeSig = p.glaze_layers ? p.glaze_layers.map(g => g.glaze_name).sort().join('|') : '';
					if (pGlazeSig === glazeSig) {
						return {
							...p,
							stage: targetStage,
							started_at: isMovingOutFromBacklog ? (p.started_at || now) : p.started_at,
							updated_at: now
						};
					}
				}
				return p;
			});
			showToast(`Moved batch stack to ${stageName}`);
		} else if (draggedPieceId) {
			const piece = pieces.find(p => p.id === draggedPieceId);
			if (piece) {
				const isMovingOutFromBacklog = piece.stage === 'backlog' && targetStage !== 'backlog';
				pieces = pieces.map(p => {
					if (p.id === draggedPieceId) {
						return {
							...p,
							stage: targetStage,
							started_at: isMovingOutFromBacklog ? (p.started_at || now) : p.started_at,
							updated_at: now
						};
					}
					return p;
				});
				showToast(`Moved piece "${piece.title}" to ${stageName}`);
			}
		}

		snapStageToCenter(targetStage);
	}

	function updateAutoScroll() {
		if (!touchDragActive || !boardContainerRef || isSnappingStage) {
			if (autoScrollAnimFrame !== null) {
				cancelAnimationFrame(autoScrollAnimFrame);
				autoScrollAnimFrame = null;
			}
			return;
		}

		const now = Date.now();
		if (now - lastStageSnapTime < 500) {
			autoScrollAnimFrame = requestAnimationFrame(updateAutoScroll);
			return;
		}

		const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 800;
		const EDGE_THRESHOLD = 80;

		const stageElements = Array.from(boardContainerRef.querySelectorAll('[data-stage-id]')) as HTMLElement[];
		if (stageElements.length === 0) return;

		const containerRect = boardContainerRef.getBoundingClientRect();
		const containerCenter = containerRect.left + containerRect.width / 2;

		let closestIdx = 0;
		let minDiff = Infinity;
		stageElements.forEach((el, idx) => {
			const rect = el.getBoundingClientRect();
			const stageCenter = rect.left + rect.width / 2;
			const diff = Math.abs(stageCenter - containerCenter);
			if (diff < minDiff) {
				minDiff = diff;
				closestIdx = idx;
			}
		});

		let targetIdx = closestIdx;
		if (touchDragGhostX > viewportWidth - EDGE_THRESHOLD) {
			targetIdx = Math.min(stageElements.length - 1, closestIdx + 1);
		} else if (touchDragGhostX < EDGE_THRESHOLD) {
			targetIdx = Math.max(0, closestIdx - 1);
		}

		if (targetIdx !== closestIdx) {
			const targetEl = stageElements[targetIdx];
			isSnappingStage = true;
			lastStageSnapTime = now;

			targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

			setTimeout(() => {
				isSnappingStage = false;
				const el = document.elementFromPoint(touchDragGhostX, touchDragGhostY);
				if (el) {
					const cardEl = el.closest('[data-card-group-key]') as HTMLElement | null;
					const stageEl = el.closest('[data-stage-id]') as HTMLElement | null;

					const targetCardKey = cardEl?.dataset.cardGroupKey || null;

					let isSelf = false;
					if (targetCardKey) {
						if (draggedBatchKey) {
							const [srcBatchId] = draggedBatchKey.split('::');
							isSelf = targetCardKey === srcBatchId;
						} else if (draggedPieceId) {
							isSelf = targetCardKey === draggedPieceId;
						}
					}

					dragOverCardGroupKey = isSelf ? null : targetCardKey;
					dragOverStageId = stageEl ? (stageEl.dataset.stageId as CeramicStage) : null;
				}
			}, 500);
		}

		autoScrollAnimFrame = requestAnimationFrame(updateAutoScroll);
	}

	$effect(() => {
		if (typeof window === 'undefined') return;

		const onMove = (e: PointerEvent) => {
			if (!touchDragActive && (pendingPieceId || pendingBatchKey)) {
				const dx = Math.abs(e.clientX - touchStartX);
				const dy = Math.abs(e.clientY - touchStartY);
				if (dx > TOUCH_MOVE_THRESHOLD || dy > TOUCH_MOVE_THRESHOLD) {
					resetDragState();
				}
				return;
			}

			if (!touchDragActive) return;

			if (e.cancelable) e.preventDefault();

			touchDragGhostX = e.clientX;
			touchDragGhostY = e.clientY;

			if (autoScrollAnimFrame === null) {
				autoScrollAnimFrame = requestAnimationFrame(updateAutoScroll);
			}

			const el = document.elementFromPoint(e.clientX, e.clientY);
			if (el) {
				const cardEl = el.closest('[data-card-group-key]') as HTMLElement | null;
				const stageEl = el.closest('[data-stage-id]') as HTMLElement | null;

				const targetCardKey = cardEl?.dataset.cardGroupKey || null;

				let isSelf = false;
				if (targetCardKey) {
					if (draggedBatchKey) {
						const [srcBatchId] = draggedBatchKey.split('::');
						isSelf = targetCardKey === srcBatchId;
					} else if (draggedPieceId) {
						isSelf = targetCardKey === draggedPieceId;
					}
				}

				dragOverCardGroupKey = isSelf ? null : targetCardKey;
				dragOverStageId = stageEl ? (stageEl.dataset.stageId as CeramicStage) : null;
			} else {
				dragOverCardGroupKey = null;
				dragOverStageId = null;
			}
		};

		const onUp = (e: PointerEvent) => {
			if (touchDragActive) {
				const targetCardKey = dragOverCardGroupKey;
				const targetStage = dragOverStageId;

				if (targetCardKey) {
					try {
						executeCardMerge(targetCardKey);
					} catch (err) {
						console.error('Merge execution failed:', err);
					}
				} else if (targetStage) {
					try {
						executeStageMove(targetStage);
					} catch (err) {
						console.error('Drop execution failed:', err);
					}
				}
			}

			resetDragState();
		};

		const onCancel = () => {
			resetDragState();
		};

		const onTouchMove = (e: TouchEvent) => {
			if (touchDragActive) {
				if (e.cancelable) e.preventDefault();
				if (e.touches && e.touches.length > 0) {
					touchDragGhostX = e.touches[0].clientX;
					touchDragGhostY = e.touches[0].clientY;

					if (autoScrollAnimFrame === null) {
						autoScrollAnimFrame = requestAnimationFrame(updateAutoScroll);
					}
				}
			}
		};

		window.addEventListener('pointermove', onMove, { passive: false });
		window.addEventListener('touchmove', onTouchMove, { passive: false });
		window.addEventListener('pointerup', onUp);
		window.addEventListener('pointercancel', onCancel);
		window.addEventListener('blur', onCancel);
		window.addEventListener('dragend', onCancel);

		return () => {
			window.removeEventListener('pointermove', onMove);
			window.removeEventListener('touchmove', onTouchMove);
			window.removeEventListener('pointerup', onUp);
			window.removeEventListener('pointercancel', onCancel);
			window.removeEventListener('blur', onCancel);
			window.removeEventListener('dragend', onCancel);
		};
	});

	// Piece & Batch Operations
	function movePieceToStage(pieceId: string, targetStage: CeramicStage) {
		const targetStageObj = STAGES.find(s => s.id === targetStage);
		const stageName = targetStageObj?.label || targetStage;
		const now = new Date();
		pieces = pieces.map(p => {
			if (p.id === pieceId) {
				if (p.stage === targetStage) return p;
				const isMovingOutFromBacklog = p.stage === 'backlog' && targetStage !== 'backlog';
				const isClearingFailed = p.is_failed && targetStage !== 'done';
				return {
					...p,
					stage: targetStage,
					is_failed: targetStage === 'done' ? p.is_failed : false,
					failure_stage: isClearingFailed ? null : p.failure_stage,
					failure_reason: isClearingFailed ? null : p.failure_reason,
					started_at: isMovingOutFromBacklog ? (p.started_at || now) : p.started_at,
					updated_at: now
				};
			}
			return p;
		});
		showToast(`Moved piece to ${stageName}`);
	}

	function advanceBatchGroupStage(group: KanbanDisplayGroup) {
		const targetStage = getNextStage(group.primaryPiece.stage);
		const stageName = STAGES.find(s => s.id === targetStage)?.label || targetStage;
		const now = new Date();
		const groupPieceIds = new Set(group.pieces.map(p => p.id));

		pieces = pieces.map(p => {
			if (groupPieceIds.has(p.id)) {
				const isMovingOutFromBacklog = p.stage === 'backlog' && targetStage !== 'backlog';
				return {
					...p,
					stage: targetStage,
					started_at: isMovingOutFromBacklog ? (p.started_at || now) : p.started_at,
					updated_at: now
				};
			}
			return p;
		});

		showToast(`Moved batch (${group.pieces.length} pcs) to ${stageName}`);
	}

	function getNextStage(current: CeramicStage): CeramicStage {
		const stages: CeramicStage[] = ['backlog', 'formed', 'leather_hard', 'trimmed', 'pending_bisque', 'bisqued', 'glazed', 'done'];
		const idx = stages.indexOf(current);
		return idx >= 0 && idx < stages.length - 1 ? stages[idx + 1] : 'done';
	}

	function handleCreatePiece(data: any) {
		const now = new Date();
		const clay = clayBodies.find(c => c.id === data.clayBodyId);
		const clayName = clay ? clay.name : 'Studio Clay';
		const weightGrams = data.weightAmount ? toGrams(data.weightAmount, data.weightUnit) : null;
		const shrinkPct = clay ? clay.shrinkage_pct : 12.0;

		const tLen = data.targetLength && data.targetLength > 0 ? data.targetLength : null;
		const tWid = data.targetWidth && data.targetWidth > 0 ? data.targetWidth : null;
		const tHgt = data.targetHeight && data.targetHeight > 0 ? data.targetHeight : null;

		const fLen = calculateFormedDimension(tLen, shrinkPct);
		const fWid = calculateFormedDimension(tWid, shrinkPct);
		const fHgt = calculateFormedDimension(tHgt, shrinkPct);
		const parsedDueDate = parseDateInput(data.dueDate);

		if (data.quantity > 1) {
			const batchId = `b-${Date.now()}`;
			const bTitle = data.batchTitle.trim() || `${data.title} (${data.quantity} Batch)`;
			const batchObj: PieceBatch = {
				id: batchId,
				user_id: 'user-1',
				title: bTitle,
				created_at: now,
				updated_at: now
			};

			const newPieces: CeramicPiece[] = Array.from({ length: data.quantity }).map((_, i) => ({
				id: `p-${Date.now()}-${i + 1}`,
				user_id: 'user-1',
				title: `${data.title} #${i + 1}`,
				description: data.description || null,
				piece_type: data.pieceType,
				clay_body_id: data.clayBodyId,
				clay_body_name: clayName,
				stage: 'backlog',
				batch_id: batchId,
				batch_sequence: i + 1,
				batch: batchObj,
				is_failed: false,
				target_bisque_cone: data.targetBisqueCone,
				target_glaze_cone: data.targetGlazeCone,
				weight_grams: weightGrams,
				target_length_cm: tLen,
				target_width_cm: tWid,
				target_height_cm: tHgt,
				formed_length_cm: fLen,
				formed_width_cm: fWid,
				formed_height_cm: fHgt,
				initial_photo_url: data.initialPhotoUrl || null,
				due_date: parsedDueDate,
				created_at: now,
				updated_at: now,
				stage_logs: [],
				glaze_layers: []
			}));

			pieces = [...newPieces, ...pieces];
			showToast(`Created batch "${bTitle}" with ${data.quantity} pieces!`);
		} else {
			const newPiece: CeramicPiece = {
				id: `p-${Date.now()}`,
				user_id: 'user-1',
				title: data.title,
				description: data.description || null,
				piece_type: data.pieceType,
				clay_body_id: data.clayBodyId,
				clay_body_name: clayName,
				stage: 'backlog',
				is_failed: false,
				target_bisque_cone: data.targetBisqueCone,
				target_glaze_cone: data.targetGlazeCone,
				weight_grams: weightGrams,
				target_length_cm: tLen,
				target_width_cm: tWid,
				target_height_cm: tHgt,
				formed_length_cm: fLen,
				formed_width_cm: fWid,
				formed_height_cm: fHgt,
				initial_photo_url: data.initialPhotoUrl || null,
				due_date: parsedDueDate,
				created_at: now,
				updated_at: now,
				stage_logs: [],
				glaze_layers: []
			};

			pieces = [newPiece, ...pieces];
			showToast(`Created piece "${newPiece.title}"!`);
		}
	}

	function handleDuplicatePiece(data: any) {
		if (!pieceToDuplicate) return;
		const target = pieceToDuplicate;
		const now = new Date();
		const clay = clayBodies.find(c => c.id === data.clayBodyId);
		const clayName = clay ? clay.name : 'Studio Clay';
		const weightGrams = data.weightAmount ? toGrams(data.weightAmount, data.weightUnit) : null;
		const shrinkPct = clay ? clay.shrinkage_pct : 12.0;

		const tLen = data.targetLength && data.targetLength > 0 ? data.targetLength : null;
		const tWid = data.targetWidth && data.targetWidth > 0 ? data.targetWidth : null;
		const tHgt = data.targetHeight && data.targetHeight > 0 ? data.targetHeight : null;

		const fLen = calculateFormedDimension(tLen, shrinkPct);
		const fWid = calculateFormedDimension(tWid, shrinkPct);
		const fHgt = calculateFormedDimension(tHgt, shrinkPct);

		const copyGlazeLayers = data.copyGlazes && target.glaze_layers ? target.glaze_layers.map(g => ({ ...g, id: `gl-${Date.now()}-${Math.random()}` })) : [];

		if (data.quantity > 1) {
			const batchId = `b-${Date.now()}`;
			const bTitle = `${data.title} (${data.quantity} Batch)`;
			const batchObj: PieceBatch = {
				id: batchId,
				user_id: 'user-1',
				title: bTitle,
				created_at: now,
				updated_at: now
			};

			const newPieces: CeramicPiece[] = Array.from({ length: data.quantity }).map((_, i) => ({
				id: `p-dup-${Date.now()}-${i + 1}`,
				user_id: 'user-1',
				title: `${data.title} #${i + 1}`,
				description: data.description || target.description,
				piece_type: data.pieceType,
				clay_body_id: data.clayBodyId,
				clay_body_name: clayName,
				stage: data.stage,
				batch_id: batchId,
				batch_sequence: i + 1,
				batch: batchObj,
				is_failed: false,
				target_bisque_cone: data.targetBisqueCone,
				target_glaze_cone: data.targetGlazeCone,
				weight_grams: weightGrams,
				target_length_cm: tLen,
				target_width_cm: tWid,
				target_height_cm: tHgt,
				formed_length_cm: fLen,
				formed_width_cm: fWid,
				formed_height_cm: fHgt,
				initial_photo_url: target.initial_photo_url,
				due_date: target.due_date,
				created_at: now,
				updated_at: now,
				stage_logs: [],
				glaze_layers: copyGlazeLayers
			}));

			pieces = [...newPieces, ...pieces];
			showToast(`Duplicated into new batch "${bTitle}" with ${data.quantity} pieces!`);
		} else {
			const newPiece: CeramicPiece = {
				id: `p-dup-${Date.now()}`,
				user_id: 'user-1',
				title: data.title,
				description: data.description || target.description,
				piece_type: data.pieceType,
				clay_body_id: data.clayBodyId,
				clay_body_name: clayName,
				stage: data.stage,
				is_failed: false,
				target_bisque_cone: data.targetBisqueCone,
				target_glaze_cone: data.targetGlazeCone,
				weight_grams: weightGrams,
				target_length_cm: tLen,
				target_width_cm: tWid,
				target_height_cm: tHgt,
				formed_length_cm: fLen,
				formed_width_cm: fWid,
				formed_height_cm: fHgt,
				initial_photo_url: target.initial_photo_url,
				due_date: target.due_date,
				created_at: now,
				updated_at: now,
				stage_logs: [],
				glaze_layers: copyGlazeLayers
			};

			pieces = [newPiece, ...pieces];
			showToast(`Created duplicate piece "${newPiece.title}"!`);
		}
	}

	function flagPieceAsFailed(reason: string) {
		if (!pieceToFail) return;
		const now = new Date();
		pieces = pieces.map(p => {
			if (p.id === pieceToFail!.id) {
				return {
					...p,
					stage: 'done',
					is_failed: true,
					failure_stage: p.stage,
					failure_reason: reason.trim() || 'Unspecified failure',
					failed_at: now,
					updated_at: now
				};
			}
			return p;
		});

		showToast(`Flagged "${pieceToFail.title}" as failed loss`, 'warning');
		pieceToFail = null;
	}

	function restoreFailedPiece(pieceId: string) {
		const now = new Date();
		pieces = pieces.map(p => {
			if (p.id === pieceId) {
				return {
					...p,
					stage: (p.failure_stage as CeramicStage) || 'formed',
					is_failed: false,
					failure_stage: null,
					failure_reason: null,
					failed_at: null,
					updated_at: now
				};
			}
			return p;
		});

		showToast('Restored piece to active studio workflow!');
	}

	function openSplitBatchModal(batchId: string, stageId: CeramicStage) {
		const targetBatchPieces = pieces.filter(p => p.batch_id === batchId && p.stage === stageId && !p.is_failed);
		if (targetBatchPieces.length === 0) return;
		splitTargetBatchId = batchId;
		splitTargetBatchTitle = targetBatchPieces[0].batch?.title || targetBatchPieces[0].title;
		splitBatchPieces = targetBatchPieces;
		isSplitModalOpen = true;
	}

	function executeSplitBatch(data: { selectedPieceIds: string[]; action: string; newSubBatchTitle: string; failReason: string }) {
		if (data.selectedPieceIds.length === 0) return;
		const selectedSet = new Set(data.selectedPieceIds);
		const now = new Date();

		if (data.action === 'new_batch') {
			const subBatchId = `b-sub-${Date.now()}`;
			const subBatchTitle = data.newSubBatchTitle.trim() || 'Sub-Batch';
			const subBatchObj: PieceBatch = {
				id: subBatchId,
				user_id: 'user-1',
				title: subBatchTitle,
				created_at: now,
				updated_at: now
			};

			pieces = pieces.map(p => {
				if (selectedSet.has(p.id)) {
					return { ...p, batch_id: subBatchId, batch: subBatchObj, updated_at: now };
				}
				return p;
			});
			showToast(`Split ${data.selectedPieceIds.length} piece(s) into sub-batch "${subBatchTitle}"!`);
		} else if (data.action === 'detach') {
			pieces = pieces.map(p => {
				if (selectedSet.has(p.id)) {
					return { ...p, batch_id: null, batch: null, updated_at: now };
				}
				return p;
			});
			showToast(`Detached ${data.selectedPieceIds.length} piece(s) as standalone!`);
		} else if (data.action === 'fail') {
			pieces = pieces.map(p => {
				if (selectedSet.has(p.id)) {
					return {
						...p,
						stage: 'done',
						is_failed: true,
						failure_stage: p.stage,
						failure_reason: data.failReason.trim() || 'Batch split failure',
						failed_at: now,
						updated_at: now
					};
				}
				return p;
			});
			showToast(`Flagged ${data.selectedPieceIds.length} piece(s) as failed from batch!`, 'warning');
		}
	}

	function handleUpdatePiece(updatedPiece: CeramicPiece, updateBatchGlaze?: { removeIndex?: number; addLayer?: PieceGlazeLayer }) {
		if (updateBatchGlaze && updatedPiece.batch_id) {
			const curGlazeSig = updatedPiece.glaze_layers ? updatedPiece.glaze_layers.map(g => g.glaze_name).sort().join('|') : '';
			const now = new Date();

			pieces = pieces.map(p => {
				if (p.batch_id === updatedPiece.batch_id && p.stage === updatedPiece.stage && p.is_failed === updatedPiece.is_failed) {
					let layers = p.glaze_layers || [];
					if (updateBatchGlaze.removeIndex !== undefined) {
						layers = layers.filter((_, idx) => idx !== updateBatchGlaze.removeIndex);
					} else if (updateBatchGlaze.addLayer) {
						layers = [...layers, { ...updateBatchGlaze.addLayer, id: `gl-${Date.now()}-${Math.random()}` }];
					}
					return { ...p, glaze_layers: layers, updated_at: now };
				}
				if (p.id === updatedPiece.id) return updatedPiece;
				return p;
			});
		} else {
			pieces = pieces.map(p => p.id === updatedPiece.id ? updatedPiece : p);
		}
	}
</script>

<svelte:head>
	<title>Kalai - Studio Ceramic Piece & Glaze Tracker</title>
	<meta name="description" content="Professional Ceramic Studio Piece Tracker, Orton Pyrometric Cone Calculations, Batch Glaze Log & Shrinkage Tracker" />
</svelte:head>

<!-- PAGE CONTAINER -->
<div class="w-full flex-1 flex flex-col min-h-0 overflow-hidden">
	<!-- Board Top Controls & Toolbar -->
	<BoardHeader
		{pieces}
		{clayBodies}
		{glazes}
		bind:showLossArchive
		bind:mobileActiveStage
		bind:filterSearchQuery
		bind:filterFormType
		bind:filterClayBody
		bind:filterGlaze
		bind:filterTargetCone
		bind:filterDueDate
		bind:filterWeightEnabled
		bind:appliedMinWeight
		bind:appliedMaxWeight
		bind:appliedWeightUnit
		bind:isMobileFilterDrawerOpen
		onOpenPyrometricChart={() => showPyrometricChartModal = true}
		onOpenGlazeLibrary={() => showGlazeLibraryModal = true}
		onOpenClayLibrary={() => showClayLibraryModal = true}
		onOpenNewPieceModal={() => isNewPieceModalOpen = true}
	/>

	<!-- MAIN WORKSPACE VIEW: KANBAN LANES -->
	<KanbanBoard
		{pieces}
		{filteredPieces}
		{showLossArchive}
		{mobileActiveStage}
		{draggedPieceId}
		{draggedBatchKey}
		{dragOverStageId}
		{dragOverCardGroupKey}
		{touchDragActive}
		hasActiveFilters={filterSearchQuery.trim().length > 0 || filterFormType !== 'all' || filterClayBody !== 'all' || filterGlaze !== 'all' || filterTargetCone !== 'all' || filterDueDate !== 'all' || filterWeightEnabled}
		bind:boardContainerRef
		onSelectPiece={(piece) => selectedPiece = piece}
		onOpenDuplicateModal={(piece) => { pieceToDuplicate = piece; isDuplicateModalOpen = true; }}
		onOpenFailModal={(piece) => { pieceToFail = piece; isFailModalOpen = true; }}
		onOpenSplitBatchModal={openSplitBatchModal}
		onMovePieceToStage={movePieceToStage}
		onAdvanceBatchGroupStage={advanceBatchGroupStage}
		onClearAllFilters={() => {
			filterSearchQuery = '';
			filterFormType = 'all';
			filterClayBody = 'all';
			filterGlaze = 'all';
			filterTargetCone = 'all';
			filterDueDate = 'all';
			filterWeightEnabled = false;
		}}
		onPointerDownPiece={handlePointerDownPiece}
		onPointerDownBatch={handlePointerDownBatch}
		onCardDragOver={(e, g) => {
			e.preventDefault();
			const key = g.isBatch ? g.batchId! : g.primaryPiece.id;
			dragOverCardGroupKey = key;
		}}
		onCardDragLeave={() => dragOverCardGroupKey = null}
		onCardDrop={(e, targetGroup) => {
			e.preventDefault();
			const targetCardKey = targetGroup.isBatch ? targetGroup.batchId! : targetGroup.primaryPiece.id;
			if (targetCardKey) {
				executeCardMerge(targetCardKey);
			}
			resetDragState();
		}}
		onStageDragOver={(e, stageId) => {
			e.preventDefault();
			dragOverStageId = stageId;
		}}
		onStageDragLeave={() => dragOverStageId = null}
		onStageDrop={(e, stageId) => {
			e.preventDefault();
			executeStageMove(stageId);
			resetDragState();
		}}
	/>
</div>

<!-- FLOATING TOUCH & POINTER DRAG GHOST BADGE OVERLAY -->
{#if touchDragActive}
	<div 
		class="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-content font-bold px-4 py-2.5 rounded-xl shadow-2xl border border-white/20 text-sm flex items-center gap-2 animate-pulse"
		style="left: {touchDragGhostX}px; top: {touchDragGhostY}px;"
	>
		<GripVertical class="w-4 h-4 opacity-70" />
		<span>Dragging: {touchDragLabel}</span>
	</div>
{/if}

<!-- MODAL DIALOGS -->
<PyrometricChartModal bind:isOpen={showPyrometricChartModal} />

<ClayLibraryModal 
	bind:isOpen={showClayLibraryModal} 
	{clayBodies}
	onAddClay={(newClay) => {
		clayBodies = [...clayBodies, newClay];
		showToast(`Added "${newClay.name}" to clay bodies library!`);
	}}
/>

<GlazeLibraryModal 
	bind:isOpen={showGlazeLibraryModal} 
	{glazes}
	onAddGlaze={(newGlaze) => {
		glazes = [...glazes, newGlaze];
		showToast(`Added "${newGlaze.name}" to glaze library!`);
	}}
/>

<NewPieceModal
	bind:isOpen={isNewPieceModalOpen}
	{clayBodies}
	onCreatePiece={handleCreatePiece}
	onManageClay={() => { isNewPieceModalOpen = false; showClayLibraryModal = true; }}
/>

<PieceDetailModal
	bind:selectedPiece
	{pieces}
	{clayBodies}
	{glazes}
	onUpdatePiece={handleUpdatePiece}
	onRestoreFailedPiece={restoreFailedPiece}
	onShowToast={showToast}
/>

<FailPieceModal
	bind:isOpen={isFailModalOpen}
	{pieceToFail}
	onConfirm={flagPieceAsFailed}
/>

<DuplicateModal
	bind:isOpen={isDuplicateModalOpen}
	{pieceToDuplicate}
	{clayBodies}
	onConfirm={handleDuplicatePiece}
/>

<JobSplitModal
	bind:isOpen={isSplitModalOpen}
	{splitTargetBatchTitle}
	{splitBatchPieces}
	onConfirm={executeSplitBatch}
/>

<Toast {toastMessage} {toastType} />
