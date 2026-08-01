export function formatDateShort(dateVal?: Date | string | null): string {
	if (!dateVal) return '';
	const d = typeof dateVal === 'string' ? new Date(dateVal) : dateVal;
	if (isNaN(d.getTime())) return '';
	const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	return `${monthNames[d.getMonth()]} ${d.getDate()}`;
}

export function formatDateInput(d?: Date | null): string {
	if (!d || isNaN(d.getTime())) return '';
	const year = d.getFullYear();
	const month = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

export function parseDateInput(str?: string | null): Date | null {
	if (!str || !str.trim()) return null;
	const parts = str.split('-').map(Number);
	if (parts.length === 3 && !parts.some(isNaN)) {
		return new Date(parts[0], parts[1] - 1, parts[2]);
	}
	return null;
}
