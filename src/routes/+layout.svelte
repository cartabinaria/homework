<script>
	// import Header from './Header.svelte';
	import '../app.css';
	import Ban from './AddBan.svelte';
	import BanLeaderboard from './BanLeaderboard.svelte';
</script>

<div class="app">
	<!-- <Header /> -->
	<slot />
	<main class="bg-base text-content">
		<div class="m-5">
			<BanLeaderboard />
		</div>
		<Ban />
	</main>
</div>
