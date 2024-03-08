<script lang="ts">
	import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
	import { app } from '@/firebase/client';
	import getFriendlyErrorMessage from '@/firebase/utils/auth/getFriendlyErrorMessage';
	import Button from './base/button/Button.svelte';
	let email: string = '',
		errorMessage,
		loading,
		successMessage;
	const auth = getAuth(app);

	async function handlePasswordReset() {
		loading = true;
		try {
			await sendPasswordResetEmail(auth, email);
			successMessage = 'Please check your email to reset your password.';
		} catch (error) {
			console.error('Error during password reset:', error);
			errorMessage = getFriendlyErrorMessage(error);
		}
		loading = false;
	}
</script>

<div
	class="text-text-color flex h-screen w-full items-center justify-center bg-neutral-900 text-center text-base max-md:px-5"
>
	<div
		class="mt-24 flex w-[337px] max-w-full flex-col items-center space-y-8 rounded-xl p-6 max-md:mt-10"
	>
		<h1 class="text-2xl font-semibold leading-5 text-white">Reset Password</h1>
		<p class="text-sm text-neutral-400">Enter the email associated with your account.</p>
		<form class="w-full space-y-6" on:submit|preventDefault={handlePasswordReset}>
			<input
				bind:value={email}
				type="email"
				id="email"
				placeholder="Email"
				autocomplete="email"
				class="w-full items-start justify-center self-stretch whitespace-nowrap rounded-lg bg-neutral-800 py-4 pl-5 pr-16 text-white placeholder:text-neutral-400"
			/>
			{#if errorMessage}
				<div class="text-center">
					<p class="text-sm text-red-500">{errorMessage}</p>
				</div>
			{/if}
			{#if successMessage}
				<div class="text-center">
					<p class="text-sm text-green-500">{successMessage}</p>
				</div>
			{/if}
			<Button type="submit" variant="grey" disabled={!email.trim() || loading}>
				{#if loading}
					Loading...
				{:else}
					Send Reset Email
				{/if}
			</Button>
		</form>
	</div>
</div>

<style>
	input:focus,
	button:focus {
		outline: none; /* Removes the default outline */
		box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5); /* Adds a custom focus indicator */
	}
</style>
