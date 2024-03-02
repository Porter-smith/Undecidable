<script>
	import Dashboard from '@/components/Dashboard.svelte';
	export let data;
	const user = data.user;
	import { meta } from '@/lib/metaTags';
	const title = meta.dashboard.title;
	const description = meta.dashboard.description;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
</svelte:head>

<Dashboard {user} />
