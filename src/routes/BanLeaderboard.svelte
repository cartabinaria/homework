<script lang="ts">
	import Line from './Line.svelte';
	import { onMount } from 'svelte';

	let bans: { name: string; description: string; approved: boolean }[] = [];
	let banCounts: { name: string; count: number }[] = [];
	let groupedBans: { [key: string]: typeof bans } = {};

	// Chiamate queste funzioni ogni volta che l'array `bans` viene aggiornato
	$: updateBanCounts();
	$: groupBans();

	// Fetch and sort bans when component mounts
	onMount(async () => {
		await getBans();
		updateBanCounts();
		groupBans();
	});

	async function getBans() {
		const response = await fetch('http://localhost:3001/getBans', {
			method: 'GET'
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error('Error fetching bans');
				}
				return response.json();
			})
			.then((data) => {
				bans = data;
			})
			.catch((error) => {
				console.log('There was a problem with the fetch operation:', error);
			});
	}

	async function updateBanCounts() {
		let counts: { [key: string]: number } = {};
		for (let ban of bans) {
			if (counts[ban.name]) {
				counts[ban.name]++;
			} else {
				counts[ban.name] = 1;
			}
		}
		banCounts = Object.entries(counts)
			.map(([name, count]) => ({ name, count: Number(count) }))
			.sort((a, b) => b.count - a.count);
	}

	function groupBans() {
		// Clear the groupedBans object
		groupedBans = {};

		// Loop over the sorted banCounts array
		for (let { name } of banCounts) {
			// Filter the bans array to get the bans for the current name
			let bansForName = bans.filter((ban) => ban.name === name);

			// Add the bans for the current name to the groupedBans object
			groupedBans[name] = bansForName;
		}
	}
</script>

<div class="rounded-lg bg-accent/20 p-5 flex flex-col items-center md:justify-center">
	<h1 class="text-2xl font-bold">Ban Leaderboard</h1>
	<div class="flex flex-row justify-start">
		<h4 class="font-medium">Legenda</h4>
		<p>
			<span class="icon-[fa--close] mx-1 text-primary"></span>: ban approvato e verificato da almeno
			2 utenti<br />
			<span class="icon-[fa--close] mx-1 text-accent"></span>: ban disapprovato da almeno 1 utente<br
			/>
			<span class="icon-[fa--close] mx-1"></span>: ban da approvare
		</p>
	</div>
	<div class="flex flex-wrap justify-center m-2 w-full">
		{#each Object.keys(groupedBans) as key}
			<div class="flex-none md:flex-auto max-w-screen min-w-max">
				<Line bans={groupedBans[key]}></Line>
			</div>
		{/each}
	</div>
</div>
