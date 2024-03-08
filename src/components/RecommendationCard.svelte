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
				class="hidden h-[250px] w-1/5 flex-none bg-cover bg-center md:block"
				style={`background-image: url(${data.Poster})`}
			/>
			<div
				class="absolute inset-0 z-10 bg-cover bg-center md:hidden"
				style={`background-image: url(${data.Poster})`}
			>
				<div class="bg-blur-sm h-full w-full bg-black/80" />
			</div>
			<div class="z-40 flex flex-col justify-between pt-32 md:ml-6 md:pt-0">
				<div>
					<div class="mb-4 flex items-end">
						<div class="text-3xl font-bold text-slate-200">
							{data.Title}
							<span class="ml-2 text-xl font-bold text-slate-200/60">{data.Year}</span>
						</div>
					</div>
					<div class="mb-4 text-slate-200/90">{data.Plot}</div>
					<div class="mb-4 text-slate-200/50">Starring: {data.Actors}</div>
				</div>
				<div class="flex items-center">
					<div class="mr-4 rounded-full border border-pink-600 px-2 py-1 text-xs text-pink-600">
						{data.Rated}
					</div>
				</div>
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
				{/await}
			</div>
		</div>
	{/await}
</div>
