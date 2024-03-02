<script>
	import Button from '../components/base/button/Button.svelte';
	import { handleSignOut } from '../firebase/utils/auth/handleServerSignOut';
	import { meta } from '@/lib/metaTags';
	const title = meta.home.title;
	const description = meta.home.description;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
</svelte:head>

<h1>Welcome to SvelteKit test</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<Button on:click={handleSignOut}>sign out</Button>
