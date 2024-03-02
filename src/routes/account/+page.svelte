<script>
	import { meta } from '@/lib/metaTags';
	import EditAccountForm from '@/components/EditAccountForm.svelte';
	export let data;
	const user = data.user;
	const title = meta.account.title;
	const description = meta.account.description;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
</svelte:head>
<EditAccountForm {user} />
