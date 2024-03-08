<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '@/components/base/button';
	import RecommendationCard from '@/components/RecommendationCard.svelte';
	import type { CinemaSearchCriteria } from '../types/recommendation';
	import fetchGetRecommendation from '../services/api/fetchGetRecommendation';

	let specifications = '';
	let error;
	export let cinemaType = 'Movie';
	let currentStep = 2;
	let recommendations = [];
	let loading = false;

	async function search() {
		loading = true;
		recommendations = [];
		try {
			const criteria: CinemaSearchCriteria = {
				cinemaType: cinemaType,
				specificDescriptors: specifications,
				selectedCategories: []
			};
			const stream = await fetchGetRecommendation(criteria);
			await handleStreamedResponse({ stream });
		} catch (err) {
			error = err;
		}

		loading = false;
	}

	onMount(() => {
		console.log('Component mounted');
	});

	function updateMovieData(chunk) {
		// Assume the chunk is movie data
		const index = recommendations.findIndex(
			(movie) => movie.title === chunk.title && movie.year === chunk.year
		);

		if (index >= 0) {
			// Update existing movie data
			recommendations = [
				...recommendations.slice(0, index),
				{ ...recommendations[index], ...chunk },
				...recommendations.slice(index + 1)
			];
		} else {
			// Add new movie data
			recommendations = [...recommendations, chunk];
		}
	}
	async function handleStreamedResponse({ stream }: { stream: ReadableStream<Uint8Array> }) {
		const reader = stream.getReader();
		const decoder = new TextDecoder('utf-8');

		let readResult;
		while (!(readResult = await reader.read()).done) {
			const chunk = decoder.decode(readResult.value);
			console.log(chunk)
			await processChunk(chunk);
		}
	}

	async function processChunk(chunk: string) {
		console.log('chunk', chunk);
		try {
			const data = JSON.parse(chunk);
			updateMovieData(data);
		} catch (error) {
			console.log('not a json', chunk);
		}
	}
</script>

<div class="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center p-4">
	<div class="flex w-full flex-col items-center justify-center text-center">
		<div class="w-full space-y-8 rounded-lg p-6 shadow">
			<h1 class="text-2xl font-semibold text-white">
				Please provide more details for your "{cinemaType}" search
			</h1>
			<p class="text-lg font-bold text-white">
				Write any other specifications here. Be as picky as you'd like.
			</p>
			<textarea
				bind:value={specifications}
				class="w-full rounded-lg bg-neutral-700 py-4 pl-5 pr-16 text-white placeholder:text-neutral-400"
				placeholder="Ex. Must have at least 2 seasons and be on Netflix or Hulu."
				rows="4"
			></textarea>
			<Button on:click={search} disabled={loading || specifications.trim() === ''} variant="grey">
				{#if loading}
					<span>Searching...</span>
				{:else}
					<span>Get Recommendations</span>
				{/if}
			</Button>
			{#if error}
				<p class="mnb-2 mt-2 text-sm text-red-500">{error}</p>
			{/if}
		</div>
	</div>
	{#if recommendations?.length > 0}
		<div class="my-4 flex w-full flex-col gap-2 overflow-auto">
			{#each recommendations as recommendation, i (i)}
				<RecommendationCard {recommendation} key={i} />
			{/each}
		</div>
	{/if}
</div>

<style>
	.selected,
	button:focus,
	textarea:focus {
		outline: none; /* Removes the default outline */
		box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5); /* Adds a custom focus indicator for selected button and focused elements */
	}
</style>
