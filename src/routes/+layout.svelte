<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import Flame from 'lucide-svelte/icons/flame';
	import Layers from 'lucide-svelte/icons/layers';
	import Droplets from 'lucide-svelte/icons/droplets';
	import Sparkles from 'lucide-svelte/icons/sparkles';
	import Plus from 'lucide-svelte/icons/plus';
	import AlertCircle from 'lucide-svelte/icons/alert-circle';
	import Copy from 'lucide-svelte/icons/copy';
	import ShieldAlert from 'lucide-svelte/icons/shield-alert';
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';
	import Monitor from 'lucide-svelte/icons/monitor';

	import Maximize2 from 'lucide-svelte/icons/maximize-2';
	import Minimize2 from 'lucide-svelte/icons/minimize-2';

	let { children } = $props();

	type Theme = 'light' | 'dark' | 'system';
	let currentTheme = $state<Theme>('dark');
	let isFullscreen = $state(false);

	function setTheme(theme: Theme) {
		currentTheme = theme;
		if (typeof window === 'undefined') return;
		localStorage.setItem('theme', theme);

		let isDark = false;
		if (theme === 'dark') {
			isDark = true;
		} else if (theme === 'light') {
			isDark = false;
		} else {
			isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		}

		if (isDark) {
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
		const savedTheme = (localStorage.getItem('theme') as Theme) || 'dark';
		currentTheme = savedTheme;

		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handleMediaChange = () => {
			if (currentTheme === 'system') {
				setTheme('system');
			}
		};
		mediaQuery.addEventListener('change', handleMediaChange);

		const handleFullscreenChange = () => {
			if (!document.fullscreenElement) {
				isFullscreen = false;
			}
		};
		document.addEventListener('fullscreenchange', handleFullscreenChange);

		return () => {
			mediaQuery.removeEventListener('change', handleMediaChange);
			document.removeEventListener('fullscreenchange', handleFullscreenChange);
		};
	});
</script>

