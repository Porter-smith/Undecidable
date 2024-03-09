<script lang="ts">
	import { fade } from 'svelte/transition';
	import LoadingCard from './LoadingCard.svelte';

	export let recommendation;

	async function getRecommendationInfo() {
		const response = await fetch('/api/getMediaDetails', {
			method: 'POST',
			body: JSON.stringify({ title: recommendation.title }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		let recommendationDetails = await response.json();
		return recommendationDetails;
	}

	async function getProviders() {
		const response = await fetch('/api/getProviders', {
			method: 'POST',
			body: JSON.stringify({ title: recommendation.title, year: recommendation.year }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		let result = await response.json();

		if (!response.ok || result.error) {
			console.log(result.error);
			// Handle cases where the response is not OK or when the response contains an error field
			throw new Error(`An error occurred: ${result.error || 'Unknown error'}`);
		}

		return result.providers;
	}
	let promise = getRecommendationInfo();
	let promiseProviders = getProviders();
</script>

<div>
	{#await promise}
		<LoadingCard incomingStream={false} />
	{:then data}
		<div in:fade class="relative flex flex-col bg-neutral-800/70 p-6 shadow-md md:flex-row">
			<div
				class={data.Poster
					? 'hidden h-[250px] w-1/5 flex-none bg-cover bg-center md:block'
					: 'hidden'}
				style={`background-image: url(${data.Poster || '/default_poster_image_path'})`}
			/>
			<div
				class={data.Poster
					? 'absolute inset-0 z-10 bg-cover bg-center md:hidden'
					: 'absolute inset-0 z-10 md:hidden'}
				style={`background-image: url(${data.Poster || '/default_poster_image_path'})`}
			>
				<div class="bg-blur-sm h-full w-full bg-black/80" />
			</div>
			<div class="z-40 flex flex-col justify-between pt-32 md:ml-6 md:pt-0">
				<div>
					<div class="mb-4 flex items-end">
						<div class="text-3xl font-bold text-slate-200">
							{data.Title || recommendation.title}
							<span class="ml-2 text-xl font-bold text-slate-200/60"
								>{data.Year || recommendation.year}</span
							>
						</div>
					</div>
					{#if data.Plot}
						<div class="mb-4 text-slate-200/90">{data.Plot}</div>
					{:else}
						<div class="mb-4 text-slate-200/90">No movie description found.</div>
					{/if}
					{#if data.Actors}
						<div class="mb-4 text-slate-200/50">Starring: {data.Actors}</div>
					{/if}
				</div>
				{#if data.Rated}
					<div class="flex items-center">
						<div class="mr-4 rounded-full border border-pink-600 px-2 py-1 text-xs text-pink-600">
							{data.Rated}
						</div>
					</div>
				{/if}
				<!-- Providers section -->
				{#await promiseProviders}
					<div
						class="background-animate h-6 w-40 rounded-full bg-gradient-to-r from-white/90 via-white/40 to-white/90"
					/>
					<div
						class="background-animate ml-2 h-3 w-20 rounded-full bg-gradient-to-r from-white/50 via-white/20 to-white/50"
					/>
				{:then providersData}
					{#if providersData?.length > 0}
						<div class="providers-container mt-4">
							{#each providersData as provider}
								<div class="provider mt-2">
									<a
										href={provider.link}
										target="_blank"
										rel="noopener noreferrer"
										class="text-blue-500 hover:text-blue-700">{provider.name}</a
									>
									<span class="ml-2 text-sm text-gray-500">({provider.price})</span>
								</div>
							{/each}
						</div>
					{:else}
						<div class="mt-4 text-gray-500">No providers available.</div>
					{/if}
				{:catch error}
					<!-- Note here, the error variable is directly used -->
					<div class="mt-4 text-red-500">
						An error occurred while trying to find the providers. This usually happens when the show
						isn't in our system yet.
						<!-- {error.message} -->
					</div>
				{/await}
			</div>
		</div>
	{/await}
</div>
