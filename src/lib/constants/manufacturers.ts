import type { Manufacturer, PieceType } from '$lib/types/database';

export const MANUFACTURERS: Manufacturer[] = [
	{ name: 'Amaco', category: 'glaze' },
	{ name: 'Aardvark', category: 'both' },
	{ name: 'Mayco', category: 'glaze' },
	{ name: 'Coyote', category: 'glaze' },
	{ name: 'Spectrum', category: 'glaze' },
	{ name: 'Laguna Clay', category: 'both' },
	{ name: 'Highwater', category: 'clay' },
	{ name: 'Standard Clay', category: 'clay' },
	{ name: 'Custom Studio', category: 'both' }
];

export const PIECE_TYPES: PieceType[] = [
	{ name: 'Mug', description: 'Handled drinking vessel' },
	{ name: 'Bowl', description: 'Open serving or eating dish' },
	{ name: 'Vase', description: 'Decorative or flower vessel' },
	{ name: 'Plate / Platter', description: 'Flat dining or display ware' },
	{ name: 'Planter', description: 'Botanical pot with drainage' },
	{ name: 'Sculpture', description: 'Non-functional art object' }
];
