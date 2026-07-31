<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';
	import Layers from 'lucide-svelte/icons/layers';
	import Droplets from 'lucide-svelte/icons/droplets';
	import ShieldAlert from 'lucide-svelte/icons/shield-alert';
	import Maximize2 from 'lucide-svelte/icons/maximize-2';
	import Minimize2 from 'lucide-svelte/icons/minimize-2';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import Check from 'lucide-svelte/icons/check';

	let { children } = $props();

	const THEMES = [
		'light', 'dark', 'cupcake', 'bumblebee', 'emerald', 'corporate', 
		'synthwave', 'retro', 'cyberpunk', 'valentine', 'halloween', 'garden', 
		'forest', 'aqua', 'lofi', 'pastel', 'fantasy', 'wireframe', 
		'black', 'luxury', 'dracula', 'cmyk', 'autumn', 'business', 
		'acid', 'lemonade', 'night', 'coffee', 'winter', 'dim', 
		'nord', 'sunset', 'caramellatte', 'abyss', 'silk'
	];

	let currentTheme = $state<string>('coffee');
	let isFullscreen = $state(false);

	function setTheme(theme: string) {
		currentTheme = theme;
		if (typeof window === 'undefined') return;
		localStorage.setItem('theme', theme);

		document.documentElement.setAttribute('data-theme', theme);
		const darkThemes = ['coffee', 'dracula', 'synthwave', 'forest', 'sunset', 'dim', 'dark', 'cyberpunk', 'night', 'halloween', 'black', 'luxury', 'business', 'abyss'];
		if (darkThemes.includes(theme)) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}

	function toggleFullScreen() {
		isFullscreen = !isFullscreen;
		if (typeof window === 'undefined') return;

		if (isFullscreen) {
			if (document.documentElement.requestFullscreen) {
				document.documentElement.requestFullscreen().catch(() => {});
			}
		} else {
			if (document.fullscreenElement && document.exitFullscreen) {
				document.exitFullscreen().catch(() => {});
			}
		}
	}

	onMount(() => {
		themeChange(false);
		const savedTheme = localStorage.getItem('theme') || 'coffee';
		setTheme(savedTheme);

		const handleFullscreenChange = () => {
			if (!document.fullscreenElement) {
				isFullscreen = false;
			}
		};
		document.addEventListener('fullscreenchange', handleFullscreenChange);

		return () => {
			document.removeEventListener('fullscreenchange', handleFullscreenChange);
		};
	});
</script>

