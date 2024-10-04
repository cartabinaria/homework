<!-- AddBan.svelte -->
<script lang="ts">
	import { bans } from '../stores';
	import type { Ban } from '../stores';
	import { addBan, approveBan, rejectBan } from '../global';
	import Fireworks from '../components/Fireworks.svelte';

	let newBanName = '';
	let newBanDescription = '';
	let newBanSuper: boolean;

	async function handleAddBan() {
		try {
			const newBan = await addBan({
				name: newBanName,
				description: newBanDescription,
				super: newBanSuper
			});
			bans.addBan(newBan);
			newBanName = '';
			newBanDescription = '';
			bans.refresh();
		} catch (error) {
			console.error('Error adding ban:', error);
		}
	}

	async function handleApproveBan(name: string, description: string) {
		if (!hasUserApproved(name, description)) {
			try {
				const updatedBan = await approveBan(name, description);
				bans.approveBan(name, description);
				addUserApproval(name, description);

				if (updatedBan.approved >= 3) {
					await bans.refresh(); // Aggiorna l'intera lista se il ban è stato completamente approvato
				}
			} catch (error) {
				console.error('Error approving ban:', error);
			}
		} else {
			console.error('User has already approved this ban');
		}
	}

	async function handleRejectBan(name: string, description: string) {
		try {
			await rejectBan(name, description);
			bans.rejectBan(name, description);
		} catch (error) {
			console.error('Error rejecting ban:', error);
		}
	}

	function hasUserApproved(name: string, description: string): boolean {
		const userApprovals = JSON.parse(sessionStorage.getItem('userApprovals') || '[]');
		return userApprovals.some((ban: Ban) => ban.name === name && ban.description === description);
	}

	function addUserApproval(name: string, description: string) {
		const userApprovals = JSON.parse(sessionStorage.getItem('userApprovals') || '[]');
		userApprovals.push({ name, description });
		sessionStorage.setItem('userApprovals', JSON.stringify(userApprovals));
	}

	$: unapprovedBans = $bans.filter((ban) => ban.approved < 2);

	let showFireworks = false;

	function triggerFireworks() {
		showFireworks = true;
		setTimeout(() => {
			showFireworks = false;
		}, 100);
	}
</script>

<div class="flex flex-wrap md:flex-col lg:flex-row justify-center items-start">
	<div class="rounded-lg bg-accent/30 m-5 p-5 max-w-full flex-grow h-fit">
		<h2 class="text-2xl font-bold m-2">Aggiungi un Ban</h2>
		<form
			on:submit|preventDefault={handleAddBan}
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
		<label class="ml-2 label cursor-pointer w-fit gap-2">
			<span class="label-text flex text-warning items-center"
				>Super <span class="icon-[fa--close] ml-1"></span></span
			>
			<input
				type="checkbox"
				class="toggle toggle-warning"
				bind:checked={newBanSuper}
				on:change={() => {
					if (newBanSuper) triggerFireworks();
				}}
			/>
		</label>
		<Fireworks trigger={showFireworks} />
		<!-- <XConfetti bind:checked={newBanSuper} /> -->
	</div>

	<div
		class="rounded-lg bg-accent/30 m-5 max-w-full flex-grow h-fit {unapprovedBans.length == 0
			? 'bg-success/50 max-w-fit p-3'
			: ' p-7 '}"
	>
		{#if unapprovedBans.length === 0}
			<div class="flex justify-around items-center">
				<p class="font-medium text-xl text-content/60">Nessun ban da approvare</p>
				<span class="text-7xl text-content/60 icon-[fa--check-circle] ml-2"></span>
			</div>
		{:else}
			<h2 class="text-2xl font-bold">Ban da approvare</h2>
		{/if}
		<ul>
			{#each unapprovedBans as ban (ban.description)}
				<li
					class="rounded-lg bg-accent/60 p-3 flex flex-col sm:flex-row justify-between md:flex-auto m-1 items-center"
				>
					<p class="font-medium md:w-full">Ban di {ban.name} - motivo: {ban.description}</p>
					<div class="flex lg:justify-end justify-around">
						<button
							class="flex rounded-lg bg-success/70 text-content px-3 py-2 hover:bg-success items-center m-1 {hasUserApproved(
								ban.name,
								ban.description
							)
								? 'opacity-50'
								: ''}"
							on:click={() => handleApproveBan(ban.name, ban.description)}
							disabled={hasUserApproved(ban.name, ban.description)}
						>
							<span class="icon-[fa--check]"></span>Approva</button
						>

						<button
							class="flex rounded-lg bg-error/70 text-content px-3 hover:bg-error items-center m-1 {hasUserApproved(
								ban.name,
								ban.description
							)
								? 'opacity-50'
								: ''}"
							on:click={() => handleRejectBan(ban.name, ban.description)}
							disabled={hasUserApproved(ban.name, ban.description)}
						>
							<span class="icon-[fa--trash]"></span>
						</button>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</div>
