import type { GlazeLocation } from '$lib/types/database';

export const GLAZE_LOCATIONS: { id: GlazeLocation; label: string }[] = [
	{ id: 'entire', label: 'Entire Piece' },
	{ id: 'inside', label: 'Inside' },
	{ id: 'outside', label: 'Outside' },
	{ id: 'top', label: 'Top / Upper' },
	{ id: 'bottom', label: 'Bottom / Foot' },
	{ id: 'rim', label: 'Rim Only' },
	{ id: 'accent', label: 'Accent / Drips' }
];
