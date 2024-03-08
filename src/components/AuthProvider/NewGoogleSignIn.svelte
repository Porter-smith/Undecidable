<script>
	import handleGoogleSignIn from '@/firebase/utils/auth/handleGoogleSignIn';
	import { Button } from '@/components/base/button';
	import Spinner from '@/icons/spinner.svg?component';
	import GoogleIcon from '@/icons/google.svg?component';
	let loading = false;

	async function signIn() {
		loading = true;
		await handleGoogleSignIn();
		loading = false;
	}
</script>

<Button variant="google2" on:click={signIn} disabled={loading}>
	{#if loading}
		<Spinner class="mr-2 h-4 w-4" />
		Please wait
	{:else}
		<GoogleIcon class="ml-[12px] mr-[10px] h-[20px] w-[20px]" />
		Continue with Google
	{/if}
</Button>
