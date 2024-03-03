<script>
	import { fade } from 'svelte/transition';
	import LoadingCard from './LoadingCard.svelte';
	/**
	 * @type {{title: string, description: string}}
	 */
	export let recommendation;
</script>

{#if recommendation.description}
	{#if recommendation?.Poster}
		<div in:fade class="relative flex flex-col bg-neutral-800/70 p-6 shadow-md md:flex-row">
			<div
				class="hidden h-[250px] w-1/5 flex-none bg-cover bg-center md:block"
				style={`background-image: url(${recommendation.Poster})`}
			/>
			<div
				class="absolute inset-0 z-10 bg-cover bg-center md:hidden"
				style={`background-image: url(${recommendation.Poster})`}
			>
				<div class="bg-blur-sm h-full w-full bg-black/80" />
			</div>

			<div class="z-40 flex flex-col justify-between pt-32 md:ml-6 md:pt-0">
				<div>
					<div class="mb-4 flex items-end">
						<div class="text-3xl font-bold text-slate-200">
							{recommendation.Title}
							<span class="ml-2 text-xl font-bold text-slate-200/60">{data.Year}</span>
						</div>
					</div>
					<div class="mb-4 text-slate-200/90">
						{recommendation.Plot}
					</div>
					<div class="mb-4 text-slate-200/50">
						Starring: {recommendation.Actors}
					</div>
				</div>
				<div class="flex items-center">
					<div class="mr-4 rounded-full border border-pink-600 px-2 py-1 text-xs text-pink-600">
						{recommendation.Rated}
					</div>
				</div>
			</div>
		</div>
	{:else}
		<div in:fade class="relative flex flex-col bg-neutral-800/70 p-6 shadow-md md:flex-row">
			<div
				class="flex h-[250px] w-1/5 flex-none items-center justify-center bg-neutral-900 text-white/50"
			>
				<svg
					width="35"
					height="35"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M0.75 2.25C0.75 1.42157 1.42157 0.75 2.25 0.75H21.75C22.5784 0.75 23.25 1.42157 23.25 2.25V21.75C23.25 22.5784 22.5784 23.25 21.75 23.25H2.25C1.42157 23.25 0.75 22.5784 0.75 21.75V2.25Z"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M5.25 17.25L8.712 12.634C8.97285 12.286 9.37191 12.0683 9.80575 12.0374C10.2396 12.0065 10.6655 12.1654 10.973 12.473L12 13.5L15.3 9.1C15.5833 8.72229 16.0279 8.5 16.5 8.5C16.9721 8.5 17.4167 8.72229 17.7 9.1L20.37 12.66"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M6.375 8.25C7.41053 8.25 8.25 7.41053 8.25 6.375C8.25 5.33947 7.41053 4.5 6.375 4.5C5.33947 4.5 4.5 5.33947 4.5 6.375C4.5 7.41053 5.33947 8.25 6.375 8.25Z"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M0.75 17.25H23.25"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</div>
			<div class="absolute inset-0 z-10 bg-cover bg-center md:hidden">
				<div class="bg-blur-sm h-full w-full bg-black/80" />
			</div>

			<div class="z-40 flex flex-col justify-between md:ml-6">
				<div>
					<div class="mb-4 flex items-end">
						<div class="text-3xl font-bold text-slate-200">
							{recommendation.title}
							<span class="ml-2 text-xl font-bold text-slate-200/60">N/A</span>
						</div>
					</div>
					<div class="mb-4 text-slate-200/90">
						{recommendation.description}
					</div>
				</div>
			</div>
		</div>
	{/if}
{:else}
	<LoadingCard incomingStream={false} />
{/if}
