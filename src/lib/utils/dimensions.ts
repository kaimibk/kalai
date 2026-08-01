export type WeightUnit = 'g' | 'kg' | 'oz' | 'lbs';

export function toGrams(amount: number, unit: WeightUnit): number {
	switch (unit) {
		case 'kg': return amount * 1000;
		case 'oz': return amount * 28.3495;
		case 'lbs': return amount * 453.592;
		case 'g': default: return amount;
	}
}

export function formatClayWeight(grams: number | null | undefined): string {
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

export function calculateFormedDimension(desiredCm: number | null | undefined, shrinkagePct: number): number | null {
	if (desiredCm === null || desiredCm === undefined || isNaN(desiredCm) || desiredCm <= 0) return null;
	if (shrinkagePct >= 100 || shrinkagePct < 0) return desiredCm;
	const scale = 1 - (shrinkagePct / 100);
	if (scale <= 0) return desiredCm;
	return Math.round((desiredCm / scale) * 100) / 100;
}

export function calculateFiredDimension(formedCm: number | null | undefined, shrinkagePct: number): number | null {
	if (formedCm === null || formedCm === undefined || isNaN(formedCm) || formedCm <= 0) return null;
	if (shrinkagePct >= 100 || shrinkagePct < 0) return formedCm;
	const scale = 1 - (shrinkagePct / 100);
	if (scale <= 0) return formedCm;
	return Math.round((formedCm * scale) * 100) / 100;
}
