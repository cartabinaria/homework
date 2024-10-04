<!-- BanLeaderboard.svelte -->
<script lang="ts">
    import Line from './Line.svelte';
    import { onMount } from 'svelte';
    import { getBans } from '../global';
    import type { Ban } from '../stores';
    import { bans } from '../stores';

    let banCounts: { name: string; count: number }[] = [];
    let groupedBans: { [key: string]: Ban[] } = {};

    $: updateBanCounts($bans);
    $: groupBans($bans, banCounts);

    onMount(async () => {
        const fetchedBans = await getBans();
        bans.set(fetchedBans);
    });

    function updateBanCounts(bansContent: Ban[]) {
        const counts: { [key: string]: number } = {};
        for (const ban of bansContent) {
            counts[ban.name] = (counts[ban.name] || 0) + 1;
        }
        banCounts = Object.entries(counts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);
    }

    function groupBans(bansContent: Ban[], sortedBanCounts: { name: string; count: number }[]) {
        groupedBans = {};
        for (const { name } of sortedBanCounts) {
            groupedBans[name] = bansContent.filter(ban => ban.name === name);
        }
    }
</script>

<div class="rounded-lg bg-accent/20 p-5 flex flex-col items-center md:justify-center">
    <h1 class="text-2xl font-bold">Ban Leaderboard</h1>
    <div class="flex flex-row justify-start">
        <p> 
            <span class="icon-[fa--close] mx-1 text-primary"></span>: ban approvato e verificato da almeno 2 utenti<br />
            <span class="icon-[fa--close] mx-1 text-accent"></span>: ban disapprovato da almeno 1 utente<br />
            <span class="icon-[fa--close] mx-1"></span>: ban da approvare
        </p>
    </div>
    <div class="flex flex-wrap justify-center m-2 w-full">
        {#each Object.entries(groupedBans) as [key, bans]}
            <div class="flex-none md:flex-auto max-w-screen min-w-max">
                <Line {bans} />
            </div>
        {/each}
    </div>
</div>