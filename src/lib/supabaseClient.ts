import { createClient } from '@supabase/supabase-js';
import type { CeramicPiece, ClayBody, GlazeRecipe, PieceGlazeLayer, PieceBatch, PieceStageLog } from '$lib/types/database';

const DEFAULT_ANON_KEY = 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY;

export const supabaseConfig = {
	url: supabaseUrl,
	anonKey: supabaseAnonKey
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getSupabaseClient(customFetch?: typeof fetch) {
	if (customFetch) {
		return createClient(supabaseUrl, supabaseAnonKey, {
			global: { fetch: customFetch }
		});
	}
	return supabase;
}

/**
 * Rapid health check helper to verify if the local/remote Supabase database is reachable.
 * Times out after 1.5 seconds so offline page load doesn't hang.
 */
export async function checkSupabaseConnection(timeoutMs = 1500, customFetch?: typeof fetch): Promise<boolean> {
	try {
		const fetchImpl = customFetch || fetch;
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), timeoutMs);

		const response = await fetchImpl(`${supabaseUrl}/rest/v1/`, {
			method: 'GET',
			headers: {
				apikey: supabaseAnonKey,
				Authorization: `Bearer ${supabaseAnonKey}`
			},
			signal: controller.signal
		});

		clearTimeout(timer);
		return response.ok || response.status === 404; // 200/404 indicates endpoint is online
	} catch {
		return false;
	}
}

/**
 * Fetch all studio data (ceramic_pieces, clay_bodies, glaze_recipes) from Supabase.
 */
export async function fetchStudioData(customFetch?: typeof fetch) {
	const client = getSupabaseClient(customFetch);
	const [piecesRes, claysRes, glazesRes] = await Promise.all([
		client
			.from('ceramic_pieces')
			.select('*, batch:batches(*), stage_logs:piece_stage_logs(*), glaze_layers:piece_glaze_layers(*)'),
		client.from('clay_bodies').select('*'),
		client.from('glaze_recipes').select('*')
	]);

	return {
		pieces: (piecesRes.data as CeramicPiece[] | null) || null,
		clayBodies: (claysRes.data as ClayBody[] | null) || null,
		glazes: (glazesRes.data as GlazeRecipe[] | null) || null,
		error: piecesRes.error || claysRes.error || glazesRes.error || null
	};
}

/**
 * Move a piece to a new stage in Supabase DB and insert stage log entry.
 */
