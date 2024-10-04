<!-- FireworksAnimation.svelte -->
<script lang="ts">
	import { onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';

	export let trigger: boolean = false;

	let fireworks: { id: number; x: number; y: number; color: string }[] = [];
	let timeoutId: ReturnType<typeof setTimeout>;

	$: if (trigger) {
		createFireworks();
	}

	function createFireworks() {
		fireworks = Array.from({ length: 30 }, (_, i) => ({
			id: Date.now() + i,
			x: Math.random() * 100,
			y: Math.random() * 100,
			color: `hsl(${Math.random() * 360}, 100%, 50%)`
		}));

		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			fireworks = [];
		}, 1000);
	}

	onDestroy(() => {
		clearTimeout(timeoutId);
	});
</script>

<div class="fireworks-container">
	{#each fireworks as fw (fw.id)}
		<div
			class="firework icon-[fa--close]"
			style="left: {fw.x}%; top: {fw.y}%; background-color: {fw.color};"
			transition:fade={{ duration: 500 }}
		/>
	{/each}
</div>

<style>
	.fireworks-container {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		pointer-events: none;
	}

	.firework {
		position: absolute;
		width: 5px;
		height: 5px;
		border-radius: 50%;
		transform: scale(0);
		animation: explode 0.5s ease-out forwards;
	}

	@keyframes explode {
		to {
			transform: scale(8);
			opacity: 0;
		}
	}
</style>
