<script>
	import handleGoogleSignIn from '@/firebase/utils/auth/handleGoogleSignIn';
	import { Button } from '@/components/base/button';
	import Spinner from '@/icons/spinner.svg?component';
	import GoogleIcon from '@/icons/google.svg?component';
	let loading = false;

	async function signIn() {
		if (window.navigator.userAgent.includes('Messenger')) {
			alert('Please open this link in your browser to sign in.');
			loading = false;
		} else {
			loading = true;
			await handleGoogleSignIn().catch((error) => {
				// Handle or log the error
				console.error('Error during Google sign-in:', error);
				loading = false;
			});
			loading = false;
		}
	}
</script>

<Button variant="google" on:click={signIn} disabled={loading}>
	{#if loading}
		<Spinner class="mr-2 h-4 w-4" />
		Please wait
	{:else}
		<GoogleIcon class="ml-[12px] mr-[10px] h-[20px] w-[20px]" />
		Sign in with Google
	{/if}
</Button>
