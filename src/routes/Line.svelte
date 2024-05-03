<script lang='ts'>
	export let bans: { name: string; description: string; approved: number }[] = [];
</script>

<div class="w-full flex flex-col m-2">
	<h4 class="text-xl font-bold">{bans[0].name}</h4>
	{#if bans && bans.length > 0}
		{#each bans as ban}
			<div class="flex flex-row items-baseline">
				{#if ban.approved >= 2}
					<span class="icon-[fa--close] ml-1 text-primary"></span>
				{:else if ban.approved < 0}
					<span class="icon-[fa--close] ml-1 text-accent"></span>
				{:else}
					<span class="icon-[fa--close] ml-1"></span>				
				{/if}
				<div class="text-accent/70 max-w-[4em]">{ban.description}</div>
			</div>
		{/each}
	{/if}
</div>