<div class="min-h-screen 2xl:h-screen bg-base-200 text-base-content flex flex-col font-sans transition-colors duration-200 selection:bg-primary selection:text-primary-content overflow-y-auto 2xl:overflow-hidden relative">
	<!-- Top Studio Header (daisyUI Navbar) -->
	<header class="navbar bg-base-100 border-b border-base-300 z-40 transition-all duration-300 ease-in-out flex-shrink-0 min-h-16 sm:min-h-20 sticky top-0 2xl:relative px-4 sm:px-6 lg:px-8 {isFullscreen ? 'hidden' : 'flex'}">
		<div class="w-full mx-auto flex items-center justify-between">
			<!-- Logo / Title -->
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md text-primary-content">
					<span class="font-display font-extrabold text-xl sm:text-2xl tracking-tighter">K</span>
				</div>
				<div>
					<div class="flex items-center gap-2">
						<h1 class="font-display font-bold text-lg sm:text-xl tracking-tight text-base-content">kālai</h1>
						<span class="badge badge-primary badge-outline badge-sm uppercase text-[10px] font-bold tracking-wider">Studio Board</span>
					</div>
					<p class="text-xs text-base-content/70">Ceramic Piece Lifecycle & Kanban Tracker</p>
				</div>
			</div>

			<!-- Quick Studio Stats & Controls -->
			<div class="flex items-center gap-2 sm:gap-4">
				<div class="hidden lg:flex items-center gap-3">
					<div class="badge badge-lg gap-2 py-3 px-3 bg-base-200 border-base-300">
						<Layers class="w-4 h-4 text-primary" />
						<span class="text-xs text-base-content/70">Active:</span>
						<span class="text-xs font-semibold text-success">14 tracked</span>
					</div>

					<div class="badge badge-lg gap-2 py-3 px-3 bg-base-200 border-base-300">
						<Droplets class="w-4 h-4 text-info" />
						<span class="text-xs text-base-content/70">Clays:</span>
						<span class="text-xs font-semibold text-base-content">5 Global + 2 Custom</span>
					</div>

					<div class="badge badge-lg gap-2 py-3 px-3 bg-base-200 border-base-300">
						<ShieldAlert class="w-4 h-4 text-warning" />
						<span class="text-xs text-base-content/70">Loss:</span>
						<span class="text-xs font-semibold text-warning">1 piece (7%)</span>
					</div>
				</div>

				<!-- daisyUI Theme Select Dropdown (Matching daisyUI Docs) -->
				<div title="Change Theme" class="dropdown dropdown-end">
					<button
						type="button"
						class="btn btn-ghost btn-sm gap-1.5 px-2 group cursor-pointer"
						aria-label="Change Theme"
					>
						<div class="bg-base-100 group-hover:border-base-content/20 border-base-content/10 grid shrink-0 grid-cols-2 gap-0.5 rounded-md border p-1 transition-colors">
							<div class="bg-base-content size-1 rounded-full"></div>
							<div class="bg-primary size-1 rounded-full"></div>
							<div class="bg-secondary size-1 rounded-full"></div>
							<div class="bg-accent size-1 rounded-full"></div>
						</div>
						<span class="text-xs font-bold capitalize hidden sm:inline">{currentTheme}</span>
						<ChevronDown class="size-3 fill-current opacity-60 flex-shrink-0" />
					</button>

					<div
						tabindex="-1"
						class="dropdown-content bg-base-200 text-base-content rounded-2xl h-96 max-h-[calc(100vh-8.6rem)] overflow-y-auto border border-base-300 shadow-2xl z-50 mt-2 w-56 p-2"
					>
						<ul class="menu menu-sm w-full p-0 gap-0.5">
							<li class="menu-title text-xs font-extrabold uppercase tracking-wider px-2 py-1">Select Theme</li>
							{#each THEMES as t}
								<li>
									<button
										type="button"
										onclick={() => setTheme(t)}
										class="flex items-center justify-between gap-3 px-2 py-1.5 rounded-xl transition-all cursor-pointer {currentTheme === t ? 'active font-bold bg-base-300/60' : ''}"
									>
										<div data-theme={t} class="bg-base-100 grid shrink-0 grid-cols-2 gap-0.5 rounded-md p-1 shadow-xs border border-base-content/10">
											<div class="bg-base-content size-1 rounded-full"></div>
											<div class="bg-primary size-1 rounded-full"></div>
											<div class="bg-secondary size-1 rounded-full"></div>
											<div class="bg-accent size-1 rounded-full"></div>
										</div>
										<div class="grow truncate text-xs capitalize text-left">{t}</div>
										{#if currentTheme === t}
											<Check class="h-3.5 w-3.5 shrink-0 text-primary" />
										{/if}
									</button>
								</li>
							{/each}
						</ul>
					</div>
				</div>

				<!-- Full Screen Toggle Button -->
				<button
					type="button"
					onclick={toggleFullScreen}
					class="2xl:hidden btn btn-xs sm:btn-sm btn-outline gap-1.5"
					aria-label={isFullscreen ? "Exit full screen" : "Enter full screen"}
					title={isFullscreen ? "Exit Full Screen Mode" : "Full Screen Workspace"}
				>
					{#if isFullscreen}
						<Minimize2 class="w-3.5 h-3.5 text-primary" />
						<span class="hidden sm:inline">Exit</span>
					{:else}
						<Maximize2 class="w-3.5 h-3.5 text-primary" />
						<span class="hidden sm:inline">Full Screen</span>
					{/if}
				</button>
			</div>
		</div>
	</header>

	<!-- Main Page Slot -->
	<main class="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col min-h-0 overflow-y-auto 2xl:overflow-hidden">
		{@render children()}
	</main>

	<!-- Footer or Bottom Exit Full Screen Bar -->
	{#if isFullscreen}
		<div class="border-t border-base-300 bg-base-100/90 backdrop-blur-md py-2.5 text-center flex-shrink-0 flex items-center justify-center z-40">
			<button
				type="button"
				onclick={toggleFullScreen}
				class="btn btn-primary btn-sm rounded-full gap-2 shadow-md"
				title="Exit Full Screen Mode"
			>
				<Minimize2 class="w-3.5 h-3.5" />
				<span>Exit Full Screen</span>
			</button>
		</div>
	{:else}
		<footer class="footer border-t border-base-300 bg-base-100 py-3 px-4 sm:px-6 lg:px-8 mt-auto text-xs text-base-content/70 flex-shrink-0 flex flex-col sm:flex-row items-center justify-between gap-2">
			<p>© 2026 kālai Studio. Handcrafted multi-stage ceramic tracking.</p>
			<div class="flex items-center gap-2 sm:gap-4 flex-wrap justify-center">
				<span class="badge badge-xs badge-neutral">Svelte 5</span>
				<span>•</span>
				<span class="badge badge-xs badge-neutral">SvelteKit</span>
				<span>•</span>
				<span class="badge badge-xs badge-neutral">daisyUI 5</span>
				<span>•</span>
				<span class="badge badge-xs badge-neutral">theme-change</span>
				<span>•</span>
				<span class="badge badge-xs badge-neutral">Tailwind v4</span>
			</div>
		</footer>
	{/if}
</div>
