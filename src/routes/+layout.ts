import { fetchStudioData, checkSupabaseConnection } from '$lib/supabaseClient';
import type { LayoutLoad } from './$types';

export const prerender = true;
export const ssr = false;
export const trailingSlash = 'always';

export const load: LayoutLoad = async ({ fetch }) => {
	// In pure SPA mode (ssr = false), load() runs 100% in the browser context.
	// We perform a fast connection check first to ensure page rendering doesn't stall when database is offline.
	try {
		const isConnected = await checkSupabaseConnection(1200, fetch);

		if (isConnected) {
			const studioData = await fetchStudioData(fetch);

			if (!studioData.error) {
				return {
					pieces: studioData.pieces,
					clayBodies: studioData.clayBodies,
					glazes: studioData.glazes,
					isConnected: true
				};
			}
		}
	} catch (err) {
		console.info('Supabase unreachable — using local studio demo fallback state:', err);
	}

	return { pieces: null, clayBodies: null, glazes: null, isConnected: false };
};
