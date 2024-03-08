<script>
	// Add any necessary script logic for the Privacy page here
	import UndecidableLogo from '@/lib/assets/logo.png';
	import { meta } from '@/lib/metaTags';
	const title = meta.privacyPolicy.title;
	const description = meta.privacyPolicy.description;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
</svelte:head>

<div
	class="text-text-color flex w-full items-center justify-center bg-neutral-900 px-5 py-20 text-center text-base"
>
	<div class="flex flex-col items-center">
		<img src={UndecidableLogo} alt="Undecidable Logo" class="mb-4 w-32" />
		<h1 class="mb-4 text-2xl font-semibold leading-5">Privacy Policy</h1>
		<p class="max-w-md text-sm leading-5 tracking-tight text-neutral-400">
			Your Privacy Policy content goes here. This should detail how you collect, use, and manage
			your users' data.
		</p>
	</div>
</div>
