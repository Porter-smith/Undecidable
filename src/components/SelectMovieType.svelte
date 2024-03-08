<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	let selectedType = '';

	// Create an array of objects each containing 'name' and 'slug' properties
	const types = [
		{ name: 'TV Show', slug: 'tv-show' },
		{ name: 'Movie', slug: 'movie' },
		{ name: 'No Preference', slug: 'no-preference' }
	];

	function selectType(slug) {
		selectedType = slug;
		goto(`/search/${slug}`);
	}

	onMount(() => {
		console.log('Component mounted');
	});
</script>

<div class="mx-auto flex h-screen w-full max-w-4xl flex-col justify-center">
	<div
		class="text-text-color flex flex-col items-center justify-center bg-background text-center text-base"
	>
		<h1 class=" mb-4 text-2xl font-semibold text-white">What kind of show are you looking for?</h1>
		<div class="flex flex-wrap justify-center">
			{#each types as { name, slug }}
				<button
					on:click={() => selectType(slug)}
					class="mb-2 mr-2 rounded-lg bg-neutral-700 px-4 py-2 text-sm font-bold text-white transition-all duration-150 ease-in-out hover:bg-neutral-600 focus:outline-none"
				>
					{name}
				</button>
			{/each}
		</div>
	</div>
</div>
