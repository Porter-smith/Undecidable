<script>
	import Button from '../components/base/button/Button.svelte';
	import { handleSignOut } from '../firebase/utils/auth/handleServerSignOut';
	import { meta } from '@/lib/metaTags';
	import SearchThings from '@/components/SelectMovieType.svelte';
	const title = meta.home.title;
	const description = meta.home.description;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<!-- Add Inter Font -->

	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<SearchThings />
