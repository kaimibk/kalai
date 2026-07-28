export type CeramicStage =
	| 'backlog'        // 💡 To-Do / Planned Idea
	| 'formed'         // 🏺 Formed (Wheel Thrown, Handbuilt, Slab, Slipcast)
	| 'ready_to_trim'  // 🔪 Trimming (Leather-Hard, Handles, Carving)
	| 'bone_dry'       // ☀️ Bone Dry (Bisque Fire Pending)
	| 'glazed'         // 🖌️ Glazed (Glaze Layering & Glaze Fire Pending)
	| 'done';          // ✨ Finished Ceramic Piece

export type GlazeStyle = 'dip' | 'brush' | 'spray' | 'pour' | 'underglaze' | 'wax_accent';
export type GlazeLocation = 'entire' | 'inside' | 'outside' | 'top' | 'bottom' | 'rim' | 'accent';

export interface PyrometricCone {
	name: string;
	display_order: number;
	temp_f: number;
	temp_c: number;
	color_fire?: string;
	firing_category: 'enamel_luster' | 'bisque_lowfire' | 'mid_fire' | 'high_fire';
}

export interface Manufacturer {
	name: string;
	category: 'clay' | 'glaze' | 'both';
}

export interface PieceType {
	name: string;
	description: string;
}

export interface KanbanStageInfo {
	id: CeramicStage;
	display_order: number;
	label: string;
	icon: string;
	description?: string;
}

export interface Profile {
	id: string;
	full_name: string | null;
	studio_name: string;
	default_cone: string;
	created_at: string;
}

export interface ClayBody {
	id: string;
	user_id?: string | null;
	is_global: boolean;
	name: string;
	manufacturer?: string | null;
	firing_range: string;
	min_cone?: string | null;
	max_cone?: string | null;
	shrinkage_pct: number;
	raw_color: string;
	fired_color: string;
	notes?: string;
}

export interface PieceBatch {
	id: string;
	user_id: string;
	title: string;
	description?: string | null;
	parent_batch_id?: string | null;
	created_at: string;
	updated_at: string;
}

export interface CeramicPiece {
	id: string;
	user_id: string;
	title: string;
	description?: string | null;
	notes?: string | null;
	piece_type: string;
	clay_body_id?: string | null;
	clay_body_name?: string | null;
	stage: CeramicStage;
	
	// Batch tracking
	batch_id?: string | null;
	batch_sequence?: number | null;
	batch?: PieceBatch | null;
	
	// Failure tracking
	is_failed: boolean;
	failure_stage?: string | null;
	failure_reason?: string | null;
	failed_at?: string | null;

	// FK to pyrometric_cones
	target_bisque_cone: string;
	target_glaze_cone: string;
	
	weight_grams?: number | null;
	height_cm?: number | null;
	width_cm?: number | null;
	initial_photo_url?: string | null;

	// UI Helpers / Joined Data
	stage_logs?: PieceStageLog[];
	glaze_layers?: PieceGlazeLayer[];
	created_at: string;
	updated_at: string;
}

export interface PieceStageLog {
	id: string;
	piece_id: string;
	user_id: string;
	stage: CeramicStage;
	photo_url?: string | null;
	notes?: string | null;
	weight_grams?: number | null;
	created_at: string;
}

export interface GlazeRecipe {
	id: string;
	user_id?: string | null;
	is_global: boolean;
	name: string;
	manufacturer: string;
	default_style: GlazeStyle;
	min_cone?: string | null;
	max_cone?: string | null;
	target_cone: string;
	atmosphere: string;
	batch_liters: number;
	notes?: string | null;
	image_url?: string | null;
}

export interface PieceGlazeLayer {
	id: string;
	piece_id: string;
	glaze_id?: string | null;
	glaze_name: string;
	manufacturer: string;
	layer_order: number;
	coat_count: number;
	application_method: GlazeStyle;
	location?: GlazeLocation;
	notes?: string | null;
	created_at: string;
}
