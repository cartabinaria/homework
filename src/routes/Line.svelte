<script lang="ts">
	export let bans: { name: string; description: string; approved: number; super: boolean }[] = [];
</script>

<div class="w-full flex flex-col m-2">
	{#if bans && bans.length > 0}
		<h4 class="text-xl font-bold">{bans[0].name}</h4>
		{#each bans as ban}
			<div class="flex flex-row items-center">
				{#if ban.approved >= 2}
					<span
						class="icon-[fa--close] ml-1 text-primary {ban.super ? 'text-3xl text-warning' : ''}"
					></span>
				{:else if ban.approved < 0}
					<span class="icon-[fa--close] ml-1 text-accent {ban.super ? 'text-3xl' : ''}"></span>
				{:else}
					<span class="icon-[fa--close] ml-1 {ban.super ? 'text-3xl' : ''}"></span>
				{/if}
				<div class="text-accent/70 max-w-[4em] {ban.super ? 'text-warning' : ''}">
					{ban.description}
				</div>
			</div>
		{/each}
	{/if}
</div>