export async function updatePieceStageDb(pieceId: string, stage: string, notes?: string, weightGrams?: number) {
	const { error: updateErr } = await supabase
		.from('ceramic_pieces')
		.update({ stage, updated_at: new Date().toISOString() })
		.eq('id', pieceId);

	if (updateErr) throw updateErr;

	// Insert stage log
	const { error: logErr } = await supabase
		.from('piece_stage_logs')
		.insert({
			piece_id: pieceId,
			stage,
			notes: notes || `Moved to ${stage}`,
			weight_grams: weightGrams || null
		});

	if (logErr) console.warn('Stage log creation warning:', logErr);
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function sanitizePiecePayload(piece: Partial<CeramicPiece>) {
	const { batch, stage_logs, glaze_layers, id, ...clean } = piece;

	if (clean.clay_body_id && typeof clean.clay_body_id === 'string' && !UUID_REGEX.test(clean.clay_body_id)) {
		clean.clay_body_id = null;
	}

	if (clean.batch_id && typeof clean.batch_id === 'string' && !UUID_REGEX.test(clean.batch_id)) {
		clean.batch_id = null;
	}

	if (clean.weight_grams !== undefined && clean.weight_grams !== null) {
		const num = Number(clean.weight_grams);
		clean.weight_grams = isNaN(num) ? null : Math.round(num);
	}

	return clean;
}

/**
 * Create a new piece in Supabase DB.
 */
export async function insertPieceDb(piece: Partial<CeramicPiece>) {
	const payload = sanitizePiecePayload(piece);

	const { data, error } = await supabase
		.from('ceramic_pieces')
		.insert([payload])
		.select('*, batch:batches(*), stage_logs:piece_stage_logs(*), glaze_layers:piece_glaze_layers(*)')
		.single();

	if (error) throw error;
	return data as CeramicPiece;
}

/**
 * Update any piece fields (dimensions, cones, notes, photos, stage, etc.) in Supabase DB.
 */
export async function updatePieceDb(pieceId: string, updates: Partial<CeramicPiece>) {
	if (!pieceId || !UUID_REGEX.test(pieceId)) {
		console.warn('Skipping updatePieceDb: pieceId is temporary client ID', pieceId);
		return null;
	}

	const payload = {
		...sanitizePiecePayload(updates),
		updated_at: new Date().toISOString()
	};

	const { data, error } = await supabase
		.from('ceramic_pieces')
		.update(payload)
		.eq('id', pieceId)
		.select('*, batch:batches(*), stage_logs:piece_stage_logs(*), glaze_layers:piece_glaze_layers(*)')
		.single();

	if (error) throw error;
	return data as CeramicPiece;
}

/**
 * Create a new batch record in Supabase DB.
 */
export async function insertBatchDb(title: string, description?: string) {
	const { data, error } = await supabase
		.from('batches')
		.insert([{ title, description }])
		.select('*')
		.single();

	if (error) throw error;
	return data as PieceBatch;
}

/**
 * Insert a new glaze layer application in Supabase DB.
 */
export async function insertGlazeLayerDb(layer: Partial<PieceGlazeLayer>) {
	if (!layer.piece_id || layer.piece_id.startsWith('p-')) {
		console.warn('Skipping insertGlazeLayerDb: piece_id is temporary client ID', layer.piece_id);
		return null;
	}

	const { id, location, ...cleanLayer } = layer as any;
	const payload = typeof id === 'string' && !id.startsWith('gl-') ? { id, ...cleanLayer } : cleanLayer;

	const { data, error } = await supabase
		.from('piece_glaze_layers')
		.insert([payload])
		.select('*')
		.single();

	if (error) throw error;
	return data as PieceGlazeLayer;
}

/**
 * Delete a glaze layer application from Supabase DB.
 */
export async function deleteGlazeLayerDb(layerId: string) {
	if (!layerId || layerId.startsWith('gl-')) {
		return;
	}

	const { error } = await supabase
		.from('piece_glaze_layers')
		.delete()
		.eq('id', layerId);

	if (error) throw error;
}

/**
 * Insert a stage log snapshot in Supabase DB.
 */
export async function insertStageLogDb(log: Partial<PieceStageLog>) {
	if (!log.piece_id || log.piece_id.startsWith('p-')) {
		return null;
	}

	const { id, ...cleanLog } = log;
	const payload = typeof id === 'string' && !id.startsWith('log-') ? { id, ...cleanLog } : cleanLog;

	if (payload.weight_grams !== undefined && payload.weight_grams !== null) {
		const num = Number(payload.weight_grams);
		payload.weight_grams = isNaN(num) ? null : Math.round(num);
	}

	const { data, error } = await supabase
		.from('piece_stage_logs')
		.insert([payload])
		.select('*')
		.single();

	if (error) throw error;
	return data as PieceStageLog;
}

/**
 * Mark a piece as failed in Supabase DB.
 */
export async function markPieceFailedDb(pieceId: string, failureStage: string, failureReason: string) {
	const { data, error } = await supabase
		.from('ceramic_pieces')
		.update({
			is_failed: true,
			failure_stage: failureStage,
			failure_reason: failureReason,
			failed_at: new Date().toISOString(),
			updated_at: new Date().toISOString()
		})
		.eq('id', pieceId)
		.select('*')
		.single();

	if (error) throw error;
	return data as CeramicPiece;
}

/**
 * Create a new custom clay body in Supabase DB.
 */
export async function insertClayBodyDb(clayBody: Partial<ClayBody>) {
	const { data, error } = await supabase
		.from('clay_bodies')
		.insert([clayBody])
		.select('*')
		.single();

	if (error) throw error;
	return data as ClayBody;
}

/**
 * Create a new custom glaze recipe in Supabase DB.
 */
export async function insertGlazeRecipeDb(glaze: Partial<GlazeRecipe>) {
	const { data, error } = await supabase
		.from('glaze_recipes')
		.insert([glaze])
		.select('*')
		.single();

	if (error) throw error;
	return data as GlazeRecipe;
}
