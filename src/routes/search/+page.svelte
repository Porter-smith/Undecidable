<script lang="ts">
	import type { CinemaSearchCriteria } from '@/types/recommendation';
	import fetchGetRecommendation from '@/services/api/fetchGetRecommendation';
	import * as animateScroll from 'svelte-scrollto';
	let cinemaType = 'movie';
	let specificDescriptors = '';
	let loading = false;
	let selectedCategories: Array<string> = [];
	let searchResponse = '';
	let error = '';
	let recommendations = [];

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
		searchResponse = '';
		error = '';
		recommendations = [];
		try {
			const criteria: CinemaSearchCriteria = {
				cinemaType,
				selectedCategories,
				specificDescriptors
			};
			const stream = await fetchGetRecommendation(criteria);
			await handleStreamedResponse(stream);
		} catch (err) {
			error = 'An error occurred while fetching recommendations.';
		}

		loading = false;
	}

	function updateMovieData(data) {
		const index = recommendations.findIndex(
			(movie) => movie.title === data.title && movie.year === data.year
		);

		if (index >= 0) {
			recommendations[index] = { ...recommendations[index], ...data };
		} else {
			recommendations.push(data);
		}
		console.log(recommendations);
	}
	async function handleStreamedResponse(stream) {
		const reader = stream.getReader();
		const decoder = new TextDecoder('utf-8');

		try {
			while (true) {
				const { value, done } = await reader.read();
				if (done) break;

				const chunk = decoder.decode(value, { stream: true });
				if (chunk) {
					try {
						// Assuming each chunk is a valid JSON string.
						const data = JSON.parse(chunk);
						updateMovieData(data);
					} catch (err) {
						console.error('Error parsing JSON:', chunk, err);
					}
				}
			}
		} catch (err) {
			console.error('An error occurred while streaming the response: ', err);
		}
	}

	// animateScroll.scrollToBottom({ duration: 1500 });
	//
</script>

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

<button
	on:click={getRecommendations}
	disabled={loading}
	class="mt-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:opacity-50"
>
	{#if loading}
		<span>Loading...</span>
	{:else}
		<span>Get Recommendations</span>
	{/if}
</button>

{#if recommendations}
	{#each recommendations as recommendation, i (i)}
		<div>
			{#if recommendation !== ''}
				<div class="mb-8">
					{#if typeof recommendation !== 'string' && recommendation.title}
						<div>
							{recommendation.title}
						</div>
						<!-- <RecommendationCard {recommendation} /> -->
					{:else}
						Loading...
						<!-- <div in:fade> -->
						<!-- <LoadingCard incomingStream={recommendation} /> -->
						<!-- </div> -->
					{/if}
				</div>
			{/if}
		</div>
	{/each}
{/if}

{#if error}
	<div class="text-red-500">{error}</div>
{/if}
