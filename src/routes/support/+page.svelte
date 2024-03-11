<script>
	import UndecidableLogo from '@/lib/assets/logo.png';
	const supportEmail = 'support@myundecidable.com';
</script>

<svelte:head>
	<title>Support</title>
	<meta name="description" content="Need help? Contact our support team for assistance." />
</svelte:head>

<div
	class="text-text-color flex w-full items-center justify-center bg-neutral-900 px-5 py-20 text-center text-base"
>
	<div class="flex flex-col items-center">
		<img src={UndecidableLogo} alt="Undecidable Logo" class="mb-4 w-32" />
		<h1 class="mb-4 text-2xl font-semibold leading-5">Need Help?</h1>
		<p class="max-w-md text-sm leading-5 tracking-tight text-neutral-400">
			If you're experiencing issues or have questions regarding our services, feel free to reach out
			to our support team. We're here to help!
		</p>
		<a
			href={`mailto:${supportEmail}`}
			class="mt-4 rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
		>
			Contact Support
		</a>
	</div>
</div>
