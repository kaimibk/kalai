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
	import Ruler from 'lucide-svelte/icons/ruler';
	import type { CeramicPiece, ClayBody, CeramicStage, PieceStageLog, PieceGlazeLayer, GlazeRecipe, GlazeStyle, GlazeLocation, PyrometricCone, Manufacturer, PieceType, PieceBatch } from '$lib/types/database';
	import CallyDatePicker from '$lib/components/CallyDatePicker.svelte';

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

	function calculateFormedDimension(desiredCm: number | null | undefined, shrinkagePct: number): number | null {
		if (desiredCm === null || desiredCm === undefined || isNaN(desiredCm) || desiredCm <= 0) return null;
		if (shrinkagePct >= 100 || shrinkagePct < 0) return desiredCm;
		const scale = 1 - (shrinkagePct / 100);
		if (scale <= 0) return desiredCm;
		return Math.round((desiredCm / scale) * 100) / 100;
	}

	function calculateFiredDimension(formedCm: number | null | undefined, shrinkagePct: number): number | null {
		if (formedCm === null || formedCm === undefined || isNaN(formedCm) || formedCm <= 0) return null;
		if (shrinkagePct >= 100 || shrinkagePct < 0) return formedCm;
		const scale = 1 - (shrinkagePct / 100);
		if (scale <= 0) return formedCm;
		return Math.round((formedCm * scale) * 100) / 100;
	}

	// Expanded 8-Stage Kanban Lifecycle
	const STAGES: { id: CeramicStage; label: string; icon: string; color: string; badgeColor: string }[] = [
		{ id: 'backlog', label: 'Backlog / Planned', icon: '💡', color: 'border-2 border-info/50 bg-info/5', badgeColor: 'badge-info' },
		{ id: 'formed', label: 'Formed', icon: '🏺', color: 'border-2 border-primary/50 bg-primary/5', badgeColor: 'badge-primary' },
		{ id: 'leather_hard', label: 'Drying to Leather-Hard', icon: '📦', color: 'border-2 border-warning/50 bg-warning/5', badgeColor: 'badge-warning' },
		{ id: 'trimmed', label: 'Trimmed', icon: '🔪', color: 'border-2 border-secondary/50 bg-secondary/5', badgeColor: 'badge-secondary' },
		{ id: 'pending_bisque', label: 'Pending Bisque', icon: '☀️', color: 'border-2 border-accent/50 bg-accent/5', badgeColor: 'badge-accent' },
		{ id: 'bisqued', label: 'Bisqued (Awaiting Glaze)', icon: '🏷️', color: 'border-2 border-info/50 bg-info/5', badgeColor: 'badge-info' },
		{ id: 'glazed', label: 'Glazed (Pending Glaze Fire)', icon: '🖌️', color: 'border-2 border-primary/50 bg-primary/5', badgeColor: 'badge-primary' },
		{ id: 'done', label: 'Finished', icon: '✨', color: 'border-2 border-success/50 bg-success/5', badgeColor: 'badge-success' }
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
	let newTargetLength = $state<number | null>(null);
	let newTargetWidth = $state<number | null>(null);
	let newTargetHeight = $state<number | null>(null);
	let selectedClayForNewPiece = $derived(clayBodies.find(c => c.id === newClayBodyId));
	let selectedPieceClay = $derived(selectedPiece ? clayBodies.find(c => c.id === selectedPiece?.clay_body_id || c.name === selectedPiece?.clay_body_name) : null);
	let selectedPieceShrinkPct = $derived(selectedPieceClay ? selectedPieceClay.shrinkage_pct : 12.0);

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
	let duplicateTargetLength = $state<number | null>(null);
	let duplicateTargetWidth = $state<number | null>(null);
	let duplicateTargetHeight = $state<number | null>(null);

	// Piece Detail Modal Editing State
	let editingPieceNotes = $state('');
	let isEditingNotes = $state(false);
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
		const clay = clayBodies.find(c => c.id === selectedPiece!.clay_body_id || c.name === selectedPiece!.clay_body_name);
		const shrinkPct = clay ? clay.shrinkage_pct : 12.0;

		const tLen = editingTargetLength && editingTargetLength > 0 ? editingTargetLength : null;
		const tWid = editingTargetWidth && editingTargetWidth > 0 ? editingTargetWidth : null;
		const tHgt = editingTargetHeight && editingTargetHeight > 0 ? editingTargetHeight : null;

		const fLen = calculateFormedDimension(tLen, shrinkPct);
		const fWid = calculateFormedDimension(tWid, shrinkPct);
		const fHgt = calculateFormedDimension(tHgt, shrinkPct);

		const updatedPiece: CeramicPiece = {
			...selectedPiece,
			target_length_cm: tLen,
			target_width_cm: tWid,
			target_height_cm: tHgt,
			formed_length_cm: fLen,
			formed_width_cm: fWid,
			formed_height_cm: fHgt,
			updated_at: new Date()
		};

		selectedPiece = updatedPiece;
		pieces = pieces.map(p => p.id === selectedPiece!.id ? updatedPiece : p);
		editingDimensionMode = 'none';
		showToast(`Updated goal dimensions & recalculated recommended pre-fire target!`);
	}

	function saveActualFormedDimensions() {
		if (!selectedPiece) return;

		const afLen = editingActualFormedLength && editingActualFormedLength > 0 ? editingActualFormedLength : null;
		const afWid = editingActualFormedWidth && editingActualFormedWidth > 0 ? editingActualFormedWidth : null;
		const afHgt = editingActualFormedHeight && editingActualFormedHeight > 0 ? editingActualFormedHeight : null;

		const updatedPiece: CeramicPiece = {
			...selectedPiece,
			actual_formed_length_cm: afLen,
			actual_formed_width_cm: afWid,
			actual_formed_height_cm: afHgt,
			width_cm: afWid || selectedPiece.formed_width_cm || selectedPiece.width_cm,
			height_cm: afHgt || selectedPiece.formed_height_cm || selectedPiece.height_cm,
			length_cm: afLen || selectedPiece.formed_length_cm || selectedPiece.length_cm,
			updated_at: new Date()
		};

		selectedPiece = updatedPiece;
		pieces = pieces.map(p => p.id === selectedPiece!.id ? updatedPiece : p);
		editingDimensionMode = 'none';
		showToast(`Saved actual measured pre-fire dimensions!`);
	}

	function saveActualFiredDimensions() {
		if (!selectedPiece) return;

		const afiLen = editingActualFiredLength && editingActualFiredLength > 0 ? editingActualFiredLength : null;
		const afiWid = editingActualFiredWidth && editingActualFiredWidth > 0 ? editingActualFiredWidth : null;
		const afiHgt = editingActualFiredHeight && editingActualFiredHeight > 0 ? editingActualFiredHeight : null;

		const updatedPiece: CeramicPiece = {
			...selectedPiece,
			actual_fired_length_cm: afiLen,
			actual_fired_width_cm: afiWid,
			actual_fired_height_cm: afiHgt,
			width_cm: afiWid || selectedPiece.actual_formed_width_cm || selectedPiece.formed_width_cm || selectedPiece.width_cm,
			height_cm: afiHgt || selectedPiece.actual_formed_height_cm || selectedPiece.formed_height_cm || selectedPiece.height_cm,
			length_cm: afiLen || selectedPiece.actual_formed_length_cm || selectedPiece.formed_length_cm || selectedPiece.length_cm,
			updated_at: new Date()
		};

		selectedPiece = updatedPiece;
		pieces = pieces.map(p => p.id === selectedPiece!.id ? updatedPiece : p);
		editingDimensionMode = 'none';
		showToast(`Saved actual measured final fired dimensions!`);
	}

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
	let toastType = $state<'success' | 'warning' | 'error' | 'info'>('success');
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
	let boardContainerRef = $state<HTMLElement | null>(null);
	let autoScrollAnimFrame: number | null = null;

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

	const TOUCH_MOVE_THRESHOLD = 18;

	let isSnappingStage = false;
	let lastStageSnapTime = 0;

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
		const EDGE_THRESHOLD = 80; // 80px edge trigger zone

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

	let stageBounds: { id: CeramicStage; rect: DOMRect }[] = [];

	function updateStageBounds() {
		if (typeof document === 'undefined') return;
		const stageElements = document.querySelectorAll('[data-stage-id]');
		stageBounds = Array.from(stageElements).map((el) => ({
			id: (el as HTMLElement).dataset.stageId as CeramicStage,
			rect: el.getBoundingClientRect()
		}));
	}

	function isInteractiveTarget(target: EventTarget | null): boolean {
		if (!target || !(target instanceof Element)) return false;
		const btn = target.closest('button, input, select, a, textarea, [role="button"]');
		return btn !== null;
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

			if (autoScrollAnimFrame === null) {
				autoScrollAnimFrame = requestAnimationFrame(updateAutoScroll);
			}

			// Live DOM element hit-testing under current pointer position
			const el = document.elementFromPoint(e.clientX, e.clientY);
			if (el) {
				const cardEl = el.closest('[data-card-group-key]') as HTMLElement | null;
				const stageEl = el.closest('[data-stage-id]') as HTMLElement | null;

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

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				if (isFailModalOpen) {
					isFailModalOpen = false;
				} else if (isDuplicateModalOpen) {
					isDuplicateModalOpen = false;
				} else if (isSplitModalOpen) {
					isSplitModalOpen = false;
				} else if (isNewPieceModalOpen) {
					isNewPieceModalOpen = false;
				} else if (showGlazeLibraryModal) {
					showGlazeLibraryModal = false;
				} else if (showClayLibraryModal) {
					showClayLibraryModal = false;
				} else if (showPyrometricChartModal) {
					showPyrometricChartModal = false;
				} else if (isMobileFilterDrawerOpen) {
					isMobileFilterDrawerOpen = false;
				} else if (selectedPiece) {
					selectedPiece = null;
				}
			}
		};

		window.addEventListener('pointermove', onMove, { passive: false });
		window.addEventListener('touchmove', onTouchMove, { passive: false });
		window.addEventListener('pointerup', onUp);
		window.addEventListener('pointercancel', onCancel);
		window.addEventListener('blur', onCancel);
		window.addEventListener('dragend', onCancel);
		window.addEventListener('keydown', onKeyDown);
		return () => {
			window.removeEventListener('pointermove', onMove);
			window.removeEventListener('touchmove', onTouchMove);
			window.removeEventListener('pointerup', onUp);
			window.removeEventListener('pointercancel', onCancel);
			window.removeEventListener('blur', onCancel);
			window.removeEventListener('dragend', onCancel);
			window.removeEventListener('keydown', onKeyDown);
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

	function snapStageToCenter(stageId: CeramicStage) {
		if (typeof document === 'undefined') return;
		setTimeout(() => {
			const stageEl = document.querySelector(`[data-stage-id="${stageId}"]`) as HTMLElement | null;
			if (stageEl) {
				stageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
			}
		}, 60);
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
			snapStageToCenter(targetStage);
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
				snapStageToCenter(targetStage);
			}
		}
	}

	function showToast(msg: string, type: 'success' | 'warning' | 'error' | 'info' = 'success') {
		toastMessage = msg;
		toastType = type;
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
			showToast(`Cannot merge: Items must share the same clay (${targetPiece.clay_body_name}), form type (${targetPiece.piece_type}), and stage!`, 'warning');
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
			showToast('Please select at least 1 piece to split.', 'warning');
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
			'backlog', 'formed', 'leather_hard', 'trimmed', 'pending_bisque', 'bisqued', 'glazed', 'done'
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

		const shrinkPct = selectedClay ? selectedClay.shrinkage_pct : 12.0;
		const targetLen = newTargetLength && newTargetLength > 0 ? newTargetLength : null;
		const targetWid = newTargetWidth && newTargetWidth > 0 ? newTargetWidth : null;
		const targetHgt = newTargetHeight && newTargetHeight > 0 ? newTargetHeight : null;

		const formedLen = calculateFormedDimension(targetLen, shrinkPct);
		const formedWid = calculateFormedDimension(targetWid, shrinkPct);
		const formedHgt = calculateFormedDimension(targetHgt, shrinkPct);

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
				target_length_cm: targetLen,
				target_width_cm: targetWid,
				target_height_cm: targetHgt,
				formed_length_cm: formedLen,
				formed_width_cm: formedWid,
				formed_height_cm: formedHgt,
				length_cm: formedLen || null,
				width_cm: formedWid || targetWid || null,
				height_cm: formedHgt || targetHgt || null,
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
				target_length_cm: targetLen,
				target_width_cm: targetWid,
				target_height_cm: targetHgt,
				formed_length_cm: formedLen,
				formed_width_cm: formedWid,
				formed_height_cm: formedHgt,
				length_cm: formedLen || null,
				width_cm: formedWid || targetWid || null,
				height_cm: formedHgt || targetHgt || null,
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
		newTargetLength = null;
		newTargetWidth = null;
		newTargetHeight = null;
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
			'backlog', 'formed', 'leather_hard', 'trimmed', 'pending_bisque', 'bisqued', 'glazed', 'done'
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
		duplicateTargetLength = piece.target_length_cm || null;
		duplicateTargetWidth = piece.target_width_cm || null;
		duplicateTargetHeight = piece.target_height_cm || null;
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

		const shrinkPct = selectedClay ? selectedClay.shrinkage_pct : 12.0;
		const targetLen = duplicateTargetLength && duplicateTargetLength > 0 ? duplicateTargetLength : null;
		const targetWid = duplicateTargetWidth && duplicateTargetWidth > 0 ? duplicateTargetWidth : null;
		const targetHgt = duplicateTargetHeight && duplicateTargetHeight > 0 ? duplicateTargetHeight : null;

		const formedLen = calculateFormedDimension(targetLen, shrinkPct);
		const formedWid = calculateFormedDimension(targetWid, shrinkPct);
		const formedHgt = calculateFormedDimension(targetHgt, shrinkPct);

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
				target_length_cm: targetLen,
				target_width_cm: targetWid,
				target_height_cm: targetHgt,
				formed_length_cm: formedLen,
				formed_width_cm: formedWid,
				formed_height_cm: formedHgt,
				length_cm: formedLen || null,
				width_cm: formedWid || targetWid || null,
				height_cm: formedHgt || targetHgt || null,
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
				target_length_cm: targetLen,
				target_width_cm: targetWid,
				target_height_cm: targetHgt,
				formed_length_cm: formedLen,
				formed_width_cm: formedWid,
				formed_height_cm: formedHgt,
				length_cm: formedLen || null,
				width_cm: formedWid || targetWid || null,
				height_cm: formedHgt || targetHgt || null,
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
	<div class="flex items-center justify-between gap-2 border-b border-base-300 pb-2.5 transition-colors flex-shrink-0">
		<div>
			<div class="flex items-center gap-2 sm:gap-3">				
				<!-- Studio Statistics Component (daisyUI stat) -->
				<div class="stats stats-horizontal bg-base-200/60 border border-base-300 shadow-xs py-0.5 px-2 rounded-xl">
					<div class="stat p-1 flex items-center gap-1.5">
						<div class="stat-title text-[10px] font-extrabold uppercase text-base-content/60">Active</div>
						<div class="stat-value text-xs sm:text-sm font-extrabold text-primary">{activePieces.length}</div>
					</div>
					<div class="stat p-1 flex items-center gap-1.5 border-l border-base-300">
						<div class="stat-title text-[10px] font-extrabold uppercase text-base-content/60 hidden sm:block">Done</div>
						<div class="stat-value text-xs sm:text-sm font-extrabold text-success">{activePieces.filter(p => p.stage === 'done').length}</div>
					</div>
					{#if failedPieces.length > 0}
						<div class="stat p-1 flex items-center gap-1.5 border-l border-base-300">
							<div class="stat-title text-[10px] font-extrabold uppercase text-base-content/60 hidden sm:block">Losses</div>
							<div class="stat-value text-xs sm:text-sm font-extrabold text-error">{failedPieces.length}</div>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<div class="flex items-center gap-1.5 sm:gap-2">
			<button 
				onclick={() => showPyrometricChartModal = true}
				class="btn btn-sm btn-ghost border border-base-300 text-xs font-semibold gap-1.5"
				title="Pyrometric Cone Temp Chart"
			>
				<Flame class="w-4 h-4 text-warning" />
				<span class="hidden md:inline">Cone Temp Chart</span>
				<span class="hidden sm:inline md:hidden">Cones</span>
			</button>

			<button 
				onclick={() => showGlazeLibraryModal = true}
				class="btn btn-sm btn-ghost border border-base-300 text-xs font-semibold gap-1.5"
				title="Glaze Library"
			>
				<Palette class="w-4 h-4 text-success" />
				<span class="hidden md:inline">Glaze Library ({glazes.length})</span>
				<span class="hidden sm:inline md:hidden">Glazes ({glazes.length})</span>
			</button>

			<button 
				onclick={() => showClayLibraryModal = true}
				class="btn btn-sm btn-ghost border border-base-300 text-xs font-semibold gap-1.5"
				title="Clay Bodies Library"
			>
				<Package class="w-4 h-4 text-primary" />
				<span class="hidden md:inline">Clay Bodies ({clayBodies.length})</span>
				<span class="hidden sm:inline md:hidden">Clay ({clayBodies.length})</span>
			</button>

			<button 
				onclick={() => showLossArchive = !showLossArchive}
				class="btn btn-sm gap-1.5 {showLossArchive ? 'btn-error' : 'btn-outline btn-error'}"
				title="Toggle Loss Archive (Failed Pieces in Finished Stage)"
			>
				<ShieldAlert class="w-4 h-4" />
				<span class="hidden md:inline">Loss Archive ({failedPieces.length})</span>
				<span class="hidden sm:inline md:hidden">Losses ({failedPieces.length})</span>
				{#if showLossArchive}
					<span class="badge badge-xs badge-neutral uppercase font-extrabold">Shown</span>
				{/if}
			</button>

			<button 
				onclick={() => isNewPieceModalOpen = true}
				class="btn btn-sm btn-primary font-bold gap-1.5 shadow-md"
				title="Create New Piece"
			>
				<Plus class="w-4 h-4" />
				<span class="hidden sm:inline">Create Piece</span>
			</button>
		</div>
	</div>

	<!-- DYNAMIC RESPONSIVE FILTER TOOLBAR -->
	<div class="w-full bg-base-100/90 backdrop-blur-md border border-base-300 rounded-2xl p-2.5 sm:p-3 mb-3 shadow-sm space-y-2 flex-shrink-0 relative z-30">
		<div class="flex flex-wrap items-center justify-between gap-2">
			<!-- Search Bar -->
			<div class="relative flex-1 min-w-[200px] sm:min-w-[260px]">
				<Search class="w-4 h-4 text-base-content/50 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
				<input
					type="text"
					bind:value={filterSearchQuery}
					placeholder="Search titles, clay, forms, glazes, notes..."
					class="input input-bordered input-sm w-full pl-9 pr-8 text-xs"
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
				class="lg:hidden btn btn-sm btn-outline gap-1.5 cursor-pointer {hasActiveFilters ? 'btn-primary' : ''}"
			>
				<SlidersHorizontal class="w-4 h-4" />
				<span>Filter</span>
				{#if activeFilterCount > 0}
					<span class="badge badge-xs badge-neutral">
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
						class="select select-bordered select-sm text-xs font-semibold"
					>
						<option value="all">All Forms</option>
						{#each availablePieceTypes as typeName}
							<option value={typeName}>{typeName}</option>
						{/each}
					</select>
				</div>

				<!-- Clay Body Filter -->
				<div class="relative">
					<select
						bind:value={filterClayBody}
						class="select select-bordered select-sm text-xs font-semibold"
					>
						<option value="all">All Clay Bodies</option>
						{#each availableClayBodies as clayName}
							<option value={clayName}>{clayName}</option>
						{/each}
					</select>
				</div>

				<!-- Glaze Filter -->
				<div class="relative">
					<select
						bind:value={filterGlaze}
						class="select select-bordered select-sm text-xs font-semibold"
					>
						<option value="all">All Glazes</option>
						<option value="unglazed">Unglazed Only</option>
						{#each availableGlazes as glazeName}
							<option value={glazeName}>{glazeName}</option>
						{/each}
					</select>
				</div>

				<!-- Target Cone Filter -->
				<div class="relative">
					<select
						bind:value={filterTargetCone}
						class="select select-bordered select-sm text-xs font-semibold"
					>
						<option value="all">All Cones</option>
						{#each availableCones as coneName}
							<option value={coneName}>{coneName}</option>
						{/each}
					</select>
				</div>

				<!-- Due Date Filter -->
				<div class="relative">
					<select
						bind:value={filterDueDate}
						class="select select-bordered select-sm text-xs font-semibold"
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

				<!-- Weight Range Filter Popover -->
				<div class="relative flex-shrink-0">
					<button
						type="button"
						onclick={() => { if (showWeightSliderPopover) showWeightSliderPopover = false; else openWeightSliderPopover(); }}
						class="btn btn-sm bg-base-100 border border-base-300 text-base-content hover:bg-base-200 gap-1.5 cursor-pointer font-semibold shadow-xs {filterWeightEnabled ? 'btn-primary border-primary text-primary-content' : ''}"
					>
						<span>Weight</span>
						{#if filterWeightEnabled}
							<span class="badge badge-xs badge-primary-content text-primary font-bold">
								{appliedMinWeight}–{appliedMaxWeight}{appliedWeightUnit}
							</span>
						{:else}
							<span class="text-base-content/60 font-normal">All</span>
						{/if}
						<ChevronDown class="w-3.5 h-3.5 opacity-60" />
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

						<div class="absolute right-0 top-full mt-2 w-72 max-w-[calc(100vw-2rem)] p-4 bg-base-100 border border-base-300 rounded-2xl shadow-2xl z-50 space-y-3.5 text-base-content outline-none ring-0">
							<div class="flex items-center justify-between">
								<span class="text-xs font-extrabold uppercase tracking-wider text-base-content/70">Weight Range</span>
								<!-- Unit Selector -->
								<div class="join bg-base-200 p-0.5 rounded-lg">
									{#each (['g', 'kg', 'oz', 'lbs'] as WeightUnit[]) as u}
										<button
											type="button"
											onclick={() => handleWeightUnitChange(u)}
											class="join-item btn btn-xs transition-all {draftWeightUnit === u ? 'btn-primary font-bold shadow-xs' : 'btn-ghost text-base-content/60'}"
										>
											{u}
										</button>
									{/each}
								</div>
							</div>

							<!-- Min Weight Slider -->
							<div class="space-y-1">
								<div class="flex items-center justify-between text-xs text-base-content/70">
									<span>Min Weight:</span>
									<span class="font-extrabold text-base-content">{draftMinWeight} {draftWeightUnit}</span>
								</div>
								<input
									type="range"
									min="0"
									max={weightSliderMax}
									step={weightSliderStep}
									bind:value={draftMinWeight}
									class="range range-xs range-primary w-full cursor-pointer"
								/>
							</div>

							<!-- Max Weight Slider -->
							<div class="space-y-1">
								<div class="flex items-center justify-between text-xs text-base-content/70">
									<span>Max Weight:</span>
									<span class="font-extrabold text-base-content">{draftMaxWeight} {draftWeightUnit}</span>
								</div>
								<input
									type="range"
									min="0"
									max={weightSliderMax}
									step={weightSliderStep}
									bind:value={draftMaxWeight}
									class="range range-xs range-primary w-full cursor-pointer"
								/>
							</div>

							<!-- Popover Footer -->
							<div class="flex items-center justify-between pt-2.5 border-t border-base-300">
								<button
									type="button"
									onclick={resetWeightFilter}
									class="btn btn-xs btn-ghost text-base-content/60 font-semibold cursor-pointer"
								>
									Reset Weight
								</button>
								<button
									type="button"
									onclick={applyWeightFilter}
									class="btn btn-xs btn-primary font-bold shadow-xs cursor-pointer"
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
					class="btn btn-xs btn-error btn-outline rounded-xl flex items-center gap-1 font-bold transition-all duration-200 cursor-pointer {hasActiveFilters ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}"
					title="Clear all active filters"
				>
					<RotateCcw class="w-3.5 h-3.5" />
					<span>Clear Filters</span>
				</button>
			</div>
		</div>

		<!-- ACTIVE FILTER CHIPS / TAGS BAR -->
		{#if hasActiveFilters}
			<div class="flex items-center gap-1.5 flex-wrap pt-2 border-t border-base-300 text-xs">
				<span class="text-[11px] font-extrabold uppercase tracking-wider text-base-content/50 mr-1">Active:</span>
				
				{#if filterSearchQuery.trim()}
					<span class="badge badge-primary gap-1.5 font-bold py-2 px-2.5 text-xs">
						<span>Search: "{filterSearchQuery}"</span>
						<button type="button" onclick={() => resetSingleFilter('search')} class="hover:opacity-75 cursor-pointer" aria-label="Remove search filter"><X class="w-3 h-3" /></button>
					</span>
				{/if}

				{#if filterFormType !== 'all'}
					<span class="badge badge-secondary gap-1.5 font-bold py-2 px-2.5 text-xs">
						<span>Form: {filterFormType}</span>
						<button type="button" onclick={() => resetSingleFilter('formType')} class="hover:opacity-75 cursor-pointer" aria-label="Remove form type filter"><X class="w-3 h-3" /></button>
					</span>
				{/if}

				{#if filterClayBody !== 'all'}
					<span class="badge badge-accent gap-1.5 font-bold py-2 px-2.5 text-xs">
						<span>Clay: {filterClayBody}</span>
						<button type="button" onclick={() => resetSingleFilter('clayBody')} class="hover:opacity-75 cursor-pointer" aria-label="Remove clay body filter"><X class="w-3 h-3" /></button>
					</span>
				{/if}

				{#if filterGlaze !== 'all'}
					<span class="badge badge-info gap-1.5 font-bold py-2 px-2.5 text-xs">
						<span>Glaze: {filterGlaze === 'unglazed' ? 'Unglazed' : filterGlaze}</span>
						<button type="button" onclick={() => resetSingleFilter('glaze')} class="hover:opacity-75 cursor-pointer" aria-label="Remove glaze filter"><X class="w-3 h-3" /></button>
					</span>
				{/if}

				{#if filterTargetCone !== 'all'}
					<span class="badge badge-warning gap-1.5 font-bold py-2 px-2.5 text-xs">
						<span>Cone: {filterTargetCone}</span>
						<button type="button" onclick={() => resetSingleFilter('targetCone')} class="hover:opacity-75 cursor-pointer" aria-label="Remove target cone filter"><X class="w-3 h-3" /></button>
					</span>
				{/if}

				{#if filterDueDate !== 'all'}
					<span class="badge badge-error gap-1.5 font-bold py-2 px-2.5 text-xs">
						<span>Due: {filterDueDate === 'overdue' ? 'Late / Overdue' : filterDueDate === 'due_today' ? 'Due Today' : filterDueDate === 'less_than_1_week' ? '< 1 Week' : filterDueDate === 'less_than_2_weeks' ? '< 2 Weeks' : filterDueDate === 'has_due_date' ? 'Has Date' : 'No Date'}</span>
						<button type="button" onclick={() => resetSingleFilter('dueDate')} class="hover:opacity-75 cursor-pointer" aria-label="Remove due date filter"><X class="w-3 h-3" /></button>
					</span>
				{/if}

				{#if filterWeightEnabled}
					<span class="badge badge-primary badge-outline gap-1.5 font-bold py-2 px-2.5 text-xs">
						<span>Weight: {appliedMinWeight}–{appliedMaxWeight} {appliedWeightUnit}</span>
						<button type="button" onclick={() => resetSingleFilter('weight')} class="hover:opacity-75 cursor-pointer" aria-label="Remove weight filter"><X class="w-3 h-3" /></button>
					</span>
				{/if}

				<button
					type="button"
					onclick={clearAllFilters}
					class="btn btn-ghost btn-xs text-xs font-bold text-base-content/60 underline ml-1 cursor-pointer"
				>
					Reset all ({filteredPieces.length} found)
				</button>
			</div>
		{/if}
	</div>

	<!-- MOBILE/TABLET STAGE SELECTOR TABS (Visible under 1400px width `< 2xl`) -->
	<div class="w-full overflow-x-auto pb-2 pt-0.5 no-scrollbar flex-shrink-0 2xl:hidden">
		<div class="tabs tabs-boxed bg-base-200 border border-base-300 p-1 flex items-center justify-start gap-1 w-max min-w-full">
			<button
				type="button"
				onclick={() => mobileActiveStage = 'all'}
				class="tab tab-sm font-bold gap-1.5 whitespace-nowrap {mobileActiveStage === 'all' ? 'tab-active btn-primary' : 'text-base-content/70'}"
			>
				<span>All Stages</span>
				<span class="badge badge-sm badge-neutral">
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
					class="tab tab-sm font-bold gap-1.5 whitespace-nowrap {mobileActiveStage === stageInfo.id ? 'tab-active btn-primary' : 'text-base-content/70'}"
				>
					<span>{stageInfo.icon}</span>
					<span>{stageInfo.label}</span>
					<span class="badge badge-sm {stageInfo.badgeColor} font-bold">
						{count}
					</span>
				</button>
			{/each}
		</div>
	</div>

	<!-- STREAMLINED 6-STAGE RESPONSIVE KANBAN BOARD CONTAINER -->
	<div bind:this={boardContainerRef} class="w-full flex-1 min-h-0 flex flex-col overflow-x-auto {touchDragActive ? 'snap-none scroll-auto' : 'snap-x snap-mandatory scroll-smooth'} pb-2">
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
						ondragover={(e) => handleDragOver(e, stageInfo.id)}
						ondragenter={(e) => handleDragOver(e, stageInfo.id)}
						ondragleave={(e) => handleDragLeave(e, stageInfo.id)}
						ondrop={(e) => handleDrop(e, stageInfo.id)}
					>
					
					<!-- Column Header -->
					<div class="flex items-center justify-between px-2 py-1.5 border-b border-base-300 mb-2.5 flex-shrink-0">
						<div class="flex items-center gap-2">
							<span class="text-base">{stageInfo.icon}</span>
							<h3 class="font-display text-xs font-extrabold text-base-content tracking-tight">{stageInfo.label}</h3>
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
								<!-- DAISYUI NATIVE STACKED BATCH CARD CONTAINER -->
								<div 
									role="region"
									aria-label="Stacked batch card"
									data-card-group-key={groupKey}
									aria-grabbed={draggedBatchKey === `${group.batchId}::${stageInfo.id}::${group.glazeSignature}`}
									class="stack w-full my-2 transition-transform duration-200 {isCardHovered ? 'scale-[1.02]' : ''}"
									ondragover={(e) => handleCardDragOver(e, group)}
									ondragleave={(e) => handleCardDragLeave(e, group)}
									ondrop={(e) => handleCardDrop(e, group)}
								>
									<!-- Front Primary Batch Card (Layer 1) -->
									<div class="ceramic-card-aura relative z-10">
										<div 
											role="listitem"
											data-card-group-key={groupKey}
											aria-grabbed={draggedBatchKey === `${group.batchId}::${stageInfo.id}::${group.glazeSignature}`}
											draggable={false}
											onpointerdown={(e) => handlePointerDownBatch(e, group.batchId!, stageInfo.id, group.glazeSignature || '', group.batchTitle || 'Batch')}
											class="ceramic-card relative z-10 snap-start p-3.5 rounded-xl border border-base-300 border-l-4 border-l-primary group space-y-3 cursor-grab active:cursor-grabbing select-none shadow-lg min-w-0 {group.primaryPiece.is_failed ? 'border-2 border-error bg-error/10 border-l-4 border-l-error shadow-error/10' : ''} {draggedBatchKey === `${group.batchId}::${stageInfo.id}::${group.glazeSignature}` ? 'opacity-40 scale-95 border-dashed border-primary' : ''} {isCardHovered ? 'ring-2 ring-primary border-primary bg-primary/15' : ''}"
										>
										<!-- Merge Hover Highlight Banner -->
										{#if isCardHovered}
											<div class="bg-primary text-primary-content text-[10px] font-extrabold px-2.5 py-1 rounded-md text-center shadow-md animate-pulse flex items-center justify-center gap-1">
												<Layers2 class="w-3.5 h-3.5" />
												<span>Drop card to merge into batch!</span>
											</div>
										{/if}

										<!-- Stacked Visual Indicator Badge & Drag Handle -->
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
												onclick={() => selectedPiece = group.primaryPiece}
												class="w-full h-28 rounded-lg overflow-hidden relative bg-base-200 border border-base-300 text-left cursor-pointer group/photo block"
												title="Click to view details & photos"
											>
												<img src={group.primaryPiece.initial_photo_url} alt={group.batchTitle} draggable={false} class="w-full h-full object-cover group-hover/photo:scale-105 transition duration-300 pointer-events-none select-none" />
												<span class="absolute bottom-2 left-2 text-[10px] font-bold badge badge-neutral gap-1">
													<Boxes class="w-3 h-3 text-primary" />
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
												<h4 class="font-display font-extrabold text-sm text-base-content group-hover/title:text-primary transition leading-snug truncate">
													{group.batchTitle}
												</h4>
											</button>
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
													onclick={() => selectedPiece = group.primaryPiece}
													class="btn btn-xs btn-ghost p-1"
													title="View Details"
												>
													<Info class="w-3.5 h-3.5" />
												</button>

												<button 
													type="button"
													data-action-button
													onclick={() => openSplitBatchModal(group.batchId!, stageInfo.id)}
													class="btn btn-xs btn-warning btn-outline gap-1 font-bold"
													title="Split Batch or Glaze Jobs Separately"
												>
													<GitFork class="w-3 h-3" />
													<span>Split Jobs</span>
												</button>
											</div>

											{#if stageInfo.id !== 'done'}
												<button 
													type="button"
													data-action-button
													onclick={() => advanceBatchGroupStage(group)}
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
									<div class="ceramic-card bg-base-200 border border-base-300 h-full w-full pointer-events-none opacity-90 rounded-xl"></div>

									<!-- Stack Layer 3 (Back Stack Card) -->
									<div class="ceramic-card bg-base-300 border border-base-300 h-full w-full pointer-events-none opacity-80 rounded-xl"></div>
								</div>
							{:else}
								<!-- SINGLE PIECE CARD -->
								{@const piece = group.primaryPiece}
								<div class="ceramic-card-aura">
									<div 
										role="listitem"
										data-card-group-key={groupKey}
										aria-grabbed={draggedPieceId === piece.id}
										draggable={false}
										onpointerdown={(e) => handlePointerDownPiece(e, piece.id, piece.title)}
										ondragover={(e) => handleCardDragOver(e, group)}
										ondragleave={(e) => handleCardDragLeave(e, group)}
										ondrop={(e) => handleCardDrop(e, group)}
										class="ceramic-card snap-start p-3.5 rounded-xl transition group relative space-y-3 cursor-grab active:cursor-grabbing select-none min-w-0 {piece.is_failed ? 'border-2 border-error bg-error/10 shadow-md shadow-error/10' : 'border border-base-300'} {draggedPieceId === piece.id ? 'opacity-40 scale-95 border-dashed border-primary' : ''} {isCardHovered ? 'ring-2 ring-primary border-primary bg-primary/15 scale-[1.02]' : ''}"
									>
									<!-- Merge Hover Highlight Banner -->
									{#if isCardHovered}
										<div class="bg-primary text-primary-content text-[10px] font-extrabold px-2.5 py-1 rounded-md text-center shadow-md animate-pulse flex items-center justify-center gap-1">
											<Layers2 class="w-3.5 h-3.5" />
											<span>Drop card to merge into batch!</span>
										</div>
									{/if}

									<!-- Failed Header Banner -->
									{#if piece.is_failed}
										<div class="alert alert-error p-2 text-[10px] font-extrabold flex items-center justify-between">
											<div class="flex items-center gap-1.5 truncate">
												<AlertTriangle class="w-3.5 h-3.5 flex-shrink-0" />
												<span>FAILED AT {piece.failure_stage?.toUpperCase() || 'STAGE'}</span>
											</div>
											{#if piece.failure_reason}
												<span class="truncate max-w-[130px] font-medium text-[9.5px] italic" title={piece.failure_reason}>"{piece.failure_reason}"</span>
											{/if}
										</div>
									{/if}

									<!-- Thumbnail / Photo -->
									{#if piece.initial_photo_url}
										<button 
											type="button"
											onclick={() => selectedPiece = piece}
											class="w-full h-32 rounded-lg overflow-hidden relative bg-base-200 border border-base-300 text-left cursor-pointer group/photo block"
											title="Click to view details & photos"
										>
											<img src={piece.initial_photo_url} alt={piece.title} draggable={false} class="w-full h-full object-cover group-hover/photo:scale-105 transition duration-300 pointer-events-none select-none" />
											<span class="absolute bottom-2 left-2 text-[10px] font-bold badge badge-neutral">
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
												<h4 class="font-display font-bold text-sm text-base-content group-hover/title:text-primary transition leading-snug truncate">
													{piece.title}
												</h4>
											</button>
											<div class="flex items-center gap-1.5 flex-wrap text-[11px] text-success font-medium mt-0.5">
												<span>{piece.clay_body_name}</span>
												{#if piece.weight_grams}
													<span class="badge badge-xs badge-ghost border border-base-300 font-bold">
														{formatClayWeight(piece.weight_grams)}
													</span>
												{/if}
											</div>
											{#if piece.notes || piece.description}
												<p class="text-[10px] text-base-content/70 italic mt-1 line-clamp-2">
													"{piece.notes || piece.description}"
												</p>
											{/if}
										</div>
										<span class="badge badge-accent badge-sm font-semibold text-[10px]">
											{piece.target_glaze_cone}
										</span>
									</div>

									<!-- Piece Dates Bar -->
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
										<div class="pt-2 border-t border-base-300 space-y-1.5">
											<span class="text-[10px] font-semibold text-base-content/70 block">Tagged Glazes:</span>
											<div class="flex flex-col gap-1">
												{#each piece.glaze_layers as gl}
													<div class="text-[10px] font-medium px-2 py-1 rounded bg-base-200 text-base-content border border-base-300 flex items-center justify-between">
														<div class="flex items-center gap-1.5 truncate">
															<span class="badge badge-xs badge-primary font-bold">
																{gl.manufacturer}
															</span>
															<span class="truncate font-semibold">{gl.glaze_name}</span>
														</div>
														<span class="text-[9px] text-base-content/70 capitalize flex items-center gap-1">
															<span>{gl.coat_count}c ({gl.application_method})</span>
															{#if gl.location}
																<span class="badge badge-xs badge-ghost text-[8.5px]">
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
									<div class="pt-3 border-t border-base-300 flex items-center justify-between text-xs">
										<div class="flex items-center gap-1">
											<button 
												type="button"
												data-action-button
												onclick={() => selectedPiece = piece}
												class="btn btn-xs btn-ghost p-1"
												title="Glazes & Photo History"
											>
												<Info class="w-3.5 h-3.5" />
											</button>

											<button 
												type="button"
												data-action-button
												onclick={() => openDuplicateModal(piece)}
												class="btn btn-xs btn-ghost p-1 text-primary"
												title="Duplicate Piece"
											>
												<Copy class="w-3.5 h-3.5" />
											</button>

											{#if !piece.is_failed}
												<button 
													type="button"
													data-action-button
													onclick={() => openFailModal(piece)}
													class="btn btn-xs btn-ghost p-1 text-error"
													title="Flag Firing Failure"
												>
													<ShieldAlert class="w-3.5 h-3.5" />
												</button>
											{/if}
										</div>

										<div class="flex items-center gap-1">
											{#if piece.is_failed}
												<button 
													type="button"
													data-action-button
													onclick={() => restoreFailedPiece(piece.id)}
													class="btn btn-xs btn-success btn-outline gap-1 font-bold"
													title="Restore piece back to active lifecycle"
												>
													<RotateCcw class="w-3 h-3" />
													<span>Restore</span>
												</button>
											{:else if piece.stage !== 'done'}
												<button 
													type="button"
													data-action-button
													onclick={() => advancePieceStage(piece.id)}
													class="btn btn-xs btn-success btn-outline gap-1 font-bold"
												>
													<span>Next</span>
													<ArrowRight class="w-3 h-3" />
												</button>
											{/if}
										</div>
									</div>
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
</div>

<!-- MOBILE FILTER DRAWER MODAL -->
{#if isMobileFilterDrawerOpen}
	<div 
		role="dialog" 
		aria-modal="true"
		tabindex="-1"
		onclick={(e) => { if (e.target === e.currentTarget) isMobileFilterDrawerOpen = false; }}
		onkeydown={(e) => { if (e.key === 'Escape') isMobileFilterDrawerOpen = false; }}
		class="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity duration-300 cursor-pointer"
	>
		<div class="w-full max-w-sm bg-base-100 h-full flex flex-col shadow-2xl border-l border-base-300 text-base-content">
			<!-- Drawer Header -->
			<div class="p-4 border-b border-base-300 flex items-center justify-between bg-base-200/50">
				<div class="flex items-center gap-2">
					<SlidersHorizontal class="w-5 h-5 text-primary" />
					<h3 class="font-display font-extrabold text-base text-base-content">Filter Pieces</h3>
				</div>
				<button
					type="button"
					onclick={() => isMobileFilterDrawerOpen = false}
					class="btn btn-ghost btn-xs btn-square cursor-pointer"
					aria-label="Close filter drawer"
				>
					<X class="w-5 h-5" />
				</button>
			</div>

			<!-- Drawer Form Controls -->
			<div class="p-4 space-y-4 flex-1 overflow-y-auto touch-pan-y">
				<!-- Search -->
				<div class="space-y-1.5">
					<label for="drawer-search-input" class="block text-xs font-extrabold uppercase tracking-wider text-base-content/70">Search Query</label>
					<div class="relative">
						<Search class="w-4 h-4 text-base-content/50 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
						<input
							id="drawer-search-input"
							type="text"
							bind:value={filterSearchQuery}
							placeholder="Search titles, notes, clay..."
							class="input input-sm input-bordered w-full pl-9 pr-8 bg-base-100 text-base-content"
						/>
						{#if filterSearchQuery}
							<button
								type="button"
								onclick={() => filterSearchQuery = ''}
								class="absolute right-2.5 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content cursor-pointer"
							>
								<X class="w-4 h-4" />
							</button>
						{/if}
					</div>
				</div>

				<!-- Form Type -->
				<div class="space-y-1.5">
					<label for="drawer-form-type" class="block text-xs font-extrabold uppercase tracking-wider text-base-content/70">Form Type</label>
					<select
						id="drawer-form-type"
						bind:value={filterFormType}
						class="select select-sm select-bordered w-full bg-base-100 text-base-content cursor-pointer"
					>
						<option value="all">All Form Types</option>
						{#each availablePieceTypes as typeName}
							<option value={typeName}>{typeName}</option>
						{/each}
					</select>
				</div>

				<!-- Clay Body -->
				<div class="space-y-1.5">
					<label for="drawer-clay-body" class="block text-xs font-extrabold uppercase tracking-wider text-base-content/70">Clay Body</label>
					<select
						id="drawer-clay-body"
						bind:value={filterClayBody}
						class="select select-sm select-bordered w-full bg-base-100 text-base-content cursor-pointer"
					>
						<option value="all">All Clay Bodies</option>
						{#each availableClayBodies as clayName}
							<option value={clayName}>{clayName}</option>
						{/each}
					</select>
				</div>

				<!-- Glaze -->
				<div class="space-y-1.5">
					<label for="drawer-glaze" class="block text-xs font-extrabold uppercase tracking-wider text-base-content/70">Glaze Application</label>
					<select
						id="drawer-glaze"
						bind:value={filterGlaze}
						class="select select-sm select-bordered w-full bg-base-100 text-base-content cursor-pointer"
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
					<label for="drawer-target-cone" class="block text-xs font-extrabold uppercase tracking-wider text-base-content/70">Firing Cone</label>
					<select
						id="drawer-target-cone"
						bind:value={filterTargetCone}
						class="select select-sm select-bordered w-full bg-base-100 text-base-content cursor-pointer"
					>
						<option value="all">All Cones</option>
						{#each availableCones as coneName}
							<option value={coneName}>{coneName}</option>
						{/each}
					</select>
				</div>

				<!-- Due Date -->
				<div class="space-y-1.5">
					<label for="drawer-due-date" class="block text-xs font-extrabold uppercase tracking-wider text-base-content/70">Due Date Status</label>
					<select
						id="drawer-due-date"
						bind:value={filterDueDate}
						class="select select-sm select-bordered w-full bg-base-100 text-base-content cursor-pointer"
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
				<div class="space-y-3 p-3.5 bg-base-200/50 rounded-xl border border-base-300">
					<div class="flex items-center justify-between">
						<label for="mobile-weight-range-min" class="block text-xs font-extrabold uppercase tracking-wider text-base-content/70">Clay Weight</label>
						<!-- Unit Selector Pills -->
						<div class="join bg-base-200 p-0.5 rounded-lg">
							{#each (['g', 'kg', 'oz', 'lbs'] as WeightUnit[]) as u}
								<button
									type="button"
									onclick={() => handleWeightUnitChange(u)}
									class="join-item btn btn-xs transition-all {draftWeightUnit === u ? 'btn-primary font-bold shadow-xs' : 'btn-ghost text-base-content/60'}"
								>
									{u}
								</button>
							{/each}
						</div>
					</div>

					<!-- Min Slider -->
					<div class="space-y-1 pt-1">
						<div class="flex items-center justify-between text-xs text-base-content/70">
							<span>Min Weight:</span>
							<span class="font-extrabold text-base-content">{draftMinWeight} {draftWeightUnit}</span>
						</div>
						<input
							id="mobile-weight-range-min"
							type="range"
							min="0"
							max={weightSliderMax}
							step={weightSliderStep}
							bind:value={draftMinWeight}
							class="range range-xs range-primary w-full cursor-pointer"
						/>
					</div>

					<!-- Max Slider -->
					<div class="space-y-1">
						<div class="flex items-center justify-between text-xs text-base-content/70">
							<span>Max Weight:</span>
							<span class="font-extrabold text-base-content">{draftMaxWeight} {draftWeightUnit}</span>
						</div>
						<input
							type="range"
							min="0"
							max={weightSliderMax}
							step={weightSliderStep}
							bind:value={draftMaxWeight}
							class="range range-xs range-primary w-full cursor-pointer"
						/>
					</div>

					<!-- Apply / Reset Weight Buttons -->
					<div class="flex items-center gap-2 pt-1.5">
						<button
							type="button"
							onclick={resetWeightFilter}
							class="btn btn-xs btn-ghost flex-1 text-base-content/60 font-semibold cursor-pointer"
						>
							Reset Weight
						</button>
						<button
							type="button"
							onclick={applyWeightFilter}
							class="btn btn-xs btn-primary flex-1 font-bold shadow-xs cursor-pointer"
						>
							Apply Weight
						</button>
					</div>
				</div>
			</div>

			<!-- Drawer Footer -->
			<div class="p-4 border-t border-base-300 bg-base-200/50 flex items-center gap-3">
				<button
					type="button"
					onclick={clearAllFilters}
					class="btn btn-sm btn-ghost flex-1 text-base-content/70 font-bold rounded-xl cursor-pointer"
				>
					Reset All
				</button>
				<button
					type="button"
					onclick={() => isMobileFilterDrawerOpen = false}
					class="btn btn-sm btn-primary flex-1 font-bold rounded-xl shadow-md cursor-pointer"
				>
					Apply ({filteredPieces.length})
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- MODAL 1: CREATE NEW CERAMIC PIECE -->
{#if isNewPieceModalOpen}
	<div 
		role="dialog" 
		aria-modal="true"
		tabindex="-1"
		onclick={(e) => { if (e.target === e.currentTarget) isNewPieceModalOpen = false; }}
		onkeydown={(e) => { if (e.key === 'Escape') isNewPieceModalOpen = false; }}
		class="modal modal-open"
	>
		<div class="modal-box max-w-lg bg-base-100 text-base-content border border-base-300 shadow-2xl p-6 rounded-2xl">
			<div class="flex items-center justify-between border-b border-base-300 pb-4">
				<div class="flex items-center gap-2">
					<Package class="w-5 h-5 text-primary" />
					<h3 class="font-display font-bold text-lg text-base-content">New Ceramic Piece</h3>
				</div>
				<button onclick={() => isNewPieceModalOpen = false} class="btn btn-sm btn-circle btn-ghost">
					<X class="w-4 h-4" />
				</button>
			</div>

			<form onsubmit={handleCreatePiece} class="space-y-4 text-xs mt-4">
				<div class="space-y-1.5">
					<label for="piece-title" class="text-base-content font-semibold">Piece Title</label>
					<input 
						id="piece-title"
						type="text" 
						bind:value={newTitle}
						placeholder="e.g. Fluted Amaco PC Mug, Handbuilt Ikebana Bowl" 
						class="input input-bordered input-sm w-full"
						required
					/>
				</div>

				<!-- MULTI-PIECE BATCH CREATION INPUTS -->
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-base-200 p-3 rounded-xl border border-base-300">
					<div class="space-y-1.5">
						<label for="piece-qty" class="text-base-content font-bold flex items-center gap-1">
							<Layers2 class="w-3.5 h-3.5 text-primary" />
							<span>Quantity (Duplicate Pieces)</span>
						</label>
						<input 
							id="piece-qty"
							type="number" 
							min="1"
							max="50"
							bind:value={newQuantity}
							class="input input-bordered input-sm w-full font-bold"
						/>
					</div>

					{#if newQuantity > 1}
						<div class="space-y-1.5">
							<label for="batch-title-input" class="text-base-content font-bold">Batch Title (Optional)</label>
							<input 
								id="batch-title-input"
								type="text" 
								bind:value={newBatchTitle}
								placeholder="e.g. 6x Espresso Mug Batch"
								class="input input-bordered input-sm w-full"
							/>
						</div>
					{/if}
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<div class="space-y-1.5 min-w-0">
						<label for="piece-type" class="text-base-content font-semibold block">Form Type</label>
						<select 
							id="piece-type"
							bind:value={newPieceType}
							class="select select-bordered select-sm w-full truncate"
						>
							{#each PIECE_TYPES as pt}
								<option value={pt.name}>{pt.name} ({pt.description})</option>
							{/each}
						</select>
					</div>

					<div class="space-y-1.5 min-w-0">
						<label for="target-glaze-cone-select" class="text-base-content font-semibold block">Target Glaze Cone</label>
						<select 
							id="target-glaze-cone-select"
							bind:value={newTargetGlazeCone}
							class="select select-bordered select-sm w-full truncate"
						>
							{#each PYROMETRIC_CONES as cone}
								<option value={cone.name}>
									{cone.name} ({cone.temp_f}°F / {cone.temp_c}°C)
								</option>
							{/each}
						</select>
					</div>
				</div>

				<div class="space-y-1.5 min-w-0">
					<div class="flex items-center justify-between flex-wrap gap-1">
						<label for="clay-select" class="text-base-content font-semibold">Clay Body</label>
						<button type="button" onclick={() => showClayLibraryModal = true} class="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1">
							<Package class="w-3 h-3" />
							<span>Manage Clay Bodies</span>
						</button>
					</div>
					<select 
						id="clay-select"
						bind:value={newClayBodyId}
						class="select select-bordered select-sm w-full truncate"
					>
						{#each clayBodies as clay}
							<option value={clay.id}>
								{clay.is_global ? '🌐 [Global]' : '👤 [Custom]'} {clay.name} ({clay.firing_range})
							</option>
						{/each}
					</select>
				</div>

				<!-- DESIRED GOAL DIMENSIONS & SHRINKAGE PREVIEW -->
				<div class="space-y-2 p-3 bg-base-200 rounded-xl border border-base-300">
					<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
						<label class="text-base-content font-bold flex items-center gap-1.5 text-xs min-w-0">
							<Ruler class="w-3.5 h-3.5 text-primary flex-shrink-0" />
							<span class="truncate sm:whitespace-normal">Desired Goal Dimensions (Final Fired Size in cm)</span>
						</label>
						{#if selectedClayForNewPiece}
							<span class="badge badge-primary badge-outline badge-sm self-start sm:self-auto flex-shrink-0">
								Shrinkage: {selectedClayForNewPiece.shrinkage_pct}%
							</span>
						{/if}
					</div>

					<div class="grid grid-cols-3 gap-2">
						<div class="space-y-1">
							<label for="piece-target-length" class="text-[10px] text-base-content/70 font-medium">Goal Length (cm)</label>
							<input 
								id="piece-target-length"
								type="number" 
								step="0.1" 
								min="0"
								bind:value={newTargetLength}
								placeholder="e.g. 10.0" 
								class="input input-bordered input-sm w-full"
							/>
						</div>
						<div class="space-y-1">
							<label for="piece-target-width" class="text-[10px] text-base-content/70 font-medium">Goal Width (cm)</label>
							<input 
								id="piece-target-width"
								type="number" 
								step="0.1" 
								min="0"
								bind:value={newTargetWidth}
								placeholder="e.g. 10.0" 
								class="input input-bordered input-sm w-full"
							/>
						</div>
						<div class="space-y-1">
							<label for="piece-target-height" class="text-[10px] text-base-content/70 font-medium">Goal Height (cm)</label>
							<input 
								id="piece-target-height"
								type="number" 
								step="0.1" 
								min="0"
								bind:value={newTargetHeight}
								placeholder="e.g. 12.5" 
								class="input input-bordered input-sm w-full"
							/>
						</div>
					</div>

					{#if newTargetLength || newTargetWidth || newTargetHeight}
						{@const shrinkPct = selectedClayForNewPiece ? selectedClayForNewPiece.shrinkage_pct : 12.0}
						{@const fLen = calculateFormedDimension(newTargetLength, shrinkPct)}
						{@const fWid = calculateFormedDimension(newTargetWidth, shrinkPct)}
						{@const fHgt = calculateFormedDimension(newTargetHeight, shrinkPct)}
						<div class="mt-2 p-2.5 rounded-lg bg-success/10 border border-success/30 text-xs space-y-1">
							<div class="flex flex-col sm:flex-row sm:items-center justify-between font-bold text-success gap-1">
								<span class="flex items-center gap-1">
									<Sparkles class="w-3.5 h-3.5 flex-shrink-0" />
									<span>Recommended Pre-Fire Build Target:</span>
								</span>
								<span class="badge badge-success badge-sm font-extrabold uppercase self-start sm:self-auto flex-shrink-0">
									+{((1 / (1 - shrinkPct/100) - 1) * 100).toFixed(1)}% Pre-Fire Target
								</span>
							</div>
							<div class="font-mono text-xs font-extrabold text-base-content">
								{#if fLen}<span>L: <strong class="text-primary">{fLen} cm</strong></span>{/if}
								{#if fLen && (fWid || fHgt)}<span class="text-base-content/40"> × </span>{/if}
								{#if fWid}<span>W: <strong class="text-primary">{fWid} cm</strong></span>{/if}
								{#if fWid && fHgt}<span class="text-base-content/40"> × </span>{/if}
								{#if fHgt}<span>H: <strong class="text-primary">{fHgt} cm</strong></span>{/if}
							</div>
							<p class="text-[10px] text-base-content/70 italic">
								Form/trim clay to these pre-fire dimensions so it shrinks to your goal size after {shrinkPct}% {selectedClayForNewPiece ? selectedClayForNewPiece.name : 'clay'} shrinkage.
							</p>
						</div>
					{/if}
				</div>

				<div class="space-y-1.5">
					<label for="piece-weight-amount" class="text-base-content font-semibold">Clay Weight Used (Formed Weight)</label>
					<div class="flex gap-2">
						<input 
							id="piece-weight-amount"
							type="number" 
							step="any"
							min="0"
							bind:value={newWeightAmount}
							placeholder="e.g. 550 or 1.5..." 
							class="input input-bordered input-sm flex-1"
						/>
						<select 
							bind:value={newWeightUnit}
							class="select select-bordered select-sm w-28"
						>
							<option value="g">grams (g)</option>
							<option value="kg">kilograms (kg)</option>
							<option value="lbs">pounds (lbs)</option>
							<option value="oz">ounces (oz)</option>
						</select>
					</div>
					{#if newWeightAmount && newWeightAmount > 0}
						<div class="text-[11px] font-semibold text-success">
							≈ {formatClayWeight(toGrams(newWeightAmount, newWeightUnit))}
						</div>
					{/if}
				</div>

				<div class="space-y-1.5">
					<span class="text-base-content font-semibold flex items-center gap-1.5 text-xs">
						<Calendar class="w-3.5 h-3.5 text-primary" />
						<span>Target Due Date (Optional)</span>
					</span>
					<CallyDatePicker
						bind:value={newDueDate}
						placeholder="Select due date..."
					/>
				</div>

				<div class="space-y-1.5">
					<label for="piece-notes-input" class="text-base-content font-semibold">Notes / Description (Optional)</label>
					<textarea 
						id="piece-notes-input"
						bind:value={newDescription}
						rows="2"
						placeholder="e.g. Fluted lip design, gift for Sarah, test glaze pairing..." 
						class="textarea textarea-bordered textarea-sm w-full"
					></textarea>
				</div>

				<div class="space-y-1.5">
					<label for="photo-url" class="text-base-content font-semibold">Initial Photo URL (Optional)</label>
					<input 
						id="photo-url"
						type="url" 
						bind:value={newInitialPhotoUrl}
						placeholder="https://..." 
						class="input input-bordered input-sm w-full"
					/>
				</div>

				<div class="modal-action border-t border-base-300 pt-4">
					<button 
						type="button" 
						onclick={() => isNewPieceModalOpen = false}
						class="btn btn-ghost btn-sm"
					>
						Cancel
					</button>
					<button 
						type="submit" 
						class="btn btn-primary btn-sm font-bold shadow-md"
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
							restoreFailedPiece(selectedPiece!.id);
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
						value={formatDateInput(selectedPiece.due_date)}
						placeholder="Set due date..."
						onchange={(valStr) => {
							const parsedDate = parseDateInput(valStr);
							selectedPiece = { ...selectedPiece!, due_date: parsedDate };
							pieces = pieces.map(p => p.id === selectedPiece!.id ? { ...p, due_date: parsedDate } : p);
							showToast(parsedDate ? `Updated due date to ${formatDateShort(parsedDate)}` : 'Cleared due date');
						}}
					/>
				</div>
			</div>

			<!-- Goal Dimensions & Clay Shrinkage Target Breakdown -->
			<div class="p-3.5 bg-base-200 my-3 rounded-xl border border-base-300 space-y-3 text-xs">
				<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
					<div class="flex items-center gap-1.5 font-bold text-base-content text-sm min-w-0">
						<Ruler class="w-4 h-4 text-primary flex-shrink-0" />
						<span class="truncate sm:whitespace-normal">Dimensions & Clay Shrinkage</span>
					</div>
					<span class="badge badge-primary badge-outline badge-sm self-start sm:self-auto flex-shrink-0">
						Clay Shrinkage: {selectedPieceShrinkPct}%
					</span>
				</div>

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
			<div class="p-3 bg-base-200 rounded-xl border border-base-300 space-y-1.5 text-xs">
				<div class="flex items-center justify-between">
					<span class="font-bold text-base-content flex items-center gap-1.5">
						<FileText class="w-4 h-4 text-primary" />
						<span>Piece Notes & Intent</span>
					</span>
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
					<p class="text-base-content/80 text-[11px] leading-relaxed italic">
						{selectedPiece.notes || selectedPiece.description || 'No notes added yet for this piece. Click "Edit Notes" to add artistic intent, dimensions, or firing notes.'}
					</p>
				{/if}
			</div>

			<!-- Glaze Tagging Section -->
			<div class="space-y-4">
				<div class="flex items-center justify-between">
					<h4 class="font-display font-bold text-sm text-base-content flex items-center gap-2">
						<Droplets class="w-4 h-4 text-success" />
						<span>Applied Glaze Tagging</span>
					</h4>
				</div>

				{#if selectedPiece.glaze_layers && selectedPiece.glaze_layers.length > 0}
					<div class="space-y-2">
						{#each selectedPiece.glaze_layers as gl, i}
							<div class="bg-base-200 p-3 rounded-xl border border-base-300 flex items-center justify-between text-xs">
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
							</div>
						{/each}
					</div>
				{/if}

				<!-- Tag Glaze Form -->
				<div class="p-4 bg-base-200 rounded-xl border border-base-300 space-y-3 text-xs">
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
							<span>Tag Glaze Layer</span>
						</button>
					</div>
				</div>
			</div>

			<!-- Stage Timeline & Photo Log -->
			<div class="space-y-3 pt-4 border-t border-base-300">
				<h4 class="font-display font-bold text-sm text-base-content flex items-center gap-2">
					<Camera class="w-4 h-4 text-primary" />
					<span>Stage Snapshots & Photo History</span>
				</h4>

				{#if selectedPiece.stage_logs && selectedPiece.stage_logs.length > 0}
					<div class="space-y-3">
						{#each selectedPiece.stage_logs as log}
							<div class="bg-base-200 p-3.5 rounded-xl border border-base-300 space-y-2 text-xs">
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

				<div class="space-y-2 p-3 bg-base-200 rounded-xl border border-base-300 text-xs">
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
		</div>
	</div>
{/if}

<!-- MODAL 3: GLAZE LIBRARY MANAGER -->
{#if showGlazeLibraryModal}
	<div 
		role="dialog" 
		aria-modal="true"
		tabindex="-1"
		onclick={(e) => { if (e.target === e.currentTarget) showGlazeLibraryModal = false; }}
		onkeydown={(e) => { if (e.key === 'Escape') showGlazeLibraryModal = false; }}
		class="modal modal-open"
	>
		<div class="modal-box max-w-2xl bg-base-100 text-base-content border border-base-300 shadow-2xl p-6 rounded-2xl max-h-[90vh] overflow-y-auto">
			<div class="flex items-center justify-between border-b border-base-300 pb-4">
				<div class="flex items-center gap-2 text-base-content">
					<Palette class="w-5 h-5 text-success" />
					<h3 class="font-display font-bold text-lg">Studio Glaze Library</h3>
				</div>
				<button onclick={() => showGlazeLibraryModal = false} class="btn btn-sm btn-circle btn-ghost">
					<X class="w-4 h-4" />
				</button>
			</div>

			<!-- Studio Glaze Library Stats Component -->
			<div class="stats stats-horizontal w-full bg-base-200/60 border border-base-300 shadow-xs rounded-xl my-4 text-center">
				<div class="stat p-2">
					<div class="stat-title text-[10px] font-extrabold uppercase text-base-content/60">Total Glazes</div>
					<div class="stat-value text-base font-extrabold text-success">{glazes.length}</div>
				</div>
				<div class="stat p-2 border-l border-base-300">
					<div class="stat-title text-[10px] font-extrabold uppercase text-base-content/60">Global Recipes</div>
					<div class="stat-value text-base font-extrabold text-primary">{glazes.filter(g => g.is_global).length}</div>
				</div>
				<div class="stat p-2 border-l border-base-300">
					<div class="stat-title text-[10px] font-extrabold uppercase text-base-content/60">Cone 5–6</div>
					<div class="stat-value text-base font-extrabold text-warning">{glazes.filter(g => (g.max_cone || '').includes('6') || (g.min_cone || '').includes('5')).length}</div>
				</div>
			</div>

			<div class="space-y-3 my-4">
				<h4 class="text-xs font-bold text-base-content/70 uppercase tracking-wider">Available Predefined & Custom Glazes</h4>
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
					{#each glazes as g}
						<div class="bg-base-200 p-3.5 rounded-xl border border-base-300 space-y-2">
							<div class="flex items-center justify-between">
								<span class="badge badge-primary badge-xs font-bold uppercase">
									{g.manufacturer}
								</span>
								<span class="badge badge-neutral badge-xs font-bold">
									{g.min_cone || 'Cone 5'} – {g.max_cone || 'Cone 6'}
								</span>
							</div>
							<h5 class="font-display font-bold text-base-content">{g.name}</h5>
							<p class="text-base-content/70 text-[11px] leading-relaxed">{g.notes}</p>
							<div class="pt-2 border-t border-base-300 flex justify-between text-[10px] text-base-content/60">
								<span>Style: <strong class="text-base-content capitalize">{g.default_style}</strong></span>
								<span>Scope: <strong class="text-success">{g.is_global ? 'Global' : 'Custom'}</strong></span>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<form onsubmit={handleAddCustomLibraryGlaze} class="pt-4 border-t border-base-300 space-y-3 text-xs">
				<span class="font-bold text-base-content block">Add Custom Glaze to Library:</span>
				<div class="grid grid-cols-2 gap-3">
					<input 
						type="text" 
						bind:value={newLibraryGlazeName}
						placeholder="Glaze Name (e.g. Iron Red Satin)..." 
						class="input input-bordered input-sm w-full"
						required
					/>
					<select 
						bind:value={newLibraryManufacturer}
						class="select select-bordered select-sm w-full"
					>
						{#each MANUFACTURERS as mfr}
							<option value={mfr.name}>{mfr.name}</option>
						{/each}
					</select>
				</div>
				<div class="grid grid-cols-3 gap-3">
					<div class="space-y-1">
						<label for="lib-style-select" class="text-base-content/70 text-[10px]">Application Style</label>
						<select 
							id="lib-style-select"
							bind:value={newLibraryStyle}
							class="select select-bordered select-sm w-full"
						>
							<option value="brush">Brush Style</option>
							<option value="dip">Dipping Bucket</option>
							<option value="spray">Spray Style</option>
							<option value="underglaze">Underglaze</option>
						</select>
					</div>

					<div class="space-y-1">
						<label for="lib-min-cone" class="text-base-content/70 text-[10px]">Min Firing Cone</label>
						<select 
							id="lib-min-cone"
							bind:value={newLibraryMinCone}
							class="select select-bordered select-sm w-full"
						>
							{#each PYROMETRIC_CONES as cone}
								<option value={cone.name}>{cone.name}</option>
							{/each}
						</select>
					</div>

					<div class="space-y-1">
						<label for="lib-max-cone" class="text-base-content/70 text-[10px]">Max Firing Cone</label>
						<select 
							id="lib-max-cone"
							bind:value={newLibraryMaxCone}
							class="select select-bordered select-sm w-full"
						>
							{#each PYROMETRIC_CONES as cone}
								<option value={cone.name}>{cone.name}</option>
							{/each}
						</select>
					</div>
				</div>
				<div class="flex justify-end pt-2">
					<button type="submit" class="btn btn-sm btn-success text-success-content font-bold shadow">
						Add Glaze to Library
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- MODAL 3.5: CLAY BODY LIBRARY MANAGER -->
{#if showClayLibraryModal}
	<div 
		role="dialog" 
		aria-modal="true"
		tabindex="-1"
		onclick={(e) => { if (e.target === e.currentTarget) showClayLibraryModal = false; }}
		onkeydown={(e) => { if (e.key === 'Escape') showClayLibraryModal = false; }}
		class="modal modal-open"
	>
		<div class="modal-box max-w-2xl bg-base-100 text-base-content border border-base-300 shadow-2xl p-6 rounded-2xl max-h-[90vh] overflow-y-auto">
			<div class="flex items-center justify-between border-b border-base-300 pb-4">
				<div class="flex items-center gap-2 text-base-content">
					<Package class="w-5 h-5 text-primary" />
					<h3 class="font-display font-bold text-lg">Studio Clay Body Library</h3>
				</div>
				<button onclick={() => showClayLibraryModal = false} class="btn btn-sm btn-circle btn-ghost">
					<X class="w-4 h-4" />
				</button>
			</div>

			<!-- Studio Clay Library Stats Component -->
			<div class="stats stats-horizontal w-full bg-base-200/60 border border-base-300 shadow-xs rounded-xl my-4 text-center">
				<div class="stat p-2">
					<div class="stat-title text-[10px] font-extrabold uppercase text-base-content/60">Clay Bodies</div>
					<div class="stat-value text-base font-extrabold text-primary">{clayBodies.length}</div>
				</div>
				<div class="stat p-2 border-l border-base-300">
					<div class="stat-title text-[10px] font-extrabold uppercase text-base-content/60">Stoneware</div>
					<div class="stat-value text-base font-extrabold text-secondary">{clayBodies.filter(c => c.name.toLowerCase().includes('stoneware') || (c.notes || '').toLowerCase().includes('stoneware')).length}</div>
				</div>
				<div class="stat p-2 border-l border-base-300">
					<div class="stat-title text-[10px] font-extrabold uppercase text-base-content/60">Avg Shrinkage</div>
					<div class="stat-value text-base font-extrabold text-accent">{(clayBodies.reduce((acc, c) => acc + c.shrinkage_pct, 0) / (clayBodies.length || 1)).toFixed(1)}%</div>
				</div>
			</div>

			<div class="space-y-3 my-4">
				<h4 class="text-xs font-bold text-base-content/70 uppercase tracking-wider">Available Clay Bodies</h4>
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
					{#each clayBodies as cb}
						<div class="bg-base-200 p-3.5 rounded-xl border border-base-300 space-y-2">
							<div class="flex items-center justify-between">
								<span class="badge badge-primary badge-xs font-bold uppercase">
									{cb.manufacturer || 'Custom'}
								</span>
								<span class="badge badge-neutral badge-xs font-bold">
									{cb.firing_range}
								</span>
							</div>
							<h5 class="font-display font-bold text-base-content">{cb.name}</h5>
							<div class="grid grid-cols-3 gap-1 text-[11px] text-base-content/70">
								<span>Shrinkage: <strong class="text-base-content">{cb.shrinkage_pct}%</strong></span>
								<span>Raw Color: <strong class="text-base-content">{cb.raw_color}</strong></span>
								<span>Fired Color: <strong class="text-base-content">{cb.fired_color}</strong></span>
							</div>
							{#if cb.notes}
								<p class="text-base-content/70 text-[11px] leading-relaxed pt-1 border-t border-base-300">{cb.notes}</p>
							{/if}
							<div class="pt-2 border-t border-base-300 flex justify-between text-[10px] text-base-content/60">
								<span>Scope: <strong class="text-success">{cb.is_global ? 'Global' : 'Custom'}</strong></span>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<form onsubmit={handleAddCustomLibraryClay} class="pt-4 border-t border-base-300 space-y-3 text-xs">
				<span class="font-bold text-base-content block">Add Custom Clay Body to Library:</span>
				<div class="grid grid-cols-2 gap-3">
					<div class="space-y-1">
						<label for="lib-clay-name" class="text-base-content/70 text-[10px]">Clay Body Name</label>
						<input 
							id="lib-clay-name"
							type="text" 
							bind:value={newLibraryClayName}
							placeholder="e.g. Red Stoneware 266..." 
							class="input input-bordered input-sm w-full"
							required
						/>
					</div>
					<div class="space-y-1">
						<label for="lib-clay-mfr" class="text-base-content/70 text-[10px]">Manufacturer</label>
						<select 
							id="lib-clay-mfr"
							bind:value={newLibraryClayManufacturer}
							class="select select-bordered select-sm w-full"
						>
							{#each MANUFACTURERS as mfr}
								<option value={mfr.name}>{mfr.name}</option>
							{/each}
						</select>
					</div>
				</div>

				<div class="grid grid-cols-3 gap-3">
					<div class="space-y-1">
						<label for="lib-clay-mincone" class="text-base-content/70 text-[10px]">Min Firing Cone</label>
						<select 
							id="lib-clay-mincone"
							bind:value={newLibraryClayMinCone}
							class="select select-bordered select-sm w-full"
						>
							{#each PYROMETRIC_CONES as cone}
								<option value={cone.name}>{cone.name}</option>
							{/each}
						</select>
					</div>
					<div class="space-y-1">
						<label for="lib-clay-maxcone" class="text-base-content/70 text-[10px]">Max Firing Cone</label>
						<select 
							id="lib-clay-maxcone"
							bind:value={newLibraryClayMaxCone}
							class="select select-bordered select-sm w-full"
						>
							{#each PYROMETRIC_CONES as cone}
								<option value={cone.name}>{cone.name}</option>
							{/each}
						</select>
					</div>
					<div class="space-y-1">
						<label for="lib-clay-shrinkage" class="text-base-content/70 text-[10px]">Shrinkage %</label>
						<input 
							id="lib-clay-shrinkage"
							type="number" 
							step="0.1" 
							bind:value={newLibraryClayShrinkage}
							class="input input-bordered input-sm w-full"
						/>
					</div>
				</div>

				<div class="grid grid-cols-2 gap-3">
					<div class="space-y-1">
						<label for="lib-clay-rawcolor" class="text-base-content/70 text-[10px]">Raw Color</label>
						<input 
							id="lib-clay-rawcolor"
							type="text" 
							bind:value={newLibraryClayRawColor}
							placeholder="e.g. Grey" 
							class="input input-bordered input-sm w-full"
						/>
					</div>
					<div class="space-y-1">
						<label for="lib-clay-firedcolor" class="text-base-content/70 text-[10px]">Fired Color</label>
						<input 
							id="lib-clay-firedcolor"
							type="text" 
							bind:value={newLibraryClayFiredColor}
							placeholder="e.g. Dark Red-Brown" 
							class="input input-bordered input-sm w-full"
						/>
					</div>
				</div>

				<div class="space-y-1">
					<label for="lib-clay-notes" class="text-base-content/70 text-[10px]">Notes / Characteristics</label>
					<input 
						id="lib-clay-notes"
						type="text" 
						bind:value={newLibraryClayNotes}
						placeholder="e.g. High grog content for large sculptural throwing..." 
						class="input input-bordered input-sm w-full"
					/>
				</div>

				<div class="flex justify-end pt-2">
					<button type="submit" class="btn btn-sm btn-primary font-bold shadow">
						Add Clay Body to Library
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- MODAL 4: FULL PYROMETRIC CONE TEMPERATURE EQUIVALENTS CHART -->
{#if showPyrometricChartModal}
	<div 
		role="dialog" 
		aria-modal="true"
		tabindex="-1"
		onclick={(e) => { if (e.target === e.currentTarget) showPyrometricChartModal = false; }}
		onkeydown={(e) => { if (e.key === 'Escape') showPyrometricChartModal = false; }}
		class="modal modal-open"
	>
		<div class="modal-box max-w-3xl bg-base-100 text-base-content border border-base-300 shadow-2xl p-6 rounded-2xl max-h-[90vh] overflow-y-auto">
			<div class="flex items-center justify-between border-b border-base-300 pb-4">
				<div class="flex items-center gap-2 text-base-content">
					<Flame class="w-5 h-5 text-warning" />
					<h3 class="font-display font-bold text-lg">Pyrometric Cone Temperature Equivalents</h3>
				</div>
				<button onclick={() => showPyrometricChartModal = false} class="btn btn-sm btn-circle btn-ghost">
					<X class="w-4 h-4" />
				</button>
			</div>

			<p class="text-xs text-base-content/70 my-3">
				Standard Orton / Skutt kiln firing temperatures rated at 108°F/hr during final heating:
			</p>

			<!-- Key Firing Cone Temperatures Stats Component -->
			<div class="stats stats-horizontal w-full bg-base-200/60 border border-base-300 shadow-xs rounded-xl my-3 text-center">
				<div class="stat p-2">
					<div class="stat-title text-[10px] font-extrabold uppercase text-base-content/60">Bisque (Cone 06)</div>
					<div class="stat-value text-base font-extrabold text-info">1828°F</div>
					<div class="stat-desc text-[10px]">998°C</div>
				</div>
				<div class="stat p-2 border-l border-base-300">
					<div class="stat-title text-[10px] font-extrabold uppercase text-base-content/60">Mid-Fire (Cone 6)</div>
					<div class="stat-value text-base font-extrabold text-warning">2232°F</div>
					<div class="stat-desc text-[10px]">1222°C</div>
				</div>
				<div class="stat p-2 border-l border-base-300">
					<div class="stat-title text-[10px] font-extrabold uppercase text-base-content/60">High-Fire (Cone 10)</div>
					<div class="stat-value text-base font-extrabold text-error">2345°F</div>
					<div class="stat-desc text-[10px]">1285°C</div>
				</div>
			</div>

			<div class="overflow-x-auto rounded-xl border border-base-300">
				<table class="table table-sm table-zebra w-full text-xs">
					<thead>
						<tr class="bg-base-200 text-base-content">
							<th>Cone</th>
							<th>°F</th>
							<th>°C</th>
							<th>Color Fire</th>
							<th>Firing Category</th>
						</tr>
					</thead>
					<tbody>
						{#each PYROMETRIC_CONES as cone}
							<tr>
								<td class="font-bold text-warning">{cone.name}</td>
								<td>{cone.temp_f}°F</td>
								<td>{cone.temp_c}°C</td>
								<td class="text-base-content/70">{cone.color_fire}</td>
								<td class="uppercase text-[10px] font-semibold text-success">{cone.firing_category.replace('_', ' ')}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
{/if}

<!-- MODAL 5: FLAG PIECE AS FAILED / CRACKED -->
{#if isFailModalOpen && pieceToFail}
	<div 
		role="dialog" 
		aria-modal="true"
		tabindex="-1"
		onclick={(e) => { if (e.target === e.currentTarget) isFailModalOpen = false; }}
		onkeydown={(e) => { if (e.key === 'Escape') isFailModalOpen = false; }}
		class="modal modal-open"
	>
		<div class="modal-box max-w-md bg-base-100 text-base-content border border-error/40 shadow-2xl p-6 rounded-2xl space-y-5">
			<div class="flex items-center justify-between border-b border-base-300 pb-3">
				<div class="flex items-center gap-2 text-error font-display font-bold text-base">
					<AlertTriangle class="w-5 h-5" />
					<h3>Flag Piece as Failed</h3>
				</div>
				<button onclick={() => isFailModalOpen = false} class="btn btn-sm btn-circle btn-ghost">
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
					onclick={() => isFailModalOpen = false}
					class="btn btn-ghost btn-sm"
				>
					Cancel
				</button>
				<button 
					onclick={confirmFlagAsFailed}
					class="btn btn-error btn-sm font-bold text-white shadow"
				>
					Flag as Failed
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- MODAL 5.5: DUPLICATE CERAMIC PIECE CONFIRMATION & EDIT -->
{#if isDuplicateModalOpen && pieceToDuplicate}
	<div 
		role="dialog" 
		aria-modal="true"
		tabindex="-1"
		onclick={(e) => { if (e.target === e.currentTarget) isDuplicateModalOpen = false; }}
		onkeydown={(e) => { if (e.key === 'Escape') isDuplicateModalOpen = false; }}
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
				<button onclick={() => isDuplicateModalOpen = false} class="btn btn-sm btn-circle btn-ghost">
					<X class="w-4 h-4" />
				</button>
			</div>

			<form onsubmit={confirmDuplicatePiece} class="space-y-4 text-xs">
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

				<!-- Goal Dimensions section in Duplicate Modal -->
				<div class="space-y-2 p-3 bg-base-200 rounded-xl border border-base-300">
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

				<div class="modal-action border-t border-base-300 pt-4 flex justify-end gap-2">
					<button 
						type="button"
						onclick={() => isDuplicateModalOpen = false}
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

<!-- MODAL 6: SPLIT BATCH / DIVERGE JOBS -->
{#if isSplitModalOpen}
	<div 
		role="dialog" 
		aria-modal="true"
		tabindex="-1"
		onclick={(e) => { if (e.target === e.currentTarget) isSplitModalOpen = false; }}
		onkeydown={(e) => { if (e.key === 'Escape') isSplitModalOpen = false; }}
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
				<button onclick={() => isSplitModalOpen = false} class="btn btn-sm btn-circle btn-ghost">
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
						<span class="text-[10px] text-base-content/70 font-normal">Make pieces individual (remove batch link)</span>
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
						<span class="text-[10px] text-base-content/70 font-normal">Flag selected items failed without ruining batch</span>
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
					onclick={() => isSplitModalOpen = false}
					class="btn btn-ghost btn-sm"
				>
					Cancel
				</button>
				<button 
					type="button" 
					onclick={executeSplitBatch}
					class="btn btn-warning btn-sm font-bold shadow"
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
			class="absolute pointer-events-none flex items-center gap-2 px-3 py-2 rounded-xl bg-primary text-primary-content text-xs font-extrabold shadow-2xl border border-primary/30 max-w-[220px] truncate"
			style="left: {touchDragGhostX + 12}px; top: {touchDragGhostY - 24}px; transform: translate(0, -50%);"
		>
			<span class="text-sm">🏺</span>
			<span class="truncate">{touchDragLabel}</span>
		</div>
		{#if dragOverStageId}
			{@const targetStage = STAGES.find(s => s.id === dragOverStageId)}
			<div class="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-2xl bg-base-100/95 text-base-content border border-base-300 text-sm font-extrabold shadow-2xl flex items-center gap-2.5 backdrop-blur-md pointer-events-none ring-2 ring-primary/40">
				<span>{targetStage?.icon}</span>
				<span>Drop into {targetStage?.label}</span>
			</div>
		{/if}
	</div>
{/if}

<!-- STAGE UPDATE FEEDBACK TOAST -->
{#if toastMessage}
	<div class="toast toast-end toast-bottom z-50">
		<div
			class="alert shadow-lg text-xs font-semibold flex items-center gap-2 {toastType === 'error'
				? 'alert-error'
				: toastType === 'warning'
					? 'alert-warning'
					: toastType === 'info'
						? 'alert-info'
						: 'alert-success'}"
		>
			{#if toastType === 'error'}
				<AlertCircle class="w-4 h-4" />
			{:else if toastType === 'warning'}
				<AlertTriangle class="w-4 h-4" />
			{:else if toastType === 'info'}
				<Info class="w-4 h-4" />
			{:else}
				<CheckCircle2 class="w-4 h-4" />
			{/if}
			<span>{toastMessage}</span>
		</div>
	</div>
{/if}
