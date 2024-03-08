<script>
	// Add any necessary script logic for the Terms page here
	import UndecidableLogo from '@/lib/assets/logo.png';
	import { meta } from '@/lib/metaTags';
	const title = meta.termsOfService.title;
	const description = meta.termsOfService.description;
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
		<h1 class="mb-4 text-2xl font-semibold leading-5">Terms of Service</h1>
		<p class="max-w-md text-sm leading-5 tracking-tight text-neutral-400">
			Your Terms of Service content goes here. You can outline the rules and guidelines for using
			your website and services.
		</p>
	</div>
</div>
