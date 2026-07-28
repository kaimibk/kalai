<script lang="ts">
	import Flame from 'lucide-svelte/icons/flame';
	import Layers from 'lucide-svelte/icons/layers';
	import Droplets from 'lucide-svelte/icons/droplets';
	import CheckSquare from 'lucide-svelte/icons/check-square';
	import Plus from 'lucide-svelte/icons/plus';
	import ArrowRight from 'lucide-svelte/icons/arrow-right';
	import Clock from 'lucide-svelte/icons/clock';
	import Sparkles from 'lucide-svelte/icons/sparkles';
	import CheckCircle2 from 'lucide-svelte/icons/check-circle-2';
	import AlertCircle from 'lucide-svelte/icons/alert-circle';
	import Thermometer from 'lucide-svelte/icons/thermometer';
	import ShieldAlert from 'lucide-svelte/icons/shield-alert';
	import Tag from 'lucide-svelte/icons/tag';
	import Package from 'lucide-svelte/icons/package';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import X from 'lucide-svelte/icons/x';
	import Copy from 'lucide-svelte/icons/copy';
	import Camera from 'lucide-svelte/icons/camera';
	import Image from 'lucide-svelte/icons/image';
	import AlertTriangle from 'lucide-svelte/icons/alert-triangle';
	import Layers2 from 'lucide-svelte/icons/layers-2';
	import Trash2 from 'lucide-svelte/icons/trash-2';
	import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';
	import RotateCcw from 'lucide-svelte/icons/rotate-ccw';
	import Info from 'lucide-svelte/icons/info';
	import Palette from 'lucide-svelte/icons/palette';
	import GripVertical from 'lucide-svelte/icons/grip-vertical';
	import FileText from 'lucide-svelte/icons/file-text';
	import type { CeramicPiece, ClayBody, CeramicStage, PieceStageLog, PieceGlazeLayer, GlazeRecipe, GlazeStyle, GlazeLocation, PyrometricCone, Manufacturer, PieceType } from '$lib/types/database';

	// Full Skutt / Orton Pyrometric Cones Temperature Equivalents Dataset
	const PYROMETRIC_CONES: PyrometricCone[] = [
		{ name: 'Cone 022', display_order: 1,  temp_f: 1087, temp_c: 586,  color_fire: 'Dull Red',   firing_category: 'enamel_luster' },
		{ name: 'Cone 021', display_order: 2,  temp_f: 1112, temp_c: 600,  color_fire: 'Dull Red',   firing_category: 'enamel_luster' },
		{ name: 'Cone 020', display_order: 3,  temp_f: 1159, temp_c: 626,  color_fire: 'Dull Red',   firing_category: 'enamel_luster' },
		{ name: 'Cone 019', display_order: 4,  temp_f: 1252, temp_c: 678,  color_fire: 'Dull Red',   firing_category: 'enamel_luster' },
		{ name: 'Cone 018', display_order: 5,  temp_f: 1319, temp_c: 715,  color_fire: 'Dull Red',   firing_category: 'enamel_luster' },
		{ name: 'Cone 017', display_order: 6,  temp_f: 1360, temp_c: 738,  color_fire: 'Dull Red',   firing_category: 'enamel_luster' },
		{ name: 'Cone 016', display_order: 7,  temp_f: 1422, temp_c: 772,  color_fire: 'Red',        firing_category: 'enamel_luster' },
		{ name: 'Cone 015', display_order: 8,  temp_f: 1456, temp_c: 791,  color_fire: 'Red',        firing_category: 'enamel_luster' },
		{ name: 'Cone 014', display_order: 9,  temp_f: 1485, temp_c: 807,  color_fire: 'Red',        firing_category: 'enamel_luster' },
		{ name: 'Cone 013', display_order: 10, temp_f: 1539, temp_c: 837,  color_fire: 'Cherry Red', firing_category: 'bisque_lowfire' },
		{ name: 'Cone 012', display_order: 11, temp_f: 1582, temp_c: 861,  color_fire: 'Cherry Red', firing_category: 'bisque_lowfire' },
		{ name: 'Cone 011', display_order: 12, temp_f: 1607, temp_c: 875,  color_fire: 'Orange',     firing_category: 'bisque_lowfire' },
		{ name: 'Cone 010', display_order: 13, temp_f: 1657, temp_c: 903,  color_fire: 'Orange',     firing_category: 'bisque_lowfire' },
		{ name: 'Cone 09',  display_order: 14, temp_f: 1688, temp_c: 920,  color_fire: 'Orange',     firing_category: 'bisque_lowfire' },
		{ name: 'Cone 08',  display_order: 15, temp_f: 1728, temp_c: 942,  color_fire: 'Orange',     firing_category: 'bisque_lowfire' },
		{ name: 'Cone 07',  display_order: 16, temp_f: 1789, temp_c: 976,  color_fire: 'Orange',     firing_category: 'bisque_lowfire' },
		{ name: 'Cone 06',  display_order: 17, temp_f: 1828, temp_c: 998,  color_fire: 'Orange',     firing_category: 'bisque_lowfire' },
		{ name: 'Cone 05',  display_order: 18, temp_f: 1888, temp_c: 1031, color_fire: 'Orange',     firing_category: 'bisque_lowfire' },
		{ name: 'Cone 04',  display_order: 19, temp_f: 1945, temp_c: 1063, color_fire: 'Yellow',     firing_category: 'bisque_lowfire' },
		{ name: 'Cone 03',  display_order: 20, temp_f: 1987, temp_c: 1086, color_fire: 'Yellow',     firing_category: 'bisque_lowfire' },
		{ name: 'Cone 02',  display_order: 21, temp_f: 2016, temp_c: 1102, color_fire: 'Yellow',     firing_category: 'bisque_lowfire' },
		{ name: 'Cone 01',  display_order: 22, temp_f: 2046, temp_c: 1119, color_fire: 'Yellow',     firing_category: 'bisque_lowfire' },
		{ name: 'Cone 1',   display_order: 23, temp_f: 2079, temp_c: 1137, color_fire: 'Yellow',     firing_category: 'mid_fire' },
		{ name: 'Cone 2',   display_order: 24, temp_f: 2088, temp_c: 1142, color_fire: 'Yellow',     firing_category: 'mid_fire' },
		{ name: 'Cone 3',   display_order: 25, temp_f: 2106, temp_c: 1152, color_fire: 'Yellow',     firing_category: 'mid_fire' },
		{ name: 'Cone 4',   display_order: 26, temp_f: 2124, temp_c: 1162, color_fire: 'Yellow',     firing_category: 'mid_fire' },
		{ name: 'Cone 5',   display_order: 27, temp_f: 2167, temp_c: 1186, color_fire: 'Yellow',     firing_category: 'mid_fire' },
		{ name: 'Cone 6',   display_order: 28, temp_f: 2232, temp_c: 1222, color_fire: 'White',      firing_category: 'mid_fire' },
		{ name: 'Cone 7',   display_order: 29, temp_f: 2262, temp_c: 1239, color_fire: 'White',      firing_category: 'high_fire' },
		{ name: 'Cone 8',   display_order: 30, temp_f: 2280, temp_c: 1249, color_fire: 'White',      firing_category: 'high_fire' },
		{ name: 'Cone 9',   display_order: 31, temp_f: 2300, temp_c: 1260, color_fire: 'White',      firing_category: 'high_fire' },
		{ name: 'Cone 10',  display_order: 32, temp_f: 2345, temp_c: 1285, color_fire: 'White',      firing_category: 'high_fire' }
	];

	// Normalized Manufacturers List
	const MANUFACTURERS: Manufacturer[] = [
		{ name: 'Amaco', category: 'glaze' },
		{ name: 'Mayco', category: 'glaze' },
		{ name: 'Coyote', category: 'glaze' },
		{ name: 'Spectrum', category: 'glaze' },
		{ name: 'Laguna Clay', category: 'both' },
		{ name: 'Highwater', category: 'clay' },
		{ name: 'Standard Clay', category: 'clay' },
		{ name: 'Custom Studio', category: 'both' }
	];

	// Normalized Form Types
	const PIECE_TYPES: PieceType[] = [
		{ name: 'Mug', description: 'Handled drinking vessel' },
		{ name: 'Bowl', description: 'Open serving or eating dish' },
		{ name: 'Vase', description: 'Decorative or flower vessel' },
		{ name: 'Plate / Platter', description: 'Flat dining or display ware' },
		{ name: 'Planter', description: 'Botanical pot with drainage' },
		{ name: 'Sculpture', description: 'Non-functional art object' }
	];

	// Glaze Application Locations
	const GLAZE_LOCATIONS: { id: GlazeLocation; label: string }[] = [
		{ id: 'entire', label: 'Entire Piece' },
		{ id: 'inside', label: 'Inside' },
		{ id: 'outside', label: 'Outside' },
		{ id: 'top', label: 'Top / Upper' },
		{ id: 'bottom', label: 'Bottom / Foot' },
		{ id: 'rim', label: 'Rim Only' },
		{ id: 'accent', label: 'Accent / Drips' }
	];

	// Clay Weight Unit Conversions
	type WeightUnit = 'g' | 'kg' | 'oz' | 'lbs';

	function toGrams(amount: number, unit: WeightUnit): number {
		switch (unit) {
			case 'kg': return amount * 1000;
			case 'oz': return amount * 28.3495;
			case 'lbs': return amount * 453.592;
			case 'g': default: return amount;
		}
	}

	function formatClayWeight(grams: number | null | undefined): string {
		if (!grams || grams <= 0) return '';
		if (grams >= 1000) {
			const kg = (grams / 1000).toFixed(2);
			const lbs = (grams / 453.592).toFixed(2);
			return `${kg} kg (${lbs} lbs)`;
		} else {
			const lbs = (grams / 453.592).toFixed(2);
			const oz = (grams / 28.3495).toFixed(1);
			if (grams < 454) {
				return `${Math.round(grams)} g (${oz} oz)`;
			}
			return `${Math.round(grams)} g (${lbs} lbs)`;
		}
	}

	// Streamlined 6-Stage Kanban Lifecycle
	const STAGES: { id: CeramicStage; label: string; icon: string; color: string }[] = [
		{ id: 'backlog', label: 'Backlog / To-Do', icon: '💡', color: 'border-yellow-500/30' },
		{ id: 'formed', label: 'Formed (Wheel/Handbuilt)', icon: '🏺', color: 'border-[#E07A5F]/40' },
		{ id: 'ready_to_trim', label: 'Trimming (Leather-Hard)', icon: '🔪', color: 'border-orange-500/40' },
		{ id: 'bone_dry', label: 'Bone Dry (Bisque Pending)', icon: '☀️', color: 'border-amber-400/30' },
		{ id: 'glazed', label: 'Glazed (Glaze Fire Pending)', icon: '🖌️', color: 'border-[#81B29A]/40' },
		{ id: 'done', label: 'Finished', icon: '✨', color: 'border-[#81B29A]/60' }
	];

	// Global & Custom Clay Bodies
	let clayBodies = $state<ClayBody[]>([
		{ id: 'cb-1', is_global: true, name: 'Speckled Buff 80', manufacturer: 'Laguna Clay', min_cone: 'Cone 5', max_cone: 'Cone 10', firing_range: 'Cone 5-10', shrinkage_pct: 12.0, raw_color: 'Buff', fired_color: 'Speckled Cream' },
		{ id: 'cb-2', is_global: true, name: 'B-Mix 5 (with Grog)', manufacturer: 'Laguna Clay', min_cone: 'Cone 5', max_cone: 'Cone 6', firing_range: 'Cone 5-6', shrinkage_pct: 11.5, raw_color: 'Off-White', fired_color: 'Cream Smooth' },
		{ id: 'cb-3', is_global: true, name: 'Frost Porcelain 365', manufacturer: 'Standard Clay', min_cone: 'Cone 6', max_cone: 'Cone 6', firing_range: 'Cone 6', shrinkage_pct: 14.0, raw_color: 'Pure White', fired_color: 'Translucent White' },
		{ id: 'cb-4', is_global: true, name: 'Red Terracotta Earthenware', manufacturer: 'Highwater', min_cone: 'Cone 06', max_cone: 'Cone 04', firing_range: 'Cone 06-04', shrinkage_pct: 9.5, raw_color: 'Red', fired_color: 'Terracotta Rust' },
		{ id: 'cb-5', is_global: false, name: 'Studio Reclaim Blend #3', manufacturer: 'Custom Studio', min_cone: 'Cone 5', max_cone: 'Cone 6', firing_range: 'Cone 5-6', shrinkage_pct: 12.5, raw_color: 'Grey', fired_color: 'Toasted Oatmeal' }
	]);

	// Predefined Normalized Glaze Library
	let glazes = $state<GlazeRecipe[]>([
		{ id: 'glz-1', is_global: true, name: 'PC-20 Blue Rutile', manufacturer: 'Amaco', default_style: 'brush', min_cone: 'Cone 5', max_cone: 'Cone 6', target_cone: 'Cone 6', atmosphere: 'Oxidation', batch_liters: 0.5, notes: 'Flowing blue and rutile highlights. 3 brushed coats.' },
		{ id: 'glz-2', is_global: true, name: 'PC-50 Seafoam', manufacturer: 'Amaco', default_style: 'brush', min_cone: 'Cone 5', max_cone: 'Cone 6', target_cone: 'Cone 6', atmosphere: 'Oxidation', batch_liters: 0.5, notes: 'Soft satin green glaze. Beautiful over texture.' },
		{ id: 'glz-3', is_global: true, name: 'SW-119 Honey Flux', manufacturer: 'Mayco', default_style: 'brush', min_cone: 'Cone 5', max_cone: 'Cone 6', target_cone: 'Cone 6', atmosphere: 'Oxidation', batch_liters: 0.5, notes: 'High mobility accent glaze. Flowing rim drips.' },
		{ id: 'glz-4', is_global: true, name: 'Celadon Jade Studio Bucket', manufacturer: 'Custom Studio', default_style: 'dip', min_cone: 'Cone 5', max_cone: 'Cone 6', target_cone: 'Cone 6', atmosphere: 'Oxidation', batch_liters: 10.0, notes: '3-second dipping bucket for smooth translucent celadon.' },
		{ id: 'glz-5', is_global: true, name: 'Floating Blue Studio Bucket', manufacturer: 'Custom Studio', default_style: 'dip', min_cone: 'Cone 5', max_cone: 'Cone 6', target_cone: 'Cone 6', atmosphere: 'Oxidation', batch_liters: 8.0, notes: 'Variegated cobalt floating bucket glaze.' },
		{ id: 'glz-6', is_global: false, name: 'Tenmoku Satin Black', manufacturer: 'Custom Studio', default_style: 'dip', min_cone: 'Cone 5', max_cone: 'Cone 6', target_cone: 'Cone 6', atmosphere: 'Oxidation / Reduction', batch_liters: 5.0, notes: 'Rich iron black with bronze oil-spotting.' }
	]);

	// Sample Initial Pieces
	let pieces = $state<CeramicPiece[]>([
		{
			id: 'p-101',
			user_id: 'user-1',
			title: 'Ribbed Matcha Bowl',
			description: 'Deep wall design with flared rim and hand-carved exterior fluting.',
			piece_type: 'Bowl',
			clay_body_id: 'cb-1',
			clay_body_name: 'Speckled Buff 80',
			stage: 'ready_to_trim',
			is_failed: false,
			target_bisque_cone: 'Cone 06',
			target_glaze_cone: 'Cone 6',
			weight_grams: 480,
			height_cm: 8.5,
			width_cm: 13.0,
			initial_photo_url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&auto=format&fit=crop&q=80',
			created_at: '2026-07-22',
			updated_at: '2026-07-23',
			stage_logs: [
				{ id: 'log-1', piece_id: 'p-101', user_id: 'user-1', stage: 'formed', weight_grams: 550, notes: 'Thrown on wheel with 550g clay. Fluted walls.', created_at: '2026-07-22' }
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
			initial_photo_url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&auto=format&fit=crop&q=80',
			created_at: '2026-07-18',
			updated_at: '2026-07-24',
			stage_logs: [
				{ id: 'log-4', piece_id: 'p-102', user_id: 'user-1', stage: 'glazed', notes: 'Bisque fired clean cone 04. Ready for glaze kiln.', created_at: '2026-07-24' }
			],
			glaze_layers: [
				{ id: 'gl-1', piece_id: 'p-102', glaze_id: 'glz-1', glaze_name: 'PC-20 Blue Rutile', manufacturer: 'Amaco', layer_order: 1, coat_count: 3, application_method: 'brush', location: 'outside', created_at: '2026-07-24' },
				{ id: 'gl-2', piece_id: 'p-102', glaze_id: 'glz-3', glaze_name: 'SW-119 Honey Flux', manufacturer: 'Mayco', layer_order: 2, coat_count: 2, application_method: 'brush', location: 'top', created_at: '2026-07-24' }
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
			initial_photo_url: null,
			created_at: '2026-07-24',
			updated_at: '2026-07-24',
			stage_logs: [],
			glaze_layers: []
		}
	]);

	// UI Active Views & Modals
	let showGlazeLibraryModal = $state(false);
	let showClayLibraryModal = $state(false);
	let showPyrometricChartModal = $state(false);
	let showFailedDrawer = $state(false);
	let selectedPiece = $state<CeramicPiece | null>(null);

	// New Piece Modal State
	let isNewPieceModalOpen = $state(false);
	let newTitle = $state('');
	let newDescription = $state('');
	let newPieceType = $state('Mug');
	let newClayBodyId = $state('cb-1');
	let newTargetBisqueCone = $state('Cone 06');
	let newTargetGlazeCone = $state('Cone 6');
	let newWeightAmount = $state<number | null>(null);
	let newWeightUnit = $state<WeightUnit>('g');
	let newInitialPhotoUrl = $state('');
	let newStage = $state<CeramicStage>('backlog');

	// Glaze Tagging Form State (inside Piece Detail Modal)
	let selectedGlazeOption = $state<string>('glz-1');
	let tagGlazeName = $state('PC-20 Blue Rutile');
	let tagGlazeManufacturer = $state('Amaco');
	let tagGlazeMethod = $state<GlazeStyle>('brush');
	let tagGlazeCoats = $state(3);
	let tagGlazeLocation = $state<GlazeLocation>('entire');

	// Custom Glaze Creation State (inside Library Modal)
	let newLibraryGlazeName = $state('');
	let newLibraryManufacturer = $state('Amaco');
	let newLibraryStyle = $state<GlazeStyle>('brush');
	let newLibraryMinCone = $state('Cone 5');
	let newLibraryMaxCone = $state('Cone 6');
	let newLibraryTargetCone = $state('Cone 6');
	let newLibraryNotes = $state('');

	// Custom Clay Creation State (inside Clay Library Modal)
	let newLibraryClayName = $state('');
	let newLibraryClayManufacturer = $state('Laguna Clay');
	let newLibraryClayMinCone = $state('Cone 5');
	let newLibraryClayMaxCone = $state('Cone 6');
	let newLibraryClayShrinkage = $state(12.0);
	let newLibraryClayRawColor = $state('Buff');
	let newLibraryClayFiredColor = $state('Speckled Cream');
	let newLibraryClayNotes = $state('');

	// Failure Flag Modal State
	let isFailModalOpen = $state(false);
	let pieceToFail = $state<CeramicPiece | null>(null);
	let failReason = $state('S-crack in foot during drying');

	// Piece Notes Inline Editing State
	let editingPieceNotes = $state('');
	let isEditingNotes = $state(false);

	// Stage Log Add State (inside Detail Modal)
	let newLogNote = $state('');
	let newLogPhoto = $state('');
	let newLogWeightAmount = $state<number | null>(null);
	let newLogWeightUnit = $state<WeightUnit>('g');

	// Drag & Drop State
	let draggedPieceId = $state<string | null>(null);
	let dragOverStageId = $state<CeramicStage | null>(null);
	let toastMessage = $state<string | null>(null);
	let toastTimeout: ReturnType<typeof setTimeout>;

	function showToast(msg: string) {
		toastMessage = msg;
		clearTimeout(toastTimeout);
		toastTimeout = setTimeout(() => {
			toastMessage = null;
		}, 3000);
	}

	function handleDragStart(e: DragEvent, pieceId: string) {
		draggedPieceId = pieceId;
		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('text/plain', pieceId);
		}
	}

	function handleDragEnd() {
		draggedPieceId = null;
		dragOverStageId = null;
	}

	function handleDragOver(e: DragEvent, stageId: CeramicStage) {
		e.preventDefault();
		if (e.dataTransfer) {
			e.dataTransfer.dropEffect = 'move';
		}
		if (dragOverStageId !== stageId) {
			dragOverStageId = stageId;
		}
	}

	function handleDragLeave(e: DragEvent, stageId: CeramicStage) {
		const relatedTarget = e.relatedTarget as HTMLElement | null;
		const currentTarget = e.currentTarget as HTMLElement | null;
		if (currentTarget && relatedTarget && currentTarget.contains(relatedTarget)) {
			return;
		}
		if (dragOverStageId === stageId) {
			dragOverStageId = null;
		}
	}

	function handleDrop(e: DragEvent, targetStage: CeramicStage) {
		e.preventDefault();
		const pieceId = draggedPieceId || e.dataTransfer?.getData('text/plain');
		if (!pieceId) return;

		const piece = pieces.find(p => p.id === pieceId);
		if (piece && piece.stage !== targetStage) {
			const targetStageObj = STAGES.find(s => s.id === targetStage);
			const stageName = targetStageObj?.label || targetStage;

			pieces = pieces.map(p => {
				if (p.id === pieceId) {
					return {
						...p,
						stage: targetStage,
						updated_at: new Date().toISOString().split('T')[0]
					};
				}
				return p;
			});

			showToast(`Moved "${piece.title}" to ${stageName}`);
		}

		draggedPieceId = null;
		dragOverStageId = null;
	}

	// Derived lists
	let activePieces = $derived(pieces.filter(p => !p.is_failed));
	let failedPieces = $derived(pieces.filter(p => p.is_failed));

	function handleGlazeSelectionChange(e: Event) {
		const val = (e.target as HTMLSelectElement).value;
		selectedGlazeOption = val;
		if (val !== 'custom') {
			const found = glazes.find(g => g.id === val);
			if (found) {
				tagGlazeName = found.name;
				tagGlazeManufacturer = found.manufacturer;
				tagGlazeMethod = found.default_style;
			}
		} else {
			tagGlazeName = '';
			tagGlazeManufacturer = 'Custom Studio';
			tagGlazeMethod = 'brush';
		}
	}

	function advancePieceStage(pieceId: string) {
		const stageOrder: CeramicStage[] = [
			'backlog', 'formed', 'ready_to_trim', 'bone_dry', 'glazed', 'done'
		];
		pieces = pieces.map(p => {
			if (p.id === pieceId) {
				const currentIndex = stageOrder.indexOf(p.stage);
				if (currentIndex >= 0 && currentIndex < stageOrder.length - 1) {
					const nextStage = stageOrder[currentIndex + 1];
					return { ...p, stage: nextStage, updated_at: new Date().toISOString().split('T')[0] };
				}
			}
			return p;
		});
	}

	function duplicatePiece(piece: CeramicPiece) {
		const newPiece: CeramicPiece = {
			...piece,
			id: `p-${Date.now()}`,
			title: `${piece.title} (Copy)`,
			stage: 'backlog',
			is_failed: false,
			failure_stage: null,
			failure_reason: null,
			failed_at: null,
			created_at: new Date().toISOString().split('T')[0],
			updated_at: new Date().toISOString().split('T')[0],
			stage_logs: piece.stage_logs ? [...piece.stage_logs] : [],
			glaze_layers: piece.glaze_layers ? [...piece.glaze_layers] : []
		};
		pieces = [newPiece, ...pieces];
	}

	function openFailModal(piece: CeramicPiece) {
		pieceToFail = piece;
		isFailModalOpen = true;
	}

	function confirmFlagAsFailed() {
		if (!pieceToFail) return;
		pieces = pieces.map(p => {
			if (p.id === pieceToFail!.id) {
				return {
					...p,
					is_failed: true,
					failure_stage: p.stage,
					failure_reason: failReason,
					failed_at: new Date().toISOString().split('T')[0]
				};
			}
			return p;
		});
		if (selectedPiece && selectedPiece.id === pieceToFail.id) {
			selectedPiece = null;
		}
		isFailModalOpen = false;
		pieceToFail = null;
	}

	function restoreFailedPiece(pieceId: string) {
		pieces = pieces.map(p => p.id === pieceId ? { ...p, is_failed: false, failure_stage: null, failure_reason: null } : p);
	}

	function handleCreatePiece(e: Event) {
		e.preventDefault();
		if (!newTitle.trim()) return;
		const selectedClay = clayBodies.find(c => c.id === newClayBodyId);
		const calculatedGrams = newWeightAmount && newWeightAmount > 0 
			? toGrams(newWeightAmount, newWeightUnit) 
			: null;

		const created: CeramicPiece = {
			id: `p-${Date.now()}`,
			user_id: 'user-1',
			title: newTitle,
			description: newDescription.trim() || null,
			notes: newDescription.trim() || null,
			piece_type: newPieceType,
			clay_body_id: newClayBodyId,
			clay_body_name: selectedClay ? selectedClay.name : 'Speckled Buff 80',
			stage: newStage,
			is_failed: false,
			target_bisque_cone: newTargetBisqueCone,
			target_glaze_cone: newTargetGlazeCone,
			weight_grams: calculatedGrams,
			initial_photo_url: newInitialPhotoUrl.trim() || null,
			created_at: new Date().toISOString().split('T')[0],
			updated_at: new Date().toISOString().split('T')[0],
			stage_logs: [],
			glaze_layers: []
		};
		pieces = [created, ...pieces];
		newTitle = '';
		newDescription = '';
		newWeightAmount = null;
		newInitialPhotoUrl = '';
		isNewPieceModalOpen = false;
	}

	function addGlazeTagToPiece() {
		if (!selectedPiece || !tagGlazeName.trim()) return;
		const newLayer: PieceGlazeLayer = {
			id: `gl-${Date.now()}`,
			piece_id: selectedPiece.id,
			glaze_id: selectedGlazeOption !== 'custom' ? selectedGlazeOption : undefined,
			glaze_name: tagGlazeName,
			manufacturer: tagGlazeManufacturer,
			layer_order: (selectedPiece.glaze_layers?.length || 0) + 1,
			coat_count: tagGlazeCoats,
			application_method: tagGlazeMethod,
			location: tagGlazeLocation,
			created_at: new Date().toISOString()
		};

		const updatedGlazes = [...(selectedPiece.glaze_layers || []), newLayer];
		selectedPiece = { ...selectedPiece, glaze_layers: updatedGlazes };
		pieces = pieces.map(p => p.id === selectedPiece!.id ? selectedPiece! : p);
	}

	function handleAddCustomLibraryGlaze(e: Event) {
		e.preventDefault();
		if (!newLibraryGlazeName.trim()) return;
		glazes = [
			...glazes,
			{
				id: `glz-${Date.now()}`,
				is_global: false,
				name: newLibraryGlazeName,
				manufacturer: newLibraryManufacturer,
				default_style: newLibraryStyle,
				min_cone: newLibraryMinCone,
				max_cone: newLibraryMaxCone,
				target_cone: newLibraryTargetCone,
				atmosphere: 'Oxidation',
				batch_liters: 1.0,
				notes: newLibraryNotes
			}
		];
		newLibraryGlazeName = '';
		newLibraryNotes = '';
	}

	function handleAddCustomLibraryClay(e: Event) {
		e.preventDefault();
		if (!newLibraryClayName.trim()) return;
		clayBodies = [
			...clayBodies,
			{
				id: `cb-${Date.now()}`,
				is_global: false,
				name: newLibraryClayName,
				manufacturer: newLibraryClayManufacturer,
				min_cone: newLibraryClayMinCone,
				max_cone: newLibraryClayMaxCone,
				firing_range: `${newLibraryClayMinCone}-${newLibraryClayMaxCone.replace('Cone ', '')}`,
				shrinkage_pct: newLibraryClayShrinkage,
				raw_color: newLibraryClayRawColor,
				fired_color: newLibraryClayFiredColor,
				notes: newLibraryClayNotes
			}
		];
		showToast(`Clay body "${newLibraryClayName}" added to library!`);
		newLibraryClayName = '';
		newLibraryClayNotes = '';
	}

	function addStageLogNote() {
		if (!selectedPiece || (!newLogNote.trim() && !newLogPhoto.trim() && (!newLogWeightAmount || newLogWeightAmount <= 0))) return;
		const calculatedLogGrams = newLogWeightAmount && newLogWeightAmount > 0 
			? toGrams(newLogWeightAmount, newLogWeightUnit) 
			: null;

		const newLog: PieceStageLog = {
			id: `log-${Date.now()}`,
			piece_id: selectedPiece.id,
			user_id: 'user-1',
			stage: selectedPiece.stage,
			notes: newLogNote,
			photo_url: newLogPhoto.trim() || null,
			weight_grams: calculatedLogGrams,
			created_at: new Date().toISOString().split('T')[0]
		};

		const updatedLogs = [...(selectedPiece.stage_logs || []), newLog];
		const updatedPiece = { 
			...selectedPiece, 
			stage_logs: updatedLogs,
			weight_grams: calculatedLogGrams || selectedPiece.weight_grams
		};
		selectedPiece = updatedPiece;
		pieces = pieces.map(p => p.id === selectedPiece!.id ? selectedPiece! : p);
		newLogNote = '';
		newLogPhoto = '';
		newLogWeightAmount = null;
	}

	function savePieceNotes() {
		if (!selectedPiece) return;
		const trimmed = editingPieceNotes.trim() || null;
		selectedPiece = {
			...selectedPiece,
			notes: trimmed,
			description: trimmed
		};
		pieces = pieces.map(p => p.id === selectedPiece!.id ? selectedPiece! : p);
		showToast('Piece notes saved!');
		isEditingNotes = false;
	}
</script>

<!-- Top Studio Actions & Controls -->
<div class="space-y-6">
	<div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5 transition-colors">
		<div>
			<div class="flex items-center gap-3">
				<h2 class="font-display text-2xl font-extrabold text-stone-900 dark:text-white tracking-tight">Studio Board</h2>
				<span class="px-2.5 py-0.5 text-xs font-semibold text-[#3B7258] dark:text-[#81B29A] bg-[#81B29A]/15 rounded-full border border-[#81B29A]/30">
					{activePieces.length} Active Pieces
				</span>
			</div>
			<p class="text-xs text-stone-600 dark:text-stone-400 mt-1">Ceramic tracking tool for studio artists.</p>
		</div>

		<div class="flex items-center gap-3">
			<button 
				onclick={() => showPyrometricChartModal = true}
				class="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 flex items-center gap-2 transition shadow-xs dark:shadow-none"
			>
				<Flame class="w-4 h-4 text-[#C85A32] dark:text-[#F2CC8F]" />
				<span>Cone Temp Chart</span>
			</button>

			<button 
				onclick={() => showGlazeLibraryModal = true}
				class="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 flex items-center gap-2 transition shadow-xs dark:shadow-none"
			>
				<Palette class="w-4 h-4 text-[#3B7258] dark:text-[#81B29A]" />
				<span>Glaze Library ({glazes.length})</span>
			</button>

			<button 
				onclick={() => showClayLibraryModal = true}
				class="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 flex items-center gap-2 transition shadow-xs dark:shadow-none"
			>
				<Package class="w-4 h-4 text-[#E07A5F]" />
				<span>Clay Bodies ({clayBodies.length})</span>
			</button>

			{#if failedPieces.length > 0}
				<button 
					onclick={() => showFailedDrawer = !showFailedDrawer}
					class="px-3.5 py-2 text-xs font-semibold rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-800/40 flex items-center gap-2 transition"
				>
					<ShieldAlert class="w-4 h-4 text-red-500 dark:text-red-400" />
					<span>Loss Archive ({failedPieces.length})</span>
				</button>
			{/if}

			<button 
				onclick={() => isNewPieceModalOpen = true}
				class="px-4 py-2 text-xs font-bold rounded-xl bg-[#E07A5F] hover:bg-[#C85A32] text-white flex items-center gap-2 transition shadow-lg shadow-[#C85A32]/25"
			>
				<Plus class="w-4 h-4" />
				<span>Create Piece</span>
			</button>
		</div>
	</div>

	<!-- FAILED PIECES ARCHIVE DRAWER -->
	{#if showFailedDrawer}
		<div class="ceramic-card p-5 rounded-2xl border border-red-300 dark:border-red-900/40 bg-gradient-to-r from-red-50/50 via-stone-100 to-red-50/50 dark:from-red-950/20 dark:via-stone-900 dark:to-red-950/20 space-y-4">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2 text-red-600 dark:text-red-400 font-display font-bold text-sm">
					<AlertTriangle class="w-5 h-5" />
					<h3>Ceramic Failures & Loss Archive</h3>
				</div>
				<button onclick={() => showFailedDrawer = false} class="text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white text-xs">Close</button>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
				{#each failedPieces as fp}
					<div class="bg-white dark:bg-stone-950/80 p-3.5 rounded-xl border border-red-200 dark:border-red-900/30 space-y-2 shadow-xs dark:shadow-none">
						<div class="flex items-center justify-between">
							<span class="font-bold text-stone-900 dark:text-stone-200">{fp.title}</span>
							<span class="text-[10px] uppercase font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950 px-2 py-0.5 rounded border border-red-200 dark:border-red-900">
								Failed at {fp.failure_stage}
							</span>
						</div>
						<p class="text-stone-600 dark:text-stone-400 text-[11px] font-semibold">Reason: "{fp.failure_reason}"</p>
						<div class="pt-2 border-t border-stone-200 dark:border-stone-800 flex justify-end">
							<button 
								onclick={() => restoreFailedPiece(fp.id)}
								class="text-[11px] text-[#3B7258] dark:text-[#81B29A] hover:underline flex items-center gap-1 font-semibold"
							>
								<RotateCcw class="w-3 h-3" />
								<span>Restore to Active</span>
							</button>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- STREAMLINED 6-STAGE HORIZONTAL KANBAN BOARD CONTAINER -->
	<div class="overflow-x-auto snap-x snap-mandatory scroll-smooth pb-6">
		<div class="flex gap-4 min-w-[1600px]">
			{#each STAGES as stageInfo}
				{@const columnPieces = activePieces.filter(p => p.stage === stageInfo.id)}
				<div 
					role="region"
					aria-label={stageInfo.label}
					class="w-[265px] flex-shrink-0 snap-start bg-stone-200/50 dark:bg-stone-900/40 rounded-2xl p-3 border transition-all duration-200 flex flex-col min-h-[620px] {stageInfo.color} {dragOverStageId === stageInfo.id ? 'ring-2 ring-[#E07A5F] bg-stone-200/90 dark:bg-stone-900/80 scale-[1.01] shadow-lg shadow-[#E07A5F]/10' : ''}"
					ondragover={(e) => handleDragOver(e, stageInfo.id)}
					ondragenter={(e) => handleDragOver(e, stageInfo.id)}
					ondragleave={(e) => handleDragLeave(e, stageInfo.id)}
					ondrop={(e) => handleDrop(e, stageInfo.id)}
				>
					
					<!-- Column Header -->
					<div class="flex items-center justify-between px-2 py-2 border-b border-stone-300/80 dark:border-stone-800/80 mb-3">
						<div class="flex items-center gap-2">
							<span class="text-base">{stageInfo.icon}</span>
							<h3 class="font-display text-xs font-bold text-stone-800 dark:text-stone-200 tracking-tight">{stageInfo.label}</h3>
						</div>
						<span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-300/70 dark:bg-stone-800 text-stone-700 dark:text-stone-400 border border-stone-300 dark:border-stone-700">
							{columnPieces.length}
						</span>
					</div>

					<!-- Cards Column -->
					<div class="space-y-3 flex-1 overflow-y-auto snap-y snap-mandatory scroll-smooth max-h-[720px] pr-1" role="list">
						{#each columnPieces as piece}
							<div 
								role="listitem"
								aria-grabbed={draggedPieceId === piece.id}
								draggable="true"
								ondragstart={(e) => handleDragStart(e, piece.id)}
								ondragend={handleDragEnd}
								class="ceramic-card snap-start p-3.5 rounded-xl border border-stone-200 dark:border-stone-800/90 hover:border-[#E07A5F]/50 transition group relative space-y-3 cursor-grab active:cursor-grabbing {draggedPieceId === piece.id ? 'opacity-40 scale-95 border-dashed border-[#E07A5F]' : ''}"
							>
								<!-- Thumbnail / Photo -->
								{#if piece.initial_photo_url}
									<div class="w-full h-32 rounded-lg overflow-hidden relative bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
										<img src={piece.initial_photo_url} alt={piece.title} class="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
										<span class="absolute bottom-2 left-2 text-[10px] font-bold bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-white border border-white/10">
											{piece.piece_type}
										</span>
									</div>
								{/if}

								<!-- Piece Header & Cone -->
								<div class="flex items-start justify-between gap-2">
									<div class="flex-1 min-w-0">
										<div class="flex items-center gap-1.5">
											<GripVertical class="w-3.5 h-3.5 text-stone-400 dark:text-stone-600 group-hover:text-stone-600 dark:group-hover:text-stone-400 cursor-grab active:cursor-grabbing flex-shrink-0 transition" />
											<h4 class="font-display font-bold text-sm text-stone-900 dark:text-stone-100 group-hover:text-[#E07A5F] transition leading-snug truncate">
												{piece.title}
											</h4>
										</div>
										<div class="flex items-center gap-1.5 flex-wrap text-[11px] text-[#3B7258] dark:text-[#81B29A] font-medium mt-0.5 ml-5">
											<span>{piece.clay_body_name}</span>
											{#if piece.weight_grams}
												<span class="text-[10px] px-1.5 py-0.2 rounded bg-[#3B7258]/15 text-[#3B7258] dark:text-[#81B29A] font-bold border border-[#3B7258]/20">
													{formatClayWeight(piece.weight_grams)}
												</span>
											{/if}
										</div>
										{#if piece.notes || piece.description}
											<p class="text-[10px] text-stone-500 dark:text-stone-400 italic mt-1 ml-5 line-clamp-2">
												"{piece.notes || piece.description}"
											</p>
										{/if}
									</div>
									<span class="cone-badge cone-6 text-[9px] px-1.5 py-0.5 flex-shrink-0">
										{piece.target_glaze_cone}
									</span>
								</div>

								<!-- Tagged Glazes -->
								{#if piece.glaze_layers && piece.glaze_layers.length > 0}
									<div class="pt-2 border-t border-stone-200 dark:border-stone-800/80 space-y-1.5">
										<span class="text-[10px] font-semibold text-stone-500 dark:text-stone-400 block">Tagged Glazes:</span>
										<div class="flex flex-col gap-1">
											{#each piece.glaze_layers as gl}
												<div class="text-[10px] font-medium px-2 py-1 rounded bg-stone-100 dark:bg-stone-950/80 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
													<div class="flex items-center gap-1.5 truncate">
														<span class="px-1 py-0.2 text-[9px] font-bold rounded bg-[#E07A5F]/15 text-[#C85A32] dark:text-[#E07A5F]">
															{gl.manufacturer}
														</span>
														<span class="truncate font-semibold">{gl.glaze_name}</span>
													</div>
													<span class="text-[9px] text-stone-500 dark:text-stone-400 capitalize flex items-center gap-1">
														<span>{gl.coat_count}c ({gl.application_method})</span>
														{#if gl.location}
															<span class="px-1 py-0.2 rounded bg-stone-200 dark:bg-stone-800 text-[8.5px] font-semibold text-stone-700 dark:text-stone-300">
																{gl.location}
															</span>
														{/if}
													</span>
												</div>
											{/each}
										</div>
									</div>
								{/if}

								<!-- Card Action Bar -->
								<div class="pt-3 border-t border-stone-200 dark:border-stone-800/80 flex items-center justify-between text-xs">
									<div class="flex items-center gap-1.5">
										<button 
											onclick={() => selectedPiece = piece}
											class="p-1.5 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white rounded hover:bg-stone-200 dark:hover:bg-stone-800 transition"
											title="Glazes & Photo History"
										>
											<Info class="w-3.5 h-3.5" />
										</button>

										<button 
											onclick={() => duplicatePiece(piece)}
											class="p-1.5 text-stone-500 dark:text-stone-400 hover:text-[#E07A5F] rounded hover:bg-stone-200 dark:hover:bg-stone-800 transition"
											title="Duplicate Piece"
										>
											<Copy class="w-3.5 h-3.5" />
										</button>

										<button 
											onclick={() => openFailModal(piece)}
											class="p-1.5 text-stone-500 dark:text-stone-400 hover:text-red-500 rounded hover:bg-stone-200 dark:hover:bg-stone-800 transition"
											title="Flag as Failed"
										>
											<AlertCircle class="w-3.5 h-3.5" />
										</button>
									</div>

									{#if piece.stage !== 'done'}
										<button 
											onclick={() => advancePieceStage(piece.id)}
											class="text-[10px] font-bold text-[#3B7258] dark:text-[#81B29A] hover:text-stone-900 dark:hover:text-white flex items-center gap-1 transition px-2 py-1 rounded bg-[#81B29A]/15 hover:bg-[#81B29A]/25 border border-[#81B29A]/30"
										>
											<span>Next Stage</span>
											<ArrowRight class="w-3 h-3" />
										</button>
									{/if}
								</div>
							</div>
						{/each}

						{#if columnPieces.length === 0}
							<div class="h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center p-3 transition-all duration-200 {dragOverStageId === stageInfo.id ? 'border-[#E07A5F] bg-[#E07A5F]/10 scale-[1.02]' : 'border-stone-300 dark:border-stone-800/50'}">
								<p class="text-[11px] font-medium {dragOverStageId === stageInfo.id ? 'text-[#E07A5F] font-bold' : 'text-stone-500'}">
									{dragOverStageId === stageInfo.id ? 'Release to drop piece here' : 'Empty stage'}
								</p>
								{#if dragOverStageId === stageInfo.id}
									<span class="text-[10px] text-stone-500 dark:text-stone-400 mt-1">Move to {stageInfo.label}</span>
								{/if}
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<!-- MODAL 1: CREATE NEW CERAMIC PIECE -->
{#if isNewPieceModalOpen}
	<div class="fixed inset-0 z-50 bg-black/70 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
		<div class="ceramic-card max-w-lg w-full p-6 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-2xl space-y-6">
			<div class="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
				<div class="flex items-center gap-2">
					<Package class="w-5 h-5 text-[#E07A5F]" />
					<h3 class="font-display font-bold text-lg text-stone-900 dark:text-white">New Ceramic Piece</h3>
				</div>
				<button onclick={() => isNewPieceModalOpen = false} class="text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white">
					<X class="w-5 h-5" />
				</button>
			</div>

			<form onsubmit={handleCreatePiece} class="space-y-4 text-xs">
				<div class="space-y-1.5">
					<label for="piece-title" class="text-stone-700 dark:text-stone-300 font-semibold">Piece Title</label>
					<input 
						id="piece-title"
						type="text" 
						bind:value={newTitle}
						placeholder="e.g. Fluted Amaco PC Mug, Handbuilt Ikebana Bowl" 
						class="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-2.5 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#E07A5F]"
						required
					/>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div class="space-y-1.5">
						<label for="piece-type" class="text-stone-700 dark:text-stone-300 font-semibold">Form Type</label>
						<select 
							id="piece-type"
							bind:value={newPieceType}
							class="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-2.5 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#E07A5F]"
						>
							{#each PIECE_TYPES as pt}
								<option value={pt.name}>{pt.name} ({pt.description})</option>
							{/each}
						</select>
					</div>

					<div class="space-y-1.5">
						<label for="target-glaze-cone-select" class="text-stone-700 dark:text-stone-300 font-semibold">Target Glaze Cone</label>
						<select 
							id="target-glaze-cone-select"
							bind:value={newTargetGlazeCone}
							class="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-2.5 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#E07A5F]"
						>
							{#each PYROMETRIC_CONES as cone}
								<option value={cone.name}>
									{cone.name} ({cone.temp_f}°F / {cone.temp_c}°C)
								</option>
							{/each}
						</select>
					</div>
				</div>

				<div class="space-y-1.5">
					<div class="flex items-center justify-between">
						<label for="clay-select" class="text-stone-700 dark:text-stone-300 font-semibold">Clay Body</label>
						<button type="button" onclick={() => showClayLibraryModal = true} class="text-[11px] font-semibold text-[#E07A5F] hover:underline flex items-center gap-1">
							<Package class="w-3 h-3" />
							<span>Manage Clay Bodies</span>
						</button>
					</div>
					<select 
						id="clay-select"
						bind:value={newClayBodyId}
						class="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-2.5 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#E07A5F]"
					>
						{#each clayBodies as clay}
							<option value={clay.id}>
								{clay.is_global ? '🌐 [Global]' : '👤 [Custom]'} {clay.name} ({clay.firing_range})
							</option>
						{/each}
					</select>
				</div>

				<div class="space-y-1.5">
					<label for="piece-weight-amount" class="text-stone-700 dark:text-stone-300 font-semibold">Clay Weight Used (Formed Weight)</label>
					<div class="flex gap-2">
						<input 
							id="piece-weight-amount"
							type="number" 
							step="any"
							min="0"
							bind:value={newWeightAmount}
							placeholder="e.g. 550 or 1.5..." 
							class="flex-1 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-2.5 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#E07A5F]"
						/>
						<select 
							bind:value={newWeightUnit}
							class="w-28 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-2.5 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#E07A5F]"
						>
							<option value="g">grams (g)</option>
							<option value="kg">kilograms (kg)</option>
							<option value="lbs">pounds (lbs)</option>
							<option value="oz">ounces (oz)</option>
						</select>
					</div>
					{#if newWeightAmount && newWeightAmount > 0}
						<div class="text-[11px] font-semibold text-[#3B7258] dark:text-[#81B29A]">
							≈ {formatClayWeight(toGrams(newWeightAmount, newWeightUnit))}
						</div>
					{/if}
				</div>

				<div class="space-y-1.5">
					<label for="piece-notes-input" class="text-stone-700 dark:text-stone-300 font-semibold">Notes / Description (Optional)</label>
					<textarea 
						id="piece-notes-input"
						bind:value={newDescription}
						rows="2"
						placeholder="e.g. Fluted lip design, gift for Sarah, test glaze pairing..." 
						class="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-2.5 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#E07A5F]"
					></textarea>
				</div>

				<div class="space-y-1.5">
					<label for="photo-url" class="text-stone-700 dark:text-stone-300 font-semibold">Initial Photo URL (Optional)</label>
					<input 
						id="photo-url"
						type="url" 
						bind:value={newInitialPhotoUrl}
						placeholder="https://..." 
						class="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-2.5 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#E07A5F]"
					/>
				</div>

				<div class="pt-4 border-t border-stone-200 dark:border-stone-800 flex justify-end gap-3">
					<button 
						type="button" 
						onclick={() => isNewPieceModalOpen = false}
						class="px-4 py-2 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-semibold rounded-lg"
					>
						Cancel
					</button>
					<button 
						type="submit" 
						class="px-4 py-2 bg-[#E07A5F] hover:bg-[#C85A32] text-white font-bold rounded-lg shadow"
					>
						Create Piece
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- MODAL 2: PIECE GLAZE TAGGING & PHOTO HISTORY -->
{#if selectedPiece}
	<div class="fixed inset-0 z-50 bg-black/70 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
		<div class="ceramic-card max-w-2xl w-full p-6 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
			<div class="flex items-start justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
				<div>
					<div class="flex items-center gap-2">
						<h3 class="font-display font-bold text-xl text-stone-900 dark:text-white">{selectedPiece.title}</h3>
						<span class="px-2 py-0.5 text-[10px] uppercase font-bold bg-[#E07A5F]/20 text-[#C85A32] dark:text-[#E07A5F] border border-[#E07A5F]/30 rounded">
							Stage: {selectedPiece.stage}
						</span>
					</div>
					<div class="flex items-center gap-3 text-xs text-[#3B7258] dark:text-[#81B29A] font-semibold mt-1">
						<span>Clay: {selectedPiece.clay_body_name}</span>
						{#if selectedPiece.weight_grams}
							<span class="px-2 py-0.5 rounded bg-[#3B7258]/15 text-[#3B7258] dark:text-[#81B29A] border border-[#3B7258]/30 font-bold">
								Weight: {formatClayWeight(selectedPiece.weight_grams)}
							</span>
						{/if}
					</div>
				</div>
				<button onclick={() => selectedPiece = null} class="text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white">
					<X class="w-5 h-5" />
				</button>
			</div>

			<!-- Piece Notes / Description Section -->
			<div class="p-3 bg-stone-100/90 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800 space-y-1.5 text-xs">
				<div class="flex items-center justify-between">
					<span class="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
						<FileText class="w-4 h-4 text-[#E07A5F]" />
						<span>Piece Notes & Intent</span>
					</span>
					{#if !isEditingNotes}
						<button 
							type="button" 
							onclick={() => { editingPieceNotes = selectedPiece?.notes || selectedPiece?.description || ''; isEditingNotes = true; }} 
							class="text-[11px] font-bold text-[#E07A5F] hover:underline"
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
							class="w-full bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 rounded-lg p-2.5 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:border-[#E07A5F]"
						></textarea>
						<div class="flex justify-end gap-2">
							<button 
								type="button" 
								onclick={() => isEditingNotes = false}
								class="px-3 py-1 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-lg font-semibold text-[11px]"
							>
								Cancel
							</button>
							<button 
								type="button" 
								onclick={savePieceNotes}
								class="px-3 py-1 bg-[#E07A5F] hover:bg-[#C85A32] text-white rounded-lg font-bold text-[11px] shadow"
							>
								Save Notes
							</button>
						</div>
					</div>
				{:else}
					<p class="text-stone-600 dark:text-stone-300 text-[11px] leading-relaxed italic">
						{selectedPiece.notes || selectedPiece.description || 'No notes added yet for this piece. Click "Edit Notes" to add artistic intent, dimensions, or firing notes.'}
					</p>
				{/if}
			</div>

			<!-- Glaze Tagging Section -->
			<div class="space-y-4">
				<div class="flex items-center justify-between">
					<h4 class="font-display font-bold text-sm text-stone-800 dark:text-stone-200 flex items-center gap-2">
						<Droplets class="w-4 h-4 text-[#3B7258] dark:text-[#81B29A]" />
						<span>Applied Glaze Tagging</span>
					</h4>
				</div>

				{#if selectedPiece.glaze_layers && selectedPiece.glaze_layers.length > 0}
					<div class="space-y-2">
						{#each selectedPiece.glaze_layers as gl, i}
							<div class="bg-stone-100 dark:bg-stone-900/90 p-3 rounded-xl border border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
								<div class="flex items-center gap-2">
									<span class="w-5 h-5 rounded-full bg-stone-200 dark:bg-stone-800 font-bold flex items-center justify-center text-[10px] text-stone-700 dark:text-stone-400 border border-stone-300 dark:border-stone-700">
										#{i + 1}
									</span>
									<div>
										<div class="flex items-center gap-2">
											<span class="px-1.5 py-0.2 text-[9px] font-bold uppercase rounded bg-[#E07A5F]/20 text-[#C85A32] dark:text-[#E07A5F] border border-[#E07A5F]/30">
												{gl.manufacturer}
											</span>
											<span class="font-bold text-stone-900 dark:text-stone-100">{gl.glaze_name}</span>
											{#if gl.location}
												<span class="px-1.5 py-0.2 text-[9px] font-bold uppercase rounded bg-[#3B7258]/15 text-[#3B7258] dark:text-[#81B29A] border border-[#3B7258]/30">
													{gl.location}
												</span>
											{/if}
										</div>
										<span class="text-[11px] text-stone-500 dark:text-stone-400">
											Applied: <strong class="text-stone-700 dark:text-stone-300">{gl.coat_count} coats ({gl.application_method})</strong>
										</span>
									</div>
								</div>
							</div>
						{/each}
					</div>
				{/if}

				<!-- Tag Glaze Form -->
				<div class="p-4 bg-stone-100/80 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800 space-y-3 text-xs">
					<span class="font-bold text-stone-800 dark:text-stone-200 block">Tag New Glaze Layer:</span>
					
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<div class="space-y-1">
							<label for="glaze-preset-select" class="text-stone-600 dark:text-stone-400 font-medium">Select Predefined Glaze</label>
							<select 
								id="glaze-preset-select"
								onchange={handleGlazeSelectionChange}
								class="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#E07A5F]"
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
							<label for="glaze-name-input" class="text-stone-600 dark:text-stone-400 font-medium">Glaze Name</label>
							<input 
								id="glaze-name-input"
								type="text" 
								bind:value={tagGlazeName}
								placeholder="e.g. PC-20 Blue Rutile" 
								class="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-2 text-stone-900 dark:text-stone-100"
							/>
						</div>
					</div>

					<div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
						<div class="space-y-1">
							<label for="glaze-mfr-input" class="text-stone-600 dark:text-stone-400 font-medium">Manufacturer</label>
							<select 
								id="glaze-mfr-input"
								bind:value={tagGlazeManufacturer}
								class="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-2 text-stone-900 dark:text-stone-100"
							>
								{#each MANUFACTURERS as mfr}
									<option value={mfr.name}>{mfr.name}</option>
								{/each}
							</select>
						</div>

						<div class="space-y-1">
							<label for="glaze-style-input" class="text-stone-600 dark:text-stone-400 font-medium">Style / Method</label>
							<select 
								id="glaze-style-input"
								bind:value={tagGlazeMethod}
								class="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-2 text-stone-900 dark:text-stone-100"
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
							<label for="glaze-coats-input" class="text-stone-600 dark:text-stone-400 font-medium">Coats</label>
							<select 
								id="glaze-coats-input"
								bind:value={tagGlazeCoats}
								class="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-2 text-stone-900 dark:text-stone-100"
							>
								<option value={1}>1 Coat</option>
								<option value={2}>2 Coats</option>
								<option value={3}>3 Coats</option>
								<option value={4}>4 Coats</option>
							</select>
						</div>

						<div class="space-y-1">
							<label for="glaze-location-input" class="text-stone-600 dark:text-stone-400 font-medium">Location / Coverage</label>
							<select 
								id="glaze-location-input"
								bind:value={tagGlazeLocation}
								class="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-2 text-stone-900 dark:text-stone-100"
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
							class="px-4 py-2 bg-[#81B29A] hover:bg-[#579B7B] text-white font-bold rounded-lg transition shadow flex items-center gap-1.5"
						>
							<Plus class="w-4 h-4" />
							<span>Tag Glaze Layer</span>
						</button>
					</div>
				</div>
			</div>

			<!-- Stage Timeline & Photo Log -->
			<div class="space-y-3 pt-4 border-t border-stone-200 dark:border-stone-800">
				<h4 class="font-display font-bold text-sm text-stone-800 dark:text-stone-200 flex items-center gap-2">
					<Camera class="w-4 h-4 text-[#E07A5F]" />
					<span>Stage Snapshots & Photo History</span>
				</h4>

				{#if selectedPiece.stage_logs && selectedPiece.stage_logs.length > 0}
					<div class="space-y-3">
						{#each selectedPiece.stage_logs as log}
							<div class="bg-stone-100 dark:bg-stone-900/60 p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2 text-xs">
								<div class="flex items-center justify-between text-stone-500 dark:text-stone-400">
									<div class="flex items-center gap-2">
										<span class="font-bold text-[#C85A32] dark:text-[#E07A5F] uppercase">{log.stage}</span>
										{#if log.weight_grams}
											<span class="px-1.5 py-0.2 rounded bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-[10px]">
												{formatClayWeight(log.weight_grams)}
											</span>
										{/if}
									</div>
									<span>{log.created_at}</span>
								</div>
								{#if log.notes}
									<p class="text-stone-700 dark:text-stone-300">{log.notes}</p>
								{/if}
								{#if log.photo_url}
									<img src={log.photo_url} alt="Stage log snapshot" class="w-32 h-32 object-cover rounded-lg border border-stone-300 dark:border-stone-700" />
								{/if}
							</div>
						{/each}
					</div>
				{/if}

				<div class="space-y-2 p-3 bg-stone-100/60 dark:bg-stone-900/40 rounded-xl border border-stone-200 dark:border-stone-800 text-xs">
					<input 
						type="text" 
						bind:value={newLogNote}
						placeholder="Add note for current stage..." 
						class="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg px-3 py-2 text-stone-900 dark:text-stone-100"
					/>
					<div class="flex gap-2">
						<input 
							type="url" 
							bind:value={newLogPhoto}
							placeholder="Photo URL..." 
							class="flex-1 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg px-3 py-2 text-stone-900 dark:text-stone-100"
						/>
						<input 
							type="number" 
							step="any"
							min="0"
							bind:value={newLogWeightAmount}
							placeholder="Weight..." 
							class="w-24 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg px-3 py-2 text-stone-900 dark:text-stone-100"
						/>
						<select 
							bind:value={newLogWeightUnit}
							class="w-20 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg px-2 py-2 text-stone-900 dark:text-stone-100"
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
		</div>
	</div>
{/if}

<!-- MODAL 3: GLAZE LIBRARY MANAGER -->
{#if showGlazeLibraryModal}
	<div class="fixed inset-0 z-50 bg-black/70 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
		<div class="ceramic-card max-w-2xl w-full p-6 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
			<div class="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
				<div class="flex items-center gap-2 text-stone-900 dark:text-white">
					<Palette class="w-5 h-5 text-[#3B7258] dark:text-[#81B29A]" />
					<h3 class="font-display font-bold text-lg">Studio Glaze Library</h3>
				</div>
				<button onclick={() => showGlazeLibraryModal = false} class="text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white">
					<X class="w-5 h-5" />
				</button>
			</div>

			<div class="space-y-3">
				<h4 class="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Available Predefined & Custom Glazes</h4>
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
					{#each glazes as g}
						<div class="bg-stone-100 dark:bg-stone-900/90 p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2">
							<div class="flex items-center justify-between">
								<span class="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-[#E07A5F]/20 text-[#C85A32] dark:text-[#E07A5F] border border-[#E07A5F]/30">
									{g.manufacturer}
								</span>
								<span class="cone-badge cone-6 text-[9px]">
									{g.min_cone || 'Cone 5'} – {g.max_cone || 'Cone 6'}
								</span>
							</div>
							<h5 class="font-display font-bold text-stone-900 dark:text-stone-100">{g.name}</h5>
							<p class="text-stone-600 dark:text-stone-400 text-[11px] leading-relaxed">{g.notes}</p>
							<div class="pt-2 border-t border-stone-200 dark:border-stone-800 flex justify-between text-[10px] text-stone-500 dark:text-stone-400">
								<span>Style: <strong class="text-stone-800 dark:text-stone-200 capitalize">{g.default_style}</strong></span>
								<span>Scope: <strong class="text-[#3B7258] dark:text-[#81B29A]">{g.is_global ? 'Global' : 'Custom'}</strong></span>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<form onsubmit={handleAddCustomLibraryGlaze} class="pt-4 border-t border-stone-200 dark:border-stone-800 space-y-3 text-xs">
				<span class="font-bold text-stone-800 dark:text-stone-200 block">Add Custom Glaze to Library:</span>
				<div class="grid grid-cols-2 gap-3">
					<input 
						type="text" 
						bind:value={newLibraryGlazeName}
						placeholder="Glaze Name (e.g. Iron Red Satin)..." 
						class="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-2 text-stone-900 dark:text-stone-100"
						required
					/>
					<select 
						bind:value={newLibraryManufacturer}
						class="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-2 text-stone-900 dark:text-stone-100"
					>
						{#each MANUFACTURERS as mfr}
							<option value={mfr.name}>{mfr.name}</option>
						{/each}
					</select>
				</div>
				<div class="grid grid-cols-3 gap-3">
					<div class="space-y-1">
						<label for="lib-style-select" class="text-stone-600 dark:text-stone-400 text-[10px]">Application Style</label>
						<select 
							id="lib-style-select"
							bind:value={newLibraryStyle}
							class="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-2 text-stone-900 dark:text-stone-100"
						>
							<option value="brush">Brush Style</option>
							<option value="dip">Dipping Bucket</option>
							<option value="spray">Spray Style</option>
							<option value="underglaze">Underglaze</option>
						</select>
					</div>

					<div class="space-y-1">
						<label for="lib-min-cone" class="text-stone-600 dark:text-stone-400 text-[10px]">Min Firing Cone</label>
						<select 
							id="lib-min-cone"
							bind:value={newLibraryMinCone}
							class="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-2 text-stone-900 dark:text-stone-100"
						>
							{#each PYROMETRIC_CONES as cone}
								<option value={cone.name}>{cone.name}</option>
							{/each}
						</select>
					</div>

					<div class="space-y-1">
						<label for="lib-max-cone" class="text-stone-600 dark:text-stone-400 text-[10px]">Max Firing Cone</label>
						<select 
							id="lib-max-cone"
							bind:value={newLibraryMaxCone}
							class="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-2 text-stone-900 dark:text-stone-100"
						>
							{#each PYROMETRIC_CONES as cone}
								<option value={cone.name}>{cone.name}</option>
							{/each}
						</select>
					</div>
				</div>
				<div class="flex justify-end">
					<button type="submit" class="px-4 py-2 bg-[#81B29A] hover:bg-[#579B7B] text-white font-bold rounded-lg shadow">
						Add Glaze to Library
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- MODAL 3.5: CLAY BODY LIBRARY MANAGER -->
{#if showClayLibraryModal}
	<div class="fixed inset-0 z-50 bg-black/70 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
		<div class="ceramic-card max-w-2xl w-full p-6 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
			<div class="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
				<div class="flex items-center gap-2 text-stone-900 dark:text-white">
					<Package class="w-5 h-5 text-[#E07A5F]" />
					<h3 class="font-display font-bold text-lg">Studio Clay Body Library</h3>
				</div>
				<button onclick={() => showClayLibraryModal = false} class="text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white">
					<X class="w-5 h-5" />
				</button>
			</div>

			<div class="space-y-3">
				<h4 class="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Available Clay Bodies</h4>
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
					{#each clayBodies as cb}
						<div class="bg-stone-100 dark:bg-stone-900/90 p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2">
							<div class="flex items-center justify-between">
								<span class="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-[#E07A5F]/20 text-[#C85A32] dark:text-[#E07A5F] border border-[#E07A5F]/30">
									{cb.manufacturer || 'Custom'}
								</span>
								<span class="cone-badge cone-6 text-[9px]">
									{cb.firing_range}
								</span>
							</div>
							<h5 class="font-display font-bold text-stone-900 dark:text-stone-100">{cb.name}</h5>
							<div class="grid grid-cols-3 gap-1 text-[11px] text-stone-600 dark:text-stone-400">
								<span>Shrinkage: <strong class="text-stone-800 dark:text-stone-200">{cb.shrinkage_pct}%</strong></span>
								<span>Raw Color: <strong class="text-stone-800 dark:text-stone-200">{cb.raw_color}</strong></span>
								<span>Fired Color: <strong class="text-stone-800 dark:text-stone-200">{cb.fired_color}</strong></span>
							</div>
							{#if cb.notes}
								<p class="text-stone-600 dark:text-stone-400 text-[11px] leading-relaxed pt-1 border-t border-stone-200 dark:border-stone-800">{cb.notes}</p>
							{/if}
							<div class="pt-2 border-t border-stone-200 dark:border-stone-800 flex justify-between text-[10px] text-stone-500 dark:text-stone-400">
								<span>Scope: <strong class="text-[#3B7258] dark:text-[#81B29A]">{cb.is_global ? 'Global' : 'Custom'}</strong></span>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<form onsubmit={handleAddCustomLibraryClay} class="pt-4 border-t border-stone-200 dark:border-stone-800 space-y-3 text-xs">
				<span class="font-bold text-stone-800 dark:text-stone-200 block">Add Custom Clay Body to Library:</span>
				<div class="grid grid-cols-2 gap-3">
					<div class="space-y-1">
						<label for="lib-clay-name" class="text-stone-600 dark:text-stone-400 text-[10px]">Clay Body Name</label>
						<input 
							id="lib-clay-name"
							type="text" 
							bind:value={newLibraryClayName}
							placeholder="e.g. Red Stoneware 266..." 
							class="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-2 text-stone-900 dark:text-stone-100"
							required
						/>
					</div>
					<div class="space-y-1">
						<label for="lib-clay-mfr" class="text-stone-600 dark:text-stone-400 text-[10px]">Manufacturer</label>
						<select 
							id="lib-clay-mfr"
							bind:value={newLibraryClayManufacturer}
							class="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-2 text-stone-900 dark:text-stone-100"
						>
							{#each MANUFACTURERS as mfr}
								<option value={mfr.name}>{mfr.name}</option>
							{/each}
						</select>
					</div>
				</div>

				<div class="grid grid-cols-3 gap-3">
					<div class="space-y-1">
						<label for="lib-clay-mincone" class="text-stone-600 dark:text-stone-400 text-[10px]">Min Firing Cone</label>
						<select 
							id="lib-clay-mincone"
							bind:value={newLibraryClayMinCone}
							class="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-2 text-stone-900 dark:text-stone-100"
						>
							{#each PYROMETRIC_CONES as cone}
								<option value={cone.name}>{cone.name}</option>
							{/each}
						</select>
					</div>
					<div class="space-y-1">
						<label for="lib-clay-maxcone" class="text-stone-600 dark:text-stone-400 text-[10px]">Max Firing Cone</label>
						<select 
							id="lib-clay-maxcone"
							bind:value={newLibraryClayMaxCone}
							class="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-2 text-stone-900 dark:text-stone-100"
						>
							{#each PYROMETRIC_CONES as cone}
								<option value={cone.name}>{cone.name}</option>
							{/each}
						</select>
					</div>
					<div class="space-y-1">
						<label for="lib-clay-shrinkage" class="text-stone-600 dark:text-stone-400 text-[10px]">Shrinkage %</label>
						<input 
							id="lib-clay-shrinkage"
							type="number" 
							step="0.1" 
							bind:value={newLibraryClayShrinkage}
							class="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-2 text-stone-900 dark:text-stone-100"
						/>
					</div>
				</div>

				<div class="grid grid-cols-2 gap-3">
					<div class="space-y-1">
						<label for="lib-clay-rawcolor" class="text-stone-600 dark:text-stone-400 text-[10px]">Raw Color</label>
						<input 
							id="lib-clay-rawcolor"
							type="text" 
							bind:value={newLibraryClayRawColor}
							placeholder="e.g. Grey" 
							class="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-2 text-stone-900 dark:text-stone-100"
						/>
					</div>
					<div class="space-y-1">
						<label for="lib-clay-firedcolor" class="text-stone-600 dark:text-stone-400 text-[10px]">Fired Color</label>
						<input 
							id="lib-clay-firedcolor"
							type="text" 
							bind:value={newLibraryClayFiredColor}
							placeholder="e.g. Dark Red-Brown" 
							class="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-2 text-stone-900 dark:text-stone-100"
						/>
					</div>
				</div>

				<div class="space-y-1">
					<label for="lib-clay-notes" class="text-stone-600 dark:text-stone-400 text-[10px]">Notes / Characteristics</label>
					<input 
						id="lib-clay-notes"
						type="text" 
						bind:value={newLibraryClayNotes}
						placeholder="e.g. High grog content for large sculptural throwing..." 
						class="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-2 text-stone-900 dark:text-stone-100"
					/>
				</div>

				<div class="flex justify-end">
					<button type="submit" class="px-4 py-2 bg-[#E07A5F] hover:bg-[#C85A32] text-white font-bold rounded-lg shadow">
						Add Clay Body to Library
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- MODAL 4: FULL PYROMETRIC CONE TEMPERATURE EQUIVALENTS CHART -->
{#if showPyrometricChartModal}
	<div class="fixed inset-0 z-50 bg-black/70 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
		<div class="ceramic-card max-w-3xl w-full p-6 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
			<div class="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
				<div class="flex items-center gap-2 text-stone-900 dark:text-white">
					<Flame class="w-5 h-5 text-[#C85A32] dark:text-[#F2CC8F]" />
					<h3 class="font-display font-bold text-lg">Pyrometric Cone Temperature Equivalents</h3>
				</div>
				<button onclick={() => showPyrometricChartModal = false} class="text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white">
					<X class="w-5 h-5" />
				</button>
			</div>

			<p class="text-xs text-stone-600 dark:text-stone-300">
				Standard Orton / Skutt kiln firing temperatures rated at 108°F/hr during final heating:
			</p>

			<div class="divide-y divide-stone-200 dark:divide-stone-800 text-xs rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden">
				<div class="grid grid-cols-5 px-4 py-2.5 bg-stone-100 dark:bg-stone-900 font-bold text-stone-700 dark:text-stone-300">
					<span>Cone</span>
					<span>°F</span>
					<span>°C</span>
					<span>Color Fire</span>
					<span>Firing Category</span>
				</div>
				<div class="max-h-96 overflow-y-auto divide-y divide-stone-200 dark:divide-stone-800">
					{#each PYROMETRIC_CONES as cone}
						<div class="grid grid-cols-5 px-4 py-2 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800/40">
							<span class="font-bold text-[#C85A32] dark:text-[#E07A5F]">{cone.name}</span>
							<span>{cone.temp_f}°F</span>
							<span>{cone.temp_c}°C</span>
							<span class="text-stone-500 dark:text-stone-400">{cone.color_fire}</span>
							<span class="uppercase text-[10px] font-semibold text-[#3B7258] dark:text-[#81B29A]">{cone.firing_category.replace('_', ' ')}</span>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- MODAL 5: FLAG PIECE AS FAILED / CRACKED -->
{#if isFailModalOpen && pieceToFail}
	<div class="fixed inset-0 z-50 bg-black/70 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
		<div class="ceramic-card max-w-md w-full p-6 rounded-2xl border border-red-300 dark:border-red-900/50 shadow-2xl space-y-5">
			<div class="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
				<div class="flex items-center gap-2 text-red-600 dark:text-red-400 font-display font-bold text-base">
					<AlertTriangle class="w-5 h-5" />
					<h3>Flag Piece as Failed</h3>
				</div>
				<button onclick={() => isFailModalOpen = false} class="text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white">
					<X class="w-5 h-5" />
				</button>
			</div>

			<p class="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
				Flagging <strong class="text-stone-900 dark:text-white">{pieceToFail.title}</strong> will move it into your studio failure archives.
			</p>

			<div class="space-y-1.5 text-xs">
				<label for="fail-reason" class="text-stone-700 dark:text-stone-300 font-semibold">Select or Type Failure Reason</label>
				<select 
					id="fail-reason"
					bind:value={failReason}
					class="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-2.5 text-stone-900 dark:text-stone-100 mb-2"
				>
					<option value="S-crack in foot during drying">S-crack in foot during drying</option>
					<option value="Handle attachment popped off">Handle attachment popped off</option>
					<option value="Glaze ran onto kiln shelf">Glaze ran onto kiln shelf</option>
					<option value="Exploded in bisque firing">Exploded in bisque firing</option>
					<option value="Shivering / glaze crawling defect">Shivering / glaze crawling defect</option>
					<option value="Thermal shock / dunting crack">Thermal shock / dunting crack</option>
				</select>
				<input 
					type="text" 
					bind:value={failReason} 
					placeholder="Or enter custom failure reason..."
					class="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-2.5 text-stone-900 dark:text-stone-100"
				/>
			</div>

			<div class="pt-3 border-t border-stone-200 dark:border-stone-800 flex justify-end gap-3 text-xs">
				<button 
					onclick={() => isFailModalOpen = false}
					class="px-4 py-2 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-semibold rounded-lg"
				>
					Cancel
				</button>
				<button 
					onclick={confirmFlagAsFailed}
					class="px-4 py-2 bg-red-700 hover:bg-red-800 dark:bg-red-800 dark:hover:bg-red-700 text-white font-bold rounded-lg shadow"
				>
					Flag as Failed
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- STAGE UPDATE FEEDBACK TOAST -->
{#if toastMessage}
	<div class="fixed bottom-6 right-6 z-50 bg-white dark:bg-stone-900 border border-[#81B29A]/50 text-stone-900 dark:text-stone-100 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
		<div class="p-1 rounded-full bg-[#81B29A]/20 text-[#3B7258] dark:text-[#81B29A]">
			<CheckCircle2 class="w-4 h-4" />
		</div>
		<span class="text-xs font-semibold">{toastMessage}</span>
	</div>
{/if}
