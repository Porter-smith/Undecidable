<script lang="ts">
	import handleSignup from '@/firebase/utils/auth/handleSignup';
	import { Button } from '@/components/base/button';
	import GoogleSignInButton from '@/components/AuthProvider/GoogleSignInButton.svelte';
	import { Input } from '@/components/base/input';
	import getFriendlyErrorMessage from '@/firebase/utils/auth/getFriendlyErrorMessage';
	import handleServerSignin from '@/firebase/utils/auth/handleServerSignin';
	import NewGoogleSignIn from '../AuthProvider/NewGoogleSignIn.svelte';
	import UndecidableLogo from '@/lib/assets/logo.png';
	let email: string = '',
		name: string,
		password: string,
		errorMessage: string,
		loading: boolean;
	async function createAccount() {
		try {
			await handleSignup(name, email, password);
		} catch (error) {
			console.error('Error during sign in:', error);
			errorMessage = getFriendlyErrorMessage(error);
		}
	}
</script>

<div
	class="text-text-color flex w-full items-center justify-center bg-background text-center text-base max-md:px-5"
>
	<div class="mt-24 flex w-[337px] max-w-full flex-col items-center max-md:mt-10">
		<img src={UndecidableLogo} alt="Undecidable Logo" class="aspect-square w-[135px] max-w-full" />
		<h2 class="mt-2 text-2xl font-semibold leading-5">Sign Up to Undecidable</h2>
		<form
			class="mt-4 flex flex-col items-center self-stretch"
			on:submit|preventDefault={createAccount}
		>
			<input
				bind:value={name}
				id="nameInput"
				type="name"
				placeholder="Name"
				aria-label="Name"
				class="mt-4 w-full max-w-full items-start justify-center self-stretch whitespace-nowrap rounded-lg bg-neutral-700 py-4 pl-5 pr-16 text-white placeholder:text-neutral-400 max-md:px-5"
			/>
			<input
				bind:value={email}
				id="emailInput"
				type="email"
				placeholder="Email"
				aria-label="Email"
				class="mt-4 w-full max-w-full items-start justify-center self-stretch whitespace-nowrap rounded-lg bg-neutral-700 py-4 pl-5 pr-16 text-white placeholder:text-neutral-400 max-md:px-5"
			/>
			<input
				bind:value={password}
				id="passwordInput"
				type="password"
				autocomplete="new-password"
				placeholder="Password"
				aria-label="Password"
				class="mt-4 w-full max-w-full items-start justify-center self-stretch whitespace-nowrap rounded-lg bg-neutral-700 py-4 pl-5 pr-16 text-white placeholder:text-neutral-400 max-md:px-5"
			/>

			<!-- {#if errorMessage}
				<p class="mb-2 mt-2 text-sm text-red-500">{errorMessage}</p>
			{/if} -->
			<Button type="submit" variant="grey" disabled={!email.trim()}>Sign Up</Button>
		</form>
		<div class="mt-2 text-neutral-400">or</div>
		<NewGoogleSignIn />

		<p class="mt-4 text-neutral-400">
			Already have an account?
			<a href="/login" class="font-bold text-white" tabindex="0">Login</a>.
		</p>
		<p class="mt-9 text-sm leading-5 tracking-tight text-neutral-400">
			By signing up, you are creating an Undecidable account and agree to Undecidable’s
			<a href="/terms-of-service" class="text-white" tabindex="0">Terms</a> and
			<a href="/privacy-policy" class="text-white" tabindex="0">Privacy Policy</a>.
		</p>
	</div>
</div>

<style>
	input:focus,
	button:focus {
		outline: none; /* Removes the default outline */
		box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5); /* Adds a custom focus indicator */
	}
</style>
