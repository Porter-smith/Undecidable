<script>
	import { meta } from '@/lib/metaTags';
	const title = meta.recommendations.title;
	const description = meta.recommendations.description;
	export let data;
	console.log(data);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
</svelte:head>
