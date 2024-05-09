<script lang="ts">
	import { onMount } from 'svelte';
	import * as fs from 'fs';
	import { serverURL } from '../const';

	let bans: { name: string; description: string; approved: number }[] = [];
	let newBanDescription = '';
	let newBanName = '';

	onMount(async () => getBans());

	async function getBans() {
		const response = await fetch(serverURL + '/getBans', {
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

	async function addBan() {
		let newBan = {
			name: newBanName,
			description: newBanDescription,
			approved: 0
		};

		const response = await fetch(serverURL + '/addBan', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newBan)
		});

		if (response.ok) {
			// Aggiungi il nuovo ban alla lista locale
			bans.push(newBan);
			getBans();
		} else {
			console.error('Error adding ban');
		}
	}

	async function approveBan(name: string, description: string, approved: number) {
		let newBan;
		if (approved >= 1) {
			// Aggiungi il nuovo ban alla lista come approvato
			newBan = {
				name,
				description,
				approved: 2
			};
		} else {
			// Aggiungi un'approvazione al ban
			newBan = {
				name,
				description,
				approved: approved + 1
			};
		}

		const response = await fetch(serverURL + '/approveBan', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newBan)
		});

		if (response.ok) {
			// Aggiorna l'elenco dei ban
			getBans();
		} else {
			console.error('Error approving ban');
		}

		// Dopo aver approvato il ban, crea una nuova copia dell'array `bans`
		bans = bans.map((ban) =>
			ban.name === name && ban.description === description ? { ...ban, approved } : ban
		);
	}
</script>

<div class="flex flex-wrap md:flex-col lg:flex-row justify-center items-start">
	<div class="rounded-lg bg-accent/30 m-5 p-5 max-w-full flex-grow h-fit">
		<h2 class="text-2xl font-bold m-2">Aggiungi un Ban</h2>
		<form
			on:submit|preventDefault={addBan}
			class="text-base flex items-stretch flex-col sm:flex-row"
		>
			<input
				class="input w-full m-1 text-content"
				type="text"
				bind:value={newBanName}
				placeholder="Chi banni?"
				required
			/>
			<input
				class="input w-full m-1 text-content"
				type="text"
				bind:value={newBanDescription}
				placeholder="Motivo ban"
				required
			/>
			<button
				class="flex rounded-lg bg-success/70 text-content px-3 py-2 hover:bg-success items-center justify-center m-1 min-w-fit"
				type="submit"><span class="icon-[fa--plus] mr-1"></span>Add Ban</button
			>
		</form>
	</div>

	<div
		class="rounded-lg bg-accent/30 m-5 max-w-full flex-grow h-fit {bans.filter(
			(ban) => ban.approved < 2
		).length == 0
			? 'bg-success/50 max-w-fit p-3'
			: ' p-7 '}"
	>
		{#if bans.filter((ban) => ban.approved < 2).length == 0}
			<div class="flex justify-around items-center">
				<p class="font-medium text-xl text-content/60">Nessun ban da approvare</p>
				<span class="text-7xl text-content/60 icon-[fa--check-circle] ml-2"></span>
			</div>
		{:else}
			<h2 class="text-2xl font-bold">Ban da approvare</h2>
		{/if}
		<ul>
			{#each bans.filter((ban) => ban.approved < 2) as ban (ban.description)}
				<li
					class="rounded-lg bg-accent/60 p-3 flex flex-col sm:flex-row justify-between md:flex-auto m-1 items-center"
				>
					<p class="font-medium md:w-full">Ban di {ban.name} - motivo: {ban.description}</p>
					<div class="flex lg:justify-end justify-around">
						<button
							class="flex rounded-lg bg-success/70 text-content px-3 py-2 hover:bg-success items-center m-1"
							on:click={() => approveBan(ban.name, ban.description, ban.approved)}
							><span class="icon-[fa--check]"></span>Approva</button
						>

						<button
							class="flex rounded-lg bg-error/70 text-content px-3 hover:bg-error items-center m-1"
							on:click={() => approveBan(ban.name, ban.description, ban.approved - 2)}
							><span class="icon-[fa--trash]"></span></button
						>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</div>
