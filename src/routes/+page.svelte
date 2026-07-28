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
	import FileText from 'lucide-svelte/icons/file-text';
	import GitFork from 'lucide-svelte/icons/git-fork';
	import Boxes from 'lucide-svelte/icons/boxes';
	import Calendar from 'lucide-svelte/icons/calendar';
	import Filter from 'lucide-svelte/icons/filter';
	import FilterX from 'lucide-svelte/icons/filter-x';
	import Search from 'lucide-svelte/icons/search';
	import SlidersHorizontal from 'lucide-svelte/icons/sliders-horizontal';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import GripVertical from 'lucide-svelte/icons/grip-vertical';
	import type { CeramicPiece, ClayBody, CeramicStage, PieceStageLog, PieceGlazeLayer, GlazeRecipe, GlazeStyle, GlazeLocation, PyrometricCone, Manufacturer, PieceType, PieceBatch } from '$lib/types/database';

	function formatDateShort(dateVal?: Date | string | null): string {
		if (!dateVal) return '';
		const d = typeof dateVal === 'string' ? new Date(dateVal) : dateVal;
		if (isNaN(d.getTime())) return '';
		const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		return `${monthNames[d.getMonth()]} ${d.getDate()}`;
	}

	function formatDateInput(d?: Date | null): string {
		if (!d || isNaN(d.getTime())) return '';
		const year = d.getFullYear();
		const month = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	function parseDateInput(str?: string | null): Date | null {
		if (!str || !str.trim()) return null;
		const parts = str.split('-').map(Number);
		if (parts.length === 3 && !parts.some(isNaN)) {
			return new Date(parts[0], parts[1] - 1, parts[2]);
		}
		return null;
	}

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

	// Sample Initial Pieces (Includes a 6-piece duplicate batch)
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
		stage: 'bone_dry' as CeramicStage,
		batch_id: 'b-101',
		batch_sequence: i + 1,
		batch: sampleBatchObj,
		is_failed: false,
		target_bisque_cone: 'Cone 04',
		target_glaze_cone: 'Cone 6',
		weight_grams: 420,
		height_cm: 9.5,
		width_cm: 8.5,
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
			stage: 'ready_to_trim',
			is_failed: false,
			target_bisque_cone: 'Cone 06',
			target_glaze_cone: 'Cone 6',
			weight_grams: 480,
			height_cm: 8.5,
			width_cm: 13.0,
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
			failure_stage: 'bone_dry',
			failure_reason: 'Thermal stress S-crack in base',
			failed_at: new Date('2026-07-24T00:00:00'),
			target_bisque_cone: 'Cone 04',
			target_glaze_cone: 'Cone 06',
			weight_grams: 850,
			height_cm: 18.0,
			width_cm: 12.0,
			initial_photo_url: null,
			started_at: new Date('2026-07-20T00:00:00'),
			due_date: null,
			created_at: new Date('2026-07-20T00:00:00'),
			updated_at: new Date('2026-07-24T00:00:00'),
			stage_logs: [],
			glaze_layers: []
		}
	]);

	// UI Active Views & Modals
	let showGlazeLibraryModal = $state(false);
	let showClayLibraryModal = $state(false);
	let showPyrometricChartModal = $state(false);
	let showLossArchive = $state(false);
	let selectedPiece = $state<CeramicPiece | null>(null);
	let mobileActiveStage = $state<CeramicStage | 'all'>('all');

	// New Piece Modal State (With Multi-Piece Batch Support)
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
	let newDueDate = $state('');
	let newStage = $state<CeramicStage>('backlog');
	let newQuantity = $state(1);
	let newBatchTitle = $state('');

	// Job Splitting Modal State
	let isSplitModalOpen = $state(false);
	let splitTargetBatchId = $state<string | null>(null);
	let splitTargetBatchTitle = $state<string>('');
	let splitTargetStage = $state<CeramicStage | null>(null);
	let splitBatchPieces = $state<CeramicPiece[]>([]);
	let splitSelectedPieceIds = $state<string[]>([]);
	let splitAction = $state<'new_batch' | 'detach' | 'fail'>('new_batch');
	let splitNewSubBatchTitle = $state<string>('');
	let splitFailReason = $state<string>('S-crack in foot during firing');

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

	// Duplicate Confirmation Modal State
	let isDuplicateModalOpen = $state(false);
	let pieceToDuplicate = $state<CeramicPiece | null>(null);
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
	let draggedBatchKey = $state<string | null>(null); // Format: "batchId::stageId::glazeSig"
	let dragOverStageId = $state<CeramicStage | null>(null);
	let dragOverCardGroupKey = $state<string | null>(null);
	let toastMessage = $state<string | null>(null);
	let toastTimeout: ReturnType<typeof setTimeout>;

	// Unified Pointer Drag State
	let touchDragActive = $state(false);
	let touchDragGhostX = $state(0);
	let touchDragGhostY = $state(0);
	let touchDragLabel = $state('');
	let touchLongPressTimer: ReturnType<typeof setTimeout> | null = null;
	let touchStartX = 0;
	let touchStartY = 0;
	let pendingPieceId: string | null = null;
	let pendingBatchKey: string | null = null;
	let pendingLabel = '';
	let pendingPointerTarget: HTMLElement | null = null;
	let pendingPointerId: number | null = null;
	const TOUCH_HOLD_MS = 450;
	const MOUSE_HOLD_MS = 50;
	const TOUCH_MOVE_THRESHOLD = 18;
	let stageBounds: { id: CeramicStage; rect: DOMRect }[] = [];

	function resetDragState() {
		if (touchLongPressTimer) {
			clearTimeout(touchLongPressTimer);
			touchLongPressTimer = null;
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
		draggedPieceId = null;
		draggedBatchKey = null;
		dragOverStageId = null;
		dragOverCardGroupKey = null;
	}

	function updateStageBounds() {
		if (typeof document === 'undefined') return;
		const lanes = document.querySelectorAll('[data-stage-id]');
		stageBounds = Array.from(lanes).map((el) => ({
			id: (el as HTMLElement).dataset.stageId as CeramicStage,
			rect: el.getBoundingClientRect()
		}));
	}

	function isInteractiveTarget(target: EventTarget | null): boolean {
		if (!target || !(target instanceof HTMLElement)) return false;
		const btn = target.closest('button, input, select, a, [role="button"]');
		if (!btn) return false;
		return btn.hasAttribute('data-action-button');
	}

	function handlePointerDownPiece(e: PointerEvent, pieceId: string, label: string) {
		if (e.button !== 0 || isInteractiveTarget(e.target)) return;
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
			updateStageBounds();
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
		if (e.button !== 0 || isInteractiveTarget(e.target)) return;
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
			updateStageBounds();
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

	// Global window pointer listeners during drag
	$effect(() => {
		if (typeof window === 'undefined') return;

		const onMove = (e: PointerEvent) => {
			// If hold timer is active and pointer moves past threshold before drag activates, cancel hold (user is scrolling or selecting)
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

			// Live DOM element hit-testing under current pointer position
			const el = document.elementFromPoint(e.clientX, e.clientY);
			if (el) {
				const cardEl = el.closest('[data-card-group-key]') as HTMLElement | null;
				const laneEl = el.closest('[data-stage-id]') as HTMLElement | null;

				const targetCardKey = cardEl?.dataset.cardGroupKey || null;

				// Don't highlight self as merge target
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
				dragOverStageId = laneEl ? (laneEl.dataset.stageId as CeramicStage) : null;
			} else {
				dragOverCardGroupKey = null;
				dragOverStageId = null;
			}
		};

		const onUp = (e: PointerEvent) => {
			if (!touchDragActive) return;

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

			resetDragState();
		};

		const onCancel = () => {
			resetDragState();
		};

		const onTouchMove = (e: TouchEvent) => {
			if (touchDragActive && e.cancelable) {
				e.preventDefault();
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
			showToast(`Cannot merge: Items must share the same clay (${targetPiece.clay_body_name}), form type (${targetPiece.piece_type}), and stage!`);
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
			showToast(`Moved batch pieces to ${stageName}`);
		} else if (draggedPieceId) {
			const piece = pieces.find(p => p.id === draggedPieceId);
			if (piece && piece.stage !== targetStage) {
				const isMovingOutFromBacklog = piece.stage === 'backlog' && targetStage !== 'backlog';

				pieces = pieces.map(p => {
					if (p.id === draggedPieceId) {
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

				showToast(`Moved "${piece.title}" to ${stageName}`);
			}
		}
	}

	function showToast(msg: string) {
		toastMessage = msg;
		clearTimeout(toastTimeout);
		toastTimeout = setTimeout(() => {
			toastMessage = null;
		}, 3000);
	}

	function handleDragStart(e: DragEvent, pieceId: string) {
		draggedPieceId = pieceId;
		draggedBatchKey = null;
		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('text/plain', pieceId);
		}
	}

	function handleBatchDragStart(e: DragEvent, batchId: string, stageId: CeramicStage, glazeSig: string) {
		draggedBatchKey = `${batchId}::${stageId}::${glazeSig}`;
		draggedPieceId = null;
		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('text/plain', draggedBatchKey);
		}
	}

	function handleDragEnd() {
		draggedPieceId = null;
		draggedBatchKey = null;
		dragOverStageId = null;
		dragOverCardGroupKey = null;
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

	function handleCardDragOver(e: DragEvent, group: KanbanDisplayGroup) {
		e.preventDefault();
		e.stopPropagation();
		if (e.dataTransfer) {
			e.dataTransfer.dropEffect = 'move';
		}
		const key = group.isBatch ? group.batchId! : group.primaryPiece.id;
		if (dragOverCardGroupKey !== key) {
			dragOverCardGroupKey = key;
		}
	}

	function handleCardDragLeave(e: DragEvent, group: KanbanDisplayGroup) {
		const relatedTarget = e.relatedTarget as HTMLElement | null;
		const currentTarget = e.currentTarget as HTMLElement | null;
		if (currentTarget && relatedTarget && currentTarget.contains(relatedTarget)) {
			return;
		}
		const key = group.isBatch ? group.batchId! : group.primaryPiece.id;
		if (dragOverCardGroupKey === key) {
			dragOverCardGroupKey = null;
		}
	}

	function handleCardDrop(e: DragEvent, targetGroup: KanbanDisplayGroup) {
		e.preventDefault();
		e.stopPropagation();

		const targetPiece = targetGroup.primaryPiece;
		const targetBatchId = targetGroup.isBatch ? targetGroup.batchId : targetPiece.batch_id;

		let sourcePiecesToMerge: CeramicPiece[] = [];

		if (draggedBatchKey) {
			const [srcBatchId, srcStage, srcGlazeSig] = draggedBatchKey.split('::');
			if (srcBatchId === targetBatchId) {
				draggedPieceId = null;
				draggedBatchKey = null;
				dragOverCardGroupKey = null;
				return;
			}
			sourcePiecesToMerge = pieces.filter(p => p.batch_id === srcBatchId && p.stage === srcStage && !p.is_failed);
		} else if (draggedPieceId) {
			if (draggedPieceId === targetPiece.id) {
				draggedPieceId = null;
				draggedBatchKey = null;
				dragOverCardGroupKey = null;
				return;
			}
			const srcPiece = pieces.find(p => p.id === draggedPieceId);
			if (srcPiece) sourcePiecesToMerge = [srcPiece];
		}

		if (sourcePiecesToMerge.length === 0) {
			draggedPieceId = null;
			draggedBatchKey = null;
			dragOverCardGroupKey = null;
			return;
		}

		// SIMPLE VALIDATION: Same clay body, same form type, same stage
		const invalidItems = sourcePiecesToMerge.filter(p => 
			(p.clay_body_id && targetPiece.clay_body_id ? p.clay_body_id !== targetPiece.clay_body_id : p.clay_body_name !== targetPiece.clay_body_name) ||
			p.piece_type !== targetPiece.piece_type ||
			p.stage !== targetPiece.stage
		);

		if (invalidItems.length > 0) {
			showToast(`Cannot merge: Items must share the same clay (${targetPiece.clay_body_name}), form type (${targetPiece.piece_type}), and stage!`);
			draggedPieceId = null;
			draggedBatchKey = null;
			dragOverCardGroupKey = null;
			return;
		}

		// Prepare batch ID & object
		const effectiveBatchId = targetBatchId || `b-${Date.now()}`;
		const effectiveBatchTitle = targetGroup.batchTitle || targetPiece.batch?.title || `${targetPiece.title.replace(/\s*#\d+$/, '')} Batch`;

		const batchObj: PieceBatch = targetPiece.batch || {
			id: effectiveBatchId,
			user_id: 'user-1',
			title: effectiveBatchTitle,
			created_at: new Date(),
			updated_at: new Date()
		};

		const sourceIds = new Set(sourcePiecesToMerge.map(p => p.id));

		pieces = pieces.map(p => {
			if (sourceIds.has(p.id) || p.id === targetPiece.id) {
				return {
					...p,
					batch_id: effectiveBatchId,
					batch: batchObj,
					updated_at: new Date()
				};
			}
			return p;
		});

		showToast(`Re-added ${sourcePiecesToMerge.length} piece(s) back into batch "${effectiveBatchTitle}"!`);

		draggedPieceId = null;
		draggedBatchKey = null;
		dragOverCardGroupKey = null;
		dragOverStageId = null;
	}

	function handleDrop(e: DragEvent, targetStage: CeramicStage) {
		e.preventDefault();
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
			showToast(`Moved batch pieces to ${stageName}`);
		} else if (draggedPieceId) {
			const piece = pieces.find(p => p.id === draggedPieceId);
			if (piece && piece.stage !== targetStage) {
				const isMovingOutFromBacklog = piece.stage === 'backlog' && targetStage !== 'backlog';

				pieces = pieces.map(p => {
					if (p.id === draggedPieceId) {
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

				showToast(`Moved "${piece.title}" to ${stageName}`);
			}
		}

		draggedPieceId = null;
		draggedBatchKey = null;
		dragOverStageId = null;
	}

	// Smart Batch Kanban Card Grouping Helper
	interface KanbanDisplayGroup {
		isBatch: boolean;
		batchId?: string;
		batchTitle?: string;
		glazeSignature?: string;
		pieces: CeramicPiece[];
		primaryPiece: CeramicPiece;
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
				const glazeSig = piece.glaze_layers ? piece.glaze_layers.map(g => g.glaze_name).sort().join('|') : '';
				const failSig = piece.is_failed ? 'failed' : 'active';
				const key = `${piece.batch_id}::${glazeSig}::${failSig}`;
				if (!batchMap.has(key)) batchMap.set(key, []);
				batchMap.get(key)!.push(piece);
			} else {
				nonBatched.push(piece);
			}
		}

		// Add individual standalone pieces
		for (const p of nonBatched) {
			groups.push({
				isBatch: false,
				pieces: [p],
				primaryPiece: p
			});
		}

		// Add stacked batch groups
		for (const [key, bPieces] of batchMap.entries()) {
			const parts = key.split('::');
			const bId = parts[0];
			const glazeSig = parts[1];
			if (bPieces.length === 1) {
				// Single piece in stage
				groups.push({
					isBatch: false,
					pieces: bPieces,
					primaryPiece: bPieces[0]
				});
			} else {
				const first = bPieces[0];
				const bTitle = first.batch?.title || `${first.title.replace(/\s*#\d+$/, '')} Batch`;
				groups.push({
					isBatch: true,
					batchId: bId,
					batchTitle: bTitle,
					glazeSignature: glazeSig,
					pieces: bPieces,
					primaryPiece: first
				});
			}
		}

		return groups;
	}

	// Job Splitting Modal Trigger & Handlers
	function openSplitBatchModal(batchId: string, stageFilter?: CeramicStage) {
		resetDragState();
		const targetPieces = pieces.filter(p => p.batch_id === batchId && !p.is_failed && (!stageFilter || p.stage === stageFilter));
		if (targetPieces.length === 0) return;
		
		splitTargetBatchId = batchId;
		splitTargetStage = stageFilter || null;
		splitBatchPieces = targetPieces;
		splitTargetBatchTitle = targetPieces[0]?.batch?.title || targetPieces[0]?.title.replace(/\s*#\d+$/, '') || 'Ceramic Batch';
		splitSelectedPieceIds = targetPieces.map(p => p.id);
		splitAction = 'new_batch';
		splitNewSubBatchTitle = `${splitTargetBatchTitle} (Group B)`;
		isSplitModalOpen = true;
	}

	function toggleSplitSelection(id: string) {
		if (splitSelectedPieceIds.includes(id)) {
			splitSelectedPieceIds = splitSelectedPieceIds.filter(x => x !== id);
		} else {
			splitSelectedPieceIds = [...splitSelectedPieceIds, id];
		}
	}

	function selectAllSplitPieces() {
		splitSelectedPieceIds = splitBatchPieces.map(p => p.id);
	}

	function deselectAllSplitPieces() {
		splitSelectedPieceIds = [];
	}

	function executeSplitBatch() {
		resetDragState();
		if (splitSelectedPieceIds.length === 0) {
			showToast('Please select at least 1 piece to split.');
			return;
		}

		const selectedSet = new Set(splitSelectedPieceIds);
		const count = splitSelectedPieceIds.length;
		const now = new Date();

		if (splitAction === 'new_batch') {
			// Sub-batch split
			const newSubBatchId = `b-${Date.now()}`;
			const newSubBatchTitle = splitNewSubBatchTitle.trim() || `${splitTargetBatchTitle} (Group B)`;
			const subBatchObj: PieceBatch = {
				id: newSubBatchId,
				user_id: 'user-1',
				title: newSubBatchTitle,
				parent_batch_id: splitTargetBatchId || undefined,
				created_at: now,
				updated_at: now
			};

			pieces = pieces.map(p => {
				if (selectedSet.has(p.id)) {
					return {
						...p,
						batch_id: newSubBatchId,
						batch: subBatchObj,
						updated_at: now
					};
				}
				return p;
			});

			showToast(`Split ${count} piece(s) into sub-batch "${newSubBatchTitle}"!`);
		} else if (splitAction === 'detach') {
			// Make selected standalone (clear batch_id)
			pieces = pieces.map(p => {
				if (selectedSet.has(p.id)) {
					return {
						...p,
						batch_id: null,
						batch_sequence: null,
						batch: null,
						updated_at: now
					};
				}
				return p;
			});

			showToast(`Detached ${count} piece(s) from batch as standalone pieces!`);
		} else if (splitAction === 'fail') {
			// Flag selected as failed and move to Finished
			pieces = pieces.map(p => {
				if (selectedSet.has(p.id)) {
					return {
						...p,
						stage: 'done',
						is_failed: true,
						failure_stage: p.stage,
						failure_reason: splitFailReason,
						failed_at: now
					};
				}
				return p;
			});

			showToast(`Moved ${count} piece(s) to Finished & flagged as failed ("${splitFailReason}")!`);
		}

		isSplitModalOpen = false;
	}

	function advanceBatchGroupStage(group: KanbanDisplayGroup) {
		const stageOrder: CeramicStage[] = [
			'backlog', 'formed', 'ready_to_trim', 'bone_dry', 'glazed', 'done'
		];
		const pieceIds = new Set(group.pieces.map(p => p.id));
		const now = new Date();
		
		pieces = pieces.map(p => {
			if (pieceIds.has(p.id)) {
				const currentIndex = stageOrder.indexOf(p.stage);
				if (currentIndex >= 0 && currentIndex < stageOrder.length - 1) {
					const nextStage = stageOrder[currentIndex + 1];
					const isMovingOutFromBacklog = p.stage === 'backlog' && nextStage !== 'backlog';
					return {
						...p,
						stage: nextStage,
						started_at: isMovingOutFromBacklog ? (p.started_at || now) : p.started_at,
						updated_at: now
					};
				}
			}
			return p;
		});

		showToast(`Moved ${group.pieces.length} batch items to next stage!`);
	}

	function handleCreatePiece(e: Event) {
		e.preventDefault();
		if (!newTitle.trim()) return;
		const selectedClay = clayBodies.find(c => c.id === newClayBodyId);
		const calculatedGrams = newWeightAmount && newWeightAmount > 0 
			? toGrams(newWeightAmount, newWeightUnit) 
			: null;

		const qty = Math.max(1, Math.min(50, newQuantity));
		const now = new Date();
		const userDueDate = parseDateInput(newDueDate);
		const isStarting = newStage !== 'backlog';
		const autoStartedAt = isStarting ? now : null;

		if (qty > 1) {
			const batchId = `b-${Date.now()}`;
			const bTitle = newBatchTitle.trim() || `${newTitle} Batch (${qty} pcs)`;
			const batchObj: PieceBatch = {
				id: batchId,
				user_id: 'user-1',
				title: bTitle,
				created_at: now,
				updated_at: now
			};

			const newBatchPieces: CeramicPiece[] = Array.from({ length: qty }).map((_, idx) => ({
				id: `p-${Date.now()}-${idx + 1}`,
				user_id: 'user-1',
				title: `${newTitle} #${idx + 1}`,
				description: newDescription.trim() || null,
				notes: newDescription.trim() || null,
				piece_type: newPieceType,
				clay_body_id: newClayBodyId,
				clay_body_name: selectedClay ? selectedClay.name : 'Speckled Buff 80',
				stage: newStage,
				batch_id: batchId,
				batch_sequence: idx + 1,
				batch: batchObj,
				is_failed: false,
				target_bisque_cone: newTargetBisqueCone,
				target_glaze_cone: newTargetGlazeCone,
				weight_grams: calculatedGrams,
				initial_photo_url: newInitialPhotoUrl.trim() || null,
				started_at: autoStartedAt,
				due_date: userDueDate,
				created_at: now,
				updated_at: now,
				stage_logs: [],
				glaze_layers: []
			}));

			pieces = [...newBatchPieces, ...pieces];
			showToast(`Created batch of ${qty} pieces ("${bTitle}")!`);
		} else {
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
				started_at: autoStartedAt,
				due_date: userDueDate,
				created_at: now,
				updated_at: now,
				stage_logs: [],
				glaze_layers: []
			};
			pieces = [created, ...pieces];
			showToast(`Created piece "${newTitle}"!`);
		}

		newTitle = '';
		newDescription = '';
		newWeightAmount = null;
		newInitialPhotoUrl = '';
		newDueDate = '';
		newQuantity = 1;
		newBatchTitle = '';
		isNewPieceModalOpen = false;
	}

	// Dynamic Options for Filtering
	let availablePieceTypes = $derived(
		Array.from(new Set([...PIECE_TYPES.map(t => t.name), ...pieces.map(p => p.piece_type)])).sort()
	);

	let availableClayBodies = $derived(
		Array.from(new Set([
			...clayBodies.map(c => c.name),
			...pieces.map(p => p.clay_body_name).filter(Boolean) as string[]
		])).sort()
	);

	let availableGlazes = $derived(
		Array.from(new Set([
			...glazes.map(g => g.name),
			...pieces.flatMap(p => p.glaze_layers?.map(l => l.glaze_name) || []).filter(Boolean) as string[]
		])).sort()
	);

	let availableCones = $derived(
		Array.from(new Set([
			...pieces.flatMap(p => [p.target_glaze_cone, p.target_bisque_cone]).filter(Boolean) as string[]
		])).sort()
	);

	// Applied Weight Filtering State (used for actual Kanban filtering)
	let appliedWeightUnit = $state<WeightUnit>('g');
	let appliedMinWeight = $state<number>(0);
	let appliedMaxWeight = $state<number>(3000);
	let filterWeightEnabled = $state<boolean>(false);

	// Draft Weight Filtering State (used inside popover / mobile drawer while dragging)
	let draftWeightUnit = $state<WeightUnit>('g');
	let draftMinWeight = $state<number>(0);
	let draftMaxWeight = $state<number>(3000);
	let showWeightSliderPopover = $state<boolean>(false);

	function openWeightSliderPopover() {
		draftWeightUnit = appliedWeightUnit;
		draftMinWeight = appliedMinWeight;
		draftMaxWeight = appliedMaxWeight;
		showWeightSliderPopover = true;
	}

	function applyWeightFilter() {
		appliedWeightUnit = draftWeightUnit;
		appliedMinWeight = draftMinWeight;
		appliedMaxWeight = draftMaxWeight;
		filterWeightEnabled = true;
		showWeightSliderPopover = false;
	}

	function resetWeightFilter() {
		appliedWeightUnit = 'g';
		appliedMinWeight = 0;
		appliedMaxWeight = 3000;
		draftWeightUnit = 'g';
		draftMinWeight = 0;
		draftMaxWeight = 3000;
		filterWeightEnabled = false;
		showWeightSliderPopover = false;
	}

	function fromGrams(grams: number, unit: WeightUnit): number {
		switch (unit) {
			case 'kg': return grams / 1000;
			case 'oz': return grams / 28.3495;
			case 'lbs': return grams / 453.592;
			case 'g': default: return grams;
		}
	}

	let weightSliderStep = $derived(
		draftWeightUnit === 'kg' ? 0.05 : draftWeightUnit === 'lbs' ? 0.1 : draftWeightUnit === 'oz' ? 1 : 25
	);

	let weightSliderMax = $derived(
		draftWeightUnit === 'kg' ? 5 : draftWeightUnit === 'lbs' ? 10 : draftWeightUnit === 'oz' ? 150 : 3000
	);

	function handleWeightUnitChange(newUnit: WeightUnit) {
		if (newUnit === draftWeightUnit) return;
		const minGrams = toGrams(draftMinWeight, draftWeightUnit);
		const maxGrams = toGrams(draftMaxWeight, draftWeightUnit);
		draftWeightUnit = newUnit;
		draftMinWeight = Math.round(fromGrams(minGrams, newUnit) * 10) / 10;
		draftMaxWeight = Math.round(fromGrams(maxGrams, newUnit) * 10) / 10;
	}

	// Filtering State
	let filterFormType = $state<string>('all');
	let filterClayBody = $state<string>('all');
	let filterGlaze = $state<string>('all');
	let filterTargetCone = $state<string>('all');
	let filterDueDate = $state<string>('all');
	let filterSearchQuery = $state<string>('');
	let isMobileFilterDrawerOpen = $state<boolean>(false);

	// Derived Filtered Lists
	let filteredPieces = $derived(
		pieces.filter(p => {
			// Form Type Filter
			if (filterFormType !== 'all' && p.piece_type !== filterFormType) {
				return false;
			}

			// Clay Body Filter
			if (filterClayBody !== 'all') {
				const matchesId = p.clay_body_id === filterClayBody;
				const matchesName = p.clay_body_name === filterClayBody;
				if (!matchesId && !matchesName) return false;
			}

			// Glaze Filter
			if (filterGlaze !== 'all') {
				if (filterGlaze === 'unglazed') {
					if (p.glaze_layers && p.glaze_layers.length > 0) return false;
				} else {
					const hasGlaze = p.glaze_layers?.some(g => g.glaze_id === filterGlaze || g.glaze_name === filterGlaze);
					if (!hasGlaze) return false;
				}
			}

			// Target Cone Filter
			if (filterTargetCone !== 'all' && p.target_glaze_cone !== filterTargetCone && p.target_bisque_cone !== filterTargetCone) {
				return false;
			}

			// Due Date Filter
			if (filterDueDate !== 'all') {
				if (filterDueDate === 'no_due_date') {
					if (p.due_date) return false;
				} else if (!p.due_date) {
					return false;
				} else {
					const due = typeof p.due_date === 'string' ? new Date(p.due_date) : p.due_date;
					if (isNaN(due.getTime())) return false;

					const now = new Date();
					const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
					const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
					const diffDays = Math.ceil((dueDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

					if (filterDueDate === 'overdue') {
						if (diffDays >= 0) return false;
					} else if (filterDueDate === 'due_today') {
						if (diffDays !== 0) return false;
					} else if (filterDueDate === 'less_than_1_week') {
						if (diffDays < 0 || diffDays > 7) return false;
					} else if (filterDueDate === 'less_than_2_weeks') {
						if (diffDays < 0 || diffDays > 14) return false;
					} else if (filterDueDate === 'has_due_date') {
						// Checked above
					}
				}
			}

			// Weight Range Filter (ONLY filters by applied values after clicking Apply)
			if (filterWeightEnabled) {
				if (!p.weight_grams || p.weight_grams <= 0) {
					return false;
				}
				const pieceGrams = p.weight_grams;
				const minGrams = toGrams(appliedMinWeight, appliedWeightUnit);
				const maxGrams = toGrams(appliedMaxWeight, appliedWeightUnit);
				if (pieceGrams < minGrams || pieceGrams > maxGrams) {
					return false;
				}
			}

			// Search Query Filter
			if (filterSearchQuery.trim() !== '') {
				const q = filterSearchQuery.toLowerCase().trim();
				const matchTitle = p.title.toLowerCase().includes(q);
				const matchDesc = p.description?.toLowerCase().includes(q) ?? false;
				const matchNotes = p.notes?.toLowerCase().includes(q) ?? false;
				const matchBatch = p.batch?.title?.toLowerCase().includes(q) ?? false;
				const matchClay = p.clay_body_name?.toLowerCase().includes(q) ?? false;
				const matchType = p.piece_type.toLowerCase().includes(q);
				if (!matchTitle && !matchDesc && !matchNotes && !matchBatch && !matchClay && !matchType) {
					return false;
				}
			}

			return true;
		})
	);

	let activePieces = $derived(filteredPieces.filter(p => !p.is_failed));
	let failedPieces = $derived(filteredPieces.filter(p => p.is_failed));

	let hasActiveFilters = $derived(
		filterFormType !== 'all' ||
		filterClayBody !== 'all' ||
		filterGlaze !== 'all' ||
		filterTargetCone !== 'all' ||
		filterDueDate !== 'all' ||
		filterWeightEnabled ||
		filterSearchQuery.trim() !== ''
	);

	let activeFilterCount = $derived(
		(filterFormType !== 'all' ? 1 : 0) +
		(filterClayBody !== 'all' ? 1 : 0) +
		(filterGlaze !== 'all' ? 1 : 0) +
		(filterTargetCone !== 'all' ? 1 : 0) +
		(filterDueDate !== 'all' ? 1 : 0) +
		(filterWeightEnabled ? 1 : 0) +
		(filterSearchQuery.trim() !== '' ? 1 : 0)
	);

	function clearAllFilters() {
		filterFormType = 'all';
		filterClayBody = 'all';
		filterGlaze = 'all';
		filterTargetCone = 'all';
		filterDueDate = 'all';
		resetWeightFilter();
		filterSearchQuery = '';
	}

	function resetSingleFilter(field: 'formType' | 'clayBody' | 'glaze' | 'targetCone' | 'dueDate' | 'weight' | 'search') {
		if (field === 'formType') filterFormType = 'all';
		else if (field === 'clayBody') filterClayBody = 'all';
		else if (field === 'glaze') filterGlaze = 'all';
		else if (field === 'targetCone') filterTargetCone = 'all';
		else if (field === 'dueDate') filterDueDate = 'all';
		else if (field === 'weight') resetWeightFilter();
		else if (field === 'search') filterSearchQuery = '';
	}

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
		const now = new Date();
		pieces = pieces.map(p => {
			if (p.id === pieceId) {
				const currentIndex = stageOrder.indexOf(p.stage);
				if (currentIndex >= 0 && currentIndex < stageOrder.length - 1) {
					const nextStage = stageOrder[currentIndex + 1];
					const isMovingOutFromBacklog = p.stage === 'backlog' && nextStage !== 'backlog';
					return {
						...p,
						stage: nextStage,
						started_at: isMovingOutFromBacklog ? (p.started_at || now) : p.started_at,
						updated_at: now
					};
				}
			}
			return p;
		});
	}

	function openDuplicateModal(piece: CeramicPiece) {
		pieceToDuplicate = piece;
		duplicateTitle = `${piece.title} (Copy)`;
		duplicatePieceType = piece.piece_type || 'Mug';
		duplicateClayBodyId = piece.clay_body_id || 'cb-1';
		duplicateStage = 'backlog';
		duplicateTargetBisqueCone = piece.target_bisque_cone || 'Cone 06';
		duplicateTargetGlazeCone = piece.target_glaze_cone || 'Cone 6';
		duplicateWeightAmount = piece.weight_grams || null;
		duplicateWeightUnit = 'g';
		duplicateDescription = piece.notes || piece.description || '';
		duplicateQuantity = 1;
		duplicateCopyGlazes = true;
		isDuplicateModalOpen = true;
	}

	function confirmDuplicatePiece(e?: Event) {
		if (e) e.preventDefault();
		if (!pieceToDuplicate || !duplicateTitle.trim()) return;
		const selectedClay = clayBodies.find(c => c.id === duplicateClayBodyId);
		const now = new Date();
		const isStarting = duplicateStage !== 'backlog';
		const autoStartedAt = isStarting ? now : null;
		const calculatedGrams = duplicateWeightAmount && duplicateWeightAmount > 0 
			? toGrams(duplicateWeightAmount, duplicateWeightUnit) 
			: null;
		const qty = Math.max(1, Math.min(50, duplicateQuantity));

		const sourceGlazes = (duplicateCopyGlazes && pieceToDuplicate.glaze_layers)
			? pieceToDuplicate.glaze_layers.map((g, idx) => ({ ...g, id: `gl-${Date.now()}-${idx}` }))
			: [];

		if (qty > 1) {
			const batchId = `b-${Date.now()}`;
			const bTitle = `${duplicateTitle.trim()} Batch (${qty} pcs)`;
			const batchObj: PieceBatch = {
				id: batchId,
				user_id: 'user-1',
				title: bTitle,
				created_at: now,
				updated_at: now
			};

			const newBatchPieces: CeramicPiece[] = Array.from({ length: qty }).map((_, idx) => ({
				id: `p-${Date.now()}-${idx + 1}`,
				user_id: 'user-1',
				title: `${duplicateTitle.trim()} #${idx + 1}`,
				description: duplicateDescription.trim() || null,
				notes: duplicateDescription.trim() || null,
				piece_type: duplicatePieceType,
				clay_body_id: duplicateClayBodyId,
				clay_body_name: selectedClay ? selectedClay.name : pieceToDuplicate!.clay_body_name,
				stage: duplicateStage,
				batch_id: batchId,
				batch_sequence: idx + 1,
				batch: batchObj,
				is_failed: false,
				target_bisque_cone: duplicateTargetBisqueCone,
				target_glaze_cone: duplicateTargetGlazeCone,
				weight_grams: calculatedGrams,
				initial_photo_url: pieceToDuplicate!.initial_photo_url,
				started_at: autoStartedAt,
				due_date: pieceToDuplicate!.due_date,
				created_at: now,
				updated_at: now,
				stage_logs: [],
				glaze_layers: duplicateCopyGlazes ? [...sourceGlazes] : []
			}));

			pieces = [...newBatchPieces, ...pieces];
			showToast(`Created duplicate batch of ${qty} pieces ("${bTitle}")!`);
		} else {
			const created: CeramicPiece = {
				id: `p-${Date.now()}`,
				user_id: 'user-1',
				title: duplicateTitle.trim(),
				description: duplicateDescription.trim() || null,
				notes: duplicateDescription.trim() || null,
				piece_type: duplicatePieceType,
				clay_body_id: duplicateClayBodyId,
				clay_body_name: selectedClay ? selectedClay.name : pieceToDuplicate.clay_body_name,
				stage: duplicateStage,
				is_failed: false,
				target_bisque_cone: duplicateTargetBisqueCone,
				target_glaze_cone: duplicateTargetGlazeCone,
				weight_grams: calculatedGrams,
				initial_photo_url: pieceToDuplicate.initial_photo_url,
				started_at: autoStartedAt,
				due_date: pieceToDuplicate.due_date,
				created_at: now,
				updated_at: now,
				stage_logs: [],
				glaze_layers: duplicateCopyGlazes ? [...sourceGlazes] : []
			};
			pieces = [created, ...pieces];
			showToast(`Created duplicate piece "${created.title}"!`);
		}

		isDuplicateModalOpen = false;
		pieceToDuplicate = null;
	}

	function openFailModal(piece: CeramicPiece) {
		pieceToFail = piece;
		isFailModalOpen = true;
	}

	function confirmFlagAsFailed() {
		if (!pieceToFail) return;
		const now = new Date();
		const targetTitle = pieceToFail.title;
		pieces = pieces.map(p => {
			if (p.id === pieceToFail!.id) {
				return {
					...p,
					stage: 'done',
					is_failed: true,
					failure_stage: p.stage,
					failure_reason: failReason,
					failed_at: now
				};
			}
			return p;
		});
		if (selectedPiece && selectedPiece.id === pieceToFail.id) {
			selectedPiece = null;
		}
		isFailModalOpen = false;
		pieceToFail = null;
		showToast(`Piece "${targetTitle}" moved to Finished & flagged as failed`);
	}

	function restoreFailedPiece(pieceId: string) {
		const target = pieces.find(p => p.id === pieceId);
		const restoredStage: CeramicStage = (target?.failure_stage as CeramicStage) || 'backlog';
		pieces = pieces.map(p => p.id === pieceId ? {
			...p,
			stage: restoredStage,
			is_failed: false,
			failure_stage: null,
			failure_reason: null
		} : p);
		if (target) {
			showToast(`Restored "${target.title}" to ${restoredStage} stage`);
		}
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
			created_at: new Date()
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
			created_at: new Date()
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
<div class="flex-1 flex flex-col min-h-0 space-y-3 overflow-hidden">
	<div class="flex items-center justify-between gap-2 border-b border-stone-200 dark:border-stone-800 pb-2.5 transition-colors flex-shrink-0">
		<div>
			<div class="flex items-center gap-2 sm:gap-3">
				<h2 class="font-display text-lg sm:text-2xl font-extrabold text-stone-900 dark:text-white tracking-tight">Studio Board</h2>
				<span class="px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-[#3B7258] dark:text-[#81B29A] bg-[#81B29A]/15 rounded-full border border-[#81B29A]/30">
					{activePieces.length} Active
				</span>
			</div>
			<p class="text-[10px] sm:text-xs text-stone-600 dark:text-stone-400 hidden sm:block mt-0.5">Ceramic tracking tool for studio artists.</p>
		</div>

		<div class="flex items-center gap-1.5 sm:gap-2.5">
			<button 
				onclick={() => showPyrometricChartModal = true}
				class="px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 flex items-center gap-1.5 transition shadow-xs dark:shadow-none"
				title="Pyrometric Cone Temp Chart"
			>
				<Flame class="w-4 h-4 text-[#C85A32] dark:text-[#F2CC8F]" />
				<span class="hidden md:inline">Cone Temp Chart</span>
				<span class="hidden sm:inline md:hidden">Cones</span>
			</button>

			<button 
				onclick={() => showGlazeLibraryModal = true}
				class="px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 flex items-center gap-1.5 transition shadow-xs dark:shadow-none"
				title="Glaze Library"
			>
				<Palette class="w-4 h-4 text-[#3B7258] dark:text-[#81B29A]" />
				<span class="hidden md:inline">Glaze Library ({glazes.length})</span>
				<span class="hidden sm:inline md:hidden">Glazes ({glazes.length})</span>
			</button>

			<button 
				onclick={() => showClayLibraryModal = true}
				class="px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 flex items-center gap-1.5 transition shadow-xs dark:shadow-none"
				title="Clay Bodies Library"
			>
				<Package class="w-4 h-4 text-[#E07A5F]" />
				<span class="hidden md:inline">Clay Bodies ({clayBodies.length})</span>
				<span class="hidden sm:inline md:hidden">Clay ({clayBodies.length})</span>
			</button>

			<button 
				onclick={() => showLossArchive = !showLossArchive}
				class="px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition border cursor-pointer {showLossArchive ? 'bg-red-600 text-white border-red-700 shadow-md ring-2 ring-red-500/30' : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40 border-red-200 dark:border-red-800/40'}"
				title="Toggle Loss Archive (Failed Pieces in Finished Lane)"
			>
				<ShieldAlert class="w-4 h-4 {showLossArchive ? 'text-white' : 'text-red-500 dark:text-red-400'}" />
				<span class="hidden md:inline">Loss Archive ({failedPieces.length})</span>
				<span class="hidden sm:inline md:hidden">Losses ({failedPieces.length})</span>
				{#if showLossArchive}
					<span class="ml-1 text-[9px] uppercase font-extrabold bg-white/20 text-white px-1.5 py-0.5 rounded">Shown</span>
				{/if}
			</button>

			<button 
				onclick={() => isNewPieceModalOpen = true}
				class="px-2.5 sm:px-4 py-1.5 text-xs font-bold rounded-xl bg-[#E07A5F] hover:bg-[#C85A32] text-white flex items-center gap-1.5 sm:gap-2 transition shadow-lg shadow-[#C85A32]/25 cursor-pointer"
				title="Create New Piece"
			>
				<Plus class="w-4 h-4" />
				<span class="hidden sm:inline">Create Piece</span>
			</button>
		</div>
	</div>

	<!-- DYNAMIC RESPONSIVE FILTER TOOLBAR -->
	<div class="w-full bg-white/70 dark:bg-stone-900/70 backdrop-blur-md border border-stone-200 dark:border-stone-800 rounded-2xl p-2.5 sm:p-3 mb-3 shadow-xs space-y-2 flex-shrink-0 relative z-30">
		<div class="flex flex-wrap items-center justify-between gap-2">
			<!-- Search Bar -->
			<div class="relative flex-1 min-w-[200px] sm:min-w-[260px]">
				<Search class="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
				<input
					type="text"
					bind:value={filterSearchQuery}
					placeholder="Search titles, clay, forms, glazes, notes..."
					class="w-full pl-9 pr-8 py-1.5 text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-500 rounded-xl border border-transparent focus:border-[#E07A5F] focus:bg-white dark:focus:bg-stone-900 focus:outline-hidden transition shadow-xs"
				/>
				{#if filterSearchQuery}
					<button
						type="button"
						onclick={() => filterSearchQuery = ''}
						class="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-0.5 rounded-full cursor-pointer"
						aria-label="Clear search"
					>
						<X class="w-3.5 h-3.5" />
					</button>
				{/if}
			</div>

			<!-- Mobile Filter Drawer Toggle Button (Visible on `< lg`) -->
			<button
				type="button"
				onclick={() => isMobileFilterDrawerOpen = true}
				class="lg:hidden px-3 py-1.5 text-xs font-bold rounded-xl border transition flex items-center gap-1.5 cursor-pointer {hasActiveFilters ? 'bg-[#E07A5F] text-white border-[#E07A5F] shadow-sm' : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700'}"
			>
				<SlidersHorizontal class="w-4 h-4" />
				<span>Filter</span>
				{#if activeFilterCount > 0}
					<span class="ml-0.5 px-1.5 py-0.2 text-[10px] font-extrabold rounded-full bg-white/25 text-white border border-white/30">
						{activeFilterCount}
					</span>
				{/if}
			</button>

			<!-- Desktop Filter Dropdowns (Visible on `lg`+) -->
			<div class="hidden lg:flex items-center gap-2 flex-wrap">
				<!-- Form Type Filter -->
				<div class="relative">
					<select
						bind:value={filterFormType}
						class="appearance-none pl-3 pr-7 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 focus:outline-hidden focus:ring-2 focus:ring-[#E07A5F]/40 cursor-pointer shadow-xs"
					>
						<option value="all">All Forms</option>
						{#each availablePieceTypes as typeName}
							<option value={typeName}>{typeName}</option>
						{/each}
					</select>
					<ChevronDown class="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
				</div>

				<!-- Clay Body Filter -->
				<div class="relative">
					<select
						bind:value={filterClayBody}
						class="appearance-none pl-3 pr-7 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 focus:outline-hidden focus:ring-2 focus:ring-[#E07A5F]/40 cursor-pointer shadow-xs"
					>
						<option value="all">All Clay Bodies</option>
						{#each availableClayBodies as clayName}
							<option value={clayName}>{clayName}</option>
						{/each}
					</select>
					<ChevronDown class="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
				</div>

				<!-- Glaze Filter -->
				<div class="relative">
					<select
						bind:value={filterGlaze}
						class="appearance-none pl-3 pr-7 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 focus:outline-hidden focus:ring-2 focus:ring-[#E07A5F]/40 cursor-pointer shadow-xs"
					>
						<option value="all">All Glazes</option>
						<option value="unglazed">Unglazed Only</option>
						{#each availableGlazes as glazeName}
							<option value={glazeName}>{glazeName}</option>
						{/each}
					</select>
					<ChevronDown class="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
				</div>

				<!-- Target Cone Filter -->
				<div class="relative">
					<select
						bind:value={filterTargetCone}
						class="appearance-none pl-3 pr-7 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 focus:outline-hidden focus:ring-2 focus:ring-[#E07A5F]/40 cursor-pointer shadow-xs"
					>
						<option value="all">All Cones</option>
						{#each availableCones as coneName}
							<option value={coneName}>{coneName}</option>
						{/each}
					</select>
					<ChevronDown class="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
				</div>

				<!-- Due Date Filter -->
				<div class="relative">
					<select
						bind:value={filterDueDate}
						class="appearance-none pl-3 pr-7 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 focus:outline-hidden focus:ring-2 focus:ring-[#E07A5F]/40 cursor-pointer shadow-xs"
					>
						<option value="all">All Due Dates</option>
						<option value="overdue">Late / Overdue</option>
						<option value="due_today">Due Today</option>
						<option value="less_than_1_week">Due in &lt; 1 Week</option>
						<option value="less_than_2_weeks">Due in &lt; 2 Weeks</option>
						<option value="has_due_date">Has Due Date</option>
						<option value="no_due_date">No Due Date</option>
					</select>
					<ChevronDown class="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
				</div>

				<!-- Weight Range Filter Popover -->
				<div class="relative flex-shrink-0">
					<button
						type="button"
						onclick={() => { if (showWeightSliderPopover) showWeightSliderPopover = false; else openWeightSliderPopover(); }}
						class="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap {filterWeightEnabled ? 'border-[#E07A5F] ring-1 ring-[#E07A5F]/50 text-[#C85A32] dark:text-[#E07A5F]' : ''}"
					>
						<span>Weight</span>
						{#if filterWeightEnabled}
							<span class="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-[#E07A5F]/20 text-[#C85A32] dark:text-[#E07A5F]">
								{appliedMinWeight}–{appliedMaxWeight}{appliedWeightUnit}
							</span>
						{:else}
							<span class="text-stone-400 font-normal">All</span>
						{/if}
						<ChevronDown class="w-3.5 h-3.5 text-stone-400" />
					</button>

					{#if showWeightSliderPopover}
						<!-- Click outside backdrop -->
						<button
							type="button"
							tabindex="-1"
							aria-label="Close weight filter popover backdrop"
							onclick={() => showWeightSliderPopover = false}
							class="fixed inset-0 z-40 bg-transparent cursor-default"
						></button>

						<div class="absolute right-0 top-full mt-2 w-72 max-w-[calc(100vw-2rem)] p-3.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl z-50 space-y-3">
							<div class="flex items-center justify-between">
								<span class="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">Weight Range</span>
								<!-- Unit Selector -->
								<div class="flex items-center p-0.5 bg-stone-100 dark:bg-stone-800 rounded-lg text-[10px] font-bold">
									{#each (['g', 'kg', 'oz', 'lbs'] as WeightUnit[]) as u}
										<button
											type="button"
											onclick={() => handleWeightUnitChange(u)}
											class="px-2 py-0.5 rounded-md transition cursor-pointer {draftWeightUnit === u ? 'bg-white dark:bg-stone-700 text-[#E07A5F] shadow-xs font-bold' : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'}"
										>
											{u}
										</button>
									{/each}
								</div>
							</div>

							<!-- Min Weight Slider -->
							<div class="space-y-1">
								<div class="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
									<span>Min Weight:</span>
									<span class="font-bold text-stone-900 dark:text-stone-100">{draftMinWeight} {draftWeightUnit}</span>
								</div>
								<input
									type="range"
									min="0"
									max={weightSliderMax}
									step={weightSliderStep}
									bind:value={draftMinWeight}
									class="w-full accent-[#E07A5F] cursor-pointer"
								/>
							</div>

							<!-- Max Weight Slider -->
							<div class="space-y-1">
								<div class="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
									<span>Max Weight:</span>
									<span class="font-bold text-stone-900 dark:text-stone-100">{draftMaxWeight} {draftWeightUnit}</span>
								</div>
								<input
									type="range"
									min="0"
									max={weightSliderMax}
									step={weightSliderStep}
									bind:value={draftMaxWeight}
									class="w-full accent-[#E07A5F] cursor-pointer"
								/>
							</div>

							<!-- Popover Footer -->
							<div class="flex items-center justify-between pt-2 border-t border-stone-200 dark:border-stone-800">
								<button
									type="button"
									onclick={resetWeightFilter}
									class="text-xs font-semibold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 cursor-pointer"
								>
									Reset Weight
								</button>
								<button
									type="button"
									onclick={applyWeightFilter}
									class="px-3.5 py-1 text-xs font-bold bg-[#E07A5F] text-white rounded-lg hover:bg-[#C85A32] transition cursor-pointer shadow-xs"
								>
									Apply Range
								</button>
							</div>
						</div>
					{/if}
				</div>

				<!-- Clear All Button (Desktop Toolbar: Opacity transition prevents layout shift) -->
				<button
					type="button"
					onclick={clearAllFilters}
					class="px-2.5 py-1.5 text-xs font-semibold rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-800/40 flex items-center gap-1 transition-all duration-200 cursor-pointer {hasActiveFilters ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}"
					title="Clear all active filters"
				>
					<RotateCcw class="w-3.5 h-3.5" />
					<span>Clear Filters</span>
				</button>
			</div>
		</div>

		<!-- ACTIVE FILTER CHIPS / TAGS BAR -->
		{#if hasActiveFilters}
			<div class="flex items-center gap-1.5 flex-wrap pt-1.5 border-t border-stone-200/60 dark:border-stone-800/60 text-xs">
				<span class="text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mr-1">Active:</span>
				
				{#if filterSearchQuery.trim()}
					<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium bg-[#E07A5F]/15 dark:bg-[#E07A5F]/20 text-[#C85A32] dark:text-[#E07A5F] border border-[#E07A5F]/30">
						<span>Search: "{filterSearchQuery}"</span>
						<button type="button" onclick={() => resetSingleFilter('search')} class="hover:text-stone-900 dark:hover:text-white p-0.5 cursor-pointer" aria-label="Remove search filter"><X class="w-3 h-3" /></button>
					</span>
				{/if}

				{#if filterFormType !== 'all'}
					<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
						<span>Form: {filterFormType}</span>
						<button type="button" onclick={() => resetSingleFilter('formType')} class="hover:text-stone-900 dark:hover:text-white p-0.5 cursor-pointer" aria-label="Remove form type filter"><X class="w-3 h-3" /></button>
					</span>
				{/if}

				{#if filterClayBody !== 'all'}
					<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
						<span>Clay: {filterClayBody}</span>
						<button type="button" onclick={() => resetSingleFilter('clayBody')} class="hover:text-stone-900 dark:hover:text-white p-0.5 cursor-pointer" aria-label="Remove clay body filter"><X class="w-3 h-3" /></button>
					</span>
				{/if}

				{#if filterGlaze !== 'all'}
					<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30">
						<span>Glaze: {filterGlaze === 'unglazed' ? 'Unglazed' : filterGlaze}</span>
						<button type="button" onclick={() => resetSingleFilter('glaze')} class="hover:text-stone-900 dark:hover:text-white p-0.5 cursor-pointer" aria-label="Remove glaze filter"><X class="w-3 h-3" /></button>
					</span>
				{/if}

				{#if filterTargetCone !== 'all'}
					<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30">
						<span>Cone: {filterTargetCone}</span>
						<button type="button" onclick={() => resetSingleFilter('targetCone')} class="hover:text-stone-900 dark:hover:text-white p-0.5 cursor-pointer" aria-label="Remove target cone filter"><X class="w-3 h-3" /></button>
					</span>
				{/if}

				{#if filterDueDate !== 'all'}
					<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30">
						<span>Due: {filterDueDate === 'overdue' ? 'Late / Overdue' : filterDueDate === 'due_today' ? 'Due Today' : filterDueDate === 'less_than_1_week' ? '< 1 Week' : filterDueDate === 'less_than_2_weeks' ? '< 2 Weeks' : filterDueDate === 'has_due_date' ? 'Has Date' : 'No Date'}</span>
						<button type="button" onclick={() => resetSingleFilter('dueDate')} class="hover:text-stone-900 dark:hover:text-white p-0.5 cursor-pointer" aria-label="Remove due date filter"><X class="w-3 h-3" /></button>
					</span>
				{/if}

				{#if filterWeightEnabled}
					<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30">
						<span>Weight: {appliedMinWeight}–{appliedMaxWeight} {appliedWeightUnit}</span>
						<button type="button" onclick={() => resetSingleFilter('weight')} class="hover:text-stone-900 dark:hover:text-white p-0.5 cursor-pointer" aria-label="Remove weight filter"><X class="w-3 h-3" /></button>
					</span>
				{/if}

				<button
					type="button"
					onclick={clearAllFilters}
					class="text-[11px] font-bold text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 underline ml-1 cursor-pointer"
				>
					Reset all ({filteredPieces.length} found)
				</button>
			</div>
		{/if}
	</div>

	<!-- MOBILE STAGE SELECTOR TABS (Visible on mobile/tablet `< xl`) -->
	<div class="flex items-center gap-1.5 overflow-x-auto pb-2 pt-0.5 no-scrollbar flex-shrink-0">
		<button
			type="button"
			onclick={() => mobileActiveStage = 'all'}
			class="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap border cursor-pointer {mobileActiveStage === 'all' ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-transparent shadow-xs' : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800'}"
		>
			<span>All Lanes</span>
			<span class="px-1.5 py-0.2 rounded-full text-[10px] bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
				{activePieces.length}
			</span>
		</button>

		{#each STAGES as stageInfo}
			{@const count = stageInfo.id === 'done'
				? (showLossArchive ? filteredPieces.filter(p => p.stage === 'done').length : filteredPieces.filter(p => p.stage === 'done' && !p.is_failed).length)
				: activePieces.filter(p => p.stage === stageInfo.id).length}
			<button
				type="button"
				onclick={() => mobileActiveStage = stageInfo.id}
				class="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap border cursor-pointer {mobileActiveStage === stageInfo.id ? 'bg-[#E07A5F] text-white border-transparent shadow-xs' : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800'}"
			>
				<span>{stageInfo.icon}</span>
				<span>{stageInfo.label}</span>
				<span class="px-1.5 py-0.2 rounded-full text-[10px] bg-stone-200/80 dark:bg-stone-800/80 text-stone-800 dark:text-stone-200">
					{count}
				</span>
			</button>
		{/each}
	</div>

	<!-- STREAMLINED 6-STAGE RESPONSIVE KANBAN BOARD CONTAINER -->
	<div class="w-full flex-1 min-h-0 flex flex-col overflow-x-auto pb-2">
		<div class="flex-1 min-h-0 flex overflow-x-auto snap-x snap-mandatory gap-3.5 pb-2">
			{#each STAGES as stageInfo}
				{@const columnPieces = stageInfo.id === 'done'
					? (showLossArchive ? filteredPieces.filter(p => p.stage === 'done') : filteredPieces.filter(p => p.stage === 'done' && !p.is_failed))
					: activePieces.filter(p => p.stage === stageInfo.id)}
				{#if mobileActiveStage === 'all' || mobileActiveStage === stageInfo.id}
					<div 
						role="region"
						aria-label={stageInfo.label}
						data-stage-id={stageInfo.id}
						class="{mobileActiveStage === stageInfo.id ? 'w-full min-w-full' : 'w-[85vw] min-w-[280px] max-w-[340px]'} flex-shrink-0 snap-start bg-stone-200/50 dark:bg-stone-900/40 rounded-2xl p-3 border transition-all duration-200 flex flex-col flex-1 min-h-[480px] max-h-[70vh] overflow-hidden {stageInfo.color} {dragOverStageId === stageInfo.id ? 'ring-2 ring-[#E07A5F] bg-stone-200/90 dark:bg-stone-900/80 scale-[1.01] shadow-lg shadow-[#E07A5F]/10' : ''}"
						ondragover={(e) => handleDragOver(e, stageInfo.id)}
						ondragenter={(e) => handleDragOver(e, stageInfo.id)}
						ondragleave={(e) => handleDragLeave(e, stageInfo.id)}
						ondrop={(e) => handleDrop(e, stageInfo.id)}
					>
					
					<!-- Column Header -->
					<div class="flex items-center justify-between px-2 py-1.5 border-b border-stone-300/80 dark:border-stone-800/80 mb-2.5 flex-shrink-0">
						<div class="flex items-center gap-2">
							<span class="text-base">{stageInfo.icon}</span>
							<h3 class="font-display text-xs font-bold text-stone-800 dark:text-stone-200 tracking-tight">{stageInfo.label}</h3>
						</div>
						<span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-300/70 dark:bg-stone-800 text-stone-700 dark:text-stone-400 border border-stone-300 dark:border-stone-700">
							{columnPieces.length}
						</span>
					</div>

					<!-- Cards Column -->
					<div class="space-y-3 flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth px-1.5 py-1" role="list">
						{#each getStageCardGroups(stageInfo.id) as group}
							{@const groupKey = group.isBatch ? group.batchId! : group.primaryPiece.id}
							{@const isCardHovered = dragOverCardGroupKey === groupKey}
							{#if group.isBatch}
								<!-- SYMMETRICALLY CENTERED DIAGONAL STACKED CARD CONTAINER -->
								<div 
									role="region"
									aria-label="Stacked batch card"
									class="relative group/stack my-2 mx-auto px-1.5 pt-1.5 pb-2 transition-transform duration-200 {isCardHovered ? 'scale-[1.02]' : ''}"
									ondragover={(e) => handleCardDragOver(e, group)}
									ondragleave={(e) => handleCardDragLeave(e, group)}
									ondrop={(e) => handleCardDrop(e, group)}
								>
									<!-- Stack Layer 3 (Back Card: Offset Bottom-Right) -->
									<div class="absolute inset-x-1.5 inset-y-1.5 translate-x-2 translate-y-2 bg-stone-300/80 dark:bg-stone-950/80 rounded-xl border border-stone-400/40 dark:border-stone-800 shadow-md transition-transform duration-300 group-hover/stack:translate-x-2.5 group-hover/stack:translate-y-2.5 pointer-events-none"></div>

									<!-- Stack Layer 2 (Middle Baseline Card: Center Anchor) -->
									<div class="absolute inset-x-1.5 inset-y-1.5 bg-stone-200/90 dark:bg-stone-900/90 rounded-xl border border-stone-300 dark:border-stone-700 shadow-xs transition-transform duration-300 pointer-events-none"></div>

									<!-- Front Primary Batch Card (Layer 1: Offset Top-Left) -->
									<div 
										role="listitem"
										data-card-group-key={groupKey}
										aria-grabbed={draggedBatchKey === `${group.batchId}::${stageInfo.id}::${group.glazeSignature}`}
										draggable={false}
										onpointerdown={(e) => handlePointerDownBatch(e, group.batchId!, stageInfo.id, group.glazeSignature || '', group.batchTitle || 'Batch')}
										class="relative z-10 -translate-x-2 -translate-y-2 group-hover/stack:-translate-x-2.5 group-hover/stack:-translate-y-2.5 transition-transform duration-300 ceramic-card snap-start p-3.5 rounded-xl border group space-y-3 cursor-grab active:cursor-grabbing select-none shadow-lg min-w-0 {group.primaryPiece.is_failed ? 'border-2 border-red-500 dark:border-red-600 bg-gradient-to-br from-red-50/90 via-white to-red-100/40 dark:from-red-950/50 dark:via-stone-900 dark:to-red-950/40 border-l-4 border-l-red-600 shadow-red-500/10' : 'border-stone-300/90 dark:border-stone-700 bg-gradient-to-br from-stone-50 via-white to-stone-100/90 dark:from-stone-900 dark:via-stone-900 dark:to-stone-950 border-l-4 border-l-[#E07A5F] hover:border-r-[#E07A5F]/50'} {draggedBatchKey === `${group.batchId}::${stageInfo.id}::${group.glazeSignature}` ? 'opacity-40 scale-95 border-dashed border-[#E07A5F]' : ''} {isCardHovered ? 'ring-2 ring-[#E07A5F] border-[#E07A5F] bg-[#E07A5F]/15 dark:bg-[#E07A5F]/20' : ''}"
									>
										<!-- Merge Hover Highlight Banner -->
										{#if isCardHovered}
											<div class="bg-[#E07A5F] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md text-center shadow-md animate-pulse flex items-center justify-center gap-1">
												<Layers2 class="w-3.5 h-3.5" />
												<span>Drop card to merge into batch!</span>
											</div>
										{/if}

										<!-- Stacked Visual Indicator Badge & Drag Handle -->
										<div class="flex items-center justify-between gap-1">
											{#if group.primaryPiece.is_failed}
												<div class="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/20 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-500/40 text-[10px] font-extrabold tracking-wide shadow-2xs truncate">
													<AlertTriangle class="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
													<span>{group.pieces.length} PCS FAILED STACK</span>
												</div>
											{:else}
												<div class="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E07A5F]/20 dark:bg-[#E07A5F]/25 text-[#C85A32] dark:text-[#E07A5F] border border-[#E07A5F]/40 text-[10px] font-extrabold tracking-wide shadow-2xs truncate">
													<Layers2 class="w-3.5 h-3.5 flex-shrink-0" />
													<span>{group.pieces.length} PCS STACK</span>
												</div>
											{/if}
											<span class="cone-badge cone-6 text-[9px] px-1.5 py-0.5 flex-shrink-0">
												{group.primaryPiece.target_glaze_cone}
											</span>
										</div>

										<!-- Thumbnail / Photo -->
										{#if group.primaryPiece.initial_photo_url}
											<button 
												type="button"
												onclick={() => selectedPiece = group.primaryPiece}
												class="w-full h-28 rounded-lg overflow-hidden relative bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-left cursor-pointer group/photo block"
												title="Click to view details & photos"
											>
												<img src={group.primaryPiece.initial_photo_url} alt={group.batchTitle} draggable={false} class="w-full h-full object-cover group-hover/photo:scale-105 transition duration-300 pointer-events-none select-none" />
												<span class="absolute bottom-2 left-2 text-[10px] font-bold bg-black/75 backdrop-blur-md px-2 py-0.5 rounded text-white border border-white/10 flex items-center gap-1">
													<Boxes class="w-3 h-3 text-[#E07A5F]" />
													<span>{group.primaryPiece.piece_type} Stack</span>
												</span>
											</button>
										{/if}

										<!-- Batch Card Header & Info -->
										<div class="space-y-1">
											<button
												type="button"
												onclick={() => selectedPiece = group.primaryPiece}
												class="text-left w-full hover:underline focus:outline-hidden group/title cursor-pointer block"
												title="Click to view details"
											>
												<h4 class="font-display font-extrabold text-sm text-stone-900 dark:text-stone-100 group-hover/title:text-[#E07A5F] transition leading-snug truncate">
													{group.batchTitle}
												</h4>
											</button>
											<div class="flex items-center gap-1.5 flex-wrap text-[11px] text-[#3B7258] dark:text-[#81B29A] font-medium">
												<span>{group.primaryPiece.clay_body_name}</span>
												{#if group.primaryPiece.weight_grams}
													<span class="text-[10px] px-1.5 py-0.2 rounded bg-[#3B7258]/15 text-[#3B7258] dark:text-[#81B29A] font-bold border border-[#3B7258]/20">
														{formatClayWeight(group.primaryPiece.weight_grams)}/ea
													</span>
												{/if}
											</div>
										</div>

										<!-- Batch Dates Bar -->
										<div class="flex items-center justify-between text-[10px] text-stone-500 dark:text-stone-400 font-medium pt-1 border-t border-stone-200/60 dark:border-stone-800/60">
											{#if group.primaryPiece.started_at}
												<span class="flex items-center gap-1 text-[#3B7258] dark:text-[#81B29A]" title={`Started work on ${group.primaryPiece.started_at}`}>
													<Clock class="w-3 h-3 text-[#3B7258] dark:text-[#81B29A]" />
													<span>Started {formatDateShort(group.primaryPiece.started_at)}</span>
												</span>
											{:else}
												<span class="flex items-center gap-1 text-stone-400 dark:text-stone-500" title={`Created on ${group.primaryPiece.created_at}`}>
													<Clock class="w-3 h-3" />
													<span>Created {formatDateShort(group.primaryPiece.created_at)}</span>
												</span>
											{/if}

											{#if group.primaryPiece.due_date}
												<span class="flex items-center gap-1 font-bold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30" title={`Due date: ${group.primaryPiece.due_date}`}>
													<Calendar class="w-3 h-3 text-amber-600 dark:text-amber-400" />
													<span>Due {formatDateShort(group.primaryPiece.due_date)}</span>
												</span>
											{/if}
										</div>

										<!-- Tagged Glazes on Batch -->
										{#if group.primaryPiece.glaze_layers && group.primaryPiece.glaze_layers.length > 0}
											<div class="pt-2 border-t border-stone-200 dark:border-stone-800/80 space-y-1">
												<span class="text-[10px] font-semibold text-stone-500 dark:text-stone-400 block">Batch Glaze:</span>
												<div class="flex flex-col gap-1">
													{#each group.primaryPiece.glaze_layers as gl}
														<div class="text-[10px] font-medium px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-950/80 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
															<div class="flex items-center gap-1 truncate">
																<span class="px-1 py-0.2 text-[8.5px] font-bold rounded bg-[#E07A5F]/15 text-[#C85A32] dark:text-[#E07A5F]">
																	{gl.manufacturer}
																</span>
																<span class="truncate font-semibold">{gl.glaze_name}</span>
															</div>
															<span class="text-[8.5px] text-stone-500 dark:text-stone-400 capitalize">{gl.coat_count}c</span>
														</div>
													{/each}
												</div>
											</div>
										{/if}

										<!-- Batch Action Bar -->
										<div class="pt-2.5 border-t border-stone-200 dark:border-stone-800/80 flex items-center justify-between text-xs gap-1.5">
											<div class="flex items-center gap-1">
												<button 
													onclick={() => selectedPiece = group.primaryPiece}
													class="p-1 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white rounded hover:bg-stone-200 dark:hover:bg-stone-800 transition"
													title="View Details"
												>
													<Info class="w-3.5 h-3.5" />
												</button>

												<button 
													type="button"
													data-action-button
													onclick={() => openSplitBatchModal(group.batchId!, stageInfo.id)}
													class="px-2 py-1 bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 font-bold rounded text-[10px] border border-amber-500/30 flex items-center gap-1 transition"
													title="Split Batch or Glaze Jobs Separately"
												>
													<GitFork class="w-3 h-3 text-amber-600 dark:text-amber-400" />
													<span>Split Jobs</span>
												</button>
											</div>

											{#if stageInfo.id !== 'done'}
												<button 
													type="button"
													data-action-button
													onclick={() => advanceBatchGroupStage(group)}
													class="text-[10px] font-bold text-[#3B7258] dark:text-[#81B29A] hover:text-stone-900 dark:hover:text-white flex items-center gap-1 transition px-2 py-1 rounded bg-[#81B29A]/15 hover:bg-[#81B29A]/25 border border-[#81B29A]/30"
												>
													<span>Next ({group.pieces.length})</span>
													<ArrowRight class="w-3 h-3" />
												</button>
											{/if}
										</div>
									</div>
								</div>
							{:else}
								<!-- SINGLE PIECE CARD -->
								{@const piece = group.primaryPiece}
								<div 
									role="listitem"
									data-card-group-key={groupKey}
									aria-grabbed={draggedPieceId === piece.id}
									draggable={false}
									onpointerdown={(e) => handlePointerDownPiece(e, piece.id, piece.title)}
									ondragover={(e) => handleCardDragOver(e, group)}
									ondragleave={(e) => handleCardDragLeave(e, group)}
									ondrop={(e) => handleCardDrop(e, group)}
									class="ceramic-card snap-start p-3.5 rounded-xl transition group relative space-y-3 cursor-grab active:cursor-grabbing select-none min-w-0 {piece.is_failed ? 'border-2 border-red-500 dark:border-red-600 bg-gradient-to-br from-red-50/90 via-white to-red-100/40 dark:from-red-950/50 dark:via-stone-900 dark:to-red-950/40 shadow-md shadow-red-500/10' : 'border border-stone-200 dark:border-stone-800/90 hover:border-[#E07A5F]/50'} {draggedPieceId === piece.id ? 'opacity-40 scale-95 border-dashed border-[#E07A5F]' : ''} {isCardHovered ? 'ring-2 ring-[#E07A5F] border-[#E07A5F] bg-[#E07A5F]/15 dark:bg-[#E07A5F]/20 scale-[1.02]' : ''}"
								>
									<!-- Merge Hover Highlight Banner -->
									{#if isCardHovered}
										<div class="bg-[#E07A5F] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md text-center shadow-md animate-pulse flex items-center justify-center gap-1">
											<Layers2 class="w-3.5 h-3.5" />
											<span>Drop card to merge into batch!</span>
										</div>
									{/if}

									<!-- Failed Header Banner -->
									{#if piece.is_failed}
										<div class="flex items-center justify-between bg-red-100 dark:bg-red-950/90 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 px-2.5 py-1 rounded-lg text-[10px] font-extrabold">
											<div class="flex items-center gap-1.5 truncate">
												<AlertTriangle class="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
												<span>FAILED AT {piece.failure_stage?.toUpperCase() || 'STAGE'}</span>
											</div>
											{#if piece.failure_reason}
												<span class="truncate max-w-[130px] font-medium text-[9.5px] italic text-red-600 dark:text-red-400" title={piece.failure_reason}>"{piece.failure_reason}"</span>
											{/if}
										</div>
									{/if}

									<!-- Thumbnail / Photo -->
									{#if piece.initial_photo_url}
										<button 
											type="button"
											onclick={() => selectedPiece = piece}
											class="w-full h-32 rounded-lg overflow-hidden relative bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-left cursor-pointer group/photo block"
											title="Click to view details & photos"
										>
											<img src={piece.initial_photo_url} alt={piece.title} draggable={false} class="w-full h-full object-cover group-hover/photo:scale-105 transition duration-300 pointer-events-none select-none" />
											<span class="absolute bottom-2 left-2 text-[10px] font-bold bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-white border border-white/10">
												{piece.piece_type}
											</span>
										</button>
									{/if}

									<!-- Piece Header & Cone -->
									<div class="flex items-start justify-between gap-2">
										<div class="flex-1 min-w-0">
											<button
												type="button"
												onclick={() => selectedPiece = piece}
												class="text-left w-full hover:underline focus:outline-hidden group/title cursor-pointer block"
												title="Click to view details"
											>
												<h4 class="font-display font-bold text-sm text-stone-900 dark:text-stone-100 group-hover/title:text-[#E07A5F] transition leading-snug truncate">
													{piece.title}
												</h4>
											</button>
											<div class="flex items-center gap-1.5 flex-wrap text-[11px] text-[#3B7258] dark:text-[#81B29A] font-medium mt-0.5">
												<span>{piece.clay_body_name}</span>
												{#if piece.weight_grams}
													<span class="text-[10px] px-1.5 py-0.2 rounded bg-[#3B7258]/15 text-[#3B7258] dark:text-[#81B29A] font-bold border border-[#3B7258]/20">
														{formatClayWeight(piece.weight_grams)}
													</span>
												{/if}
											</div>
											{#if piece.notes || piece.description}
												<p class="text-[10px] text-stone-500 dark:text-stone-400 italic mt-1 line-clamp-2">
													"{piece.notes || piece.description}"
												</p>
											{/if}
										</div>
										<span class="cone-badge cone-6 text-[9px] px-1.5 py-0.5 flex-shrink-0">
											{piece.target_glaze_cone}
										</span>
									</div>

									<!-- Piece Dates Bar -->
									<div class="flex items-center justify-between text-[10px] text-stone-500 dark:text-stone-400 font-medium pt-1 border-t border-stone-200/60 dark:border-stone-800/60">
										{#if piece.started_at}
											<span class="flex items-center gap-1 text-[#3B7258] dark:text-[#81B29A]" title={`Started work on ${piece.started_at}`}>
												<Clock class="w-3 h-3 text-[#3B7258] dark:text-[#81B29A]" />
												<span>Started {formatDateShort(piece.started_at)}</span>
											</span>
										{:else}
											<span class="flex items-center gap-1 text-stone-400 dark:text-stone-500" title={`Created on ${piece.created_at}`}>
												<Clock class="w-3 h-3" />
												<span>Created {formatDateShort(piece.created_at)}</span>
											</span>
										{/if}

										{#if piece.due_date}
											<span class="flex items-center gap-1 font-bold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30" title={`Due date: ${piece.due_date}`}>
												<Calendar class="w-3 h-3 text-amber-600 dark:text-amber-400" />
												<span>Due {formatDateShort(piece.due_date)}</span>
											</span>
										{/if}
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
												type="button"
												data-action-button
												onclick={() => selectedPiece = piece}
												class="p-1.5 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white rounded hover:bg-stone-200 dark:hover:bg-stone-800 transition"
												title="Glazes & Photo History"
											>
												<Info class="w-3.5 h-3.5" />
											</button>

											<button 
												type="button"
												data-action-button
												onclick={() => openDuplicateModal(piece)}
												class="p-1.5 text-stone-500 dark:text-stone-400 hover:text-[#E07A5F] rounded hover:bg-stone-200 dark:hover:bg-stone-800 transition"
												title="Duplicate Piece"
											>
												<Copy class="w-3.5 h-3.5" />
											</button>

											{#if !piece.is_failed}
												<button 
													type="button"
													data-action-button
													onclick={() => openFailModal(piece)}
													class="p-1.5 text-stone-500 dark:text-stone-400 hover:text-red-500 rounded hover:bg-stone-200 dark:hover:bg-stone-800 transition"
													title="Flag as Failed"
												>
													<AlertCircle class="w-3.5 h-3.5" />
												</button>
											{/if}
										</div>

										{#if piece.is_failed}
											<button 
												type="button"
												data-action-button
												onclick={() => restoreFailedPiece(piece.id)}
												class="text-[10px] font-bold text-[#3B7258] dark:text-[#81B29A] hover:text-stone-900 dark:hover:text-white flex items-center gap-1 transition px-2 py-1 rounded bg-[#81B29A]/15 hover:bg-[#81B29A]/25 border border-[#81B29A]/30"
												title="Restore piece back to active lifecycle"
											>
												<RotateCcw class="w-3 h-3" />
												<span>Restore</span>
											</button>
										{:else if piece.stage !== 'done'}
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
							{/if}
						{/each}

						{#if columnPieces.length === 0}
							{#if hasActiveFilters}
								<div class="h-44 border border-dashed rounded-xl flex flex-col items-center justify-center text-center p-4 bg-stone-100/60 dark:bg-stone-900/40 border-stone-300 dark:border-stone-800 space-y-1">
									<FilterX class="w-7 h-7 text-stone-400 dark:text-stone-600 mb-1" />
									<p class="text-xs font-bold text-stone-700 dark:text-stone-300">No matching pieces</p>
									<p class="text-[10px] text-stone-500 dark:text-stone-400">Try adjusting your active filters.</p>
									<button type="button" onclick={clearAllFilters} class="mt-2 px-2.5 py-1 text-[10px] font-bold bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 rounded-lg transition cursor-pointer">Clear Filters</button>
								</div>
							{:else}
								<div class="h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center p-3 transition-all duration-200 {dragOverStageId === stageInfo.id ? 'border-[#E07A5F] bg-[#E07A5F]/10 scale-[1.02]' : 'border-stone-300 dark:border-stone-800/50'}">
									<p class="text-[11px] font-medium {dragOverStageId === stageInfo.id ? 'text-[#E07A5F] font-bold' : 'text-stone-500'}">
										{dragOverStageId === stageInfo.id ? 'Release to drop piece here' : 'Empty stage'}
									</p>
									{#if dragOverStageId === stageInfo.id}
										<span class="text-[10px] text-stone-500 dark:text-stone-400 mt-1">Move to {stageInfo.label}</span>
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
</div>

<!-- MOBILE FILTER DRAWER MODAL -->
{#if isMobileFilterDrawerOpen}
	<div class="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity duration-300">
		<div class="w-full max-w-sm bg-white dark:bg-stone-900 h-full flex flex-col shadow-2xl border-l border-stone-200 dark:border-stone-800">
			<!-- Drawer Header -->
			<div class="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-950/50">
				<div class="flex items-center gap-2">
					<SlidersHorizontal class="w-5 h-5 text-[#E07A5F]" />
					<h3 class="font-display font-extrabold text-base text-stone-900 dark:text-stone-100">Filter Pieces</h3>
				</div>
				<button
					type="button"
					onclick={() => isMobileFilterDrawerOpen = false}
					class="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
					aria-label="Close filter drawer"
				>
					<X class="w-5 h-5" />
				</button>
			</div>

			<!-- Drawer Form Controls -->
			<div class="p-4 space-y-4 flex-1 overflow-y-auto touch-pan-y">
				<!-- Search -->
				<div class="space-y-1.5">
					<label for="drawer-search-input" class="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">Search Query</label>
					<div class="relative">
						<Search class="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
						<input
							id="drawer-search-input"
							type="text"
							bind:value={filterSearchQuery}
							placeholder="Search titles, notes, clay..."
							class="w-full pl-9 pr-8 py-2 text-sm bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-hidden focus:ring-2 focus:ring-[#E07A5F]"
						/>
						{#if filterSearchQuery}
							<button
								type="button"
								onclick={() => filterSearchQuery = ''}
								class="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
							>
								<X class="w-4 h-4" />
							</button>
						{/if}
					</div>
				</div>

				<!-- Form Type -->
				<div class="space-y-1.5">
					<label for="drawer-form-type" class="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">Form Type</label>
					<select
						id="drawer-form-type"
						bind:value={filterFormType}
						class="w-full px-3 py-2 text-sm bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-hidden focus:ring-2 focus:ring-[#E07A5F] cursor-pointer"
					>
						<option value="all">All Form Types</option>
						{#each availablePieceTypes as typeName}
							<option value={typeName}>{typeName}</option>
						{/each}
					</select>
				</div>

				<!-- Clay Body -->
				<div class="space-y-1.5">
					<label for="drawer-clay-body" class="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">Clay Body</label>
					<select
						id="drawer-clay-body"
						bind:value={filterClayBody}
						class="w-full px-3 py-2 text-sm bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-hidden focus:ring-2 focus:ring-[#E07A5F] cursor-pointer"
					>
						<option value="all">All Clay Bodies</option>
						{#each availableClayBodies as clayName}
							<option value={clayName}>{clayName}</option>
						{/each}
					</select>
				</div>

				<!-- Glaze -->
				<div class="space-y-1.5">
					<label for="drawer-glaze" class="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">Glaze Application</label>
					<select
						id="drawer-glaze"
						bind:value={filterGlaze}
						class="w-full px-3 py-2 text-sm bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-hidden focus:ring-2 focus:ring-[#E07A5F] cursor-pointer"
					>
						<option value="all">All Glazes</option>
						<option value="unglazed">Unglazed Only</option>
						{#each availableGlazes as glazeName}
							<option value={glazeName}>{glazeName}</option>
						{/each}
					</select>
				</div>

				<!-- Target Cone -->
				<div class="space-y-1.5">
					<label for="drawer-target-cone" class="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">Firing Cone</label>
					<select
						id="drawer-target-cone"
						bind:value={filterTargetCone}
						class="w-full px-3 py-2 text-sm bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-hidden focus:ring-2 focus:ring-[#E07A5F] cursor-pointer"
					>
						<option value="all">All Cones</option>
						{#each availableCones as coneName}
							<option value={coneName}>{coneName}</option>
						{/each}
					</select>
				</div>

				<!-- Due Date -->
				<div class="space-y-1.5">
					<label for="drawer-due-date" class="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">Due Date Status</label>
					<select
						id="drawer-due-date"
						bind:value={filterDueDate}
						class="w-full px-3 py-2 text-sm bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-hidden focus:ring-2 focus:ring-[#E07A5F] cursor-pointer"
					>
						<option value="all">All Due Dates</option>
						<option value="overdue">Late / Overdue</option>
						<option value="due_today">Due Today</option>
						<option value="less_than_1_week">Due in &lt; 1 Week</option>
						<option value="less_than_2_weeks">Due in &lt; 2 Weeks</option>
						<option value="has_due_date">Has Due Date</option>
						<option value="no_due_date">No Due Date</option>
					</select>
				</div>

				<!-- Clay Weight Range Slider & Unit Selector -->
				<div class="space-y-2.5 p-3 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200 dark:border-stone-800">
					<div class="flex items-center justify-between">
						<label for="mobile-weight-range-min" class="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">Clay Weight</label>
						<!-- Unit Selector Pills -->
						<div class="flex items-center p-0.5 bg-stone-200 dark:bg-stone-800 rounded-lg text-[10px] font-bold">
							{#each (['g', 'kg', 'oz', 'lbs'] as WeightUnit[]) as u}
								<button
									type="button"
									onclick={() => handleWeightUnitChange(u)}
									class="px-2 py-0.5 rounded-md transition cursor-pointer {draftWeightUnit === u ? 'bg-white dark:bg-stone-700 text-[#E07A5F] shadow-xs font-bold' : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'}"
								>
									{u}
								</button>
							{/each}
						</div>
					</div>

					<!-- Min Slider -->
					<div class="space-y-1 pt-1">
						<div class="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
							<span>Min Weight:</span>
							<span class="font-bold text-stone-900 dark:text-stone-100">{draftMinWeight} {draftWeightUnit}</span>
						</div>
						<input
							id="mobile-weight-range-min"
							type="range"
							min="0"
							max={weightSliderMax}
							step={weightSliderStep}
							bind:value={draftMinWeight}
							class="w-full accent-[#E07A5F] cursor-pointer"
						/>
					</div>

					<!-- Max Slider -->
					<div class="space-y-1">
						<div class="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
							<span>Max Weight:</span>
							<span class="font-bold text-stone-900 dark:text-stone-100">{draftMaxWeight} {draftWeightUnit}</span>
						</div>
						<input
							type="range"
							min="0"
							max={weightSliderMax}
							step={weightSliderStep}
							bind:value={draftMaxWeight}
							class="w-full accent-[#E07A5F] cursor-pointer"
						/>
					</div>

					<!-- Apply / Reset Weight Buttons -->
					<div class="flex items-center gap-2 pt-1.5">
						<button
							type="button"
							onclick={resetWeightFilter}
							class="flex-1 py-1.5 text-xs font-semibold rounded-lg border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition text-center cursor-pointer"
						>
							Reset Weight
						</button>
						<button
							type="button"
							onclick={applyWeightFilter}
							class="flex-1 py-1.5 text-xs font-bold rounded-lg bg-[#E07A5F] hover:bg-[#C85A32] text-white transition text-center cursor-pointer shadow-xs"
						>
							Apply Weight
						</button>
					</div>
				</div>
			</div>

			<!-- Drawer Footer -->
			<div class="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/50 flex items-center gap-3">
				<button
					type="button"
					onclick={clearAllFilters}
					class="flex-1 py-2.5 text-xs font-bold rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition text-center cursor-pointer"
				>
					Reset All
				</button>
				<button
					type="button"
					onclick={() => isMobileFilterDrawerOpen = false}
					class="flex-1 py-2.5 text-xs font-bold rounded-xl bg-[#E07A5F] hover:bg-[#C85A32] text-white transition text-center shadow-md shadow-[#C85A32]/20 cursor-pointer"
				>
					Apply ({filteredPieces.length})
				</button>
			</div>
		</div>
	</div>
{/if}

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

				<!-- MULTI-PIECE BATCH CREATION INPUTS -->
				<div class="grid grid-cols-2 gap-4 bg-amber-500/10 dark:bg-amber-950/20 p-3 rounded-xl border border-amber-500/30">
					<div class="space-y-1.5">
						<label for="piece-qty" class="text-stone-800 dark:text-stone-200 font-bold flex items-center gap-1">
							<Layers2 class="w-3.5 h-3.5 text-[#E07A5F]" />
							<span>Quantity (Duplicate Pieces)</span>
						</label>
						<input 
							id="piece-qty"
							type="number" 
							min="1"
							max="50"
							bind:value={newQuantity}
							class="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-2.5 text-stone-900 dark:text-stone-100 font-bold focus:outline-none focus:border-[#E07A5F]"
						/>
					</div>

					{#if newQuantity > 1}
						<div class="space-y-1.5">
							<label for="batch-title-input" class="text-stone-800 dark:text-stone-200 font-bold">Batch Title (Optional)</label>
							<input 
								id="batch-title-input"
								type="text" 
								bind:value={newBatchTitle}
								placeholder="e.g. 6x Espresso Mug Batch"
								class="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-2.5 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#E07A5F]"
							/>
						</div>
					{/if}
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
					<label for="piece-due-date" class="text-stone-700 dark:text-stone-300 font-semibold flex items-center gap-1.5">
						<Calendar class="w-3.5 h-3.5 text-[#E07A5F]" />
						<span>Target Due Date (Optional)</span>
					</label>
					<input 
						id="piece-due-date"
						type="date" 
						bind:value={newDueDate} 
						class="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-xl px-3 py-2 text-stone-900 dark:text-stone-100 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#E07A5F] focus:border-transparent transition shadow-2xs cursor-pointer scheme-light dark:scheme-dark [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-70 hover:[&::-webkit-calendar-picker-indicator]:opacity-100"
					/>
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
		<div class="ceramic-card max-w-2xl w-full p-6 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto touch-pan-y">
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

			<!-- Failed Banner (if applicable) -->
			{#if selectedPiece.is_failed}
				<div class="p-3 rounded-xl bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-xs flex items-center justify-between text-red-700 dark:text-red-300">
					<div class="flex items-center gap-2 font-semibold">
						<AlertTriangle class="w-4.5 h-4.5 text-red-500 flex-shrink-0" />
						<div>
							<span class="font-bold uppercase text-[10px] block">Flagged as Failed (Finished Lane):</span>
							<span class="text-sm font-bold">"{selectedPiece.failure_reason || 'Failure logged'}"</span>
							{#if selectedPiece.failure_stage}
								<span class="text-[10px] text-red-600 dark:text-red-400 block font-normal mt-0.5">Failed during: {selectedPiece.failure_stage} stage</span>
							{/if}
						</div>
					</div>
					<button 
						onclick={() => {
							restoreFailedPiece(selectedPiece!.id);
							selectedPiece = pieces.find(p => p.id === selectedPiece!.id) || null;
						}}
						class="px-2.5 py-1 text-xs font-bold bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg flex items-center gap-1 transition shadow-xs"
					>
						<RotateCcw class="w-3.5 h-3.5" />
						<span>Restore to Active</span>
					</button>
				</div>
			{/if}

			<!-- Piece Dates & Lifecycle Timeline -->
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-stone-100/90 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-xs">
				<div class="space-y-0.5">
					<span class="text-[10px] uppercase font-extrabold text-stone-500 dark:text-stone-400 block tracking-wider">Date Created</span>
					<div class="flex items-center gap-1.5 font-bold text-stone-800 dark:text-stone-200">
						<Clock class="w-3.5 h-3.5 text-stone-400" />
						<span>{formatDateShort(selectedPiece.created_at)}</span>
					</div>
				</div>

				<div class="space-y-0.5">
					<span class="text-[10px] uppercase font-extrabold text-stone-500 dark:text-stone-400 block tracking-wider">Date Started</span>
					<div class="flex items-center gap-1.5 font-bold text-[#3B7258] dark:text-[#81B29A]">
						<Sparkles class="w-3.5 h-3.5 text-[#3B7258] dark:text-[#81B29A]" />
						<span>{selectedPiece.started_at ? formatDateShort(selectedPiece.started_at) : 'In Backlog'}</span>
					</div>
				</div>

				<div class="space-y-0.5">
					<span class="text-[10px] uppercase font-extrabold text-stone-500 dark:text-stone-400 block tracking-wider">Target Due Date</span>
					<div class="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-300">
						<Calendar class="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
						<input
							type="date"
							value={formatDateInput(selectedPiece.due_date)}
							onchange={(e) => {
								const valStr = (e.target as HTMLInputElement).value;
								const parsedDate = parseDateInput(valStr);
								selectedPiece = { ...selectedPiece!, due_date: parsedDate };
								pieces = pieces.map(p => p.id === selectedPiece!.id ? { ...p, due_date: parsedDate } : p);
								showToast(parsedDate ? `Updated due date to ${formatDateShort(parsedDate)}` : 'Cleared due date');
							}}
							class="bg-white/80 dark:bg-stone-950/80 border border-stone-300 dark:border-stone-700 rounded-lg px-2 py-0.5 text-xs font-bold text-amber-800 dark:text-amber-200 focus:ring-2 focus:ring-[#E07A5F] focus:border-transparent cursor-pointer scheme-light dark:scheme-dark transition [&::-webkit-calendar-picker-indicator]:cursor-pointer"
							title="Click to set or edit target due date"
						/>
					</div>
				</div>
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
									<span>{formatDateShort(log.created_at)}</span>
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
		<div class="ceramic-card max-w-2xl w-full p-6 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto touch-pan-y">
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
		<div class="ceramic-card max-w-2xl w-full p-6 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto touch-pan-y">
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
		<div class="ceramic-card max-w-3xl w-full p-6 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto touch-pan-y">
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
				<div class="max-h-96 overflow-y-auto touch-pan-y divide-y divide-stone-200 dark:divide-stone-800">
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
				<label for="fail-reason" class="text-stone-700 dark:text-stone-300 font-semibold">Failure Reason</label>
				<input 
					id="fail-reason"
					type="text" 
					list="fail-reasons-list"
					bind:value={failReason} 
					placeholder="Select or enter failure reason..."
					class="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-2.5 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#E07A5F]"
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

<!-- MODAL 5.5: DUPLICATE CERAMIC PIECE CONFIRMATION & EDIT -->
{#if isDuplicateModalOpen && pieceToDuplicate}
	<div class="fixed inset-0 z-50 bg-black/70 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
		<div class="ceramic-card max-w-lg w-full p-6 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto touch-pan-y">
			<div class="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
				<div class="flex items-center gap-2">
					<Copy class="w-5 h-5 text-[#E07A5F]" />
					<div>
						<h3 class="font-display font-bold text-lg text-stone-900 dark:text-white">Duplicate Ceramic Piece</h3>
						<p class="text-xs text-stone-500 dark:text-stone-400">Review & edit details before creating copy</p>
					</div>
				</div>
				<button onclick={() => isDuplicateModalOpen = false} class="text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white">
					<X class="w-5 h-5" />
				</button>
			</div>

			<form onsubmit={confirmDuplicatePiece} class="space-y-4 text-xs">
				<div class="space-y-1.5">
					<label for="dup-title" class="text-stone-700 dark:text-stone-300 font-semibold">New Piece Title</label>
					<input 
						id="dup-title"
						type="text" 
						bind:value={duplicateTitle}
						required
						placeholder="e.g. Ribbed Matcha Bowl (Copy)"
						class="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-2.5 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#E07A5F] font-semibold"
					/>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<div class="space-y-1.5">
						<label for="dup-type" class="text-stone-700 dark:text-stone-300 font-semibold">Form / Piece Type</label>
						<select 
							id="dup-type"
							bind:value={duplicatePieceType}
							class="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-2.5 text-stone-900 dark:text-stone-100"
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
						<label for="dup-clay" class="text-stone-700 dark:text-stone-300 font-semibold">Clay Body</label>
						<select 
							id="dup-clay"
							bind:value={duplicateClayBodyId}
							class="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-2.5 text-stone-900 dark:text-stone-100"
						>
							{#each clayBodies as cb}
								<option value={cb.id}>{cb.name} ({cb.manufacturer || 'Studio'})</option>
							{/each}
						</select>
					</div>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<div class="space-y-1.5">
						<label for="dup-stage" class="text-stone-700 dark:text-stone-300 font-semibold">Starting Stage</label>
						<select 
							id="dup-stage"
							bind:value={duplicateStage}
							class="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-2.5 text-stone-900 dark:text-stone-100"
						>
							{#each STAGES as s}
								<option value={s.id}>{s.icon} {s.label}</option>
							{/each}
						</select>
					</div>

					<div class="space-y-1.5">
						<label for="dup-quantity" class="text-stone-700 dark:text-stone-300 font-semibold">Quantity to Create</label>
						<input 
							id="dup-quantity"
							type="number" 
							min="1"
							max="50"
							bind:value={duplicateQuantity}
							class="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-2.5 text-stone-900 dark:text-stone-100"
						/>
					</div>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<div class="space-y-1.5">
						<label for="dup-bisque" class="text-stone-700 dark:text-stone-300 font-semibold">Target Bisque Cone</label>
						<select 
							id="dup-bisque"
							bind:value={duplicateTargetBisqueCone}
							class="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-2.5 text-stone-900 dark:text-stone-100"
						>
							{#each PYROMETRIC_CONES as c}
								<option value={c.name}>{c.name} ({c.temp_c}°C / {c.temp_f}°F)</option>
							{/each}
						</select>
					</div>

					<div class="space-y-1.5">
						<label for="dup-glaze-cone" class="text-stone-700 dark:text-stone-300 font-semibold">Target Glaze Cone</label>
						<select 
							id="dup-glaze-cone"
							bind:value={duplicateTargetGlazeCone}
							class="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-2.5 text-stone-900 dark:text-stone-100"
						>
							{#each PYROMETRIC_CONES as c}
								<option value={c.name}>{c.name} ({c.temp_c}°C / {c.temp_f}°F)</option>
							{/each}
						</select>
					</div>
				</div>

				<div class="space-y-1.5">
					<label for="dup-weight" class="text-stone-700 dark:text-stone-300 font-semibold">Clay Weight</label>
					<div class="flex items-center gap-2">
						<input 
							id="dup-weight"
							type="number" 
							step="any"
							bind:value={duplicateWeightAmount}
							placeholder="e.g. 450"
							class="flex-1 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-2.5 text-stone-900 dark:text-stone-100"
						/>
						<select 
							bind:value={duplicateWeightUnit}
							class="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-2.5 text-stone-900 dark:text-stone-100 font-bold"
						>
							<option value="g">grams (g)</option>
							<option value="oz">ounces (oz)</option>
							<option value="lbs">pounds (lbs)</option>
						</select>
					</div>
				</div>

				<div class="space-y-1.5">
					<label for="dup-desc" class="text-stone-700 dark:text-stone-300 font-semibold">Description / Artistic Notes</label>
					<textarea 
						id="dup-desc"
						bind:value={duplicateDescription}
						rows="2"
						placeholder="Add notes..."
						class="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-2.5 text-stone-900 dark:text-stone-100"
					></textarea>
				</div>

				{#if pieceToDuplicate.glaze_layers && pieceToDuplicate.glaze_layers.length > 0}
					<div class="flex items-center gap-2 pt-1">
						<input 
							id="dup-copy-glazes"
							type="checkbox"
							bind:checked={duplicateCopyGlazes}
							class="w-4 h-4 text-[#E07A5F] rounded border-stone-300 dark:border-stone-700 focus:ring-[#E07A5F]"
						/>
						<label for="dup-copy-glazes" class="text-stone-700 dark:text-stone-300 font-medium cursor-pointer">
							Copy {pieceToDuplicate.glaze_layers.length} tagged glaze layer(s) to new piece
						</label>
					</div>
				{/if}

				<div class="pt-4 border-t border-stone-200 dark:border-stone-800 flex justify-end gap-3">
					<button 
						type="button"
						onclick={() => isDuplicateModalOpen = false}
						class="px-4 py-2 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-semibold rounded-lg"
					>
						Cancel
					</button>
					<button 
						type="submit"
						class="px-4 py-2 bg-[#E07A5F] hover:bg-[#C85A32] text-white font-bold rounded-lg shadow"
					>
						{duplicateQuantity > 1 ? `Create Batch (${duplicateQuantity} pcs)` : 'Create Duplicate Piece'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- MODAL 6: SPLIT BATCH / DIVERGE JOBS -->
{#if isSplitModalOpen}
	<div class="fixed inset-0 z-50 bg-black/70 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
		<div class="ceramic-card max-w-xl w-full p-6 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto touch-pan-y">
			<div class="flex items-start justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
				<div>
					<div class="flex items-center gap-2">
						<GitFork class="w-5 h-5 text-amber-500" />
						<h3 class="font-display font-bold text-lg text-stone-900 dark:text-white">Split Batch & Diverge Jobs</h3>
					</div>
					<p class="text-xs text-stone-500 dark:text-stone-400 mt-1">
						Splitting batch: <strong class="text-stone-800 dark:text-stone-200">{splitTargetBatchTitle}</strong> ({splitBatchPieces.length} active pieces)
					</p>
				</div>
				<button onclick={() => isSplitModalOpen = false} class="text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white">
					<X class="w-5 h-5" />
				</button>
			</div>

			<!-- Piece Selection Section -->
			<div class="space-y-3 text-xs">
				<div class="flex items-center justify-between">
					<span class="font-bold text-stone-700 dark:text-stone-300">
						Select Pieces to Split ({splitSelectedPieceIds.length} of {splitBatchPieces.length} selected):
					</span>
					<div class="flex items-center gap-2">
						<button type="button" onclick={selectAllSplitPieces} class="text-[11px] text-[#E07A5F] hover:underline font-semibold">Select All</button>
						<span class="text-stone-400">•</span>
						<button type="button" onclick={deselectAllSplitPieces} class="text-[11px] text-stone-500 hover:underline font-semibold">Clear</button>
					</div>
				</div>

				<div class="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto touch-pan-y p-2 bg-stone-100 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800">
					{#each splitBatchPieces as p}
						<label class="flex items-center gap-2.5 p-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 cursor-pointer hover:border-[#E07A5F] transition text-stone-900 dark:text-stone-100">
							<input 
								type="checkbox" 
								checked={splitSelectedPieceIds.includes(p.id)}
								onchange={() => toggleSplitSelection(p.id)}
								class="rounded text-[#E07A5F] focus:ring-[#E07A5F]"
							/>
							<span class="font-semibold truncate">{p.title}</span>
						</label>
					{/each}
				</div>
			</div>

			<!-- Action Options -->
			<div class="space-y-4 text-xs pt-2 border-t border-stone-200 dark:border-stone-800">
				<span class="font-bold text-stone-700 dark:text-stone-300 block">Choose Action for Selected Pieces:</span>

				<div class="grid grid-cols-3 gap-3">
					<button 
						type="button"
						onclick={() => splitAction = 'new_batch'}
						class="p-3 rounded-xl border text-left transition flex flex-col gap-1 {splitAction === 'new_batch' ? 'border-[#E07A5F] bg-[#E07A5F]/10 dark:bg-[#E07A5F]/20 text-[#C85A32] dark:text-[#E07A5F] font-bold' : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300'}"
					>
						<span class="flex items-center gap-1.5 font-bold">
							<GitFork class="w-4 h-4" />
							<span>Split into Sub-Batch</span>
						</span>
						<span class="text-[10px] text-stone-500 dark:text-stone-400 font-normal">Separate into a new sibling batch group</span>
					</button>

					<button 
						type="button"
						onclick={() => splitAction = 'detach'}
						class="p-3 rounded-xl border text-left transition flex flex-col gap-1 {splitAction === 'detach' ? 'border-amber-500 bg-amber-500/10 text-amber-800 dark:text-amber-300 font-bold' : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300'}"
					>
						<span class="flex items-center gap-1.5 font-bold">
							<Boxes class="w-4 h-4" />
							<span>Detach as Standalone</span>
						</span>
						<span class="text-[10px] text-stone-500 dark:text-stone-400 font-normal">Make pieces individual (remove batch link)</span>
					</button>

					<button 
						type="button"
						onclick={() => splitAction = 'fail'}
						class="p-3 rounded-xl border text-left transition flex flex-col gap-1 {splitAction === 'fail' ? 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-300 font-bold' : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300'}"
					>
						<span class="flex items-center gap-1.5 font-bold">
							<AlertCircle class="w-4 h-4 text-red-500" />
							<span>Mark as Failed</span>
						</span>
						<span class="text-[10px] text-stone-500 dark:text-stone-400 font-normal">Flag selected items failed without ruining batch</span>
					</button>
				</div>

				<!-- Dynamic Action Inputs -->
				{#if splitAction === 'new_batch'}
					<div class="p-3 bg-stone-100 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 space-y-1.5">
						<label for="split-subbatch-title" class="text-stone-700 dark:text-stone-300 font-semibold">Sub-Batch Title</label>
						<input 
							id="split-subbatch-title"
							type="text" 
							bind:value={splitNewSubBatchTitle}
							class="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#E07A5F]"
						/>
					</div>
				{:else if splitAction === 'fail'}
					<div class="p-3 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-900/40 space-y-1.5 text-xs">
						<label for="split-fail-reason" class="text-red-700 dark:text-red-300 font-semibold">Failure Reason</label>
						<input 
							id="split-fail-reason"
							type="text" 
							list="split-fail-reasons-list"
							bind:value={splitFailReason}
							placeholder="Select or enter failure reason..."
							class="w-full bg-white dark:bg-stone-900 border border-red-300 dark:border-red-900/50 rounded-lg p-2.5 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-red-500"
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

			<div class="pt-4 border-t border-stone-200 dark:border-stone-800 flex justify-end gap-3 text-xs">
				<button 
					type="button" 
					onclick={() => isSplitModalOpen = false}
					class="px-4 py-2 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-semibold rounded-lg"
				>
					Cancel
				</button>
				<button 
					type="button" 
					onclick={executeSplitBatch}
					class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow"
				>
					Execute Split ({splitSelectedPieceIds.length} pcs)
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- TOUCH DRAG GHOST INDICATOR -->
{#if touchDragActive}
	<div class="fixed inset-0 z-[60] pointer-events-none">
		<div
			class="absolute pointer-events-none flex items-center gap-2 px-3 py-2 rounded-xl bg-[#E07A5F] text-white text-xs font-bold shadow-2xl border border-[#C85A32] max-w-[200px] truncate"
			style="left: {touchDragGhostX + 12}px; top: {touchDragGhostY - 24}px; transform: translate(0, -50%);"
		>
			<span class="text-sm">🏺</span>
			<span class="truncate">{touchDragLabel}</span>
		</div>
		{#if dragOverStageId}
			{@const targetStage = STAGES.find(s => s.id === dragOverStageId)}
			<div class="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-stone-900/90 dark:bg-stone-100/90 text-white dark:text-stone-900 text-sm font-bold shadow-2xl flex items-center gap-2 backdrop-blur-md pointer-events-none">
				<span>{targetStage?.icon}</span>
				<span>Drop into {targetStage?.label}</span>
			</div>
		{/if}
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
