<script>
	import SigninForm from '@/components/forms/SigninForm.svelte';
	import { meta } from '@/lib/metaTags';
	const title = meta.signIn.title;
	const description = meta.signIn.description;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
</svelte:head>

<div class="flex min-h-screen">
	<SigninForm />
</div>
