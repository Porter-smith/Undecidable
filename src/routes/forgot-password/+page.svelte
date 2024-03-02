<script>
	import { meta } from '@/lib/metaTags';
	import ForgetPasswordForm from '@/components/ForgetPasswordForm.svelte';
	const title = meta.forgotPassword.title;
	const description = meta.forgotPassword.description;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
</svelte:head>
<ForgetPasswordForm />
