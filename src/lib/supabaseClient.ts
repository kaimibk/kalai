import { createClient } from '@supabase/supabase-js';
import type { CeramicPiece, ClayBody, GlazeRecipe, PieceGlazeLayer, PieceBatch } from '$lib/types/database';

const DEFAULT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.Jg2jVKi3tggtnhSF641wM2bszA34fUcCDG7rimRTnsk';

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

/**
 * Create a new piece in Supabase DB.
 */
export async function insertPieceDb(piece: Partial<CeramicPiece>) {
	const { data, error } = await supabase
		.from('ceramic_pieces')
		.insert([piece])
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
	const { data, error } = await supabase
		.from('piece_glaze_layers')
		.insert([layer])
		.select('*')
		.single();

	if (error) throw error;
	return data as PieceGlazeLayer;
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
