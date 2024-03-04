<script lang="ts">
	import type { CinemaSearchCriteria } from '@/types/recommendation';
	import fetchGetRecommendation from '@/services/api/fetchGetRecommendation';
	import * as animateScroll from 'svelte-scrollto';
	import { Button } from '@/components/base/button';
	import RecommendationCard from '@/components/RecommendationCard.svelte';
	import LoadingCard from '@/components/LoadingCard.svelte';
	import { meta } from '@/lib/metaTags';

	let cinemaType = 'movie';
	let specificDescriptors = '';
	let loading = false;
	let selectedCategories: Array<string> = [];
	let error = '';
	let recommendations = [];
	const title = meta.search.title;
	const description = meta.search.description;

	const genres = [
		'Action',
		'Comedy',
		'Drama',
		'Fantasy',
		'Horror',
		'Romance',
		'Sci-Fi',
		'Thriller'
	];

	const cinemaTypes = [
		{ value: 'tv show', title: 'TV Show' },
		{ value: 'movie', title: 'Movie' },
		{ value: 'tv show or movie', title: 'No Preference' }
	];
	async function getRecommendations() {
		loading = true;
		error = '';
		recommendations = [];
		try {
			const criteria: CinemaSearchCriteria = {
				cinemaType,
				selectedCategories,
				specificDescriptors
			};
			const stream = await fetchGetRecommendation(criteria);
			await handleStreamedResponse({ stream });
		} catch (err) {
			error = err;
		}

		loading = false;
	}

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

	// animateScroll.scrollToBottom({ duration: 1500 });
	//
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
</svelte:head>
<div class="flex flex-wrap justify-center">
	{#each cinemaTypes as type}
		<label
			class={`m-1 cursor-pointer rounded border px-4 py-2 font-bold transition-all duration-150 ease-in-out ${
				cinemaType === type.value ? 'bg-blue-500 text-white' : 'bg-white text-black'
			}`}
		>
			<input
				type="radio"
				class="hidden"
				bind:group={cinemaType}
				value={type.value}
				name="cinemaType"
			/>
			{type.title}
		</label>
	{/each}
</div>

<div class="mt-4 flex flex-wrap justify-center">
	{#each genres as genre}
		<label
			class={`m-1 cursor-pointer rounded border px-4 py-2 font-bold transition-all duration-150 ease-in-out ${
				selectedCategories.includes(genre) ? 'bg-blue-500 text-white' : 'bg-white text-black'
			}`}
		>
			<input type="checkbox" class="hidden" bind:group={selectedCategories} value={genre} />
			{genre}
		</label>
	{/each}
</div>

<textarea
	bind:value={specificDescriptors}
	class="mt-4 w-full rounded border px-4 py-2 text-black"
	placeholder="Enter any specific descriptors here..."
></textarea>

<Button on:click={getRecommendations} disabled={loading}>
	{#if loading}
		<span>Loading...</span>
	{:else}
		<span>Get Recommendations</span>
	{/if}
</Button>

{#if recommendations}
	{#each recommendations as recommendation, i (i)}
		<div>
			{#if recommendation !== ''}
				<div class="mb-8">
					{#if typeof recommendation !== 'string' && recommendation.title}
						<RecommendationCard {recommendation} />
					{:else}
						<div in:fade>
							<LoadingCard incomingStream={recommendation} />
						</div>
					{/if}
				</div>
			{/if}
		</div>
	{/each}
{/if}

{#if error}
	<div class="text-red-500">{error}</div>
{/if}
