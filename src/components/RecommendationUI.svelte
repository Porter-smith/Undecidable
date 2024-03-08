<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '@/components/base/button';
	import RecommendationCard from '@/components/RecommendationCard.svelte';
	import type { CinemaSearchCriteria } from '../types/recommendation';
	import fetchGetRecommendation from '../services/api/fetchGetRecommendation';
	import * as animateScroll from 'svelte-scrollto';
	let specifications = '';
	let error;
	export let cinemaType = 'Movie';
	let searchResponse = '';
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

	function updateRecommendationsFromResponse() {
		const lines = searchResponse.split('\n');

		const newRecommendations = lines
			.map((line) => {
				if (line) {
					// Regex for various title formats
					const match = line.match(/^(?:\d+\.\s\*\*|\s+)?(.*?)\s*\((\d{4})\):/);
					if (match) {
						// Remove any trailing ** before trimming
						let title = match[1].replace(/\*\*$/, '');
						return { title: title.trim(), year: match[2] };
					}
				}
				return null;
			})
			.filter(Boolean);

		if (newRecommendations.length > recommendations.length) {
			recommendations = newRecommendations;
			animateScroll.scrollToBottom({ duration: 1500 });
		}
	}
	async function handleStreamedResponse({ stream }) {
		const reader = stream.getReader();
		const decoder = new TextDecoder();

		try {
			while (true) {
				const { value, done } = await reader.read();
				if (done) {
					// endStream = true;
					break;
				}
				console.log(searchResponse);
				searchResponse += decoder.decode(value);
			}
		} catch (err) {
			error = 'An error occurred while streaming the response.';
		}
	}

	$: {
		if (searchResponse) {
			updateRecommendationsFromResponse();
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
