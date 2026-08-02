export type CeramicStage =
	| 'backlog'        // 💡 Backlog / Planned Idea
	| 'formed'         // 🏺 Formed (Wheel Thrown, Handbuilt, Slab, Slipcast)
	| 'leather_hard'   // 📦 Drying to Leather-Hard
	| 'trimmed'        // 🔪 Trimmed (Foot Turned, Handles Attached, Carved)
	| 'pending_bisque' // ☀️ Pending Bisque (Drying Greenware & Bisque Kiln Load Pending)
	| 'bisqued'        // 🏷️ Bisqued (Awaiting Glaze & Wax Application)
	| 'glazed'         // 🖌️ Glazed (Glaze Firing Pending)
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

export interface KanbanDisplayGroup {
	isBatch: boolean;
	batchId?: string;
	batchTitle?: string;
	glazeSignature?: string;
	pieces: CeramicPiece[];
	primaryPiece: CeramicPiece;
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
	created_at: Date;
	updated_at: Date;
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
	failed_at?: Date | null;

	// FK to pyrometric_cones
	target_bisque_cone: string;
	target_glaze_cone: string;
	target_bisque_cone_rel?: PyrometricCone | null;
	target_glaze_cone_rel?: PyrometricCone | null;
	
	weight_grams?: number | null;
	length_cm?: number | null;
	height_cm?: number | null;
	width_cm?: number | null;

	// Desired (Final Goal) Dimensions
	target_length_cm?: number | null;
	target_width_cm?: number | null;
	target_height_cm?: number | null;

	// Recommended Formed (Wet Target) Dimensions accounting for shrinkage
	formed_length_cm?: number | null;
	formed_width_cm?: number | null;
	formed_height_cm?: number | null;

	// Actual Measured Formed (Pre-Fire) Dimensions recorded after forming/trimming
	actual_formed_length_cm?: number | null;
	actual_formed_width_cm?: number | null;
	actual_formed_height_cm?: number | null;

	// Actual Measured Final Fired Dimensions recorded after final firing
	actual_fired_length_cm?: number | null;
	actual_fired_width_cm?: number | null;
	actual_fired_height_cm?: number | null;

	initial_photo_url?: string | null;

	// Date tracking (native Date objects)
	started_at?: Date | null;
	due_date?: Date | null;

	// UI Helpers / Joined Data
	stage_logs?: PieceStageLog[];
	glaze_layers?: PieceGlazeLayer[];
	created_at: Date;
	updated_at: Date;
}

export interface PieceStageLog {
	id: string;
	piece_id: string;
	user_id: string;
	stage: CeramicStage;
	photo_url?: string | null;
	notes?: string | null;
	weight_grams?: number | null;
	created_at: Date;
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
	created_at: Date;
}
