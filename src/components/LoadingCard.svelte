<script>
	/**
	 * @type {any}
	 */
	export let incomingStream;
</script>

<div class="relative flex flex-col bg-neutral-800/70 p-6 shadow-md md:flex-row">
	<div
		class="background-animate flex h-[250px] w-1/5 flex-none items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-700 to-neutral-900 text-white/50"
	>
		<svg width="35" height="35" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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

	<div class="z-40 flex w-full flex-col justify-between md:ml-6">
		<div class="w-full">
			<div class="mb-4 flex items-end">
				<div class="flex items-end">
					<div
						class="background-animate h-6 w-40 rounded-full bg-gradient-to-r from-white/90 via-white/40 to-white/90"
					/>
					<div
						class="background-animate ml-2 h-3 w-20 rounded-full bg-gradient-to-r from-white/50 via-white/20 to-white/50"
					/>
				</div>
			</div>
			<div class="mb-4 w-full text-slate-200/90">
				{#if incomingStream}
					{incomingStream}
				{:else}
					<div
						class="background-animate mb-2 h-2 w-full rounded-full bg-gradient-to-r from-white/20 via-white/10 to-white/20"
					/>
					<div
						class="background-animate mb-2 h-2 w-full rounded-full bg-gradient-to-r from-white/20 via-white/10 to-white/20"
					/>
					<div
						class="background-animate h-2 w-1/2 rounded-full bg-gradient-to-r from-white/20 via-white/10 to-white/20"
					/>
				{/if}
			</div>
		</div>
	</div>
</div>