<div class="min-h-screen xl:h-screen bg-[#F7F4EF] text-stone-800 dark:bg-[#181616] dark:text-[#F4F1DE] flex flex-col font-sans transition-colors duration-200 selection:bg-[#E07A5F] selection:text-white overflow-y-auto xl:overflow-hidden relative">
	<!-- Top Studio Header -->
	<header class="border-b border-stone-200 dark:border-stone-800/80 bg-white/95 dark:bg-[#1C1918]/95 backdrop-blur-md z-40 transition-all duration-300 ease-in-out flex-shrink-0 h-16 sm:h-20 sticky top-0 xl:relative {isFullscreen ? 'hidden' : 'block'}">
		<div class="w-full mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
			<!-- Logo / Title -->
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#E07A5F] to-[#C85A32] flex items-center justify-center shadow-lg shadow-[#C85A32]/20 border border-[#E07A5F]/40">
					<span class="font-display font-extrabold text-xl sm:text-2xl tracking-tighter text-white">K</span>
				</div>
				<div>
					<div class="flex items-center gap-2">
						<h1 class="font-display font-bold text-lg sm:text-xl tracking-tight text-stone-900 dark:text-white">kālai</h1>
						<span class="px-2 py-0.5 text-[10px] font-semibold tracking-wider text-[#C85A32] dark:text-[#E07A5F] bg-[#E07A5F]/10 rounded-md border border-[#E07A5F]/20 uppercase">Studio Board</span>
					</div>
					<p class="text-xs text-stone-500 dark:text-stone-400">Ceramic Piece Lifecycle & Kanban Tracker</p>
				</div>
			</div>

			<!-- Quick Studio Stats & Controls -->
			<div class="flex items-center gap-2 sm:gap-3">
				<div class="hidden lg:flex items-center gap-4 text-xs">
					<div class="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
						<Layers class="w-4 h-4 text-[#E07A5F]" />
						<div>
							<span class="text-stone-500 dark:text-stone-400">Active Pieces:</span>
							<span class="font-semibold text-[#3B7258] dark:text-[#81B29A] ml-1">14 tracked</span>
						</div>
					</div>

					<div class="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
						<Droplets class="w-4 h-4 text-[#81B29A]" />
						<div>
							<span class="text-stone-500 dark:text-stone-400">Clay Bodies:</span>
							<span class="font-semibold text-stone-900 dark:text-white ml-1">5 Global + 2 Custom</span>
						</div>
					</div>

					<div class="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
						<ShieldAlert class="w-4 h-4 text-[#C85A32] dark:text-[#F2CC8F]" />
						<div>
							<span class="text-stone-500 dark:text-stone-400">Loss Rate:</span>
							<span class="font-semibold text-[#C85A32] dark:text-[#F2CC8F] ml-1">1 piece (7%)</span>
						</div>
					</div>
				</div>

				<!-- Light / Dark / System Mode Toggle -->
				<div class="flex items-center p-1 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl">
					<button
						type="button"
						onclick={() => setTheme('light')}
						class="px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all {currentTheme === 'light' ? 'bg-white text-[#C85A32] shadow-sm font-semibold border border-stone-200' : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'}"
						aria-label="Light mode"
						title="Light Mode"
					>
						<Sun class="w-3.5 h-3.5" />
						<span class="hidden sm:inline">Light</span>
					</button>

					<button
						type="button"
						onclick={() => setTheme('dark')}
						class="px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all {currentTheme === 'dark' ? 'bg-stone-800 text-[#E07A5F] shadow-sm font-semibold border border-stone-700' : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'}"
						aria-label="Dark mode"
						title="Dark Mode"
					>
						<Moon class="w-3.5 h-3.5" />
						<span class="hidden sm:inline">Dark</span>
					</button>

					<button
						type="button"
						onclick={() => setTheme('system')}
						class="px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all {currentTheme === 'system' ? 'bg-white dark:bg-stone-800 text-[#C85A32] dark:text-[#E07A5F] shadow-sm font-semibold border border-stone-200 dark:border-stone-700' : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'}"
						aria-label="System theme"
						title="System Theme"
					>
						<Monitor class="w-3.5 h-3.5" />
						<span class="hidden sm:inline">System</span>
					</button>
				</div>

				<!-- Full Screen Toggle Button (Mobile/Tablet Only: xl:hidden) -->
				<button
					type="button"
					onclick={toggleFullScreen}
					class="xl:hidden p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border cursor-pointer {isFullscreen ? 'bg-[#E07A5F] text-white border-transparent shadow-sm' : 'bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:bg-stone-200 dark:hover:bg-stone-800'}"
					aria-label={isFullscreen ? "Exit full screen" : "Enter full screen"}
					title={isFullscreen ? "Exit Full Screen Mode" : "Full Screen Workspace"}
				>
					{#if isFullscreen}
						<Minimize2 class="w-3.5 h-3.5 text-white" />
						<span class="hidden sm:inline">Exit Full Screen</span>
					{:else}
						<Maximize2 class="w-3.5 h-3.5 text-[#E07A5F]" />
						<span class="hidden sm:inline">Full Screen</span>
					{/if}
				</button>
			</div>
		</div>
	</header>

	<!-- Main Page Slot -->
	<main class="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col min-h-0 overflow-y-auto xl:overflow-hidden">
		{@render children()}
	</main>

	<!-- Footer or Bottom Exit Full Screen Bar -->
	{#if isFullscreen}
		<div class="border-t border-stone-200 dark:border-stone-800/80 bg-stone-100/90 dark:bg-[#151313]/90 backdrop-blur-md py-2.5 text-center flex-shrink-0 flex items-center justify-center z-40">
			<button
				type="button"
				onclick={toggleFullScreen}
				class="px-4 py-1.5 rounded-full bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs font-bold shadow-md border border-white/20 dark:border-stone-700 flex items-center gap-2 hover:scale-105 transition cursor-pointer"
				title="Exit Full Screen Mode"
			>
				<Minimize2 class="w-3.5 h-3.5 text-[#E07A5F]" />
				<span>Exit Full Screen</span>
			</button>
		</div>
	{:else}
		<footer class="border-t border-stone-200 dark:border-stone-800/80 bg-stone-100 dark:bg-[#151313] py-2 mt-auto text-center text-xs text-stone-500 transition-all duration-300 ease-in-out flex-shrink-0">
			<div class="w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
				<p>© 2026 kālai Studio. Handcrafted multi-stage ceramic tracking.</p>
				<div class="flex items-center gap-4 text-stone-500 dark:text-stone-400">
					<span>Svelte 5</span>
					<span>•</span>
					<span>SvelteKit</span>
					<span>•</span>
					<span>Tailwind CSS v4</span>
					<span>•</span>
					<span>Supabase RLS</span>
				</div>
			</div>
		</footer>
	{/if}
</div>

