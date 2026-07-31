declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare namespace svelteHTML {
	interface IntrinsicElements {
		'calendar-date': any;
		'calendar-month': any;
		'calendar-range': any;
	}
	interface SVGAttributes {
		slot?: string;
	}
	interface HTMLAttributes {
		slot?: string;
	}
}

export {};
