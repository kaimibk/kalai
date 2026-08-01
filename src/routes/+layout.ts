import { supabase } from '$lib/supabaseClient';
import type { LayoutLoad } from './$types';

export const prerender = true;
export const ssr = false;
export const trailingSlash = 'always';

export const load: LayoutLoad = async () => {
	// In pure SPA mode (ssr = false), load() runs 100% in the browser context.
	// This allows initializing APIs and fetching Supabase data directly without server endpoints.
	try {
		const { data: pieces, error } = await supabase
			.from('pieces')
			.select('*, batch:batches(*), stage_logs(*), glaze_layers(*)');

		if (!error && pieces && pieces.length > 0) {
			return { pieces };
		}
	} catch (err) {
		console.warn('Supabase load notice (using local studio state fallback):', err);
	}

	return { pieces: null };
};
