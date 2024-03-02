<script>
	import SignUpForm from '@/components/forms/SignUpForm.svelte';
	import { meta } from '@/lib/metaTags';
	const title = meta.signUp.title;
	const description = meta.signUp.description;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
</svelte:head>

<div class="flex min-h-screen">
	<SignUpForm />
</div>
