<script>
	import { meta } from '@/lib/metaTags';
	import ConfirmPasswordForm from '@/components/ConfirmPasswordForm.svelte';
	import { page } from '$app/stores';
	const title = meta.confirmPassword.title;
	const description = meta.confirmPassword.description;
	const oobCode = $page.url.searchParams.get('oobCode');
	console.log(oobCode);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
</svelte:head>

<ConfirmPasswordForm {oobCode} />
