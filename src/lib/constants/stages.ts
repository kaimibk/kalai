import type { CeramicStage } from '$lib/types/database';

export interface StageDefinition {
	id: CeramicStage;
	label: string;
	icon: string;
	color: string;
	badgeColor: string;
}

export const STAGES: StageDefinition[] = [
	{ id: 'backlog', label: 'Backlog / Planned', icon: '💡', color: 'border-2 border-info/50 bg-info/5', badgeColor: 'badge-info' },
	{ id: 'formed', label: 'Formed', icon: '🏺', color: 'border-2 border-primary/50 bg-primary/5', badgeColor: 'badge-primary' },
	{ id: 'leather_hard', label: 'Drying to Leather-Hard', icon: '📦', color: 'border-2 border-warning/50 bg-warning/5', badgeColor: 'badge-warning' },
	{ id: 'trimmed', label: 'Trimmed', icon: '🔪', color: 'border-2 border-secondary/50 bg-secondary/5', badgeColor: 'badge-secondary' },
	{ id: 'pending_bisque', label: 'Pending Bisque', icon: '☀️', color: 'border-2 border-accent/50 bg-accent/5', badgeColor: 'badge-accent' },
	{ id: 'bisqued', label: 'Bisqued (Awaiting Glaze)', icon: '🏷️', color: 'border-2 border-info/50 bg-info/5', badgeColor: 'badge-info' },
	{ id: 'glazed', label: 'Glazed (Pending Glaze Fire)', icon: '🖌️', color: 'border-2 border-primary/50 bg-primary/5', badgeColor: 'badge-primary' },
	{ id: 'done', label: 'Finished', icon: '✨', color: 'border-2 border-success/50 bg-success/5', badgeColor: 'badge-success' }
];
